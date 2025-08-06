import { useState, useEffect } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useLanguage } from "../components/language-provider";
import { ArrowLeft, FileText, Star, Clock, Users, Shield } from "lucide-react";
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
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back to Home */}
          <div className="mb-8">
            <Link href="/">
              <span className="inline-flex items-center text-blue-600 hover:text-blue-800 cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </span>
            </Link>
          </div>
          
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Complete Immigration Form Guides
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional step-by-step guides for all major USCIS forms. Each guide includes
              detailed instructions, document checklists, and expert tips to avoid common mistakes.
            </p>
          </div>

          {/* Database Guides */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading guides...</p>
            </div>
          ) : guides.length > 0 ? (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Available Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {guides.map((guide) => (
                  <div key={guide.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {guide.formType}
                        </span>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            guide.skillLevel === 'beginner' ? 'bg-green-100 text-green-800' :
                            guide.skillLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {guide.skillLevel}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3">{guide.title}</h3>
                      <p className="text-gray-600 mb-6 line-clamp-3">{guide.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-blue-600">
                          ${guide.price}
                        </div>
                        <Button
                          onClick={() => handleBuyNow(guide.formType.toLowerCase(), parseFloat(guide.price), guide.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Fallback Forms Grid */}
          {guides.length === 0 && !loading && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Available Forms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allForms.map((form) => (
              <div key={form.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-blue-600 mr-2" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(form.difficulty)}`}>
                      {form.difficulty}
                    </span>
                  </div>
                  <div className="flex">
                    {[...Array(form.popularity)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{form.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{form.description}</p>

                {/* Processing Time */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Processing: {form.processingTime}</span>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">What's Included:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {form.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                    {form.features.length > 3 && (
                      <li className="text-blue-600 text-xs">+ {form.features.length - 3} more features</li>
                    )}
                  </ul>
                </div>

                {/* Price and Buy Button */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-600">
                      ${form.price}
                    </div>
                    <Button 
                      onClick={() => handleBuyNow(form.id, form.price)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 text-center bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help Choosing the Right Form?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Not sure which form you need? Our AI Immigration Assistant can help you 
              determine the correct forms for your specific situation.
            </p>
            <Link href="/#ai-assistant">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get AI Assistance
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}