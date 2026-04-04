import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";
import { User, LogOut, Info, ChevronDown, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/compare", label: "Compare" },
    { to: "/price-alerts", label: "Price Alerts" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-[0_4px_30px_-4px_hsl(var(--primary)/0.15)]"
          : "bg-card/80 backdrop-blur-md border-b border-border/50"
      }`}
    >
      {/* Neon bottom line */}
      <div className="absolute bottom-0 left-0 right-0 neon-line" />

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="group flex items-center gap-2.5 transition-transform hover:scale-105">
          <div className="relative">
            <img src={logo} alt="Pricewise.ai" className="h-8 w-8 drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]" />
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Pricewise<span className="text-gradient">.ai</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative rounded-lg px-4 py-2 font-body text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-muted/50 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 after:shadow-[0_0_8px_hsl(var(--primary)/0.5)] hover:after:w-3/4"
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-3 h-6 w-px bg-border" />

          {user ? (
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-muted/30 px-3 py-1.5 transition-all hover:bg-muted/60 hover:border-primary/30 hover:shadow-[0_0_15px_-5px_hsl(var(--primary)/0.2)] btn-press"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 ring-1 ring-primary/20">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl glass-card shadow-[0_20px_50px_-10px_hsl(var(--background)/0.8)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                  <Link
                    to="/about"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-all hover:bg-primary/10 hover:text-primary"
                  >
                    <Info className="h-4 w-4 text-muted-foreground" />
                    About
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-all hover:bg-primary/10 hover:text-primary"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    Profile
                  </Link>
                  <div className="neon-line mx-4" />
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive transition-all hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className="ml-2 rounded-xl bg-primary px-5 py-2 font-display text-sm font-semibold text-primary-foreground shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] transition-all hover:shadow-[0_0_30px_-4px_hsl(var(--primary)/0.7)] hover:-translate-y-0.5 btn-press"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-muted/30 transition-all hover:bg-muted/60 hover:border-primary/30 md:hidden btn-press">
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 glass-card border-l border-border/50">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <img src={logo} alt="Pricewise.ai" className="h-7 w-7 drop-shadow-[0_0_8px_hsl(var(--primary)/0.4)]" />
                <span className="font-display text-lg font-bold text-foreground">
                  Pricewise<span className="text-gradient">.ai</span>
                </span>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 font-body text-sm font-medium text-foreground transition-all hover:bg-primary/10 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 neon-line" />
              {user ? (
                <>
                  <Link to="/about" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 font-body text-sm text-foreground transition-all hover:bg-primary/10 hover:text-primary">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    About
                  </Link>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 font-body text-sm text-foreground transition-all hover:bg-primary/10 hover:text-primary">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Profile
                  </Link>
                  <div className="my-2 neon-line" />
                  <button onClick={handleSignOut} className="flex items-center gap-3 rounded-lg px-4 py-3 font-body text-sm text-destructive transition-all hover:bg-destructive/10">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="mx-4 mt-2 rounded-xl bg-primary py-2.5 text-center font-display text-sm font-semibold text-primary-foreground shadow-[0_0_20px_-4px_hsl(var(--primary)/0.5)] transition-all hover:shadow-[0_0_30px_-4px_hsl(var(--primary)/0.7)]"
                >
                  Sign In
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
