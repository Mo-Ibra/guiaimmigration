import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useLanguage } from "./language-provider";
import { FileText, Globe, ShoppingCart, Star, CheckCircle } from "lucide-react";
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
    { key: "beginner", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "🌱" },
    { key: "intermediate", color: "bg-amber-100 text-amber-700 border-amber-200", icon: "⚡" },
    { key: "advanced", color: "bg-rose-100 text-rose-700 border-rose-200", icon: "🚀" },
  ];

  const getSkillLevelColor = (level: string) => {
    const skillLevel = skillLevels.find(sl => sl.key === level);
    return skillLevel?.color || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getSkillLevelIcon = (level: string) => {
    const skillLevel = skillLevels.find(sl => sl.key === level);
    return skillLevel?.icon || "📋";
  };

  if (isLoading) {
    return (
      <section id="guides" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded-xl w-1/2 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-96 shadow-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="guides" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-blue-700 border border-blue-200/50 shadow-sm mb-6">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Premium Guides
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Immigration Guides
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-6 rounded-full"></div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional step-by-step guides for immigration forms
          </p>
        </div>
        
        {/* Skill Level Tabs */}
        <div className="flex flex-wrap justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50">
            {["beginner", "intermediate", "advanced", "all"].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-6 py-3 font-medium capitalize rounded-xl transition-all duration-300 ${
                  selectedLevel === level
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {level === "all" ? "All Levels" : level}
              </button>
            ))}
          </div>
        </div>
        
        {/* Guide Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <Card key={guide.id} className="group relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden">
              {/* Gradient border effect */}
              <div className="absolute inset-0  rounded-2xl"></div>
              
              <CardContent className="relative p-8">
                {/* Header with badges and price */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex flex-col space-y-2">
                    <Badge className={`${getSkillLevelColor(guide.skillLevel)} border text-sm font-medium px-3 py-1 rounded-full`}>
                      <span className="mr-1">{getSkillLevelIcon(guide.skillLevel)}</span>
                      {guide.skillLevel}
                    </Badge>
                    {guide.featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 px-3 py-1 rounded-full text-sm font-medium">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white px-2 py-1 rounded-xl shadow-lg">
                      <p className="text-md font-bold">
                        ${guide.price}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Title and description */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-800 transition-colors duration-300">
                    {language === "es" ? guide.titleEs : guide.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {language === "es" ? guide.descriptionEs : guide.description}
                  </p>
                </div>
                
                {/* Features list */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3 text-sm text-gray-700">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="font-medium">Complete guide included</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-700">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="font-medium">Available in English & Spanish</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-700">
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium">Updated for 2025 requirements</span>
                  </div>
                </div>
                
                {/* CTA Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Buy Now clicked for guide:", guide.id);
                    window.location.href = `/checkout?guideId=${guide.id}&price=${guide.price}`;
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{t("buyNow")}</span>
                </button>

                {/* Corner decoration */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-300"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {guides.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No guides found</h3>
            <p className="text-gray-600">Try selecting a different skill level to see available guides.</p>
          </div>
        )}
      </div>
    </section>
  );
}