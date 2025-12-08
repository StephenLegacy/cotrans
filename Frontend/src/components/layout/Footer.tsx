import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

      {/* Main footer */}
      <div className="container-custom section-padding relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center shadow-gold">
                <span className="text-secondary-foreground font-display font-bold text-xl">C</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl leading-tight">Cotrans Global</span>
                <span className="text-xs text-primary-foreground/60 leading-tight">Corporation</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Connecting talented professionals from Kenya with verified job opportunities in the UAE. Your gateway to a brighter future.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Job Listings", href: "/jobs" },
                { name: "Contact", href: "/contact" },
                { name: "Apply Now", href: "/jobs" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Job Categories</h3>
            <ul className="space-y-3">
              {["Hospitality", "Healthcare", "Construction", "Security", "Transportation", "Retail"].map((category) => (
                <li key={category}>
                  <Link
                    to={`/jobs?category=${category}`}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm flex items-center gap-1 group"
                  >
                    {category}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <span className="text-primary-foreground/70 text-sm block">
                    Business Bay, Sheikh Zayed Road
                  </span>
                  <span className="text-primary-foreground/70 text-sm">
                    Dubai, United Arab Emirates
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
                <a href="tel:+971501234567" className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm">
                  +971 50 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-secondary" />
                </div>
                <a href="mailto:info@Cotransglobal.com" className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm">
                  info@Cotransglobal.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10 relative z-10">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Cotrans Global Corporation. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-primary-foreground/50 hover:text-secondary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-primary-foreground/50 hover:text-secondary transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
