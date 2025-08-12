import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Features } from "../components/features";
import { FeaturedGuides } from "../components/featured-guides";
import { LiveData } from "../components/live-data";
import { Resources } from "../components/resources";
import { AIAssistant } from "../components/ai-assistant";
import { Testimonials } from "../components/testimonials";
import { Contact } from "../components/contact";
import { Footer } from "../components/footer";
import { useLanguage } from "../components/language-provider";
import DisclaimerCard from "@/components/DisclaimerCard";

export default function Home() {
  const { t } = useLanguage();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <Features />

      {/* Disclaimer Section */}
      <DisclaimerCard />
      
      {/* Guides Section */}
      <FeaturedGuides />
      
      {/* Live USCIS Data Section */}
      <LiveData />
      
      {/* Essential Immigration Resources Section */}
      <Resources />
      
      {/* AI Immigration Assistant Section */}
      <AIAssistant />
      
      {/* Success Stories Section */}
      <Testimonials />

      {/* Contact Section */}
      <Contact />

      <Footer />
    </div>
  );
}