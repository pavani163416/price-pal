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
    <nav className={`sticky top-0 z-50 border-b border-border transition-all duration-300 ${scrolled ? "glass shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.1)]" : "bg-card shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.12)]"}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <img src={logo} alt="Pricewise.ai" className="h-8 w-8 drop-shadow-[0_4px_8px_hsl(var(--primary)/0.3)]" />
          <span className="font-display text-xl font-bold text-foreground">
            Pricewise<span className="text-gradient">.ai</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 font-body text-sm text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="relative transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 transition-all hover:bg-muted hover:shadow-sm"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-[0_16px_40px_-8px_hsl(var(--foreground)/0.1)] backdrop-blur-sm animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                  <Link
                    to="#about"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <Info className="h-4 w-4 text-muted-foreground" />
                    About
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    Profile
                  </Link>
                  <div className="border-t border-border" />
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
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
              className="rounded-xl bg-primary px-4 py-1.5 font-display text-sm font-semibold text-primary-foreground shadow-[0_4px_14px_-3px_hsl(var(--primary)/0.5)] transition-all hover:bg-primary/90 hover:shadow-[0_6px_20px_-3px_hsl(var(--primary)/0.6)] hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-colors hover:bg-muted md:hidden">
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-card">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <img src={logo} alt="Pricewise.ai" className="h-7 w-7" />
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
                  className="rounded-lg px-4 py-3 font-body text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              {user ? (
                <>
                  <Link
                    to="#about"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 font-body text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <Info className="h-4 w-4 text-muted-foreground" />
                    About
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 font-body text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    Profile
                  </Link>
                  <div className="my-2 border-t border-border" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 font-body text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="mx-4 mt-2 rounded-xl bg-primary py-2.5 text-center font-display text-sm font-semibold text-primary-foreground shadow-[0_4px_14px_-3px_hsl(var(--primary)/0.5)] transition-all hover:bg-primary/90"
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
