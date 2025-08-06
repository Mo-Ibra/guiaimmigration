import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useLanguage } from "./language-provider";
import { FileText, Globe, Clock, Eye, ShoppingCart } from "lucide-react";
import type { Guide } from "@shared/schema";
import { apiRequest } from "../lib/queryClient";

export function FeaturedGuides() {
  const { language, t } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState("all");

  const { data: allGuides = [], isLoading } = useQuery<Guide[]>({
    queryKey: ["/api/guides", selectedLevel],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/guides?level=${selectedLevel}`);
      return response.json();
    },
  });

  // Filter out guides with price = 0 (free guides)
  const guides = allGuides.filter(guide =>
    parseFloat(guide.price.toString()) > 0
  );

  const skillLevels = [
    { key: "beginner", color: "bg-green-100 text-emerald-700" },
    { key: "intermediate", color: "bg-yellow-100 text-amber-700" },
    { key: "advanced", color: "bg-red-100 text-red-700" },
  ];

  const getSkillLevelColor = (level: string) => {
    const skillLevel = skillLevels.find(sl => sl.key === level);
    return skillLevel?.color || "bg-gray-100 text-gray-700";
  };

  if (isLoading) {
    return (
      <section id="guides" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="guides" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Immigration Guides
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional step-by-step guides for immigration forms
          </p>
        </div>
        
        {/* Skill Level Tabs */}
        <div className="flex flex-wrap justify-center mb-12 border-b border-gray-200">
          {["beginner", "intermediate", "advanced", "all"].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-6 py-3 font-medium capitalize ${
                selectedLevel === level
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        
        {/* Guide Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <Card key={guide.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={getSkillLevelColor(guide.skillLevel)}>
                      {guide.skillLevel}
                    </Badge>
                    {guide.featured && (
                      <Badge className="bg-blue-100 text-blue-700">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${guide.price}
                    </p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {language === "es" ? guide.titleEs : guide.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === "es" ? guide.descriptionEs : guide.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span>Complete guide included</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Globe className="w-4 h-4 text-amber-500" />
                    <span>Available in English & Spanish</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Updated for 2024 requirements</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("Buy Now clicked for guide:", guide.id);
                      window.location.href = `/checkout?guideId=${guide.id}&price=${guide.price}`;
                    }}
                    className="flex-1 w-full bg-blue-600 text-white hover:bg-blue-700 font-medium px-4 py-3 rounded-lg flex items-center justify-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {t("buyNow")}
                  </button>
                  <Button
                    variant="outline"
                    className="px-4 py-3 border border-gray-300 hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
