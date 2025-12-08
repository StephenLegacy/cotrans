import { Shield, FileCheck, Plane, Building, HeadphonesIcon, MapPin } from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "Verified UAE Job Placement",
    description: "All job opportunities are thoroughly vetted and verified with legitimate UAE employers.",
  },
  {
    icon: FileCheck,
    title: "Visa Processing Support",
    description: "Complete assistance with employment visa applications and documentation requirements.",
  },
  {
    icon: HeadphonesIcon,
    title: "Pre-departure Orientation",
    description: "Comprehensive training on UAE culture, workplace expectations, and living conditions.",
  },
  {
    icon: Building,
    title: "Contract Verification",
    description: "Legal review of employment contracts to ensure your rights and benefits are protected.",
  },
  {
    icon: MapPin,
    title: "Agency Support in UAE",
    description: "Ongoing assistance after arrival including accommodation and workplace integration.",
  },
  {
    icon: Plane,
    title: "Airport Pick-up",
    description: "Optional airport reception service to help you settle in smoothly upon arrival.",
  },
];

export function ServicesSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            What We Provide
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Al Oula Recruitment Agency Provides
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We go beyond just finding you a job. Our comprehensive services ensure your 
            journey to the UAE is smooth and successful.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`bg-card rounded-xl border border-border p-6 card-hover animate-slide-up stagger-${index + 1}`}
            >
              <div className="w-14 h-14 rounded-lg bg-gradient-gold flex items-center justify-center mb-4">
                <service.icon className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
