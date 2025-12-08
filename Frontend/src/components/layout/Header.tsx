import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Jobs", href: "/jobs" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50"
          : "bg-transparent"
      )}
    >
      {/* Top bar */}
      <div
        className={cn(
          "bg-primary text-primary-foreground transition-all duration-500 overflow-hidden",
          scrolled ? "h-0 py-0" : "py-2"
        )}
      >
        <div className="container-custom flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a
              href="tel:+971501234567"
              className="flex items-center gap-2 hover:text-secondary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">+971 50 123 4567</span>
            </a>
            <a
              href="mailto:info@Cotransglobal.com"
              className="flex items-center gap-2 hover:text-secondary transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">info@Cotransglobal.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="hover:text-secondary transition-colors flex items-center gap-1"
            >
              Admin Portal
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-gold rounded-xl flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform duration-300">
              <span className="text-secondary-foreground font-display font-bold text-lg md:text-xl">
                C
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-display font-bold text-base md:text-lg leading-tight transition-colors",
                  scrolled ? "text-foreground" : "text-primary"
                )}
              >
                Cotrans Global
              </span>
              <span
                className={cn(
                  "text-[10px] md:text-xs leading-tight transition-colors",
                  scrolled ? "text-muted-foreground" : "text-muted-foreground"
                )}
              >
                Corporation
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                  location.pathname === item.href
                    ? "text-secondary"
                    : scrolled
                    ? "text-foreground hover:text-secondary hover:bg-muted/50"
                    : "text-foreground hover:text-secondary hover:bg-muted/30"
                )}
              >
                {item.name}
                {location.pathname === item.href && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="gold" asChild className="shadow-gold">
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              scrolled ? "text-foreground" : "text-foreground"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 space-y-1 bg-background/95 backdrop-blur-xl rounded-2xl mb-4 border border-border/50 shadow-xl">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 mx-2 rounded-xl text-base font-medium transition-all",
                  location.pathname === item.href
                    ? "text-secondary bg-secondary/10"
                    : "text-foreground hover:bg-muted/50"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 pt-4 pb-2">
              <Button variant="gold" className="w-full shadow-gold" asChild>
                <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>
                  Browse Jobs
                </Link>
              </Button>
            </div>
            <div className="px-4 pt-2 space-y-2 text-sm text-muted-foreground border-t border-border/50 mt-2">
              <a href="tel:+971501234567" className="flex items-center gap-2 py-2">
                <Phone className="w-4 h-4" />
                +971 50 123 4567
              </a>
              <a href="mailto:info@Cotransglobal.com" className="flex items-center gap-2 py-2">
                <Mail className="w-4 h-4" />
                info@Cotransglobal.com
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
