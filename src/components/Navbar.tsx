import logo from "@/assets/logo.png";

const Navbar = () => {
  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="Pricewise.ai" className="h-8 w-8" />
          <span className="font-display text-xl font-bold text-foreground">
            Pricewise<span className="text-primary">.ai</span>
          </span>
        </a>
        <div className="flex items-center gap-6 font-body text-sm text-muted-foreground">
          <a href="/" className="transition-colors hover:text-foreground">Home</a>
          <a href="#how-it-works" className="transition-colors hover:text-foreground">How It Works</a>
          <a href="#about" className="transition-colors hover:text-foreground">About</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
