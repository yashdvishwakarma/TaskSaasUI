import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeatureSection";
import ComparisonSection from "../components/landing/ComparisonSection";
import CTASection from "../components/landing/CTASection";


const Index = () => {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <ComparisonSection />
          <CTASection />
        </main>
      </div>
    </>
  );
};

export default Index;
