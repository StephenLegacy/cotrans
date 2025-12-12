import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/JobCard";
import { useJobs, Job } from "@/hooks/useJobs";

export function FeaturedJobs() {
  const { jobs, loading, error } = useJobs(); // correct hook usage
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);

  // Filter featured jobs when jobs are fetched
  useEffect(() => {
    if (jobs && jobs.length > 0) {
      const featured = jobs.filter((job) => job.featured).slice(0, 3);
      setFeaturedJobs(featured);
    }
  }, [jobs]);

  if (loading) return <p className="text-center">Loading featured jobs...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Career Opportunities
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Job Openings
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our top opportunities in the UAE. All positions are verified and come with
            comprehensive benefits packages.
          </p>
        </div>

        {/* Jobs grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredJobs.length > 0 ? (
            featuredJobs.map((job, index) => (
              <JobCard
                key={job._id}
                job={job}
                className={`animate-slide-up stagger-${index + 1}`}
              />
            ))
          ) : (
            <p className="text-center col-span-full">No featured jobs available at the moment.</p>
          )}
        </div>

        {/* View all button */}
        <div className="text-center">
          <Button variant="navy" size="lg" asChild>
            <Link to="/jobs" className="gap-2">
              View All Openings
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
