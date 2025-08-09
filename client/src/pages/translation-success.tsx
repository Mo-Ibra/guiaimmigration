import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  CheckCircle,
  FileText,
  Mail,
  ArrowRight,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";

export default function TranslationSuccess() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [paymentStatus, setPaymentStatus] = useState<
    "loading" | "success" | "failed" | "error"
  >("loading");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [orderUpdateStatus, setOrderUpdateStatus] = useState<
    "updating" | "success" | "failed"
  >("updating");

  useEffect(() => {
    const updateOrderStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentIntent = urlParams.get("payment_intent");
      const redirectStatus = urlParams.get("redirect_status");

      console.log("🔍 URL Parameters:", { paymentIntent, redirectStatus });

      // Handle case when no URL parameters (direct access to success page)
      if (!paymentIntent && !redirectStatus) {
        console.log("✅ Direct access to success page - assuming success");
        setPaymentStatus("success");
        setOrderUpdateStatus("success");
        return;
      }

      // Handle payment failure cases
      if (redirectStatus === "failed" || (!paymentIntent && redirectStatus)) {
        console.log("❌ Payment failed - redirectStatus:", redirectStatus);
        setPaymentStatus("failed");
        toast({
          title: "Payment Failed",
          description: "Your payment was not successful. Please try again.",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation("/translation-checkout");
        }, 10000);
        return;
      }

      // Handle payment success
      if (redirectStatus === "succeeded" && paymentIntent) {
        console.log("✅ Payment succeeded via Stripe redirect");
        setPaymentStatus("success");
        setPaymentDetails({ paymentIntent });

        // Now try to update the order status
        try {
          const storedOrderDetails = sessionStorage.getItem(
            "translationOrderDetails"
          );

          if (storedOrderDetails) {
            const orderDetails = JSON.parse(storedOrderDetails);

            if (orderDetails.orderNumber) {
              console.log(
                `🔄 Updating order ${orderDetails.orderNumber} payment status to 'paid'`
              );

              const updateResponse = await apiRequest(
                "PATCH",
                `/api/translation-orders/${orderDetails.orderNumber}/payment-status`,
                {
                  paymentIntentId: paymentIntent,
                }
              );

              if (!updateResponse.ok) {
                throw new Error(
                  `Failed to update order: ${updateResponse.status}`
                );
              }

              const updatedOrder = await updateResponse.json();
              console.log(
                "✅ Order payment status updated successfully:",
                updatedOrder
              );

              setOrderUpdateStatus("success");

              toast({
                title: "Order Updated",
                description: `Order ${orderDetails.orderNumber} status updated to paid!`,
              });

              // Clean up sessionStorage after successful update
              sessionStorage.removeItem("translationFile");
              sessionStorage.removeItem("translationOrderDetails");
            } else {
              // No order number found, but payment succeeded
              console.log("⚠️ No order number found, but payment succeeded");
              setOrderUpdateStatus("success");
              sessionStorage.removeItem("translationFile");
              sessionStorage.removeItem("translationOrderDetails");
            }
          } else {
            // No stored order details, but payment succeeded
            console.log(
              "⚠️ No stored order details found, but payment succeeded"
            );
            setOrderUpdateStatus("success");
          }
        } catch (error) {
          console.error("❌ Failed to update order payment status:", error);
          setOrderUpdateStatus("failed");

          toast({
            title: "Order Update Failed",
            description:
              "Payment succeeded but order status couldn't be updated. Contact support.",
            variant: "destructive",
          });
        }

        // Clean up URL
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } else {
        // Payment not succeeded or missing parameters
        console.log("❌ Payment not successful or missing parameters:", {
          paymentIntent,
          redirectStatus,
        });
        setPaymentStatus("failed");
        toast({
          title: "Payment Failed",
          description: "Payment was not successful. Please try again.",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation("/translation-checkout");
        }, 5000);
      }
    };

    updateOrderStatus();
  }, [toast, setLocation]);

  // ❌ Failed State
  if (paymentStatus === "failed") {
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
              We couldn't process your payment. Please check your payment
              details and try again.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">
                  What went wrong?
                </h3>
              </div>
              <div className="space-y-2 text-sm text-red-700">
                <p>• Payment could not be processed by your bank</p>
                <p>• Insufficient funds or card limit reached</p>
                <p>• Technical issue with payment processor</p>
                <p>• Invalid payment information</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setLocation("/translation-checkout")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Try Payment Again
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <Link href="/translations">
                <Button variant="outline" className="w-full">
                  Start New Translation Order
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>Need help? Contact us at support@guiaimmigration.com</p>
              <p className="mt-1">
                You will be redirected back in 5 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Success State مع إشعار حالة تحديث الطلب
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
            Your translation order has been submitted and payment processed
            successfully.
          </p>

          {/* Order update status indicator */}
          {orderUpdateStatus === "failed" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">
                  Order Status Update Issue
                </span>
              </div>
              <p className="text-sm text-yellow-700">
                Your payment was successful, but we couldn't automatically
                update your order status. Don't worry - our team will process
                your order manually. You may contact support for confirmation.
              </p>
            </div>
          )}

          {paymentDetails && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>Payment ID:</strong> {paymentDetails.paymentIntent}
              </p>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">
                What happens next?
              </h3>
            </div>
            <div className="space-y-2 text-sm text-green-700">
              <p>✓ Your order has been added to our translation queue</p>
              <p>
                ✓ You'll receive an email confirmation with your order details
              </p>
              <p>
                ✓ Our professional translators will begin working on your
                document
              </p>
              <p>✓ You'll receive email updates as your order progresses</p>
              <p>✓ Completed translation will be delivered via email</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                Check your email
              </span>
            </div>
            <p className="text-sm text-blue-700">
              Order confirmation and tracking details have been sent to your
              email address.
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
            <p>
              Questions about your order? Contact us at
              support@guiaimmigration.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
