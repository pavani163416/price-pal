import { Link2, BarChart3, ExternalLink } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Paste or Search",
    description: "Enter a product URL or name in the search bar.",
  },
  {
    icon: BarChart3,
    title: "Compare Prices",
    description: "We scan multiple e-commerce stores and show real-time prices.",
  },
  {
    icon: ExternalLink,
    title: "Get the Best Deal",
    description: "Click 'View Deal' to go directly to the store with the lowest price.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="border-t border-border bg-muted/50 py-16">
    <div className="container mx-auto px-4">
      <h2 className="text-center font-display text-2xl font-bold text-foreground">
        How It Works
      </h2>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <step.icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
