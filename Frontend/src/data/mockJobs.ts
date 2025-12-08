export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  category: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
  featured: boolean;
}

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Executive Housekeeper",
    company: "5-Star Hotel Dubai",
    location: "Dubai, UAE",
    salary: "AED 3,500 - 4,500/month",
    type: "Full-time",
    category: "Hospitality",
    description: "We are seeking an experienced Executive Housekeeper to oversee housekeeping operations at our prestigious 5-star hotel in Dubai. The ideal candidate will manage a team of housekeeping staff, ensure highest standards of cleanliness, and maintain guest satisfaction.",
    requirements: [
      "Minimum 3 years housekeeping experience in 4-5 star hotels",
      "Excellent leadership and team management skills",
      "Strong attention to detail",
      "Good English communication skills",
      "Valid passport with at least 2 years validity"
    ],
    benefits: [
      "Free accommodation provided",
      "Meals included",
      "Medical insurance",
      "Annual flight ticket",
      "30 days paid leave"
    ],
    postedDate: "2024-01-15",
    deadline: "2024-02-15",
    featured: true
  },
  {
    id: "2",
    title: "Restaurant Waiter/Waitress",
    company: "Luxury Restaurant Group",
    location: "Abu Dhabi, UAE",
    salary: "AED 2,500 - 3,000/month + Tips",
    type: "Full-time",
    category: "Hospitality",
    description: "Join our award-winning restaurant team in Abu Dhabi. We're looking for professional waiters/waitresses who can deliver exceptional dining experiences to our guests.",
    requirements: [
      "1-2 years experience in fine dining",
      "Professional appearance and demeanor",
      "Excellent customer service skills",
      "Basic English proficiency",
      "Age 21-35 years"
    ],
    benefits: [
      "Competitive salary plus tips",
      "Shared accommodation",
      "Transportation provided",
      "Medical coverage",
      "Training opportunities"
    ],
    postedDate: "2024-01-18",
    deadline: "2024-02-20",
    featured: true
  },
  {
    id: "3",
    title: "Construction Site Supervisor",
    company: "Al Futtaim Construction",
    location: "Dubai, UAE",
    salary: "AED 5,000 - 7,000/month",
    type: "Full-time",
    category: "Construction",
    description: "Seeking experienced construction supervisors for major development projects in Dubai. Responsible for overseeing daily construction activities and ensuring safety compliance.",
    requirements: [
      "5+ years construction supervision experience",
      "Diploma in Civil Engineering or related field",
      "Knowledge of UAE building codes",
      "Strong leadership abilities",
      "Ability to read technical drawings"
    ],
    benefits: [
      "Competitive salary package",
      "Accommodation allowance",
      "Transportation",
      "Overtime pay",
      "End of service benefits"
    ],
    postedDate: "2024-01-20",
    deadline: "2024-02-25",
    featured: false
  },
  {
    id: "4",
    title: "Security Guard",
    company: "Emirates Security Services",
    location: "Dubai, UAE",
    salary: "AED 2,000 - 2,500/month",
    type: "Full-time",
    category: "Security",
    description: "Looking for reliable security personnel for various sites across Dubai including shopping malls, residential compounds, and corporate buildings.",
    requirements: [
      "Previous security experience preferred",
      "Height minimum 5'8\" for males",
      "Good physical fitness",
      "Basic English communication",
      "Clean criminal record"
    ],
    benefits: [
      "Free accommodation",
      "Uniforms provided",
      "Medical insurance",
      "Overtime available",
      "Annual leave with ticket"
    ],
    postedDate: "2024-01-22",
    deadline: "2024-02-28",
    featured: false
  },
  {
    id: "5",
    title: "Registered Nurse",
    company: "Dubai Healthcare City",
    location: "Dubai, UAE",
    salary: "AED 8,000 - 12,000/month",
    type: "Full-time",
    category: "Healthcare",
    description: "Prestigious healthcare facility seeking qualified registered nurses for various departments. Excellent opportunity for career growth in world-class medical environment.",
    requirements: [
      "Bachelor's degree in Nursing",
      "Valid nursing license",
      "Minimum 2 years hospital experience",
      "BLS/ACLS certification",
      "Excellent English communication"
    ],
    benefits: [
      "Competitive tax-free salary",
      "Housing allowance",
      "Medical coverage for family",
      "Professional development",
      "Relocation assistance"
    ],
    postedDate: "2024-01-10",
    deadline: "2024-02-10",
    featured: true
  },
  {
    id: "6",
    title: "Heavy Vehicle Driver",
    company: "Emirates Logistics",
    location: "Sharjah, UAE",
    salary: "AED 3,000 - 4,000/month",
    type: "Full-time",
    category: "Transportation",
    description: "Seeking experienced heavy vehicle drivers for our logistics fleet. Transport goods across UAE and GCC countries.",
    requirements: [
      "Valid UAE heavy vehicle license or convertible license",
      "3+ years driving experience",
      "Good knowledge of UAE roads",
      "Clean driving record",
      "Age 25-45 years"
    ],
    benefits: [
      "Accommodation provided",
      "Meal allowance",
      "Vehicle insurance",
      "Performance bonuses",
      "Annual ticket"
    ],
    postedDate: "2024-01-25",
    deadline: "2024-03-01",
    featured: false
  }
];

export const jobCategories = [
  "All Categories",
  "Hospitality",
  "Construction",
  "Security",
  "Healthcare",
  "Transportation",
  "Retail",
  "Manufacturing"
];

export const jobLocations = [
  "All Locations",
  "Dubai, UAE",
  "Abu Dhabi, UAE",
  "Sharjah, UAE",
  "Ajman, UAE"
];
