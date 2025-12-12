import { Link } from "react-router-dom";
import { MapPin, Clock, Briefcase, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/hooks/useJobs";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  className?: string;
}

export function JobCard({ job, className }: JobCardProps) {
  // Determine if job is featured
  const isFeatured = job.featured ?? false;

  // Calculate days since posted
  const daysSincePosted = Math.floor(
    (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow relative overflow-hidden",
        isFeatured && "border-secondary/50 bg-gradient-to-r from-secondary/5 to-secondary/10",
        className
      )}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-secondary text-secondary-foreground gap-1 px-2 py-1 rounded-full flex items-center">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </Badge>
        </div>
      )}

      <div className="space-y-4">
        {/* Category badge */}
        <Badge variant="outline" className="badge-navy">
          {job.category}
        </Badge>

        {/* Job title and company */}
        <div>
          <h3 className="font-display font-semibold text-xl text-foreground mb-1 line-clamp-2">
            {job.title}
          </h3>
          <p className="text-muted-foreground line-clamp-1">{job.company}</p>
        </div>

        {/* Job details */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-secondary" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-secondary" />
            <span>{job.employmentType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-secondary" />
            <span>{job.salary}</span>
          </div>
        </div>

        {/* Description preview */}
        <p className="text-muted-foreground text-sm line-clamp-3">
          {job.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              Posted {daysSincePosted === 0 ? "today" : `${daysSincePosted} day${daysSincePosted > 1 ? "s" : ""} ago`}
            </span>
          </div>
          <Button variant="gold" size="sm" asChild>
            <Link to={`/jobs/${job.slug}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
