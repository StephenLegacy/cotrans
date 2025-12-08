import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Lock,
  Mail,
  AlertCircle,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Menu,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockJobs } from "@/data/mockJobs";

// Mock applicants data
const mockApplicants = [
  { id: "1", name: "John Kimani", email: "john@example.com", job: "Executive Housekeeper", status: "pending", date: "2024-01-20" },
  { id: "2", name: "Mary Wanjiku", email: "mary@example.com", job: "Restaurant Waiter/Waitress", status: "shortlisted", date: "2024-01-19" },
  { id: "3", name: "Peter Omondi", email: "peter@example.com", job: "Security Guard", status: "interviewed", date: "2024-01-18" },
  { id: "4", name: "Grace Muthoni", email: "grace@example.com", job: "Registered Nurse", status: "rejected", date: "2024-01-17" },
  { id: "5", name: "David Njoroge", email: "david@example.com", job: "Construction Site Supervisor", status: "pending", date: "2024-01-16" },
];

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@Cotransglobal.com" && password === "admin123") {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Try admin@Cotransglobal.com / admin123");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: typeof CheckCircle }> = {
      pending: { className: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
      shortlisted: { className: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle },
      interviewed: { className: "bg-purple-50 text-purple-700 border-purple-200", icon: Calendar },
      rejected: { className: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
    };
    const { className, icon: Icon } = variants[status] || variants.pending;
    return (
      <Badge variant="outline" className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "jobs", label: "Jobs", icon: Briefcase },
    { id: "applicants", label: "Applicants", icon: Users },
    { id: "interviews", label: "Interviews", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Login page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="absolute inset-0 geometric-pattern opacity-20" />
        <div className="w-full max-w-md relative z-10">
          <div className="bg-card rounded-3xl shadow-2xl p-8 border border-border/50 backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-gold">
                <span className="text-secondary-foreground font-display font-bold text-2xl">C</span>
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">Admin Portal</h1>
              <p className="text-muted-foreground text-sm mt-1">Cotrans Global Corporation</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-xl text-sm border border-destructive/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {loginError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@Cotransglobal.com"
                    className="pl-11 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-11 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="gold" className="w-full h-12 rounded-xl shadow-gold" size="lg">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Back to Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-xl shadow-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-primary text-primary-foreground transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center shadow-gold">
              <span className="text-secondary-foreground font-display font-bold">C</span>
            </div>
            <div>
              <div className="font-display font-bold">Cotrans Global</div>
              <div className="text-xs text-primary-foreground/60">Admin Panel</div>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-secondary text-secondary-foreground shadow-gold"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/10"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-primary-foreground/10">
            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-primary-foreground/70 hover:bg-primary-foreground/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Overview of your recruitment activities</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[
                { label: "Active Jobs", value: mockJobs.length, icon: Briefcase, color: "bg-blue-500" },
                { label: "Total Applicants", value: mockApplicants.length, icon: Users, color: "bg-emerald-500" },
                { label: "Shortlisted", value: 1, icon: CheckCircle, color: "bg-purple-500" },
                { label: "Interviews", value: 1, icon: Calendar, color: "bg-amber-500" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card rounded-2xl p-5 lg:p-6 card-hover">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs lg:text-sm">{stat.label}</p>
                      <p className="text-2xl lg:text-3xl font-display font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent applicants */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-5 lg:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-display text-lg font-semibold text-foreground">Recent Applicants</h2>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("applicants")} className="rounded-xl">
                  View All
                </Button>
              </div>
              <div className="p-5 lg:p-6">
                <div className="space-y-4">
                  {mockApplicants.slice(0, 3).map((applicant) => (
                    <div key={applicant.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-border last:border-0 gap-2">
                      <div>
                        <p className="font-medium text-foreground">{applicant.name}</p>
                        <p className="text-sm text-muted-foreground">{applicant.job}</p>
                      </div>
                      {getStatusBadge(applicant.status)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs */}
        {activeTab === "jobs" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Job Listings</h1>
                <p className="text-muted-foreground">Manage your job postings</p>
              </div>
              <Button variant="gold" className="gap-2 rounded-xl shadow-gold">
                <Plus className="w-4 h-4" />
                Add New Job
              </Button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search jobs..." className="pl-11 rounded-xl" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">Job Title</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm hidden md:table-cell">Category</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm hidden lg:table-cell">Location</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm hidden md:table-cell">Deadline</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockJobs.map((job) => (
                      <tr key={job.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-foreground">{job.title}</p>
                          <p className="text-sm text-muted-foreground md:hidden">{job.category}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <Badge variant="outline" className="rounded-lg">{job.category}</Badge>
                        </td>
                        <td className="p-4 text-muted-foreground hidden lg:table-cell">{job.location}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{new Date(job.deadline).toLocaleDateString()}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="rounded-lg">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-lg">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-lg text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Applicants */}
        {activeTab === "applicants" && (
          <div className="space-y-8">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Applicants</h1>
              <p className="text-muted-foreground">Manage candidate applications</p>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search applicants..." className="pl-11 rounded-xl" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">Name</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm hidden md:table-cell">Job Applied</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm hidden lg:table-cell">Date</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockApplicants.map((applicant) => (
                      <tr key={applicant.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-foreground">{applicant.name}</p>
                          <p className="text-sm text-muted-foreground">{applicant.email}</p>
                        </td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{applicant.job}</td>
                        <td className="p-4 text-muted-foreground hidden lg:table-cell">{new Date(applicant.date).toLocaleDateString()}</td>
                        <td className="p-4">{getStatusBadge(applicant.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="rounded-lg">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-lg hidden sm:inline-flex">
                              Shortlist
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Interviews */}
        {activeTab === "interviews" && (
          <div className="space-y-8">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Interviews</h1>
              <p className="text-muted-foreground">Schedule and manage candidate interviews</p>
            </div>
            <div className="glass-card rounded-2xl p-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">No interviews scheduled</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Shortlist candidates and schedule interviews from the applicants page.
              </p>
              <Button variant="gold" onClick={() => setActiveTab("applicants")} className="rounded-xl shadow-gold">
                View Applicants
              </Button>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Configure your admin preferences</p>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <p className="text-muted-foreground text-center py-8">
                Settings panel will be available once Lovable Cloud is enabled for full backend functionality.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
