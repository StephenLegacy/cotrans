import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="section-padding bg-gradient-card">
      <div className="container-custom">
        <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 geometric-pattern opacity-20" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Start Your{" "}
              <span className="text-secondary">UAE Career Journey?</span>
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Don't miss out on life-changing opportunities. Browse our current openings and 
              take the first step towards your new career in the UAE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/jobs" className="gap-2">
                  Browse Jobs Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <a href="tel:+971501234567" className="gap-2">
                  <Phone className="w-5 h-5" />
                  Call Us Today
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
