import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-support`;

async function sendChat({
  messages,
  sessionToken,
}: {
  messages: Message[];
  sessionToken: string | null;
}): Promise<{ reply: string; tool_results?: any[] }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
  };
  // Pass user's auth token so the edge function can identify the user
  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
  }

  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Something went wrong");
  }

  return resp.json();
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, session } = useAuth();
  const { toast } = useToast();
  const prevUserIdRef = useRef<string | null>(null);

  // Reset chat when user changes (new sign-in or sign-out)
  useEffect(() => {
    const currentUserId = user?.id ?? null;
    if (prevUserIdRef.current !== currentUserId) {
      if (prevUserIdRef.current !== null || currentUserId !== null) {
        setMessages([]);
      }
      prevUserIdRef.current = currentUserId;
    }
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const result = await sendChat({
        messages: newMessages,
        sessionToken: session?.access_token ?? null,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.reply },
      ]);

      // Show toast if a price alert was created
      if (result.tool_results?.some((r: any) => r.success)) {
        toast({
          title: "🔔 Price Alert Set!",
          description: "Check your Price Alerts page to view it.",
        });
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry, something went wrong: ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] shadow-[0_0_25px_hsl(var(--neon-cyan)/0.4)] transition-shadow hover:shadow-[0_0_35px_hsl(var(--neon-cyan)/0.6)]"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-[hsl(var(--neon-cyan)/0.2)] bg-[hsl(var(--deep-navy))] shadow-[0_0_40px_hsl(var(--neon-cyan)/0.15)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[hsl(var(--neon-cyan)/0.15)] bg-gradient-to-r from-[hsl(var(--neon-cyan)/0.1)] to-[hsl(var(--neon-purple)/0.1)] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))]">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">PriceCompare AI</p>
                  <p className="text-xs text-muted-foreground">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-[hsl(var(--neon-cyan)/0.1)] hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3 opacity-60">
                  <Bot className="h-10 w-10 text-[hsl(var(--neon-cyan))]" />
                  <p className="text-sm text-muted-foreground">
                    Hi! 👋 I'm your PriceCompare assistant. Ask me anything about comparing prices, setting alerts, or using the platform!
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--neon-cyan)/0.15)]">
                      <Bot className="h-3.5 w-3.5 text-[hsl(var(--neon-cyan))]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] text-white"
                        : "border border-[hsl(var(--neon-cyan)/0.1)] bg-[hsl(var(--neon-cyan)/0.05)] text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:m-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--neon-purple)/0.15)]">
                      <User className="h-3.5 w-3.5 text-[hsl(var(--neon-purple))]" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--neon-cyan)/0.15)]">
                    <Bot className="h-3.5 w-3.5 text-[hsl(var(--neon-cyan))]" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl border border-[hsl(var(--neon-cyan)/0.1)] bg-[hsl(var(--neon-cyan)/0.05)] px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--neon-cyan))]" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-[hsl(var(--neon-cyan)/0.15)] bg-[hsl(var(--deep-navy))] p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-[hsl(var(--neon-cyan)/0.15)] bg-[hsl(var(--neon-cyan)/0.05)] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[hsl(var(--neon-cyan)/0.4)] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--neon-cyan)/0.2)] disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] text-white shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)] transition-shadow hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)] disabled:opacity-50 disabled:shadow-none"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
