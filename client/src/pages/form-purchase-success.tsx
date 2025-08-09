import { Link } from "wouter";
import { CheckCircle, FileText, Download, ArrowRight, XCircle, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";

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

type PaymentStatus = 'succeeded' | 'failed' | 'processing' | 'requires_action' | null;

export default function FormPurchaseSuccess() {
  const [purchasedForm, setPurchasedForm] = useState<FormDetails | null>(null);
  const [purchasedGuide, setPurchasedGuide] = useState<Guide | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const loadPurchaseData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const formId = urlParams.get("form");
      const guideId = urlParams.get("guideId");
      const redirectStatus = urlParams.get("redirect_status") as PaymentStatus;
      
      // Set payment status from URL
      setPaymentStatus(redirectStatus);

      // Only load purchase data if payment was successful
      if (redirectStatus === 'succeeded') {
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
            toast({
              title: "Error",
              description: "Failed to load purchase details",
              variant: "destructive",
            });
          }
        }
        // Fallback to hardcoded data (old approach)
        else if (formId && formData[formId]) {
          setPurchasedForm(formData[formId]);
        }
      }
      
      setLoading(false);
    };

    loadPurchaseData();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your request...</p>
        </div>
      </div>
    );
  }

  // Payment Failed View
  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Failed
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Unfortunately, your payment could not be processed. Please try again or contact support.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="space-y-2 text-sm text-red-700">
                <p>• Your card may have been declined</p>
                <p>• Insufficient funds or daily limit exceeded</p>
                <p>• Incorrect card information entered</p>
                <p>• Payment method not supported</p>
              </div>
            </div>

            <div className="space-y-4">
              <Link href="/forms">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Try Again - Browse Forms
                  <ArrowRight className="h-4 w-4 ml-2" />
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
                Need help? Contact us at support@guiaimmigration.com
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Processing or Requires Action View
  if (paymentStatus === 'processing' || paymentStatus === 'requires_action') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <AlertCircle className="h-16 w-16 text-yellow-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment {paymentStatus === 'processing' ? 'Processing' : 'Action Required'}
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              {paymentStatus === 'processing' 
                ? 'Your payment is being processed. Please wait while we confirm your transaction.'
                : 'Additional action is required to complete your payment. Please check your email or return to the payment page.'}
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="space-y-2 text-sm text-yellow-700">
                <p>• Do not close this page or refresh</p>
                <p>• You will receive an email confirmation once processed</p>
                <p>• Processing may take a few minutes</p>
                {paymentStatus === 'requires_action' && (
                  <p>• Check your email for further instructions</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Refresh Status
              </Button>

              <Link href="/">
                <Button variant="outline" className="w-full">
                  Return to Homepage
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>
                Questions? Contact us at support@guiaimmigration.com
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success View - Only shown when payment succeeded
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
                <a 
                  href={purchasedGuide.fileUrl} 
                  target="_blank" 
                  className="text-blue-600 hover:text-blue-800 underline block mb-2"
                  rel="noopener noreferrer"
                >
                  English Version
                </a>
                <hr className="my-2 border border-gray-200 w-1/4 mx-auto" />
                <a 
                  href={purchasedGuide.fileUrlEs} 
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 underline block mt-2"
                  rel="noopener noreferrer"
                >
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