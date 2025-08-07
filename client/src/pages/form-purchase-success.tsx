import { Link } from "wouter";
import { CheckCircle, FileText, Download, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
// import { DownloadLinks } from "../components/DownloadLinks";

interface Guide {
  id: number;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  fileUrl: string;
  fileUrlEs: string;
  formType: string;
  price: string;
  skillLevel: string;
  featured: boolean;
  onlineFiling: boolean;
  createdAt: string;
}

interface FormDetails {
  id: string;
  title: string;
  description: string;
  price: number;
}

const formData: Record<string, FormDetails> = {
  i130: {
    id: "i130",
    title: "Form I-130 - Family Petition Guide",
    description: "Complete step-by-step guide for petitioning family members",
    price: 49.99,
  },
  i485: {
    id: "i485",
    title: "Form I-485 - Adjustment of Status Guide",
    description:
      "Comprehensive guide for adjusting status to permanent resident",
    price: 59.99,
  },
  n400: {
    id: "n400",
    title: "Form N-400 - Naturalization Guide",
    description: "Complete citizenship application guide",
    price: 54.99,
  },
};

export default function FormPurchaseSuccess() {
  const [purchasedForm, setPurchasedForm] = useState<FormDetails | null>(null);
  const [purchasedGuide, setPurchasedGuide] = useState<Guide | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const loadPurchaseData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const formId = urlParams.get("form");
      const guideId = urlParams.get("guideId");

      // Try to load from database first (new approach)
      if (guideId) {
        try {
          const response = await apiRequest("GET", `/api/guides/${guideId}`);
          const guide = await response.json();
          console.log(guide);
          setPurchasedGuide(guide);

          // Convert to FormDetails for compatibility
          const formDetails: FormDetails = {
            id: guide.formType.toLowerCase(),
            title: guide.title,
            description: guide.description,
            price: parseFloat(guide.price),
          };
          setPurchasedForm(formDetails);
        } catch (error) {
          console.error("Failed to fetch guide:", error);
        }
      }
      // Fallback to hardcoded data (old approach)
      else if (formId && formData[formId]) {
        setPurchasedForm(formData[formId]);
      }
    };

    loadPurchaseData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Purchase Successful!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Thank you for purchasing your immigration guide. Your payment has
            been processed successfully.
          </p>

          {purchasedForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">
                  {purchasedForm.title}
                </h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                {purchasedForm.description}
              </p>
              {purchasedGuide && (
                <div className="text-sm text-blue-600 mb-2">
                  Form Type: {purchasedGuide.formType} | Skill Level:{" "}
                  {purchasedGuide.skillLevel}
                </div>
              )}
              <div className="text-lg font-bold text-blue-900">
                Purchase Price: ${purchasedForm.price}
              </div>
            </div>
          )}

          {/* Download Section */}
          <div className="text-center bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <p className="text-green-700 mb-4">Your Download link is ready:</p>
            {purchasedGuide && (
              <>
                <a href={purchasedGuide.fileUrl} target="_blank">
                  English Version
                </a>
                <hr className="my-2 border border-gray-200 w-1/4 mx-auto" />
                <a href={purchasedGuide.fileUrlEs} target="_blank">
                  Spanish Version
                </a>
              </>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="space-y-2 text-sm text-blue-700">
              <p>✓ Your purchase confirmation has been sent to your email</p>
              <p>✓ Download link expires in 24 hours for security</p>
              <p>✓ Save the PDF to your computer for future reference</p>
              <p>✓ Contact our support team if you have any questions</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-700 font-medium">
              Check your email for the download link and receipt
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/forms">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Browse More Immigration Guides
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>

            <Link href="/translations">
              <Button variant="outline" className="w-full">
                Need Document Translation?
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="w-full">
                Return to Homepage
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>
              Questions about your purchase? Contact us at
              support@guiaimmigration.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
