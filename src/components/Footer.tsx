import logo from "@/assets/logo.png";

const Footer = () => (
  <footer id="about" className="border-t border-border bg-card py-10">
    <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Pricewise.ai" className="h-6 w-6" />
        <span className="font-display text-lg font-bold text-foreground">
          Pricewise<span className="text-primary">.ai</span>
        </span>
      </div>
      <p className="max-w-md font-body text-sm text-muted-foreground">
        A smart price comparison platform that helps you find the best deals
        across multiple e-commerce stores. Built by the Department of AI & Data Science.
      </p>
      <p className="font-body text-xs text-muted-foreground">
        © {new Date().getFullYear()} Pricewise.ai — All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
