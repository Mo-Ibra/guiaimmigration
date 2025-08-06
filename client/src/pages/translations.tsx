import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useLanguage } from "../components/language-provider";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, FileText, File, Image } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [deliveryType, setDeliveryType] = useState<string>('standard');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch active translation pricing
  const { data: pricingData = [], isLoading: isPricingLoading } = useQuery({
    queryKey: ["active-translation-pricing"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/translation-pricing/active");
      return response.json() as Promise<TranslationPricing[]>;
    },
  });

  // Set default delivery type when pricing data loads
  useEffect(() => {
    if (pricingData.length > 0 && !pricingData.find(p => p.serviceType === deliveryType)) {
      // If current delivery type is not available, set to first available option
      setDeliveryType(pricingData[0].serviceType);
    }
  }, [pricingData, deliveryType]);

  const analyzeFilePages = async (files: File[]) => {
    setIsAnalyzing(true);
    
    try {
      let totalPages = 0;
      
      for (const file of files) {
        if (file.type === 'application/pdf') {
          // For PDF files, we can estimate based on file size
          // This is a rough estimation - real implementation would use PDF parsing
          const fileSizeKB = file.size / 1024;
          let estimatedPages = Math.max(1, Math.round(fileSizeKB / 50)); // ~50KB per page average
          if (estimatedPages > 20) estimatedPages = 20; // Cap at reasonable limit
          totalPages += estimatedPages;
        } else if (file.type.startsWith('image/')) {
          // Image files are typically 1 page
          totalPages += 1;
        } else {
          // For other document types, estimate based on file size
          const fileSizeKB = file.size / 1024;
          let estimatedPages = Math.max(1, Math.round(fileSizeKB / 30)); // ~30KB per page for docs
          if (estimatedPages > 20) estimatedPages = 20;
          totalPages += estimatedPages;
        }
      }
      
      setPageCount(Math.max(1, totalPages));
    } catch (error) {
      console.error('Error analyzing files:', error);
      setPageCount(files.length); // Default to 1 page per file if analysis fails
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    if (newFiles.length > 0) {
      // Combine existing files with new files
      const allFiles = [...selectedFiles, ...newFiles];
      
      // Validate total file size (100MB total limit)
      const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
      const maxSize = 100 * 1024 * 1024; // 100MB total

      if (totalSize > maxSize) {
        toast({
          title: "Files Too Large",
          description: "Total file size must be less than 100MB",
          variant: "destructive"
        });
        // Clear the input
        event.target.value = '';
        return;
      }
      
      // Validate individual file sizes (100MB per file)
      const maxFileSize = 100 * 1024 * 1024; // 100MB per file
      const oversizedFiles = newFiles.filter(file => {
        console.log(`File ${file.name}: ${file.size} bytes (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        return file.size > maxFileSize;
      });
      if (oversizedFiles.length > 0) {
        console.log('Oversized files detected:', oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`));
        toast({
          title: "Individual File Too Large",
          description: `Individual files must be 100MB or less. Large files: ${oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`).join(', ')}`,
          variant: "destructive"
        });
        // Clear the input
        event.target.value = '';
        return;
      }
      
      // Check for duplicate files
      const existingFileNames = selectedFiles.map(f => f.name);
      const duplicateFiles = newFiles.filter(file => existingFileNames.includes(file.name));
      
      if (duplicateFiles.length > 0) {
        toast({
          title: "Duplicate Files",
          description: `The following files are already selected: ${duplicateFiles.map(f => f.name).join(', ')}`,
          variant: "destructive"
        });
        // Clear the input
        event.target.value = '';
        return;
      }
      
      setSelectedFiles(allFiles);
      await analyzeFilePages(allFiles);
      
      // Clear the input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  const calculatePrice = () => {
    const selectedPricing = pricingData.find(pricing => pricing.serviceType === deliveryType);
    if (!selectedPricing) {
      // Fallback to hardcoded values if pricing data is not available
      if (deliveryType === 'standard') {
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

  // Function to get file icon based on file type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-600" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-600" />;
    } else {
      return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    if (newFiles.length > 0) {
      analyzeFilePages(newFiles);
    } else {
      setPageCount(1);
    }
  };

  const handleSubmitOrder = async () => {
    if (selectedFiles.length === 0 || !customerEmail || !customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please select at least one file and provide your email address and phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting order submission process...');
      
      // Upload files and create order in one step
      const formData = new FormData();
      
      // Add all selected files
      selectedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      
      formData.append('fileCount', selectedFiles.length.toString());
      formData.append('customerEmail', customerEmail);
      
      // Add order details to the form data
      const orderDetails = {
        customerPhone: `${countryCode}${customerPhone}`,
        pageCount,
        deliveryType,
        totalPrice: calculatePrice(),
        fileNames: selectedFiles.map(file => file.name)
      };
      formData.append('orderDetails', JSON.stringify(orderDetails));

      console.log('Uploading files and creating order:', selectedFiles.map(f => f.name), 'Total size:', selectedFiles.reduce((sum, f) => sum + f.size, 0));

      try {
        const uploadResponse = await fetch('/api/upload-translation-files', {
          method: 'POST',
          body: formData,
          credentials: 'include', // Include session cookies for authentication
        });

        console.log('Upload response status:', uploadResponse.status);

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          console.log('Files uploaded and order created successfully:', uploadResult);
          
          toast({
            title: "Order Created",
            description: `Order ${uploadResult.orderNumber} created successfully. Proceeding to payment.`,
          });

          // Store order details for checkout
          const orderDetails = {
            customerEmail,
            customerPhone: `${countryCode}${customerPhone}`,
            originalFileNames: selectedFiles.map(file => file.name),
            fileTypes: selectedFiles.map(file => file.type),
            pageCount,
            deliveryType,
            totalPrice: calculatePrice(),
            orderNumber: uploadResult.orderNumber
          };

          sessionStorage.setItem('translationOrderDetails', JSON.stringify(orderDetails));
          
          // Redirect to checkout
          window.location.href = '/translation-checkout';
        } else {
          const errorText = await uploadResponse.text();
          console.error('❌ File upload and order creation failed:', uploadResponse.status, errorText);
          throw new Error(`File upload failed: ${uploadResponse.status}`);
        }
      } catch (uploadError) {
        console.error('❌ File upload error:', uploadError);
        toast({
          title: "Upload Failed",
          description: "Failed to upload your documents and create order. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ General error:', error);
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("translationsTitle")}</h1>
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
            <h2 className="text-2xl font-semibold mb-6">{t("whyChooseService")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">{t("certifiedTranslations")}</h3>
                <p className="text-gray-600 mb-4">{t("certifiedDesc")}</p>
                
                <h3 className="text-lg font-semibold mb-3">{t("professionalTranslators")}</h3>
                <p className="text-gray-600 mb-4">{t("professionalDesc")}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">{t("fastTurnaround")}</h3>
                <p className="text-gray-600 mb-4">{t("fastDesc")}</p>
                
                <h3 className="text-lg font-semibold mb-3">{t("secureProcessing")}</h3>
                <p className="text-gray-600 mb-4">{t("secureDesc")}</p>
              </div>
            </div>
          </div>
          
          {/* Document Upload and Payment */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6">{t("uploadDoc")}</h2>
            
            <div className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("selectDocument")}
                </label>
                <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    {selectedFiles.length > 0 ? "Add More Files" : t("chooseFile")}
                  </label>
                  <p className="text-gray-600 mt-4">
                    {t("acceptedFormats")}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    You can select multiple files at once. Max 100MB per file, 100MB total.
                  </p>
                  
                  {/* Display selected files */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h4 className="text-sm font-medium text-gray-700 text-left">
                        Selected Files ({selectedFiles.length}):
                      </h4>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file)}
                            <div className="text-left">
                              <p className="text-green-700 font-medium text-sm">{file.name}</p>
                              <p className="text-green-600 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-600 text-sm font-medium"
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <div className="text-sm text-gray-600 text-left">
                        <strong>Total size:</strong> {(selectedFiles.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  )}
                </div>
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
                    onChange={(e) => setPageCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    disabled={true}
                    readOnly
                  />
                  {isAnalyzing && (
                    <span className="text-blue-600 text-sm">{t("analyzingDocument")}</span>
                  )}
                  {selectedFiles.length > 0 && !isAnalyzing && (
                    <span className="text-green-600 text-sm">
                      {t("detectedPages")} {pageCount} {pageCount > 1 ? t("pages") : t("page")} from {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
                    </span>
                  )}
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
                              {pricing.serviceType.charAt(0).toUpperCase() + pricing.serviceType.slice(1)} {t("delivery")} ({pricing.deliveryDays} {pricing.deliveryDays === 1 ? t("day") : t("days")})
                            </div>
                            <div className="text-gray-600">
                              {language === 'es' ? pricing.descriptionEs : pricing.description}
                            </div>
                            <div className="text-sm text-blue-600 font-medium mt-1">
                              ${pricing.pricePerPage} {t("perPage")} • ${pricing.minimumPrice} {t("minimum")}
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
                  <span className="text-lg font-semibold">{t("totalCost")}:</span>
                  <span className="text-2xl font-bold text-blue-600">${calculatePrice()}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {pageCount} page{pageCount > 1 ? 's' : ''} from {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} × {deliveryType} delivery
                  {pricingData.find(p => p.serviceType === deliveryType) && (
                    <div className="mt-2">
                      {t("delivery")}: {pricingData.find(p => p.serviceType === deliveryType)?.deliveryDays} {pricingData.find(p => p.serviceType === deliveryType)?.deliveryDays === 1 ? t("day") : t("days")}
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
                disabled={selectedFiles.length === 0 || !customerEmail || !customerPhone || isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg"
              >
                {isSubmitting
                  ? "Processing..."
                  : selectedFiles.length > 0 && customerEmail && customerPhone
                    ? `${t("proceedToPayment")} - $${calculatePrice()}`
                    : selectedFiles.length === 0 
                      ? t("pleaseSelectFile")
                      : "Please provide email and phone"
                }
              </Button>
              
              <div className="text-sm text-gray-500 text-center">
                <p>Professional translation • Certified for USCIS • Money-back guarantee</p>
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