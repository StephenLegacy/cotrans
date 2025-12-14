import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
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
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  
  // Use whichever parameter is available (slug or id)
  const jobIdentifier = id || slug;
  
  const { job, loading, error } = useJob(jobIdentifier);

  // Handle apply button click
  const handleApply = () => {
    if (!job) return;
    
    // Option 1: Navigate to application page with job ID
    navigate(`/apply/${job.slug || job.slug || jobIdentifier}`);
    
    // Option 2: Navigate to application page with job data in state
    // navigate('/apply', { state: { job } });
    
    // Option 3: Scroll to application form on same page (if you have one)
    // document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          {" / "}
          <Link to="/jobs" className="hover:text-primary">
            Jobs
          </Link>
          {" / "}
          {job.title}
        </div>

        {/* Job header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Link
            to="/jobs"
            className="inline-flex items-center text-primary hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{job.category}</Badge>
            {job.isActive && (
              <Badge variant="default" className="bg-green-500">
                Active
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          <p className="text-xl text-gray-700 mb-4">{job.company}</p>

          <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2" />
              {job.employmentType}
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              {job.salary}
            </div>
          </div>

          <Button size="lg" className="w-full md:w-auto" onClick={handleApply}>
            Apply Now
          </Button>
        </div>

        {/* Medical notice */}
        <MedicalNotice />

        {/* Job content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">Job Summary</h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Posted",
                    value: formatDate(job.createdAt),
                    icon: Calendar,
                  },
                  {
                    label: "Experience Level",
                    value: job.experienceLevel,
                    icon: Briefcase,
                  },
                  {
                    label: "Employment Type",
                    value: job.employmentType,
                    icon: Clock,
                  },
                  {
                    label: "Category",
                    value: job.category,
                    icon: Building,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <item.icon className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agency provides */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">
                Cotrans Global Provides
              </h3>
              <ul className="space-y-3">
                {agencyProvides.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <item.icon className="w-5 h-5 text-primary mr-3" />
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Apply CTA */}
            <div className="bg-primary/10 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">
                Don't miss this opportunity!
              </h3>
              <p className="text-gray-700 mb-4">
                Apply now to secure your position
              </p>
              <Button className="w-full" onClick={handleApply}>
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetails;