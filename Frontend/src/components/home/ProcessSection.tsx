import { FileText, Search, UserCheck, Plane } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse & Apply",
    description: "Explore available positions and submit your application with required documents.",
  },
  {
    icon: UserCheck,
    step: "02",
    title: "Interview & Selection",
    description: "Shortlisted candidates undergo interviews with our team and potential employers.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Documentation",
    description: "Complete medical tests, contract signing, and visa processing requirements.",
  },
  {
    icon: Plane,
    step: "04",
    title: "Departure",
    description: "Attend pre-departure orientation and begin your journey to the UAE.",
  },
];

export function ProcessSection() {
  return (
    <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 geometric-pattern opacity-10" />

      <div className="container-custom relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-secondary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Your Journey to UAE Employment
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Our streamlined process ensures a smooth transition from application to employment.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`relative animate-slide-up stagger-${index + 1}`}
            >
              {/* Connector line */}
              {/* {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-primary-foreground/20" />
              )} */}

              <div className="relative bg-primary-foreground/5 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors">
                {/* Step number */}
                <div className="absolute -top-4 left-6 bg-secondary text-secondary-foreground text-sm font-bold px-3 py-1 rounded-full">
                  {step.step}
                </div>

                <div className="pt-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-primary-foreground/70 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
