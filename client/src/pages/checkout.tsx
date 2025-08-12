import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/components/language-provider";
import { ArrowLeft, CreditCard, FileText, CheckCircle } from "lucide-react";
import { Link } from "wouter";

// Load Stripe
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
if (!stripePublicKey) {
  console.warn('Missing Stripe public key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

interface FormDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
}

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

const formData: Record<string, FormDetails> = {
  'i130': {
    id: 'i130',
    title: 'Form I-130 - Family Petition Guide',
    description: 'Complete step-by-step guide for petitioning family members',
    price: 49.99,
    features: [
      'Step-by-step completion guide',
      'Document checklist',
      'Filing instructions'
    ]
  },
  'i485': {
    id: 'i485',
    title: 'Form I-485 - Adjustment of Status Guide',
    description: 'Comprehensive guide for adjusting status to permanent resident',
    price: 59.99,
    features: [
      'Complete application guide',
      'Supporting document requirements',
      'Interview preparation tips',
      'Timeline and process overview'
    ]
  },
  'n400': {
    id: 'n400',
    title: 'Form N-400 - Naturalization Guide',
    description: 'Complete citizenship application guide with test preparation',
    price: 69.99,
    features: [
      'Citizenship test preparation',
      'Application completion guide',
      'Interview preparation',
      'Required documentation list'
    ]
  }
};

const CheckoutForm = ({ item, guide }: { item: FormDetails; guide?: Guide | null }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [customerEmail, setCustomerEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !customerEmail) {
      return;
    }

    setIsProcessing(true);

    // Use guideId if available, otherwise fall back to form id
    const returnUrlParam = guide ? `guideId=${guide.id}` : `form=${item.id}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/form-purchase-success?${returnUrlParam}&email=${encodeURIComponent(customerEmail)}`,
        receipt_email: customerEmail,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase!",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="Enter your email for receipt"
          required
          className="mt-2"
        />
      </div>
      
      <div>
        <Label>Payment Information</Label>
        <div className="mt-2 p-4 border border-gray-300 rounded-lg">
          <PaymentElement />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={!stripe || !customerEmail || isProcessing}
      >
        <CreditCard className="w-4 h-4 mr-2" />
        {isProcessing ? "Processing..." : `Pay $${item.price}`}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { t } = useLanguage();
  const [clientSecret, setClientSecret] = useState("");
  const [item, setItem] = useState<FormDetails | null>(null);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [paymentSystemUnavailable, setPaymentSystemUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Check if Stripe is available
  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment System Unavailable</h2>
            <p className="text-gray-600 mb-6">
              Stripe payment processing is not configured. Please contact support.
            </p>
            <Link href="/forms">
              <Button>Back to Forms</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  useEffect(() => {
    const loadGuideData = async () => {
      try {
        // Get form details from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const formId = urlParams.get("form");
        const price = urlParams.get("price");
        const guideId = urlParams.get("guideId");

        let guideData: Guide | null = null;
        let formDetails: FormDetails | null = null;

        // Try to fetch from database first (new approach)
        if (guideId) {
          try {
            const response = await apiRequest("GET", `/api/guides/${guideId}`);
            guideData = await response.json();
            setGuide(guideData);

            // Convert guide to FormDetails format
            if (guideData) {
              formDetails = {
                id: guideData.formType.toLowerCase(),
                title: guideData.title,
                description: guideData.description,
                price: parseFloat(guideData.price),
                features: [
                  'Step-by-step completion guide',
                  'Document checklist',
                  'Filing instructions'
                ]
              };
            }
          } catch (error) {
            console.error("Failed to fetch guide from database:", error);
          }
        }

        // Fallback to hardcoded data (old approach)
        if (!formDetails && formId && formData[formId]) {
          formDetails = formData[formId];
        }

        // Try to find guide by formType if we have formId but no guideId
        if (!guideData && formId) {
          try {
            const response = await apiRequest("GET", "/api/guides");
            const guides: Guide[] = await response.json();
            guideData = guides.find(g => g.formType.toLowerCase() === formId.toLowerCase()) || null;
            if (guideData) {
              setGuide(guideData);
              // Update formDetails with database data
              formDetails = {
                id: guideData.formType.toLowerCase(),
                title: guideData.title,
                description: guideData.description,
                price: parseFloat(guideData.price),
                features: [
                  'Step-by-step completion guide',
                  'Document checklist',
                  'Filing instructions'
                ]
              };
            }
          } catch (error) {
            console.error("Failed to fetch guides:", error);
          }
        }

        if (formDetails) {
          setItem(formDetails);

          // Create PaymentIntent for form purchase
          const paymentAmount = price ? parseFloat(price) : formDetails.price;
          const response = await apiRequest("POST", "/api/create-form-payment-intent", {
            amount: paymentAmount,
            formId: formDetails.id,
            customerEmail: "customer@example.com" // Will be updated when user enters email
          });

          const data = await response.json();
          setClientSecret(data.clientSecret);
        } else {
          // Redirect to forms page if no valid form specified
          window.location.href = "/forms";
        }
      } catch (error) {
        console.error("Payment intent creation failed:", error);
        // Check if it's a 503 error (payment system not configured)
        if (typeof error === "object" && error !== null && "message" in error && typeof (error as any).message === "string" && (error as any).message.includes("503")) {
          setPaymentSystemUnavailable(true);
        }
      } finally {
        setLoading(false);
      }
    };

    loadGuideData();
  }, []);

  if (loading || !clientSecret || !item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="h-screen flex items-center justify-center">
          {paymentSystemUnavailable ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment System Unavailable</h2>
              <p className="text-gray-600 mb-6">
                The payment system is currently not configured. Please contact support or try again later.
              </p>
              <Link href="/forms">
                <Button>Back to Forms</Button>
              </Link>
            </div>
          ) : (
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back to Forms */}
          <div className="mb-8">
            <Link href="/forms">
              <span className="inline-flex items-center text-blue-600 hover:text-blue-800 cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forms
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">What's Included:</h4>
                      <ul className="space-y-1">
                        {item.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total:</span>
                        <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm item={item} guide={guide} />
                  </Elements>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}