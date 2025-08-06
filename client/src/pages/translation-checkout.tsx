import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { ArrowLeft, FileText, Clock, Mail, Phone } from "lucide-react";

// Load Stripe
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
if (!stripePublicKey) {
  console.warn('Missing Stripe public key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

interface OrderDetails {
  customerEmail: string;
  customerPhone?: string;
  originalFileName: string;
  fileType: string;
  pageCount: number;
  deliveryType: 'standard' | 'rush';
  totalPrice: number;
  orderNumber?: string;
}

const CheckoutForm = ({ orderDetails }: { orderDetails: OrderDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  // File is already uploaded and order created before reaching checkout
  // No need to upload file again

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/translation-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Update the existing order status to 'paid' after successful payment
        try {
          console.log('💳 Payment successful, updating order status to paid');
          console.log('📋 Order details:', orderDetails);
          console.log('💰 Payment Intent ID:', paymentIntent.id);
          
          if (orderDetails.orderNumber) {
            console.log(`🔄 Updating order ${orderDetails.orderNumber} payment status to 'paid'`);
            
            // Update existing order payment status using public endpoint with actual payment intent ID
            const updateResponse = await apiRequest("PATCH", `/api/translation-orders/${orderDetails.orderNumber}/payment-status`, {
              paymentIntentId: paymentIntent.id
            });
            
            const updatedOrder = await updateResponse.json();
            console.log('✅ Order payment status updated successfully:', updatedOrder);
            
            toast({
              title: "Payment Successful",
              description: `Order ${orderDetails.orderNumber} payment processed successfully!`,
            });
          } else {
            console.warn('⚠️ No order number found, creating new order as fallback');
            // Fallback: create new order if no order number exists
            const orderData = {
              ...orderDetails,
              totalPrice: orderDetails.totalPrice.toString(),
              status: 'paid'
            };
            const orderResponse = await apiRequest("POST", "/api/translation-orders", orderData);
            const newOrder = await orderResponse.json();
            console.log('✅ New order created:', newOrder);
            
            toast({
              title: "Payment Successful",
              description: "Your translation order has been created and payment processed!",
            });
          }
          
          // Clean up sessionStorage
          sessionStorage.removeItem('translationFile');
          sessionStorage.removeItem('translationOrderDetails');
          
          setLocation('/translation-success');
        } catch (updateError) {
          console.error('❌ Failed to update order payment status:', updateError);
          
          // Try to get more details about the error
          let errorMessage = "Unknown error occurred";
          if (updateError instanceof Error) {
            errorMessage = updateError.message;
          }
          
          toast({
            title: "Payment Processed",
            description: `Payment successful, but there was an issue updating the order: ${errorMessage}. Please contact support with your order number.`,
            variant: "destructive",
          });
          
          // Still redirect to success page since payment went through
          setLocation('/translation-success');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <span className="text-sm">{orderDetails.originalFileName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-600" />
            <span className="text-sm">
              {orderDetails.pageCount} page{orderDetails.pageCount > 1 ? 's' : ''} • {orderDetails.deliveryType} delivery
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-600" />
            <span className="text-sm">{orderDetails.customerEmail}</span>
          </div>
          {orderDetails.customerPhone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-600" />
              <span className="text-sm">{orderDetails.customerPhone}</span>
            </div>
          )}
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-green-600">${orderDetails.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-green-600" />
          <span className="text-green-800">Order created successfully - Ready for payment</span>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <PaymentElement />
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg"
      >
        {isProcessing ? "Processing Payment..." : `Pay $${orderDetails.totalPrice}`}
      </Button>

      <p className="text-sm text-gray-500 text-center">
        Secure payment processing • Professional translation guaranteed
      </p>
    </form>
  );
};

export default function TranslationCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const { toast } = useToast();

  // Check if Stripe is available
  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment System Unavailable</h2>
          <p className="text-gray-600 mb-6">
            Stripe payment processing is not configured. Please contact support.
          </p>
          <Link href="/translations">
            <Button>Back to Translations</Button>
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Get order details from sessionStorage
    const storedOrderDetails = sessionStorage.getItem('translationOrderDetails');
    if (!storedOrderDetails) {
      toast({
        title: "No Order Found",
        description: "Please start a new translation order.",
        variant: "destructive",
      });
      return;
    }

    const details: OrderDetails = JSON.parse(storedOrderDetails);
    setOrderDetails(details);

    // Create payment intent
    apiRequest("POST", "/api/create-translation-payment-intent", {
      amount: details.totalPrice,
      customerEmail: details.customerEmail
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        toast({
          title: "Payment Setup Failed",
          description: "Unable to setup payment. Please try again.",
          variant: "destructive",
        });
      });
  }, [toast]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Order Found</h2>
          <p className="text-gray-600 mb-6">Please start a new translation order.</p>
          <Link href="/translations">
            <Button>Start New Translation Order</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/translations" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Translation Service
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
          <p className="text-gray-600 mb-8">Secure payment for your translation service</p>

          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm orderDetails={orderDetails} />
          </Elements>
        </div>
      </div>
    </div>
  );
}