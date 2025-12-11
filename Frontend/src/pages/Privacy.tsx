import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Database, Globe, Users, CheckCircle, ChevronRight, Sparkles, FileText, Mail, MapPin, Clock, AlertCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Update active section based on scroll
      const sections = document.querySelectorAll('.policy-section');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(index);
        }
      });
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const sections = [
    {
      icon: Shield,
      title: "Your Trust, Our Commitment",
      subtitle: "How we protect your personal information",
      color: "from-amber-400 to-yellow-500",
      content: [
        {
          heading: "Introduction",
          text: "At Cotrans Global Corporation, we understand that connecting talented Kenyan professionals with opportunities in the UAE requires the highest level of trust. This Privacy Policy explains how we collect, use, protect, and share your personal information as we help you navigate your career journey."
        },
        {
          heading: "Who We Are",
          text: "Cotrans Global Corporation is a Human Resources & Operational Support Service Company specializing in humanitarian projects and professional placement services. We operate globally with offices in Nairobi, Kenya, and Dubai, UAE, connecting exceptional talent with life-changing opportunities."
        }
      ]
    },
    {
      icon: Database,
      title: "Information We Collect",
      subtitle: "Understanding the data that powers your journey",
      color: "from-blue-400 to-indigo-500",
      content: [
        {
          heading: "Personal Information",
          text: "We collect information you provide directly: Full name, contact details (email, phone), residential address, date of birth, nationality, passport details, education history, professional qualifications, work experience, employment references, language proficiencies, and any other information you share in your application."
        },
        {
          heading: "Application Data",
          text: "When you apply for positions: CVs/resumes, cover letters, portfolio materials, certificates and credentials, visa and work permit information, salary expectations, and job preferences."
        },
        {
          heading: "Technical Information",
          text: "Automatically collected data: IP address, browser type and version, device information, pages visited, time spent on pages, referring URLs, and cookies for site functionality and analytics."
        },
        {
          heading: "Communication Records",
          text: "We maintain records of: Email correspondence, phone call notes, interview feedback, consultation discussions, and support interactions to provide continuity in our service to you."
        }
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      subtitle: "Turning data into opportunities",
      color: "from-purple-400 to-pink-500",
      content: [
        {
          heading: "Primary Purposes",
          text: "Matching you with suitable UAE employment opportunities; Processing and managing your job applications; Communicating with potential employers on your behalf; Verifying your qualifications and credentials; Providing career guidance and consultation services; Processing visa and work permit applications; Facilitating interviews and placement processes."
        },
        {
          heading: "Operational Excellence",
          text: "Improving our recruitment services; Analyzing trends in the job market; Maintaining accurate candidate databases; Ensuring compliance with UAE and Kenyan employment regulations; Preventing fraud and protecting both candidates and employers."
        },
        {
          heading: "Communication",
          text: "Sending you relevant job opportunities; Providing updates on your applications; Sharing career advice and industry insights; Notifying you of changes to our services; Responding to your inquiries and support requests."
        }
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      subtitle: "Your privacy in the recruitment ecosystem",
      color: "from-green-400 to-emerald-500",
      content: [
        {
          heading: "With Your Consent",
          text: "We share your information with potential employers in the UAE only after obtaining your explicit consent. You control which companies see your profile and application materials."
        },
        {
          heading: "Service Providers",
          text: "We work with trusted partners: Background check services, document verification providers, visa processing agencies, recruitment technology platforms, and cloud storage providers - all bound by strict confidentiality agreements."
        },
        {
          heading: "Legal Obligations",
          text: "We may disclose information when required by law, to comply with legal processes, protect our rights and safety, prevent fraud or security threats, or cooperate with government authorities in Kenya and the UAE."
        },
        {
          heading: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity, with continued protection under this policy."
        }
      ]
    },
    {
      icon: Lock,
      title: "Data Security & Protection",
      subtitle: "Safeguarding your information with military-grade security",
      color: "from-red-400 to-orange-500",
      content: [
        {
          heading: "Security Measures",
          text: "We implement comprehensive security protocols: End-to-end encryption for data transmission; Secure, encrypted databases with regular backups; Multi-factor authentication for system access; Regular security audits and penetration testing; Employee training on data protection; Secure physical access controls at our offices; Compliance with international data protection standards (GDPR, Kenya Data Protection Act)."
        },
        {
          heading: "Data Retention",
          text: "We retain your information for as long as necessary to provide services and comply with legal obligations. Active candidates: Duration of job search plus 2 years; Placed candidates: 7 years for employment records; Unsuccessful applications: 2 years unless you request earlier deletion; Marketing communications: Until you unsubscribe."
        },
        {
          heading: "Your Control",
          text: "You can request deletion of your data at any time, subject to legal retention requirements. We will promptly remove your information from active systems while maintaining legally required records."
        }
      ]
    },
    {
      icon: Globe,
      title: "International Data Transfers",
      subtitle: "Connecting Kenya and UAE responsibly",
      color: "from-cyan-400 to-teal-500",
      content: [
        {
          heading: "Cross-Border Processing",
          text: "Your information may be transferred between Kenya and the UAE as part of our recruitment services. We ensure adequate protection through: Standard contractual clauses approved by data protection authorities; Compliance with both Kenyan and UAE data protection laws; Secure transfer mechanisms and encryption; Regular audits of international data flows."
        },
        {
          heading: "Regional Compliance",
          text: "Kenya: We comply with the Data Protection Act, 2019; UAE: We adhere to UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection; International: We follow GDPR principles for data subject rights and processing standards."
        }
      ]
    },
    {
      icon: CheckCircle,
      title: "Your Rights & Choices",
      subtitle: "Empowering you with control over your data",
      color: "from-violet-400 to-purple-500",
      content: [
        {
          heading: "Access & Control",
          text: "You have the right to: Access your personal information we hold; Request corrections to inaccurate data; Request deletion of your data; Object to certain processing activities; Request data portability; Withdraw consent at any time; Opt-out of marketing communications; Lodge complaints with data protection authorities."
        },
        {
          heading: "How to Exercise Your Rights",
          text: "Contact our Data Protection Officer at: Email: privacy@cotransglobal.com; Phone: +254 [Your Kenya Number]; Address: UN Lane, Off UN Avenue, Nairobi, Kenya; We will respond to your request within 30 days and provide clear explanations of any actions taken."
        }
      ]
    },
    {
      icon: Sparkles,
      title: "Cookies & Tracking",
      subtitle: "Understanding our website technology",
      color: "from-pink-400 to-rose-500",
      content: [
        {
          heading: "Cookie Usage",
          text: "Essential Cookies: Required for site functionality, login sessions, and security; Analytics Cookies: Help us understand site usage and improve user experience (Google Analytics); Preference Cookies: Remember your settings and choices; Marketing Cookies: Used only with your consent for targeted job recommendations."
        },
        {
          heading: "Your Choices",
          text: "You can control cookies through your browser settings. Disabling certain cookies may affect site functionality. We respect 'Do Not Track' browser settings."
        }
      ]
    },
    {
      icon: FileText,
      title: "Children's Privacy",
      subtitle: "Protecting minors online",
      color: "from-yellow-400 to-amber-500",
      content: [
        {
          heading: "Age Restrictions",
          text: "Our services are intended for individuals 18 years and older. We do not knowingly collect information from minors. If we discover we have inadvertently collected data from someone under 18, we will delete it immediately. Parents or guardians who believe we may have information about a minor should contact us immediately."
        }
      ]
    },
    {
      icon: AlertCircle,
      title: "Policy Updates",
      subtitle: "Staying transparent as we evolve",
      color: "from-orange-400 to-red-500",
      content: [
        {
          heading: "Changes to This Policy",
          text: "We may update this Privacy Policy to reflect changes in our practices, technology, legal requirements, or business operations. Material changes will be communicated via: Email notification to registered users; Prominent notice on our website; Updated 'Last Modified' date at the top of this policy; For significant changes, we may require renewed consent."
        },
        {
          heading: "Notification Period",
          text: "We provide at least 30 days notice before implementing material changes, giving you time to review and decide whether to continue using our services."
        }
      ]
    }
  ];

  const contactInfo = [
    { icon: Mail, label: "Email", value: "privacy@cotransglobal.com" },
    { icon: MapPin, label: "Kenya Office", value: "UN Lane, Off UN Avenue, Nairobi, Kenya" },
    { icon: MapPin, label: "UAE Office", value: "Dubai, United Arab Emirates" },
    { icon: Globe, label: "Website", value: "www.cotransglobal.com" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(251, 191, 36, 0.15), transparent 50%)`
        }} />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FBBF24' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }} />
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800/50 backdrop-blur-sm z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <div className={`relative pt-20 pb-32 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Last Updated: December 11, 2025</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent animate-pulse">
            Privacy Policy
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Your trust is the foundation of our mission. Here's how we protect and honor it.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-amber-500/30">
              <Shield className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300">Bank-Level Encryption</p>
            </div>
            <div className="px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-amber-500/30">
              <Globe className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300">GDPR Compliant</p>
            </div>
            <div className="px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-amber-500/30">
              <Lock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300">ISO Certified</p>
            </div>
          </div>

            <div className="relative max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 blur-3xl opacity-20 animate-pulse" />
                    <div className="relative bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-amber-500/30">
                        <p className="text-lg text-slate-200 leading-relaxed">
                            At Cotrans Global Corporation, connecting Kenyan talent with UAE opportunities means handling your dreams and aspirations with care. 
                            This policy isn't just legal compliance—it's our promise to treat your information with the respect it deserves.
                        </p>
                    </div>
                </div>
            </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold mb-4 text-amber-400">Quick Navigation</h3>
              <div className="space-y-2">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        document.querySelectorAll('.policy-section')[index]?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        activeSection === index
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                          : 'text-slate-400 hover:bg-slate-700/30 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium text-left">{section.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="policy-section group"
                >
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${section.color} blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                    <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 hover:border-amber-500/50 transition-all duration-500">
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`p-4 rounded-xl bg-gradient-to-br ${section.color}`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl font-bold text-white mb-2">
                            {section.title}
                          </h2>
                          <p className="text-slate-400">{section.subtitle}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {section.content.map((item, itemIndex) => (
                          <div key={itemIndex} className="border-l-2 border-amber-500/30 pl-6">
                            <h3 className="text-xl font-semibold text-amber-400 mb-3">
                              {item.heading}
                            </h3>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 blur-3xl opacity-20" />
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-amber-500/30 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Questions? We're Here to Help
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300">
                    <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">{info.label}</p>
                      <p className="text-white font-medium">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-300 font-semibold">© 2025 Cotrans Global Corporation. All rights reserved.</p>
              <p className="text-slate-400 text-sm">Connecting Kenyan Excellence with UAE Opportunities</p>
            </div>

            <div className="flex gap-4">

              {/* Back to Website */}
              <Link
                to="/"
                className="px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 
                text-slate-900 font-semibold rounded-lg 
                hover:shadow-lg hover:shadow-amber-500/50 
                transition-all duration-300 flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Back to Website
              </Link>

              {/* Terms of Service */}
              <Link
                to="/terms-of-service"
                className="px-6 py-2 bg-slate-800/50 
                text-slate-300 font-semibold rounded-lg 
                border border-slate-700/50 
                hover:border-amber-500/50 hover:text-white 
                transition-all duration-300 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Terms of Service
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;