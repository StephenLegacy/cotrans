import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import Job from './src/models/Job.js';

dotenv.config();

const seedJobs = [
  {
    title: "Executive Housekeeper",
    company: "5-Star Hotel Dubai",
    location: "Dubai, UAE",
    salary: "AED 3,500 - 4,500/month",
    employmentType: "Full-time",
    category: "Hospitality",
    experienceLevel: "Mid Level",
    description: "We are seeking an experienced Executive Housekeeper to oversee housekeeping operations at our prestigious 5-star hotel in Dubai. The ideal candidate will manage a team of housekeeping staff, ensure highest standards of cleanliness, and maintain guest satisfaction.",
    requirements: [
      "Minimum 3 years housekeeping experience in 4-5 star hotels",
      "Excellent leadership and team management skills",
      "Strong attention to detail",
      "Good English communication skills",
      "Valid passport with at least 2 years validity"
    ],
    responsibilities: [
      "Oversee daily housekeeping operations",
      "Train and supervise housekeeping staff",
      "Maintain inventory of supplies",
      "Ensure quality standards are met",
      "Handle guest complaints and requests"
    ],
    benefits: [
      "Free accommodation provided",
      "Meals included",
      "Medical insurance",
      "Annual flight ticket",
      "30 days paid leave"
    ],
    featured: true,
    deadline: new Date('2026-02-15'),
    isActive: true
  },
  {
    title: "Restaurant Waiter/Waitress",
    company: "Luxury Restaurant Group",
    location: "Abu Dhabi, UAE",
    salary: "AED 2,500 - 3,000/month + Tips",
    employmentType: "Full-time",
    category: "Hospitality",
    experienceLevel: "Entry Level",
    description: "Join our award-winning restaurant team in Abu Dhabi. We're looking for professional waiters/waitresses who can deliver exceptional dining experiences to our guests.",
    requirements: [
      "1-2 years experience in fine dining",
      "Professional appearance and demeanor",
      "Excellent customer service skills",
      "Basic English proficiency",
      "Age 21-35 years"
    ],
    responsibilities: [
      "Greet and serve guests professionally",
      "Take orders and serve food/beverages",
      "Handle payments and transactions",
      "Maintain cleanliness of service areas",
      "Work collaboratively with kitchen staff"
    ],
    benefits: [
      "Competitive salary plus tips",
      "Shared accommodation",
      "Transportation provided",
      "Medical coverage",
      "Training opportunities"
    ],
    featured: true,
    deadline: new Date('2026-01-30'),
    isActive: true
  },
  {
    title: "Construction Site Supervisor",
    company: "Al Futtaim Construction",
    location: "Dubai, UAE",
    salary: "AED 5,000 - 7,000/month",
    employmentType: "Full-time",
    category: "Construction",
    experienceLevel: "Senior Level",
    description: "Seeking experienced construction supervisors for major development projects in Dubai. Responsible for overseeing daily construction activities and ensuring safety compliance.",
    requirements: [
      "5+ years construction supervision experience",
      "Diploma in Civil Engineering or related field",
      "Knowledge of UAE building codes",
      "Strong leadership abilities",
      "Ability to read technical drawings"
    ],
    responsibilities: [
      "Supervise construction site activities",
      "Ensure safety protocols are followed",
      "Coordinate with contractors and workers",
      "Monitor project progress and timelines",
      "Report to project manager"
    ],
    benefits: [
      "Competitive salary package",
      "Accommodation allowance",
      "Transportation",
      "Overtime pay",
      "End of service benefits"
    ],
    featured: false,
    deadline: new Date('2026-02-28'),
    isActive: true
  },
  {
    title: "Security Guard",
    company: "Emirates Security Services",
    location: "Dubai, UAE",
    salary: "AED 2,000 - 2,500/month",
    employmentType: "Full-time",
    category: "Other",
    experienceLevel: "Entry Level",
    description: "Looking for reliable security personnel for various sites across Dubai including shopping malls, residential compounds, and corporate buildings.",
    requirements: [
      "Previous security experience preferred",
      "Height minimum 5'8\" for males",
      "Good physical fitness",
      "Basic English communication",
      "Clean criminal record"
    ],
    responsibilities: [
      "Monitor and patrol assigned areas",
      "Control access to facilities",
      "Respond to security incidents",
      "Maintain security logs",
      "Report suspicious activities"
    ],
    benefits: [
      "Free accommodation",
      "Uniforms provided",
      "Medical insurance",
      "Overtime available",
      "Annual leave with ticket"
    ],
    featured: false,
    deadline: new Date('2026-03-15'),
    isActive: true
  },
  {
    title: "Registered Nurse",
    company: "Dubai Healthcare City",
    location: "Dubai, UAE",
    salary: "AED 8,000 - 12,000/month",
    employmentType: "Full-time",
    category: "Healthcare",
    experienceLevel: "Mid Level",
    description: "Prestigious healthcare facility seeking qualified registered nurses for various departments. Excellent opportunity for career growth in world-class medical environment.",
    requirements: [
      "Bachelor's degree in Nursing",
      "Valid nursing license",
      "Minimum 2 years hospital experience",
      "BLS/ACLS certification",
      "Excellent English communication"
    ],
    responsibilities: [
      "Provide direct patient care",
      "Administer medications and treatments",
      "Monitor patient vital signs",
      "Maintain accurate medical records",
      "Collaborate with medical team"
    ],
    benefits: [
      "Competitive tax-free salary",
      "Housing allowance",
      "Medical coverage for family",
      "Professional development",
      "Relocation assistance"
    ],
    featured: true,
    deadline: new Date('2026-01-20'),
    isActive: true
  },
  {
    title: "Heavy Vehicle Driver",
    company: "Emirates Logistics",
    location: "Sharjah, UAE",
    salary: "AED 3,000 - 4,000/month",
    employmentType: "Full-time",
    category: "Other",
    experienceLevel: "Mid Level",
    description: "Seeking experienced heavy vehicle drivers for our logistics fleet. Transport goods across UAE and GCC countries.",
    requirements: [
      "Valid UAE heavy vehicle license or convertible license",
      "3+ years driving experience",
      "Good knowledge of UAE roads",
      "Clean driving record",
      "Age 25-45 years"
    ],
    responsibilities: [
      "Drive heavy vehicles safely",
      "Load and unload cargo",
      "Maintain vehicle cleanliness",
      "Follow delivery schedules",
      "Complete delivery documentation"
    ],
    benefits: [
      "Accommodation provided",
      "Meal allowance",
      "Vehicle insurance",
      "Performance bonuses",
      "Annual ticket"
    ],
    featured: false,
    deadline: new Date('2026-02-10'),
    isActive: true
  },
  {
    title: "Chef de Partie",
    company: "Michelin Star Restaurant Dubai",
    location: "Dubai, UAE",
    salary: "AED 4,500 - 6,000/month",
    employmentType: "Full-time",
    category: "Hospitality",
    experienceLevel: "Mid Level",
    description: "Prestigious Michelin-starred restaurant seeking talented Chef de Partie to join our culinary team. Work alongside world-class chefs and create exceptional dining experiences.",
    requirements: [
      "Culinary degree or equivalent certification",
      "4+ years experience in fine dining kitchens",
      "Expertise in French or Italian cuisine",
      "Strong knowledge of food safety standards",
      "Ability to work in fast-paced environment"
    ],
    responsibilities: [
      "Prepare and cook high-quality dishes",
      "Manage your station efficiently",
      "Train and mentor commis chefs",
      "Maintain kitchen cleanliness standards",
      "Assist in menu planning and development"
    ],
    benefits: [
      "Work in Michelin-starred environment",
      "Accommodation provided",
      "Meals on duty",
      "Medical insurance",
      "Career advancement opportunities"
    ],
    featured: true,
    deadline: new Date('2026-03-01'),
    isActive: true
  },
  {
    title: "Electrical Engineer",
    company: "Dubai Electricity & Water Authority",
    location: "Dubai, UAE",
    salary: "AED 9,000 - 13,000/month",
    employmentType: "Full-time",
    category: "Engineering",
    experienceLevel: "Senior Level",
    description: "Join DEWA's engineering team to work on large-scale power distribution and renewable energy projects. Contribute to Dubai's sustainable energy future.",
    requirements: [
      "Bachelor's degree in Electrical Engineering",
      "Professional Engineering license",
      "5+ years experience in power systems",
      "Knowledge of UAE electrical codes",
      "Experience with renewable energy systems preferred"
    ],
    responsibilities: [
      "Design and oversee electrical systems",
      "Conduct site inspections and testing",
      "Review technical drawings and specifications",
      "Ensure compliance with safety standards",
      "Manage project timelines and budgets"
    ],
    benefits: [
      "Competitive tax-free salary",
      "Housing allowance",
      "Company vehicle or allowance",
      "Medical insurance for family",
      "Annual performance bonuses"
    ],
    featured: false,
    deadline: new Date('2026-03-31'),
    isActive: true
  },
  {
    title: "Retail Sales Associate",
    company: "Dubai Mall - Luxury Brand",
    location: "Dubai, UAE",
    salary: "AED 3,000 - 4,000/month + Commission",
    employmentType: "Full-time",
    category: "Retail",
    experienceLevel: "Entry Level",
    description: "Luxury retail brand in Dubai Mall seeking enthusiastic sales associates. Provide exceptional customer service and represent our prestigious brand.",
    requirements: [
      "1-2 years retail sales experience",
      "Excellent communication skills",
      "Fluent in English (Arabic is a plus)",
      "Professional appearance and attitude",
      "Passion for luxury retail"
    ],
    responsibilities: [
      "Assist customers with product selection",
      "Achieve monthly sales targets",
      "Maintain store presentation standards",
      "Process transactions accurately",
      "Build lasting customer relationships"
    ],
    benefits: [
      "Base salary plus attractive commission",
      "Staff discounts on products",
      "Medical insurance",
      "Transportation allowance",
      "Training and development programs"
    ],
    featured: false,
    deadline: new Date('2026-02-20'),
    isActive: true
  },
  {
    title: "IT Support Specialist",
    company: "Tech Solutions UAE",
    location: "Abu Dhabi, UAE",
    salary: "AED 5,000 - 7,000/month",
    employmentType: "Full-time",
    category: "Technology",
    experienceLevel: "Mid Level",
    description: "Growing IT company seeks technical support specialist to provide hardware/software support to corporate clients across UAE.",
    requirements: [
      "Bachelor's degree in IT or Computer Science",
      "3+ years IT support experience",
      "Microsoft/Cisco certifications preferred",
      "Strong troubleshooting skills",
      "Valid UAE driving license"
    ],
    responsibilities: [
      "Provide technical support to clients",
      "Install and configure hardware/software",
      "Troubleshoot network issues",
      "Maintain IT documentation",
      "Train end users on systems"
    ],
    benefits: [
      "Competitive salary package",
      "Company vehicle provided",
      "Medical insurance",
      "Professional certification support",
      "Performance bonuses"
    ],
    featured: false,
    deadline: new Date('2026-04-15'),
    isActive: true
  },
  {
    title: "Physiotherapist",
    company: "Premium Health & Wellness Center",
    location: "Dubai, UAE",
    salary: "AED 10,000 - 14,000/month",
    employmentType: "Full-time",
    category: "Healthcare",
    experienceLevel: "Mid Level",
    description: "State-of-the-art wellness center seeking experienced physiotherapist to provide rehabilitation and sports therapy services to diverse clientele.",
    requirements: [
      "Bachelor's or Master's in Physiotherapy",
      "Valid DHA/MOH license",
      "3+ years clinical experience",
      "Sports injury experience preferred",
      "Excellent patient care skills"
    ],
    responsibilities: [
      "Assess and diagnose patient conditions",
      "Develop personalized treatment plans",
      "Perform manual therapy techniques",
      "Monitor patient progress",
      "Collaborate with medical team"
    ],
    benefits: [
      "Excellent salary package",
      "Housing allowance",
      "Medical insurance with family coverage",
      "Annual flight tickets",
      "Professional development budget"
    ],
    featured: true,
    deadline: new Date('2026-03-10'),
    isActive: true
  },
  {
    title: "Accounts Manager",
    company: "Financial Services Group",
    location: "Dubai, UAE",
    salary: "AED 8,000 - 11,000/month",
    employmentType: "Full-time",
    category: "Other",
    experienceLevel: "Senior Level",
    description: "Reputable financial services company seeking accounts manager to oversee financial operations and reporting for our growing business.",
    requirements: [
      "Bachelor's degree in Accounting/Finance",
      "CPA or ACCA qualification",
      "5+ years accounting experience",
      "Experience with UAE tax regulations",
      "Proficiency in accounting software"
    ],
    responsibilities: [
      "Manage accounting operations",
      "Prepare financial statements and reports",
      "Ensure compliance with regulations",
      "Oversee month-end and year-end closing",
      "Supervise accounting staff"
    ],
    benefits: [
      "Competitive salary package",
      "Annual bonus based on performance",
      "Medical insurance",
      "Professional development opportunities",
      "Work visa and residency provided"
    ],
    featured: false,
    deadline: new Date('2026-04-30'),
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Clearing existing jobs...');
    await Job.deleteMany({});
    
    console.log('🌱 Seeding jobs...');
    const jobs = await Job.insertMany(seedJobs);
    
    console.log(`✅ Successfully seeded ${jobs.length} jobs!`);
    console.log('\nJob IDs and Deadlines:');
    jobs.forEach(job => {
      const deadlineStr = job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline';
      const featuredStr = job.featured ? '⭐ FEATURED' : '';
      console.log(`${job.title}: ${job._id} | Deadline: ${deadlineStr} ${featuredStr}`);
    });
    
    console.log('\n📊 Summary:');
    console.log(`Total jobs: ${jobs.length}`);
    console.log(`Featured jobs: ${jobs.filter(j => j.featured).length}`);
    console.log(`Categories: ${[...new Set(jobs.map(j => j.category))].join(', ')}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();