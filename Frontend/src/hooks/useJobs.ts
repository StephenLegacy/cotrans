// src/hooks/useJobs.ts
import { useState, useEffect } from 'react';

export interface Job {
  _id: string;
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
  deadline?: string; // ← Add this
  createdAt: string;
  updatedAt: string;
}

interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const API_URL = 'http://localhost:5050/api/jobs';

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

      const url = params.toString() ? `${API_URL}?${params}` : API_URL;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error('Failed to fetch jobs');
      }

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

export const useJob = (id: string | undefined) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/${id}`); // ← Fixed syntax error
        
        if (!res.ok) {
          throw new Error('Job not found');
        }

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
  }, [id]);

  return { job, loading, error };
};