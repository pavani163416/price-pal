import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";
import { User, LogOut, Info, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Pricewise.ai" className="h-8 w-8" />
          <span className="font-display text-xl font-bold text-foreground">
            Pricewise<span className="text-primary">.ai</span>
          </span>
        </Link>

        <div className="flex items-center gap-6 font-body text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
          <Link to="/compare" className="transition-colors hover:text-foreground">Compare</Link>
          <Link to="/price-alerts" className="transition-colors hover:text-foreground">Price Alerts</Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
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
              className="rounded-lg bg-primary px-4 py-1.5 font-display text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
