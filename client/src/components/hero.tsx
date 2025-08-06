import { Button } from "./ui/button";
import { useLanguage } from "./language-provider";
import { CheckCircle, FileText, Globe, Clock } from "lucide-react";
import logoImage from "../assets/image_1751031851986.png";

export function Hero() {
  const { t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t("heroTitle")}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t("heroSubtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button 
                size="lg" 
                onClick={() => scrollToSection("guides")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t("getStarted")}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => scrollToSection("contact")}
              >
                {t("learnMore")}
              </Button>
            </div>
          </div>

          {/* Right side - Hero Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-lg relative">
              <img
                src="https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Happy family embracing - representing hope and new beginnings through immigration"
                className="w-full h-auto rounded-lg shadow-lg object-cover"
              />
              
              {/* Logo positioned in bottom left */}
              <div className="absolute bottom-4 left-4">
                <img
                  src={logoImage}
                  alt="Guia Immigration - Immigration made easy. Para todos."
                  className="w-32 h-auto object-contain bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}