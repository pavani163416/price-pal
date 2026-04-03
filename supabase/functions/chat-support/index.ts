import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'set_price_alert',
      description: 'Create a price alert for the user so they get notified when a product price drops to their target price. Use this when the user asks to set an alert, track a price, or be notified about a price drop.',
      parameters: {
        type: 'object',
        properties: {
          product_name: { type: 'string', description: 'Name of the product' },
          store: { type: 'string', enum: ['Amazon', 'Flipkart', 'Croma'], description: 'Store name' },
          current_price: { type: 'number', description: 'Current price of the product in INR' },
          target_price: { type: 'number', description: 'Target price the user wants to be alerted at in INR' },
          product_url: { type: 'string', description: 'Product URL if provided' },
        },
        required: ['product_name', 'store', 'current_price', 'target_price'],
      },
    },
  },
];

async function handleToolCall(
  toolName: string,
  args: Record<string, unknown>,
  userId: string | null,
): Promise<string> {
  if (toolName === 'set_price_alert') {
    if (!userId) {
      return JSON.stringify({ success: false, error: 'User must be signed in to set price alerts. Please sign in first.' });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from('price_alerts').insert({
      user_id: userId,
      product_name: args.product_name as string,
      store: args.store as string,
      current_price: args.current_price as number,
      target_price: args.target_price as number,
      product_url: (args.product_url as string) || null,
    });

    if (error) {
      console.error('Insert alert error:', error);
      return JSON.stringify({ success: false, error: error.message });
    }
    return JSON.stringify({ success: true, message: 'Price alert created successfully!' });
  }
  return JSON.stringify({ error: 'Unknown tool' });
}

function extractUserIdFromJwt(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = extractUserIdFromJwt(req.headers.get('authorization'));

    const systemPrompt = `You are a friendly and helpful customer support assistant for PriceCompare — an AI-powered price comparison platform that helps users find the best deals across Amazon, Flipkart, and Croma in India.

Your responsibilities:
- Help users understand how to use the platform (paste a product URL or search by name)
- Explain that the platform compares prices across Amazon.in, Flipkart, and Croma
- Assist with account-related questions (sign up, sign in, profile)
- Help with price alerts feature (set target prices, get notified)
- **You can SET price alerts for users using the set_price_alert tool** when they ask you to track a price or set an alert
- Be concise, friendly, and helpful
- If you don't know something specific about the platform, be honest about it
- Keep responses short (2-3 sentences max unless the user asks for detail)
- Use emojis occasionally to be friendly 😊
${userId ? '- The user is signed in, so you can set price alerts for them.' : '- The user is NOT signed in. If they ask to set alerts, tell them to sign in first.'}`;

    // Non-streaming call to support tool use
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        tools: TOOLS,
        stream: false,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unavailable.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const t = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, t);
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await aiResponse.json();
    const choice = result.choices?.[0];

    // Handle tool calls
    if (choice?.finish_reason === 'tool_calls' || choice?.message?.tool_calls?.length) {
      const toolCalls = choice.message.tool_calls || [];
      const toolResults: string[] = [];

      for (const tc of toolCalls) {
        const args = typeof tc.function.arguments === 'string'
          ? JSON.parse(tc.function.arguments)
          : tc.function.arguments;
        const result = await handleToolCall(tc.function.name, args, userId);
        toolResults.push(result);
      }

      // Send tool results back to get a natural language response
      const followUp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
            choice.message,
            ...toolCalls.map((tc: any, i: number) => ({
              role: 'tool',
              tool_call_id: tc.id,
              content: toolResults[i],
            })),
          ],
          stream: false,
        }),
      });

      if (!followUp.ok) {
        // Return tool results directly
        const allSuccess = toolResults.every((r) => JSON.parse(r).success);
        return new Response(
          JSON.stringify({
            reply: allSuccess
              ? '✅ Price alert has been set successfully! You can view it on the Price Alerts page.'
              : toolResults.map((r) => JSON.parse(r).error || JSON.parse(r).message).join('. '),
            tool_results: toolResults.map((r) => JSON.parse(r)),
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const followUpResult = await followUp.json();
      const reply = followUpResult.choices?.[0]?.message?.content || 'Done!';
      return new Response(
        JSON.stringify({
          reply,
          tool_results: toolResults.map((r) => JSON.parse(r)),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No tool call — just a text response
    const reply = choice?.message?.content || 'Sorry, I could not generate a response.';
    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('Chat support error:', e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
