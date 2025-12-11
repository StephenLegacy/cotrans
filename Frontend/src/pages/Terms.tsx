import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { FileText, Scale, Briefcase, AlertTriangle, CheckCircle2, XCircle, Users, Globe, TrendingUp, Shield, Zap, Heart, Award, Target, Clock, DollarSign, UserCheck, FileCheck, Mail, Phone, MapPin } from 'lucide-react';

const TermsOfService = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showAcceptance, setShowAcceptance] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      if (window.scrollY > 300 && !showAcceptance && !acceptedTerms) {
        setShowAcceptance(true);
      }
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    // Animated background particles
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(251, 191, 36, 0.5)';
        
        particles.forEach(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        requestAnimationFrame(animate);
      };

      animate();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [acceptedTerms, showAcceptance]);

  const categories = [
    {
      id: 'overview',
      icon: FileText,
      title: 'Agreement Overview',
      color: 'from-blue-400 to-cyan-500',
      sections: [
        {
          heading: 'Welcome to Your Journey',
          content: 'These Terms of Service ("Terms") govern your relationship with Cotrans Global Corporation ("Cotrans," "we," "us," or "our") as we work together to connect exceptional Kenyan professionals with transformative career opportunities in the United Arab Emirates. By accessing our website at www.cotransglobal.com or using our recruitment services, you agree to be bound by these Terms.',
          icon: Heart
        },
        {
          heading: 'Who This Agreement Covers',
          content: 'These Terms apply to: Job seekers and candidates seeking UAE employment; Employers and organizations seeking talent; Website visitors and users; Anyone accessing our recruitment services, career resources, or consultation services. If you do not agree with these Terms, please do not use our services.',
          icon: Users
        },
        {
          heading: 'Our Mission',
          content: 'Cotrans Global Corporation specializes in connecting talented Kenyan professionals with life-changing opportunities in the UAE. We operate as a Human Resources & Operational Support Service Company, providing comprehensive recruitment, placement, and career support services across multiple industries.',
          icon: Target
        }
      ]
    },
    {
      id: 'services',
      icon: Briefcase,
      title: 'Our Services',
      color: 'from-purple-400 to-pink-500',
      sections: [
        {
          heading: 'Recruitment Services',
          content: 'Job matching and placement services connecting Kenyan professionals with UAE employers; Comprehensive candidate profiling and skills assessment; CV optimization and application preparation; Interview coaching and preparation; Salary negotiation support; Career counseling and guidance.',
          icon: UserCheck
        },
        {
          heading: 'Document Processing',
          content: 'Visa application assistance and coordination; Work permit facilitation; Educational credential verification; Professional certification validation; Background check coordination; Document translation and attestation support.',
          icon: FileCheck
        },
        {
          heading: 'Employer Services',
          content: 'Talent sourcing and recruitment; Candidate screening and vetting; Skills assessment and testing; Interview coordination; Onboarding support; Compliance advisory for UAE labor laws.',
          icon: Briefcase
        },
        {
          heading: 'Digital Platform',
          content: 'Access to our online job portal; Application tracking system; Career resources and articles; Market insights and salary guides; Direct messaging with recruitment consultants; Document upload and management.',
          icon: Globe
        }
      ]
    },
    {
      id: 'candidate',
      icon: Users,
      title: 'Candidate Obligations',
      color: 'from-green-400 to-emerald-500',
      sections: [
        {
          heading: 'Accuracy of Information',
          content: 'You must provide truthful, accurate, and complete information in all applications, CVs, and communications. Misrepresentation of qualifications, experience, or credentials is grounds for immediate termination of services and may result in legal action. You are responsible for keeping your profile information current and accurate.',
          icon: CheckCircle2
        },
        {
          heading: 'Professional Conduct',
          content: 'Maintain professional behavior in all interactions with Cotrans staff and potential employers; Attend scheduled interviews and meetings punctually; Respond to communications within reasonable timeframes; Notify us immediately of any changes in your availability or circumstances; Treat all parties with respect and courtesy.',
          icon: Award
        },
        {
          heading: 'Exclusive Representation',
          content: 'If you choose to work exclusively with Cotrans for UAE placements, you agree not to apply for the same positions through other recruitment agencies. This ensures we can effectively represent your interests and avoid conflicts with employers. You may notify us if you wish to work with multiple agencies.',
          icon: Shield
        },
        {
          heading: 'Confidentiality',
          content: 'You agree to keep confidential any proprietary information about employers, salary ranges, or business opportunities shared during the recruitment process. You will not share interview questions, assessments, or internal company information with others.',
          icon: Lock
        }
      ]
    },
    {
      id: 'fees',
      icon: DollarSign,
      title: 'Fees & Payment',
      color: 'from-amber-400 to-yellow-500',
      sections: [
        {
          heading: 'Free Candidate Services',
          content: 'Our core recruitment services are FREE for job seekers, including: Job matching and applications; CV review and basic optimization; Interview coordination; Basic visa guidance; Access to job listings; Recruitment consultant support. We believe in making opportunities accessible to all qualified candidates.',
          icon: Heart
        },
        {
          heading: 'Premium Services (Optional)',
          content: 'We offer optional premium services for candidates seeking additional support: Executive CV writing and LinkedIn optimization: $150-300; Comprehensive interview coaching (3 sessions): $200; Expedited application processing: $100; Professional photography for applications: $75; Career assessment and planning consultation: $150-500. All premium services are clearly priced and require your explicit consent.',
          icon: TrendingUp
        },
        {
          heading: 'Employer Fees',
          content: 'Employers pay placement fees upon successful hiring: Standard placement fee: 15-25% of first-year annual salary; Executive placements: 25-35% of first-year annual salary; Payment terms: 50% upon candidate acceptance, 50% after successful completion of probation period; Guarantee period: 90 days replacement guarantee for placements.',
          icon: Briefcase
        },
        {
          heading: 'Payment Terms',
          content: 'Premium services must be paid in advance; Accepted payment methods: Bank transfer, M-Pesa, credit/debit cards; All fees are in USD unless otherwise specified; Refund policy: Premium services are non-refundable once delivered, but we guarantee satisfaction or will redo the work.',
          icon: DollarSign
        },
        {
          heading: 'No Hidden Fees',
          content: 'We commit to complete transparency: You will never be charged without explicit consent; All fees are clearly communicated in writing; We never charge for job offers or introductions to employers; Beware of scams: Legitimate employers in UAE do not charge candidates recruitment fees.',
          icon: Shield
        }
      ]
    },
    {
      id: 'guarantees',
      icon: Shield,
      title: 'Guarantees & Limitations',
      color: 'from-red-400 to-orange-500',
      sections: [
        {
          heading: 'What We Guarantee',
          content: 'Professional service delivery; Honest representation of your qualifications; Good faith efforts to match you with suitable opportunities; Confidentiality of your information; Compliance with Kenyan and UAE employment regulations; Transparent communication throughout the process.',
          icon: CheckCircle2
        },
        {
          heading: 'What We Cannot Guarantee',
          content: 'Job placement or specific employment outcomes: Success depends on market conditions, employer requirements, and candidate qualifications; Visa approval: Visa decisions are made by UAE immigration authorities; Interview outcomes: Hiring decisions rest with employers; Specific salary levels: Compensation is determined by employers; Timeline for placement: Process duration varies based on multiple factors.',
          icon: XCircle
        },
        {
          heading: 'Service Standards',
          content: 'While we cannot guarantee employment, we commit to: Responding to inquiries within 2 business days; Providing regular updates on application status; Submitting your application to all suitable opportunities; Preparing you thoroughly for interviews; Advocating for fair compensation; Providing honest feedback throughout the process.',
          icon: Award
        },
        {
          heading: 'Force Majeure',
          content: 'We are not liable for delays or failures caused by circumstances beyond our control: Changes in immigration policies; Economic downturns or market conditions; Employer decisions or bankruptcy; Natural disasters or pandemics; Government actions or political instability; Technology failures or cyber attacks.',
          icon: AlertTriangle
        }
      ]
    },
    {
      id: 'conduct',
      icon: Scale,
      title: 'Code of Conduct',
      color: 'from-indigo-400 to-purple-500',
      sections: [
        {
          heading: 'Professional Ethics',
          content: 'Cotrans operates with the highest ethical standards, and we expect the same from our candidates: No bribery or corruption in any form; No fraudulent documentation or false credentials; No discrimination based on protected characteristics; No harassment of staff or other candidates; No attempts to circumvent our processes; Respect for intellectual property and confidential information.',
          icon: Scale
        },
        {
          heading: 'Prohibited Activities',
          content: 'The following activities will result in immediate termination of services: Creating multiple accounts with false information; Sharing login credentials with others; Automated scraping or data mining of our platform; Spamming or sending unsolicited communications; Impersonating others or creating fake profiles; Attempting to hack or compromise our systems; Using our services for illegal purposes.',
          icon: XCircle
        },
        {
          heading: 'Consequences of Violations',
          content: 'Violations may result in: Immediate suspension or termination of account; Notification to relevant employers; Reporting to authorities if illegal activity is suspected; Legal action for damages caused; Permanent ban from our services.',
          icon: AlertTriangle
        }
      ]
    },
    {
      id: 'intellectual',
      icon: Award,
      title: 'Intellectual Property',
      color: 'from-pink-400 to-rose-500',
      sections: [
        {
          heading: 'Our Content',
          content: 'All content on www.cotransglobal.com is owned by Cotrans Global Corporation: Website design, layout, and functionality; Job descriptions and career resources; Articles, guides, and educational materials; Logos, trademarks, and branding; Software and technology platforms; Assessment tools and methodologies. You may not copy, reproduce, distribute, or create derivative works without written permission.',
          icon: Shield
        },
        {
          heading: 'Your Content',
          content: 'You retain ownership of content you provide (CVs, cover letters, portfolios). By submitting content, you grant Cotrans a non-exclusive license to: Store and process your information; Share with potential employers; Use anonymized data for market research; Display on our platform as part of your profile. You warrant that you have rights to all content you submit.',
          icon: FileCheck
        },
        {
          heading: 'Third-Party Content',
          content: 'Our platform may contain links to third-party websites or resources. We do not endorse or control these external sites and are not responsible for their content or practices.',
          icon: Globe
        }
      ]
    },
    {
      id: 'liability',
      icon: AlertTriangle,
      title: 'Limitation of Liability',
      color: 'from-orange-400 to-red-500',
      sections: [
        {
          heading: 'Service Limitations',
          content: 'Cotrans provides recruitment services on an "as is" basis. While we strive for excellence, we cannot guarantee specific outcomes. Our liability is limited to the amount of fees you have paid for premium services in the 12 months preceding any claim.',
          icon: Shield
        },
        {
          heading: 'Exclusions',
          content: 'We are not liable for: Lost opportunities due to candidate unavailability; Employer decisions or changes in hiring plans; Unsuccessful job applications or interview outcomes; Immigration or visa denials; Changes in employment terms by employers; Actions of third-party service providers; Economic or market conditions affecting employment.',
          icon: XCircle
        },
        {
          heading: 'Indemnification',
          content: 'You agree to indemnify Cotrans against claims arising from: Your violation of these Terms; False or misleading information you provide; Your breach of confidentiality; Your unlawful conduct; Infringement of third-party rights.',
          icon: Scale
        }
      ]
    },
    {
      id: 'termination',
      icon: XCircle,
      title: 'Termination',
      color: 'from-cyan-400 to-blue-500',
      sections: [
        {
          heading: 'Your Right to Terminate',
          content: 'You may discontinue our services at any time by: Sending written notice to info@cotransglobal.com; Requesting account deletion; Withdrawing from active applications. We will cease representing you upon receiving notice, though applications already submitted may continue.',
          icon: UserCheck
        },
        {
          heading: 'Our Right to Terminate',
          content: 'We may suspend or terminate services if: You violate these Terms; You provide false information; You engage in prohibited conduct; You fail to respond to communications for 60+ days; Legal requirements necessitate termination; You request termination.',
          icon: Shield
        },
        {
          heading: 'Effect of Termination',
          content: 'Upon termination: Your account access will be disabled; We will cease submitting new applications on your behalf; Existing applications may continue with your consent; Your data will be retained per our Privacy Policy; No refunds for premium services already delivered.',
          icon: Clock
        }
      ]
    },
    {
      id: 'governing',
      icon: Globe,
      title: 'Governing Law & Disputes',
      color: 'from-violet-400 to-purple-500',
      sections: [
        {
          heading: 'Applicable Law',
          content: 'These Terms are governed by the laws of Kenya for services provided from our Nairobi office, and UAE law for services in the UAE. For international transactions, Kenyan law applies.',
          icon: Scale
        },
        {
          heading: 'Dispute Resolution',
          content: 'We encourage resolving disputes amicably: Step 1: Contact our customer service team; Step 2: Escalate to management if unresolved within 14 days; Step 3: Mediation through an agreed mediator; Step 4: Arbitration in Nairobi, Kenya, under Arbitration Act 1995; Court litigation is a last resort after exhausting other options.',
          icon: Users
        },
        {
          heading: 'Class Action Waiver',
          content: 'You agree to resolve disputes individually and waive rights to class actions or consolidated proceedings.',
          icon: FileText
        }
      ]
    },
    {
      id: 'changes',
      icon: Clock,
      title: 'Changes to Terms',
      color: 'from-green-400 to-teal-500',
      sections: [
        {
          heading: 'Updates',
          content: 'We may modify these Terms to reflect: Changes in our services; Legal or regulatory requirements; Industry best practices; User feedback and improvements. Material changes will be communicated via email 30 days before taking effect.',
          icon: AlertTriangle
        },
        {
          heading: 'Continued Use',
          content: 'Your continued use of services after changes constitutes acceptance of updated Terms. If you disagree with changes, you may terminate your account.',
          icon: CheckCircle2
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 opacity-20 pointer-events-none"
      />

      {/* Dynamic Gradient Overlay */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(251, 191, 36, 0.2), transparent 50%)`
          }}
        />
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800/50 backdrop-blur-sm z-50">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Acceptance Button */}
      {showAcceptance && !acceptedTerms && (
        <div className="fixed bottom-8 right-8 z-40 animate-bounce">
          <button
            onClick={() => setAcceptedTerms(true)}
            className="px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-bold rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6" />
            I Accept These Terms
          </button>
        </div>
      )}

      {/* Accepted Confirmation */}
      {acceptedTerms && (
        <div className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-green-500 text-white font-medium rounded-full shadow-2xl flex items-center gap-2 animate-scale-in">
          <CheckCircle2 className="w-5 h-5" />
          Terms Accepted!
        </div>
      )}

      {/* Hero Section */}
      <div className="relative pt-20 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-500/30 animate-pulse">
            <div className="flex items-center gap-2 text-amber-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Effective Date: December 11, 2025</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Terms of Service
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            The foundation of our partnership. Clear, fair, and built for your success.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { icon: Scale, text: 'Fair & Transparent' },
              { icon: Shield, text: 'Protected Rights' },
              { icon: Heart, text: 'Built for Trust' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-amber-500/30 hover:border-amber-500 transition-all duration-300 hover:scale-105"
                >
                  <Icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-300 font-medium">{item.text}</p>
                </div>
              );
            })}
          </div>

          {/* Hero Card */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 blur-3xl opacity-20 animate-pulse" />
            <div className="relative bg-slate-800/50 backdrop-blur-xl p-10 rounded-3xl border border-amber-500/30 shadow-2xl">
              <Scale className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-6">
                These Terms of Service are more than legal text—they're our commitment to treating your career aspirations with the professionalism and care they deserve. We've written them in clear language because transparency is the foundation of trust.
              </p>
              <div className="flex items-center justify-center gap-2 text-amber-400 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span>Read time: 15 minutes • Last updated: December 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-1 z-30 bg-slate-900/80 backdrop-blur-xl border-y border-slate-700/50 px-6 py-4">
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveTab(index);
                    document.getElementById(category.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === index
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{category.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {categories.map((category, catIndex) => {
          const CategoryIcon = category.icon;
          return (
            <div key={category.id} id={category.id} className="scroll-mt-24">
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 md:p-12 hover:border-amber-500/50 transition-all duration-500">
                  {/* Category Header */}
                  <div className="flex items-start gap-6 mb-10">
                    <div className={`p-5 rounded-2xl bg-gradient-to-br ${category.color} shadow-2xl`}>
                      <CategoryIcon className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        {category.title}
                      </h2>
                      <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full" />
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="space-y-8">
                    {category.sections.map((section, secIndex) => {
                      const SectionIcon = section.icon;
                      return (
                        <div
                          key={secIndex}
                          className="border-l-4 border-amber-500/30 pl-8 hover:border-amber-500 transition-all duration-300"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-xl border border-amber-500/30">
                              <SectionIcon className="w-6 h-6 text-amber-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-amber-400 flex-1">
                              {section.heading}
                            </h3>
                          </div>
                          <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                            {section.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 blur-3xl opacity-20" />
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-amber-500/30 p-10 md:p-16">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Questions About These Terms?
              </h2>
              <p className="text-xl text-slate-300">
                We're here to clarify anything you need to know
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Mail, label: 'Email Us', value: 'info@cotransglobal.com' },
                { icon: Phone, label: 'Call Kenya', value: '+254 [Your Number]' },
                { icon: MapPin, label: 'Visit Office', value: 'UN Lane, Nairobi' }
              ].map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="p-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{contact.label}</p>
                    <p className="text-white font-semibold text-center">{contact.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 p-6 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-2xl border border-amber-500/30">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-amber-400 mb-2">Important Notice</h4>
                  <p className="text-slate-300 leading-relaxed">
                    These Terms of Service constitute a legally binding agreement. By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms. If you have any questions or concerns, please contact us before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-300 font-semibold">© 2025 Cotrans Global Corporation</p>
              <p className="text-slate-400 text-sm">Connecting Kenyan Excellence with UAE Opportunities</p>
            </div>
            <div className="flex gap-4">
                <Link
                to="/"
                    className="px-6 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all duration-300 flex items-center gap-2"
                >
                    <Globe className="w-4 h-4" />
                     Back to Website
                </Link>

                <Link
                to="/privacy-policy"
                    className="px-6 py-2 bg-slate-800/50 text-slate-300 font-semibold rounded-lg border border-slate-700/50 hover:border-amber-500/50 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                    <Shield className="w-4 h-4" />
                    Privacy Policy
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;