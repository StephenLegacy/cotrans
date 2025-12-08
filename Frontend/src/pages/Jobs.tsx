import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { JobCard } from "@/components/jobs/JobCard";
import { useJobs } from "@/hooks/useJobs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  // Fetch all jobs first to get categories/locations (without filters for the dropdowns)
  const { jobs: allJobs } = useJobs({});

  // Fetch filtered jobs based on user selection
  const { jobs, loading, error } = useJobs({
    category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
    location: selectedLocation !== "All Locations" ? selectedLocation : undefined,
    search: searchQuery,
  });

  // Extract unique categories and locations from ALL jobs (not filtered)
  const jobCategories = useMemo(() => {
    const categories = new Set(allJobs.map((job) => job.category));
    return ["All Categories", ...Array.from(categories).sort()];
  }, [allJobs]);

  const jobLocations = useMemo(() => {
    const locations = new Set(allJobs.map((job) => job.location));
    return ["All Locations", ...Array.from(locations).sort()];
  }, [allJobs]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedLocation("All Locations");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "All Categories" || selectedLocation !== "All Locations";

  return (
    <Layout>
      {/* Hero section - Added padding top to account for fixed header */}
      <section className="bg-gradient-hero text-primary-foreground pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-20" />
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Find Your <span className="text-secondary">Dream Job</span> in UAE
            </h1>
            <p className="text-primary-foreground/80 text-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Browse verified job opportunities from top UAE employers. All positions include 
              accommodation and benefits.
            </p>
          </div>
        </div>
      </section>

      {/* Filters section - Fixed with proper top spacing */}
      <section className="py-6 bg-background/95 border-b border-border sticky top-16 md:top-20 z-40 backdrop-blur-md shadow-sm">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title, company, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background border-border/50 focus:border-secondary transition-colors"
              />
            </div>

            {/* Category filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-background border-border/50 focus:border-secondary transition-colors">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {jobCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-background border-border/50 focus:border-secondary transition-colors">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {jobLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear filters */}
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={clearFilters} 
                className="h-12 gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Jobs listing */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* Loading state */}
          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 text-secondary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading jobs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Error Loading Jobs
              </h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button variant="gold" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{jobs.length}</span>{" "}
                  {jobs.length === 1 ? "job" : "jobs"}
                  {hasActiveFilters && " matching your criteria"}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  Sort by: <span className="font-medium text-foreground">Most Recent</span>
                </div>
              </div>

              {/* Jobs grid */}
              {jobs.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job, index) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      className={`animate-slide-up stagger-${(index % 5) + 1}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No jobs found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search criteria or browse all available positions.
                  </p>
                  <Button variant="gold" onClick={clearFilters}>
                    View All Jobs
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Jobs;