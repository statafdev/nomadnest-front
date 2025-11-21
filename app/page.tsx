import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HomesExplorer from "@/components/HomesExplorer";
import ForHostsSection from "@/components/ForHostsSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import FloatingActionButton from "@/components/FloatingActionButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HomesExplorer />
      <ForHostsSection />
      <FeaturesSection />
      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default Index;
