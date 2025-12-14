import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-secondary/30 via-secondary/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-secondary/25 via-secondary/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-secondary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-3xl" style={{ animation: 'float 20s ease-in-out infinite' }} />
      </div>
      
      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', 
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite'
        }} 
      />
      
      {/* Diagonal animated lines */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ 
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)',
        animation: 'diagonalMove 15s linear infinite'
      }} />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-secondary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-primary/40" />

      {/* Main footer */}
      <div className="container-custom section-padding relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company info */}
          <div className="space-y-6 group">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 group-hover:shadow-2xl group-hover:border-secondary/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-secondary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <img 
                  src="/cotrans-logo.png" 
                  alt="Cotrans Global Logo" 
                  className="w-10 h-10 object-contain transition-all duration-500 group-hover:scale-110 relative z-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl leading-tight bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text transition-all duration-300 group-hover:from-secondary group-hover:to-secondary/80">Cotrans Global</span>
                <span className="text-xs text-primary-foreground/60 leading-tight tracking-wider transition-all duration-300 group-hover:text-primary-foreground/80">Corporation</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs transition-colors duration-300 group-hover:text-primary-foreground/85">
              Connecting talented professionals from Kenya with verified job opportunities in the UAE. Your gateway to a brighter future.
            </p>
            <div className="flex gap-3">
              {[
                // { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Instagram, href: "https://www.instagram.com/cotrans_global/", label: "Instagram" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/cotrans-global/", label: "LinkedIn" },
                { Icon: Twitter, href: "https://x.com/cotrans_global", label: "Twitter" }
              ].map(({ Icon, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  aria-label={label}
                  className="relative w-11 h-11 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all duration-300 hover:scale-110 hover:-translate-y-1 group/social overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/0 group-hover/social:from-secondary/20 group-hover/social:to-secondary/40 transition-all duration-500" />
                  <div className="absolute inset-0 bg-secondary/30 translate-y-full group-hover/social:translate-y-0 transition-transform duration-500" />
                  <Icon className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover/social:rotate-12 group-hover/social:scale-110" />
                  <div className="absolute inset-0 rounded-xl bg-secondary/0 group-hover/social:bg-secondary/10 blur-xl transition-all duration-500" />
                  <div className="absolute inset-0 border-2 border-secondary/0 group-hover/social:border-secondary/30 rounded-xl scale-150 group-hover/social:scale-100 transition-all duration-500" />
                </a>
              ))}
            </div>
          </div>


          {/* Quick Links */}
          <div className="group/section">
            <h3 className="font-display font-semibold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-secondary/50 transition-all duration-500 group-hover/section:w-full" />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary/50 blur-sm transition-all duration-500 group-hover/section:w-full" />
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Job Listings", href: "/jobs" },
                { name: "Contact", href: "/contact" },
                { name: "Apply Now", href: "/jobs" },
              ].map((link, index) => (
                <li 
                  key={link.name} 
                  className="transform transition-all duration-300 hover:translate-x-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm flex items-center gap-1 group/link relative"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-secondary transition-all duration-300 group-hover/link:w-full" />
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-secondary/50 blur-sm transition-all duration-300 group-hover/link:w-full" />
                    </span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all duration-300 group-hover/link:text-secondary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Categories */}
          <div className="group/section">
            <h3 className="font-display font-semibold text-lg mb-6 relative inline-block">
              Job Categories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-secondary/50 transition-all duration-500 group-hover/section:w-full" />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary/50 blur-sm transition-all duration-500 group-hover/section:w-full" />
            </h3>
            <ul className="space-y-3">
              {["Hospitality", "Healthcare", "Construction", "Security", "Transportation", "Retail"].map((category, index) => (
                <li 
                  key={category} 
                  className="transform transition-all duration-300 hover:translate-x-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    to={`/jobs?category=${category}`}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm flex items-center gap-1 group/link relative"
                  >
                    <span className="relative">
                      {category}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-secondary transition-all duration-300 group-hover/link:w-full" />
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-secondary/50 blur-sm transition-all duration-300 group-hover/link:w-full" />
                    </span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all duration-300 group-hover/link:text-secondary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="group/section">
            <h3 className="font-display font-semibold text-lg mb-6 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-secondary/50 transition-all duration-500 group-hover/section:w-full" />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary/50 blur-sm transition-all duration-500 group-hover/section:w-full" />
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group/item">
                <div className="relative w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/item:bg-secondary/20 group-hover/item:scale-110 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                  <MapPin className="w-5 h-5 text-secondary transition-all duration-300 group-hover/item:scale-110 relative z-10" />
                  <div className="absolute inset-0 border border-secondary/0 group-hover/item:border-secondary/30 rounded-lg scale-150 group-hover/item:scale-100 transition-all duration-500" />
                </div>
                <div>
                  <span className="text-primary-foreground/70 text-sm block transition-colors duration-300 group-hover/item:text-primary-foreground">
                    Business Bay, Sheikh Zayed Road
                  </span>
                  <span className="text-primary-foreground/70 text-sm transition-colors duration-300 group-hover/item:text-primary-foreground">
                    Dubai, United Arab Emirates
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3 group/item">
                <div className="relative w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/item:bg-secondary/20 group-hover/item:scale-110 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                  <Phone className="w-5 h-5 text-secondary transition-all duration-300 group-hover/item:scale-110 group-hover/item:rotate-12 relative z-10" />
                  <div className="absolute inset-0 border border-secondary/0 group-hover/item:border-secondary/30 rounded-lg scale-150 group-hover/item:scale-100 transition-all duration-500" />
                </div>
                <a href="tel:+971501234567" className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm relative group/link">
                  hello@cotransglobal.com
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-secondary transition-all duration-300 group-hover/link:w-full" />
                </a>
              </li>
              <li className="flex items-center gap-3 group/item">
                <div className="relative w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/item:bg-secondary/20 group-hover/item:scale-110 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
                  <Mail className="w-5 h-5 text-secondary transition-all duration-300 group-hover/item:scale-110 relative z-10" />
                  <div className="absolute inset-0 border border-secondary/0 group-hover/item:border-secondary/30 rounded-lg scale-150 group-hover/item:scale-100 transition-all duration-500" />
                </div>
                <a href="mailto:hello@cotransglobal.com" className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm relative group/link">
                  hello@cotransglobal.com
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-secondary transition-all duration-300 group-hover/link:w-full" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10 relative z-10 backdrop-blur-sm">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Cotrans Global Corporation. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-primary-foreground/50 hover:text-secondary transition-colors text-sm relative group/bottom">
              Privacy Policy
              <span className="absolute bottom-0 left-0 w-0 h-px bg-secondary transition-all duration-300 group-hover/bottom:w-full" />
              <span className="absolute bottom-0 left-0 w-0 h-px bg-secondary/50 blur-sm transition-all duration-300 group-hover/bottom:w-full" />
            </Link>
            <Link to="/terms-of-service" className="text-primary-foreground/50 hover:text-secondary transition-colors text-sm relative group/bottom">
              Terms of Service
              <span className="absolute bottom-0 left-0 w-0 h-px bg-secondary transition-all duration-300 group-hover/bottom:w-full" />
              <span className="absolute bottom-0 left-0 w-0 h-px bg-secondary/50 blur-sm transition-all duration-300 group-hover/bottom:w-full" />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          25% { transform: translateY(-20px) translateX(10px) scale(1.05); }
          50% { transform: translateY(-10px) translateX(-10px) scale(0.95); }
          75% { transform: translateY(-25px) translateX(5px) scale(1.02); }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        @keyframes diagonalMove {
          0% { background-position: 0 0; }
          100% { background-position: 100px 100px; }
        }
      `}</style>
    </footer>
  );
}