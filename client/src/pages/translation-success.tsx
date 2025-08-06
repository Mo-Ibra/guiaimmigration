import { Link } from 'wouter';
import { CheckCircle, FileText, Mail, ArrowRight } from 'lucide-react';
import { Button } from "../components/ui/button";

export default function TranslationSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your translation order has been submitted and payment processed successfully.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">What happens next?</h3>
            </div>
            <div className="space-y-2 text-sm text-green-700">
              <p>✓ Your order has been added to our translation queue</p>
              <p>✓ You'll receive an email confirmation with your order details</p>
              <p>✓ Our professional translators will begin working on your document</p>
              <p>✓ You'll receive email updates as your order progresses</p>
              <p>✓ Completed translation will be delivered via email</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Check your email</span>
            </div>
            <p className="text-sm text-blue-700">
              Order confirmation and tracking details have been sent to your email address.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/translations">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Submit Another Translation Order
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
            <p>Questions about your order? Contact us at support@guiaimmigration.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}