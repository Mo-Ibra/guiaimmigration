import { useState, useEffect } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useLanguage } from "../components/language-provider";
import { ArrowLeft, FileText, Star, Clock, Users, Shield, CheckCircle, TrendingUp, Award } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "wouter";
import { apiRequest } from "../lib/queryClient";

interface Guide {
  id: number;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  formType: string;
  price: string;
  skillLevel: string;
  featured: boolean;
  onlineFiling: boolean;
  fileName?: string;
  fileContent?: string;
  fileType?: string;
  createdAt: string;
}

export default function Forms() {
  const { t } = useLanguage();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await apiRequest("GET", "/api/guides");
        const guidesData = await response.json();
        setGuides(guidesData);
      } catch (error) {
        console.error("Failed to fetch guides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  // Fallback hardcoded data for compatibility
  const allForms = [
    {
      id: "i130",
      title: "Form I-130 - Family Petition",
      description: "Petition for Alien Relative - Bring your family members to the United States",
      price: 49.99,
      difficulty: "Beginner",
      processingTime: "8-12 months",
      popularity: 5,
      features: [
        "Step-by-step completion guide",
        "Document checklist",
        "Common mistakes to avoid",
        "Filing instructions"
      ]
    },
    {
      id: "i485",
      title: "Form I-485 - Adjustment of Status", 
      description: "Apply to adjust status to permanent resident while in the United States",
      price: 59.99,
      difficulty: "Intermediate",
      processingTime: "10-16 months",
      popularity: 5,
      features: [
        "Complete application guide",
        "Supporting document requirements",
        "Interview preparation tips",
        "Timeline and process overview"
      ]
    },
    {
      id: "n400",
      title: "Form N-400 - Naturalization",
      description: "Apply for U.S. citizenship through naturalization",
      price: 69.99,
      difficulty: "Advanced",
      processingTime: "12-18 months",
      popularity: 4,
      features: [
        "Citizenship test preparation",
        "Application completion guide",
        "Interview preparation",
        "Required documentation list"
      ]
    },
    {
      id: "i765",
      title: "Form I-765 - Work Authorization",
      description: "Apply for employment authorization document (EAD)",
      price: 39.99,
      difficulty: "Beginner",
      processingTime: "3-5 months",
      popularity: 4,
      features: [
        "Category-specific guidance",
        "Document requirements",
        "Renewal instructions",
        "Common approval delays"
      ]
    },
    {
      id: "i131",
      title: "Form I-131 - Travel Document",
      description: "Apply for re-entry permit, refugee travel document, or advance parole",
      price: 44.99,
      difficulty: "Intermediate",
      processingTime: "4-6 months",
      popularity: 3,
      features: [
        "Document type selection guide",
        "Travel restrictions overview",
        "Application timeline",
        "Supporting evidence requirements"
      ]
    },
    {
      id: "i751",
      title: "Form I-751 - Remove Conditions",
      description: "Remove conditions on permanent residence based on marriage",
      price: 54.99,
      difficulty: "Intermediate", 
      processingTime: "12-24 months",
      popularity: 3,
      features: [
        "Evidence gathering guide",
        "Joint vs. waiver filing options",
        "Interview preparation",
        "Extension letter process"
      ]
    },
    {
      id: "i864",
      title: "Form I-864 - Affidavit of Support",
      description: "Sponsorship form for family-based immigration cases",
      price: 34.99,
      difficulty: "Intermediate",
      processingTime: "N/A - Supporting document",
      popularity: 4,
      features: [
        "Income requirement calculations",
        "Asset documentation guide",
        "Co-sponsor requirements",
        "Liability explanations"
      ]
    },
    {
      id: "i129f",
      title: "Form I-129F - Fiancé Petition",
      description: "Petition for fiancé(e) to enter the U.S. for marriage",
      price: 52.99,
      difficulty: "Intermediate",
      processingTime: "10-15 months",
      popularity: 3,
      features: [
        "Relationship evidence guide",
        "Meeting requirement documentation",
        "K-1 visa process overview",
        "Consular processing steps"
      ]
    },
    {
      id: "i90",
      title: "Form I-90 - Green Card Renewal",
      description: "Replace or renew your permanent resident card",
      price: 29.99,
      difficulty: "Beginner",
      processingTime: "6-10 months",
      popularity: 3,
      features: [
        "Renewal vs. replacement guide",
        "Document requirements",
        "Biometrics appointment prep",
        "Emergency travel options"
      ]
    },
    {
      id: "i601",
      title: "Form I-601 - Waiver of Inadmissibility",
      description: "Request waiver for certain grounds of inadmissibility",
      price: 79.99,
      difficulty: "Advanced",
      processingTime: "12-24 months",
      popularity: 2,
      features: [
        "Inadmissibility grounds analysis",
        "Hardship documentation guide",
        "Legal precedent references",
        "Supporting evidence strategies"
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Intermediate": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Advanced": return "bg-rose-100 text-rose-800 border-rose-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "🌱";
      case "Intermediate": return "⚡";
      case "Advanced": return "🚀";
      default: return "📋";
    }
  };

  const handleBuyNow = (formId: string, price: number, guideId?: number) => {
    // Navigate to checkout with form details
    if (guideId) {
      // Use database guide
      window.location.href = `/checkout?guideId=${guideId}&price=${price}`;
    } else {
      // Fallback to hardcoded form data
      window.location.href = `/checkout?form=${formId}&price=${price}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Header />
      
      <main className="pt-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl -translate-x-1/2"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back to Home */}
          <div className="mb-8">
            <Link href="/">
              <span className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-blue-700 hover:text-blue-800 hover:bg-white transition-all duration-300 shadow-sm border border-blue-200/50 cursor-pointer group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Home
              </span>
            </Link>
          </div>
          
          {/* Page Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-blue-700 border border-blue-200/50 shadow-sm mb-6">
              <Award className="w-4 h-4 mr-2 text-yellow-500" />
              Professional Form Guides
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
              Complete Immigration Form Guides
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-8 rounded-full"></div>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Professional step-by-step guides for all major USCIS forms. Each guide includes
              detailed instructions, document checklists, and expert tips to avoid common mistakes.
            </p>
          </div>

          {/* Database Guides */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full spin"></div>
              </div>
              <p className="text-gray-600 font-medium">Loading guides...</p>
            </div>
          ) : guides.length > 0 ? (
            <div className="mb-20">
              <div className="flex items-center justify-center mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/50">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Available Guides
                  </h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {guides.map((guide) => (
                  <div key={guide.id} className="group relative bg-white/90 rounded-2xl border border-grey-200 overflow-hidden">
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 rounded-2xl"></div>
                    
                    <div className="relative p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col space-y-2">
                          <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            <FileText className="w-4 h-4 mr-2" />
                            {guide.formType}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            guide.skillLevel === 'beginner' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                            guide.skillLevel === 'intermediate' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            'bg-rose-100 text-rose-800 border-rose-200'
                          }`}>
                            <span className="mr-1">
                              {guide.skillLevel === 'beginner' ? '🌱' : 
                               guide.skillLevel === 'intermediate' ? '⚡' : '🚀'}
                            </span>
                            {guide.skillLevel}
                          </span>
                        </div>
                        {guide.featured && (
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium border-0">
                            ⭐ Featured
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-800 transition-colors duration-300">
                        {guide.title}
                      </h3>
                      <p className="text-gray-600 mb-8 leading-relaxed line-clamp-3">
                        {guide.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white px-2 py-1 rounded-xl shadow-lg">
                          <div className="text-md font-bold">
                            ${guide.price}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleBuyNow(guide.formType.toLowerCase(), parseFloat(guide.price), guide.id)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>

                    {/* Corner decoration */}
                    <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Fallback Forms Grid */}
          {guides.length === 0 && !loading && (
            <div>
              <div className="flex items-center justify-center mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/50">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Available Forms
                  </h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allForms.map((form) => (
                  <div key={form.id} className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/50 overflow-hidden">
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl"></div>
                    
                    <div className="relative p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(form.difficulty)}`}>
                            <span className="mr-1">{getDifficultyIcon(form.difficulty)}</span>
                            {form.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                          {[...Array(form.popularity)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-800 transition-colors duration-300">
                        {form.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {form.description}
                      </p>

                      {/* Processing Time */}
                      <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-medium">Processing Time</span>
                          <div className="text-sm font-semibold text-gray-800">{form.processingTime}</div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-8">
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          What's Included:
                        </h4>
                        <ul className="space-y-2">
                          {form.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                              </div>
                              {feature}
                            </li>
                          ))}
                          {form.features.length > 3 && (
                            <li className="text-blue-600 text-xs font-medium pl-8">
                              + {form.features.length - 3} more features
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Price and Buy Button */}
                      <div className="border-t border-gray-100 pt-6">
                        <div className="flex items-center justify-between">
                          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg">
                            <div className="text-2xl font-bold">
                              ${form.price}
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleBuyNow(form.id, form.price)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Corner decoration */}
                    <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-20 text-center relative">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-4">
                  Need Help Choosing the Right Form?
                </h2>
                
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed text-lg">
                  Not sure which form you need? Our AI Immigration Assistant can help you 
                  determine the correct forms for your specific situation.
                </p>
                
                <Link href="/#ai-assistant">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg">
                    Get AI Assistance
                  </Button>
                </Link>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-20 rounded-full"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 opacity-20 rounded-full"></div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}