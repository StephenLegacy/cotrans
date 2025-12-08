import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, ChevronRight, Sparkles, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Jobs", href: "/jobs" },
  { name: "Contact", href: "/contact" },
];

const marqueeContent = [
  { icon: Sparkles, text: "10+ Premium Jobs Available Now" },
  { icon: CheckCircle2, text: "100% Verified UAE Employers" },
  { icon: TrendingUp, text: "Fast-Track Processing in 48hrs" },
  { icon: Users, text: "Join 5,000+ Successful Placements" },
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

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/98 backdrop-blur-xl shadow-2xl border-b border-border/50"
          : "bg-gradient-to-b from-primary/95 to-primary/90 backdrop-blur-md"
      )}
    >
      {/* Top Marquee Strip - Enhanced */}
      <div
        className={cn(
          "bg-gradient-to-r from-secondary via-secondary/90 to-secondary text-secondary-foreground transition-all duration-500 overflow-hidden relative",
          scrolled ? "h-0 py-0 opacity-0" : "h-11 py-2.5 opacity-100"
        )}
      >
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="absolute inset-0 flex items-center">
          <div className="animate-marquee flex items-center gap-8 text-sm font-medium">
            {marqueeContent.map((item, idx) => (
              <span key={`m1-${idx}`} className="flex items-center gap-2 whitespace-nowrap group">
                <item.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <span className="font-semibold">{item.text}</span>
              </span>
            ))}
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Phone className="w-400.5 h-3.5" />
              <span className="font-bold">+971501234567</span>
            </span>
          </div>
          <div className="animate-marquee2 flex items-center gap-8 text-sm font-medium">
            {marqueeContent.map((item, idx) => (
              <span key={`m2-${idx}`} className="flex items-center gap-2 whitespace-nowrap group">
                <item.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <span className="font-semibold">{item.text}</span>
              </span>
            ))}
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Phone className="w-400.5 h-3.5" />
              <span className="font-bold">+971 50 123 4567</span>
            </span>
          </div>
        </div>

        {/* Hidden admin link */}
        <div className="container-custom hidden">
          <Link to="/admin" className="flex items-center gap-1 text-sm">
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container-custom relative">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo with enhanced visibility */}
          <Link to="/" className="flex items-center gap-3 group relative">
            <div className={cn(
              "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden",
              scrolled 
                ? "bg-white shadow-lg" 
                : "bg-white/95 backdrop-blur-sm shadow-xl border-2 border-white/50"
            )}>
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Rotating border effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                style={{ 
                  background: 'conic-gradient(from 0deg, transparent, rgba(217, 179, 92, 0.3), transparent)',
                  animation: 'rotate 3s linear infinite'
                }} 
              />
              
              <img
                src="/cotrans-logo.png"
                alt="Cotrans Global Logo"
                className="w-8 h-8 md:w-10 md:h-10 object-contain transition-all duration-500 group-hover:scale-110 relative z-10"
              />
            </div>

            <div className="flex flex-col leading-tight">
              <span
                className={cn(
                  "font-display font-bold text-base md:text-lg transition-all duration-300 relative",
                  scrolled 
                    ? "text-foreground" 
                    : "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                )}
              >
                Cotrans Global
                <span className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/50 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Cotrans Global
                </span>
              </span>
              <span
                className={cn(
                  "text-[10px] md:text-xs font-medium tracking-wide transition-all duration-300",
                  scrolled 
                    ? "text-muted-foreground" 
                    : "text-gray-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
                )}
              >
                Your Gateway to UAE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl group overflow-hidden",
                  location.pathname === item.href
                    ? scrolled
                      ? "text-secondary"
                      : "text-white"
                    : scrolled
                    ? "text-foreground hover:text-secondary"
                    : "text-white/90 hover:text-white"
                )}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Hover background effect */}
                <span className={cn(
                  "absolute inset-0 transition-all duration-300 rounded-xl",
                  scrolled
                    ? "bg-secondary/0 group-hover:bg-secondary/10"
                    : "bg-white/0 group-hover:bg-white/10"
                )} />
                
                {/* Active indicator */}
                {location.pathname === item.href && (
                  <span className={cn(
                    "absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full transition-all duration-300",
                    scrolled ? "bg-secondary" : "bg-white"
                  )} />
                )}
                
                <span className="relative z-10">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* CTA Button - Enhanced */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="gold" 
              asChild 
              className="relative shadow-2xl hover:shadow-3xl transition-all duration-300 group overflow-hidden"
            >
              <Link to="/jobs" className="relative z-10">
                <span className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary animate-shimmer bg-[length:200%_100%]" />
                <span className="relative flex items-center gap-2">
                  Browse Jobs
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button - Enhanced */}
          <button
            type="button"
            className={cn(
              "md:hidden p-2.5 rounded-xl transition-all duration-300 relative overflow-hidden group",
              scrolled 
                ? "bg-muted/50 hover:bg-muted text-foreground" 
                : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="absolute inset-0 bg-secondary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            {mobileMenuOpen ? (
              <X className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:rotate-90" />
            ) : (
              <Menu className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:scale-110" />
            )}
          </button>
        </div>

        {/* Mobile Navigation - Enhanced */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-500 ease-out",
            mobileMenuOpen ? "max-h-[500px] opacity-100 mb-4" : "max-h-0 opacity-0"
          )}
        >
          <div className="relative py-4 space-y-1 bg-background/98 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-secondary/50 to-secondary" />
            
            {/* Menu items */}
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "relative block px-4 py-3 mx-2 rounded-xl text-base font-semibold transition-all duration-300 overflow-hidden group",
                  location.pathname === item.href
                    ? "text-secondary bg-secondary/10"
                    : "text-foreground hover:bg-muted/70"
                )}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: mobileMenuOpen ? 'slideIn 0.3s ease-out forwards' : 'none'
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/5 to-secondary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-between">
                  {item.name}
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-all duration-300",
                    location.pathname === item.href
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  )} />
                </span>
              </Link>
            ))}
            
            {/* CTA Button */}
            <div className="px-4 pt-4 pb-2">
              <Button 
                variant="gold" 
                className="w-full shadow-xl relative overflow-hidden group" 
                asChild
              >
                <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary animate-shimmer bg-[length:200%_100%]" />
                  <span className="relative flex items-center justify-center gap-2">
                    Browse All Jobs
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </div>
            
            {/* Contact Info */}
            <div className="px-4 pt-4 space-y-2 text-sm border-t border-border/50 mt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Contact</p>
              <a 
                href="tel:+971501234567" 
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Call Us</span>
                  <span className="font-semibold text-foreground">+971 50 123 4567</span>
                </div>
              </a>
              <a 
                href="mailto:info@cotransglobal.com" 
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Email Us</span>
                  <span className="font-semibold text-foreground">info@cotransglobal.com</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes marquee2 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        .animate-marquee2 {
          animation: marquee2 20s linear infinite;
        }
        
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </header>
  );
}