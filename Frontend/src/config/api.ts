const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cotransglobal.com/api";

export const api = {
  jobs: `${API_BASE_URL}/jobs`,
  applicants: `${API_BASE_URL}/applicants`,
  contact: `${API_BASE_URL}/contact`,
  auth: `${API_BASE_URL}/auth`,
};
