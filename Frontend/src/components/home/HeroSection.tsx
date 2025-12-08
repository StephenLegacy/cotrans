import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, Briefcase, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 geometric-pattern opacity-20" />
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-secondary/5 to-transparent rounded-full" />

      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark animate-slide-up">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-primary-foreground/90 text-sm font-medium">
                Licensed UAE Recruitment Agency
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-[1.1] animate-slide-up stagger-1">
              Your Gateway to{" "}
              <span className="text-gradient-gold">UAE Career</span>{" "}
              <span className="block">Opportunities</span>
            </h1>

            <p className="text-lg lg:text-xl text-primary-foreground/70 max-w-xl leading-relaxed animate-slide-up stagger-2">
              Cotrans Global Corporation connects talented Kenyan professionals with 
              verified employment opportunities in the United Arab Emirates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-3">
              <Button variant="hero" size="xl" asChild className="group shadow-gold">
                <Link to="/jobs" className="gap-2">
                  Browse Open Positions
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6 animate-slide-up stagger-4">
              {[
                { icon: Users, text: "5000+ Placed" },
                { icon: Briefcase, text: "500+ Partners" },
                { icon: CheckCircle, text: "100% Verified" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-primary-foreground/60">
                  <item.icon className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right content - Stats cards */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Main stat card */}
              <div className="glass-dark rounded-3xl p-8 animate-slide-up stagger-2">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "10+", label: "Years Experience" },
                    { value: "98%", label: "Success Rate" },
                    { value: "50+", label: "Job Categories" },
                    { value: "24/7", label: "Support" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-5 rounded-2xl bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors"
                    >
                      <div className="text-4xl font-display font-bold text-secondary mb-1">
                        {stat.value}
                      </div>
                      <div className="text-primary-foreground/60 text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-8 -left-8 bg-card rounded-2xl p-5 shadow-xl border border-border/50 animate-slide-up stagger-4 floating-element">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-lg">Verified Employers</div>
                    <div className="text-sm text-muted-foreground">All jobs pre-screened</div>
                  </div>
                </div>
              </div>

              {/* Top floating badge */}
              <div className="absolute -top-4 right-8 bg-secondary text-secondary-foreground px-5 py-2 rounded-full shadow-gold animate-slide-up stagger-3 text-sm font-medium">
                <Globe className="w-4 h-4 inline mr-2" />
                UAE Licensed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
