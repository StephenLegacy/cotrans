import { Layout } from "@/components/layout/Layout";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { CheckCircle, Users, Award, Globe, Target, Heart } from "lucide-react";

const stats = [
  { label: "Years of Experience", value: "10+", icon: Award },
  { label: "Candidates Placed", value: "5,000+", icon: Users },
  { label: "Partner Companies", value: "500+", icon: Globe },
  { label: "Success Rate", value: "98%", icon: CheckCircle },
];

const values = [
  { icon: Target, title: "Integrity", desc: "Honest and transparent dealings with all stakeholders" },
  { icon: Award, title: "Excellence", desc: "Commitment to highest standards in recruitment" },
  { icon: Heart, title: "Empathy", desc: "Understanding candidate needs and aspirations" },
  { icon: CheckCircle, title: "Reliability", desc: "Dependable services you can count on" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero section */}
      <section className="bg-gradient-hero text-primary-foreground pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-20" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-secondary text-sm font-medium mb-6 animate-slide-up">
              <Globe className="w-4 h-4" />
              About Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up stagger-1">
              Connecting Talent with{" "}
              <span className="text-gradient-gold">Opportunity</span>
            </h1>
            <p className="text-lg lg:text-xl text-primary-foreground/70 leading-relaxed animate-slide-up stagger-2">
              Cotrans Global Corporation is a licensed UAE recruitment firm dedicated to 
              connecting talented Kenyan professionals with verified employment opportunities 
              in the United Arab Emirates.
            </p>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-16 bg-background relative -mt-8 z-20">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`glass-card rounded-2xl p-6 text-center card-hover animate-slide-up stagger-${index + 1}`}
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-slide-up">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Our Mission
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Empowering Careers, Building Futures
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                Our mission is to bridge the gap between talented Kenyan professionals and 
                reputable UAE employers. We believe in transparent, ethical recruitment 
                practices that benefit both candidates and employers.
              </p>
              <ul className="space-y-4">
                {[
                  "Licensed by UAE Ministry of Human Resources",
                  "Registered with Kenya Labour Export Board",
                  "ISO 9001:2015 Certified processes",
                  "Member of UAE Recruitment Council",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-hero rounded-3xl p-8 lg:p-10 text-primary-foreground animate-slide-up stagger-2">
              <h3 className="font-display text-2xl lg:text-3xl font-bold mb-8">Our Values</h3>
              <div className="space-y-6">
                {values.map((value) => (
                  <div key={value.title} className="flex items-start gap-4 p-4 rounded-2xl bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary text-lg">{value.title}</h4>
                      <p className="text-primary-foreground/70 text-sm">{value.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />
      <ProcessSection />
    </Layout>
  );
};

export default About;
