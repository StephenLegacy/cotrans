import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { MedicalNotice } from "@/components/home/MedicalNotice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useJob } from "@/hooks/useJobs";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowLeft,
  Share2,
  Heart,
  Building,
  Shield,
  FileCheck,
  Plane,
  HeadphonesIcon,
  Calendar,
  Loader2,
} from "lucide-react";

const agencyProvides = [
  { icon: Shield, text: "Verified UAE Job Placement" },
  { icon: FileCheck, text: "Visa Processing Support" },
  { icon: HeadphonesIcon, text: "Pre-departure Orientation" },
  { icon: Building, text: "Contract Verification" },
  { icon: MapPin, text: "Agency Support in UAE" },
  { icon: Plane, text: "Airport Pick-up (Optional)" },
];

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { job, loading, error } = useJob(id);

  // Loading state
  if (loading) {
    return (
      <Layout>
        <section className="section-padding bg-background pt-32">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <Loader2 className="w-12 h-12 text-secondary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading job details...</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Error or job not found
  if (error || !job) {
    return <Navigate to="/jobs" replace />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="bg-muted/30 py-4 border-b border-border pt-24">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">
              Jobs
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-none">{job.title}</span>
          </div>
        </div>
      </section>

      {/* Job header */}
      <section className="bg-gradient-hero text-primary-foreground py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
        <div className="container-custom relative z-10">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-12">
            <div className="animate-slide-up">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 rounded-lg">
                  {job.category}
                </Badge>
                {job.isActive && (
                  <Badge className="bg-secondary text-secondary-foreground rounded-lg">Active</Badge>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{job.title}</h1>
              <p className="text-xl text-primary-foreground/80">{job.company}</p>

              <div className="flex flex-wrap gap-4 lg:gap-6 mt-6 text-primary-foreground/70">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-secondary" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-secondary" />
                  {job.employmentType}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-secondary" />
                  {job.salary}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 animate-slide-up stagger-2">
              <Button variant="hero" size="lg" asChild className="shadow-gold">
                <Link to={`/apply/${job._id}`}>Apply Now</Link>
              </Button>
              <div className="flex gap-3">
                <Button variant="hero-outline" size="lg" className="px-4">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="hero-outline" size="lg" className="px-4">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical notice */}
      <MedicalNotice />

      {/* Job content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="glass-card rounded-2xl p-6 lg:p-8 animate-slide-up">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Job Description
                </h2>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="glass-card rounded-2xl p-6 lg:p-8 animate-slide-up stagger-1">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="glass-card rounded-2xl p-6 lg:p-8 animate-slide-up stagger-1">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="glass-card rounded-2xl p-6 lg:p-8 animate-slide-up stagger-2">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Benefits
                  </h2>
                  <ul className="space-y-3">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job summary */}
              <div className="glass-card rounded-2xl p-6 animate-slide-up stagger-1">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Job Summary
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Posted", value: formatDate(job.createdAt), icon: Calendar },
                    { label: "Experience Level", value: job.experienceLevel, icon: Briefcase },
                    { label: "Employment Type", value: job.employmentType, icon: Clock },
                    { label: "Category", value: job.category, icon: Building },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </div>
                      <span className="font-medium text-foreground text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agency provides */}
              <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground animate-slide-up stagger-2">
                <h3 className="font-display text-lg font-semibold mb-4">
                  Cotrans Global Provides
                </h3>
                <ul className="space-y-3">
                  {agencyProvides.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-primary-foreground/80">
                      <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply CTA */}
              <div className="bg-secondary/10 rounded-2xl border border-secondary/20 p-6 text-center animate-slide-up stagger-3">
                <Clock className="w-12 h-12 text-secondary mx-auto mb-3" />
                <h3 className="font-display font-semibold text-foreground mb-2">
                  Don't miss this opportunity!
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Apply now to secure your position
                </p>
                <Button variant="gold" className="w-full shadow-gold" asChild>
                  <Link to={`/apply/${job._id}`}>Apply Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default JobDetails;