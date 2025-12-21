import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedJobs } from "@/components/home/FeaturedJobs";
import { ServicesSection } from "@/components/home/ServicesSection";
// import { MedicalNotice } from "@/components/home/MedicalNotice";
import { ProcessSection } from "@/components/home/ProcessSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedJobs />
      <ServicesSection />
      {/* <MedicalNotice /> */}
      <ProcessSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
