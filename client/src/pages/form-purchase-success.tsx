import { Link } from 'wouter';
import { CheckCircle, FileText, Download, ArrowRight } from 'lucide-react';
import { Button } from "../components/ui/button";
import { useEffect, useState } from 'react';
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { DownloadLinks } from "../components/DownloadLinks";

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
  fileName2?: string;
  fileContent2?: string;
  fileType2?: string;
  createdAt: string;
}

interface FormDetails {
  id: string;
  title: string;
  description: string;
  price: number;
}

const formData: Record<string, FormDetails> = {
  'i130': {
    id: 'i130',
    title: 'Form I-130 - Family Petition Guide',
    description: 'Complete step-by-step guide for petitioning family members',
    price: 49.99
  },
  'i485': {
    id: 'i485',
    title: 'Form I-485 - Adjustment of Status Guide',
    description: 'Comprehensive guide for adjusting status to permanent resident',
    price: 59.99
  },
  'n400': {
    id: 'n400',
    title: 'Form N-400 - Naturalization Guide',
    description: 'Complete citizenship application guide',
    price: 54.99
  }
};

export default function FormPurchaseSuccess() {
  const [purchasedForm, setPurchasedForm] = useState<FormDetails | null>(null);
  const [purchasedGuide, setPurchasedGuide] = useState<Guide | null>(null);
  const [downloadUrls, setDownloadUrls] = useState<string[]>([]);
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);
  const [isGeneratingDownload, setIsGeneratingDownload] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadPurchaseData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const formId = urlParams.get('form');
      const guideId = urlParams.get('guideId');

      // Try to load from database first (new approach)
      if (guideId) {
        try {
          const response = await apiRequest("GET", `/api/guides/${guideId}`);
          const guide = await response.json();
          setPurchasedGuide(guide);

          // Convert to FormDetails for compatibility
          const formDetails: FormDetails = {
            id: guide.formType.toLowerCase(),
            title: guide.title,
            description: guide.description,
            price: parseFloat(guide.price)
          };
          setPurchasedForm(formDetails);

          // Generate download link with guideId
          generateDownloadLink(guide.formType.toLowerCase(), guide.id, guide);
        } catch (error) {
          console.error("Failed to fetch guide:", error);
        }
      }
      // Fallback to hardcoded data (old approach)
      else if (formId && formData[formId]) {
        setPurchasedForm(formData[formId]);
        generateDownloadLink(formId);
      }
    };

    loadPurchaseData();
  }, []);

  const generateDownloadLink = async (formId: string, guideId?: number, guide?: Guide) => {
    try {
      // Get customer email from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const customerEmail = urlParams.get('email') || "customer@example.com";

      const requestBody: any = {
        customerEmail: customerEmail
      };

      if (guideId) {
        requestBody.guideId = guideId;
      } else {
        requestBody.formId = formId;
      }

      const response = await apiRequest("POST", "/api/generate-download-link", requestBody);

      const data = await response.json();
      setDownloadUrls(data.downloadUrls || [data.downloadUrl].filter(Boolean));
      
      // Set attachment names based on guide data
      if (guide && data.downloadUrls) {
        const names: string[] = [];
        if (guide.fileName) names.push(guide.fileName);
        if (guide.fileName2) names.push(guide.fileName2);
        setAttachmentNames(names);
      }
      
      setIsGeneratingDownload(false);

      const attachmentCount = data.downloadUrls ? data.downloadUrls.length : 1;
      toast({
        title: "Download Ready",
        description: `Your immigration guide${attachmentCount > 1 ? 's are' : ' is'} ready for download! ${attachmentCount > 1 ? `${attachmentCount} attachments available.` : ''} Check your email for the download link.`,
      });
    } catch (error) {
      console.error("Failed to generate download link:", error);
      setIsGeneratingDownload(false);
      toast({
        title: "Download Link Error",
        description: "Unable to generate download link. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (downloadUrls.length > 0) {
      // If there are multiple URLs, download them one by one
      downloadUrls.forEach((url, index) => {
        setTimeout(() => {
          window.open(url, '_blank');
        }, index * 500); // Delay each download by 500ms
      });
    }
  };

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
            Thank you for purchasing your immigration guide. Your payment has been processed successfully.
          </p>
          
          {purchasedForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">{purchasedForm.title}</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">{purchasedForm.description}</p>
              {purchasedGuide && (
                <div className="text-sm text-blue-600 mb-2">
                  Form Type: {purchasedGuide.formType} | Skill Level: {purchasedGuide.skillLevel}
                </div>
              )}
              <div className="text-lg font-bold text-blue-900">
                Purchase Price: ${purchasedForm.price}
              </div>
            </div>
          )}
          
          {/* Download Section */}
          {isGeneratingDownload ? (
            <div className="text-center bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="animate-spin w-6 h-6 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-green-700">Preparing your download...</p>
            </div>
          ) : downloadUrls.length > 0 ? (
            <div className="mb-8">
              <DownloadLinks
                downloadUrls={downloadUrls}
                guideName={purchasedForm?.title || (purchasedGuide?.title) || 'Immigration Guide'}
                attachmentNames={attachmentNames}
                expiresIn="24 hours"
              />
            </div>
          ) : (
            <div className="text-center text-red-700 bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <p>Download link generation failed. Please contact support.</p>
            </div>
          )}

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
            <p>Questions about your purchase? Contact us at support@guiaimmigration.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}