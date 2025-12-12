import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { MedicalNotice } from "@/components/home/MedicalNotice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useJob } from "@/hooks/useJobs";
import { useToast } from "@/hooks/use-toast";

import { api } from "../config/api";

import {
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertTriangle,
  User,
  Mail,
  Phone,
  FileText,
  Shield,
  FileCheck,
  Building,
  MapPin,
  Plane,
  HeadphonesIcon,
  Sparkles,
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

const Apply = () => {
  const { id } = useParams<{ id: string }>();
  const { job, loading, error } = useJob(id);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "Kenyan",
    experience: "",
    education: "",
    coverLetter: "",
  });

  const [files, setFiles] = useState<{
    resume: File | null;
    passport: File | null;
  }>({
    resume: null,
    passport: null,
  });

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "passport"
  ) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append('job', id!);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      formDataToSend.append('nationality', formData.nationality);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('education', formData.education);
      formDataToSend.append('coverLetter', formData.coverLetter);
      
      // Medical fee (mandatory)
      formDataToSend.append('medicalFeePaid', 'true');
      formDataToSend.append('medicalAmount', '8000');
      
      // Add files
      if (files.resume) {
        formDataToSend.append('resume', files.resume);
      }
      if (files.passport) {
        formDataToSend.append('passport', files.passport);
      }

      const res = await fetch(api.applicants, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          title: "Application Submitted!",
          description: "Thank you for applying. You will receive a confirmation email shortly.",
        });
        setSubmitted(true);
      } else {
        toast({
          title: "Error Submitting Application",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Application error:", err);
      toast({
        title: "Error",
        description: "Unable to submit application. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="section-padding bg-background pt-32">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 rounded-3xl bg-secondary/10 flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <CheckCircle className="w-12 h-12 text-secondary" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-slide-up stagger-1">
                Application Submitted!
              </h1>
              <p className="text-muted-foreground text-lg mb-8 animate-slide-up stagger-2">
                Thank you for applying for the <strong className="text-foreground">{job.title}</strong> position. 
                We have received your application and will review it shortly. 
                You will receive a confirmation email with further details.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-3">
                <Button variant="gold" asChild className="shadow-gold">
                  <Link to="/jobs">Browse More Jobs</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">Return Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-hero text-primary-foreground pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
        <div className="container-custom relative z-10">
          <Link
            to={`/jobs/${job.slug}`}
            className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Job Details
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-secondary" />
            <span className="text-secondary font-medium">Application Form</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-3 animate-slide-up">
            Apply for {job.title}
          </h1>
          <p className="text-primary-foreground/70 text-lg animate-slide-up stagger-1">
            {job.company} • {job.location}
          </p>
        </div>
      </section>

      {/* Medical Notice */}
      <MedicalNotice />

      {/* Application form */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="glass-card rounded-2xl p-6 lg:p-8 animate-slide-up">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-secondary" />
                    </div>
                    Personal Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="h-12 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="pl-11 h-12 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+254 7XX XXX XXX"
                          className="pl-11 h-12 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience & Education */}
                <div className="glass-card rounded-2xl p-6 lg:p-8 animate-slide-up stagger-1">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-secondary" />
                    </div>
                    Experience & Education
                  </h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Work Experience *</Label>
                      <Textarea
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="Briefly describe your relevant work experience..."
                        rows={4}
                        className="rounded-xl resize-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">Education Background *</Label>
                      <Textarea
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        placeholder="List your educational qualifications..."
                        rows={3}
                        className="rounded-xl resize-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                      <Textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                        placeholder="Tell us why you're interested in this position..."
                        rows={4}
                        className="rounded-xl resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Document Upload */}
                <div className="glass-card rounded-2xl p-6 lg:p-8 animate-slide-up stagger-2">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-secondary" />
                    </div>
                    Document Upload
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume/CV *</Label>
                      <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-secondary/50 hover:bg-secondary/5 transition-all cursor-pointer group">
                        <input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(e, "resume")}
                          className="hidden"
                          required
                        />
                        <label htmlFor="resume" className="cursor-pointer">
                          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3 group-hover:text-secondary transition-colors" />
                          {files.resume ? (
                            <p className="text-sm text-foreground font-medium">
                              {files.resume.name}
                            </p>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground">
                                Click to upload resume
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF, DOC, DOCX (Max 5MB)
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passport">Passport Copy *</Label>
                      <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-secondary/50 hover:bg-secondary/5 transition-all cursor-pointer group">
                        <input
                          id="passport"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, "passport")}
                          className="hidden"
                          required
                        />
                        <label htmlFor="passport" className="cursor-pointer">
                          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3 group-hover:text-secondary transition-colors" />
                          {files.passport ? (
                            <p className="text-sm text-foreground font-medium">
                              {files.passport.name}
                            </p>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground">
                                Click to upload passport
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF, JPG, PNG (Max 5MB)
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-3">
                  <Button
                    type="submit"
                    variant="gold"
                    size="xl"
                    className="flex-1 rounded-xl shadow-gold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                  <Button type="button" variant="outline" size="xl" asChild className="rounded-xl">
                    <Link to={`/jobs/${job._id}`}>Cancel</Link>
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job summary */}
              <div className="glass-card rounded-2xl p-6 animate-slide-up stagger-1">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Applying For
                </h3>
                <div className="space-y-3">
                  <p className="font-semibold text-foreground text-lg">{job.title}</p>
                  <p className="text-muted-foreground">{job.company}</p>
                  <p className="text-sm text-muted-foreground">{job.location}</p>
                  <p className="text-secondary font-semibold">{job.salary}</p>
                </div>
              </div>

              {/* Medical reminder */}
              <div className="bg-destructive/5 rounded-2xl border border-destructive/20 p-6 animate-slide-up stagger-2">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Medical Requirement
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Kshs. 8,000</strong> mandatory medical test fee 
                      (non-refundable) required for successful candidates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Agency provides */}
              <div className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground animate-slide-up stagger-3">
                <h3 className="font-display text-lg font-semibold mb-4">
                  What We Provide
                </h3>
                <ul className="space-y-3">
                  {agencyProvides.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-primary-foreground/80 text-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-secondary" />
                      </div>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Apply;