// src/hooks/useJobs.ts
import { useState, useEffect } from 'react';

export interface Job {
  _id: string;
  slug: string; 
  title: string;
  company: string;
  location: string;
  salary: string;
  employmentType: string;
  category: string;
  experienceLevel: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  isActive: boolean;
  featured?: boolean;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Hook to fetch all jobs
export const useJobs = (filters?: {
  category?: string;
  location?: string;
  search?: string;
}): UseJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.category && filters.category !== 'All Categories') {
        params.append('category', filters.category);
      }
      if (filters?.location && filters.location !== 'All Locations') {
        params.append('location', filters.location);
      }
      if (filters?.search) {
        params.append('search', filters.search);
      }

      const url = params.toString()
        ? `${API_BASE_URL}/jobs?${params}`
        : `${API_BASE_URL}/jobs`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch jobs');

      const data = await res.json();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters?.category, filters?.location, filters?.search]);

  return { jobs, loading, error, refetch: fetchJobs };
};

// Hook to fetch a single job by slug
export const useJob = (slug?: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/jobs/slug/${slug}`);
        if (!res.ok) throw new Error('Job not found');

        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [slug]);

  return { job, loading, error };
};
