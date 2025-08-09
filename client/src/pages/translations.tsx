import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useLanguage } from "../components/language-provider";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface TranslationPricing {
  id: number;
  serviceType: string;
  pricePerPage: string;
  minimumPrice: string;
  deliveryDays: number;
  description: string;
  descriptionEs: string;
  active: boolean;
}

export default function Translations() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [pageCount, setPageCount] = useState<number>(1);
  const [deliveryType, setDeliveryType] = useState<string>("standard");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("+1");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch active translation pricing
  const { data: pricingData = [], isLoading: isPricingLoading } = useQuery({
    queryKey: ["active-translation-pricing"],
    queryFn: async () => {
      const response = await apiRequest(
        "GET",
        "/api/admin/translation-pricing/active"
      );
      return response.json() as Promise<TranslationPricing[]>;
    },
  });

  // Set default delivery type when pricing data loads
  useEffect(() => {
    if (
      pricingData.length > 0 &&
      !pricingData.find((p) => p.serviceType === deliveryType)
    ) {
      // If current delivery type is not available, set to first available option
      setDeliveryType(pricingData[0].serviceType);
    }
  }, [pricingData, deliveryType]);

  const calculatePrice = () => {
    const selectedPricing = pricingData.find(
      (pricing) => pricing.serviceType === deliveryType
    );
    if (!selectedPricing) {
      // Fallback to hardcoded values if pricing data is not available
      if (deliveryType === "standard") {
        return pageCount === 1 ? 25 : 25 + (pageCount - 1) * 15;
      } else {
        return pageCount === 1 ? 40 : 40 + (pageCount - 1) * 25;
      }
    }

    const pricePerPage = parseFloat(selectedPricing.pricePerPage);
    const minimumPrice = parseFloat(selectedPricing.minimumPrice);
    const totalPrice = pageCount * pricePerPage;

    return Math.max(totalPrice, minimumPrice);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmitOrder = async () => {
    if (!isValidUrl(fileUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid file URL.",
        variant: "destructive",
      });
      console.log("Invalid URL");
      return;
    }

    if (!customerEmail || !customerPhone || !fileUrl) {
      toast({
        title: "Missing Information",
        description:
          "Please select at least one file and provide your email address and phone number.",
        variant: "destructive",
      });
      console.log("Please select at least one file and provide your email address and phone number.")
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Starting order submission process...");

      const payload = {
        customerEmail,
        fileUrl,
        customerPhone: `${countryCode}${customerPhone}`,
        pageCount,
        deliveryType,
        totalPrice: calculatePrice(),
      };

      console.log("creating order:", payload);

      try {
        console.log("TRY");

        const response = await fetch("/api/create-translation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include", // Include session cookies for authentication
        });

        console.log("Upload response status:", response.status);

        if (response.ok) {
          const uploadResult = await response.json();
          console.log("Order created successfully:", uploadResult);

          toast({
            title: "Order Created",
            description: `Order ${uploadResult.orderNumber} created successfully. Proceeding to payment.`,
          });

          console.log(`Order ${uploadResult.orderNumber} created successfully. Proceeding to payment.`)

          // Store order details for checkout
          const orderDetails = {
            customerEmail,
            customerPhone: `${countryCode}${customerPhone}`,
            fileUrl,
            pageCount,
            deliveryType,
            totalPrice: calculatePrice(),
            orderNumber: uploadResult.orderNumber,
          };

          sessionStorage.setItem(
            "translationOrderDetails",
            JSON.stringify(orderDetails)
          );

          // Redirect to checkout
          window.location.href = "/translation-checkout";
        } else {
          const errorText = await response.text();
          console.error(
            "❌ Order creation failed:",
            response.status,
            errorText
          );
          throw new Error(`failed: ${response.status}`);
        }
      } catch (error) {
        console.error("❌ error:", error);
        toast({
          title: "Upload Failed",
          description: "Failed to create order. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ General error:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Back to Resources */}
          <div className="mb-8">
            <Link href="/resources">
              <span className="inline-flex items-center text-blue-600 hover:text-blue-800 cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backToResources")}
              </span>
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("translationsTitle")}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {t("translationsSubtitle")}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-800 font-medium">
                {t("spanishToEnglishDisclaimer")}
              </p>
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">
              {t("whyChooseService")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {t("certifiedTranslations")}
                </h3>
                <p className="text-gray-600 mb-4">{t("certifiedDesc")}</p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("professionalTranslators")}
                </h3>
                <p className="text-gray-600 mb-4">{t("professionalDesc")}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {t("fastTurnaround")}
                </h3>
                <p className="text-gray-600 mb-4">{t("fastDesc")}</p>

                <h3 className="text-lg font-semibold mb-3">
                  {t("secureProcessing")}
                </h3>
                <p className="text-gray-600 mb-4">{t("secureDesc")}</p>
              </div>
            </div>
          </div>

          {/* Document Upload and Payment */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6">{t("uploadDoc")}</h2>

            <div className="space-y-6">
              {/* File URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("fileUrlRequired")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("fileUrlPlaceholder")}
                />
              </div>

              {/* Page Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("numberOfPages")}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    value={pageCount}
                    onChange={(e) =>
                      setPageCount(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {t("pagesAutoDetected")}
                </p>
              </div>

              {/* Delivery Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {t("deliverySpeed")}
                </label>
                {isPricingLoading ? (
                  <div className="text-center py-4">
                    <span className="text-gray-500">{t("loadingPricing")}</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pricingData.map((pricing) => (
                      <div key={pricing.id} className="flex items-center">
                        <input
                          type="radio"
                          id={pricing.serviceType}
                          name="delivery"
                          value={pricing.serviceType}
                          checked={deliveryType === pricing.serviceType}
                          onChange={(e) => setDeliveryType(e.target.value)}
                          className="mr-3"
                        />
                        <label htmlFor={pricing.serviceType} className="flex-1">
                          <div className="bg-gray-50 p-4 rounded border">
                            <div className="font-semibold">
                              {pricing.serviceType.charAt(0).toUpperCase() +
                                pricing.serviceType.slice(1)}{" "}
                              {t("delivery")} ({pricing.deliveryDays}{" "}
                              {pricing.deliveryDays === 1
                                ? t("day")
                                : t("days")}
                              )
                            </div>
                            <div className="text-gray-600">
                              {language === "es"
                                ? pricing.descriptionEs
                                : pricing.description}
                            </div>
                            <div className="text-sm text-blue-600 font-medium mt-1">
                              ${pricing.pricePerPage} {t("perPage")} • $
                              {pricing.minimumPrice} {t("minimum")}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">
                    {t("totalCost")}:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${calculatePrice()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {pageCount} page{pageCount > 1 ? "s" : ""} × {deliveryType}{" "}
                  delivery
                  {pricingData.find((p) => p.serviceType === deliveryType) && (
                    <div className="mt-2">
                      {t("delivery")}:{" "}
                      {
                        pricingData.find((p) => p.serviceType === deliveryType)
                          ?.deliveryDays
                      }{" "}
                      {pricingData.find((p) => p.serviceType === deliveryType)
                        ?.deliveryDays === 1
                        ? t("day")
                        : t("days")}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("emailRequired")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("emailPlaceholderForm")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+52">🇲🇽 +52</SelectItem>
                        <SelectItem value="+34">🇪🇸 +34</SelectItem>
                        <SelectItem value="+33">🇫🇷 +33</SelectItem>
                        <SelectItem value="+49">🇩🇪 +49</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                        <SelectItem value="+39">🇮🇹 +39</SelectItem>
                        <SelectItem value="+351">🇵🇹 +351</SelectItem>
                        <SelectItem value="+55">🇧🇷 +55</SelectItem>
                        <SelectItem value="+54">🇦🇷 +54</SelectItem>
                        <SelectItem value="+57">🇨🇴 +57</SelectItem>
                        <SelectItem value="+51">🇵🇪 +51</SelectItem>
                        <SelectItem value="+56">🇨🇱 +56</SelectItem>
                        <SelectItem value="+58">🇻🇪 +58</SelectItem>
                        <SelectItem value="+593">🇪🇨 +593</SelectItem>
                        <SelectItem value="+591">🇧🇴 +591</SelectItem>
                        <SelectItem value="+598">🇺🇾 +598</SelectItem>
                        <SelectItem value="+595">🇵🇾 +595</SelectItem>
                      </SelectContent>
                    </Select>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123-456-7890"
                    />
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleSubmitOrder}
                disabled={!customerEmail || !customerPhone || !fileUrl || isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg"
              >
                {isSubmitting
                  ? "Processing..."
                  : customerEmail && customerPhone
                  ? `${t("proceedToPayment")} - $${calculatePrice()}`
                  : "Please provide email and phone"}
              </Button>

              <div className="text-sm text-gray-500 text-center">
                <p>
                  Professional translation • Certified for USCIS • Money-back
                  guarantee
                </p>
                <p className="mt-1">Secure payment processing with Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
