import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { useToast } from "../hooks/use-toast";
import { useLanguage } from "./language-provider";
import { Mail, Phone, MessageCircle, CheckCircle, X } from "lucide-react";
import { apiRequest } from "../lib/queryClient";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  formType: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      formType: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      setShowSuccessPopup(true);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("needAssistance")}
          </h2>
          <p className="text-xl text-gray-600">
            {t("contactSubtitle")}
          </p>
        </div>
        
        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t("sendMessage")}
              </h3>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t("firstName")}</Label>
                    <Input
                      id="firstName"
                      {...form.register("firstName")}
                      className="mt-2"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-red-600 text-sm mt-1">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t("lastName")}</Label>
                    <Input
                      id="lastName"
                      {...form.register("lastName")}
                      className="mt-2"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-red-600 text-sm mt-1">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    className="mt-2"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone">{t("phoneNumber")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...form.register("phone")}
                    className="mt-2"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-600 text-sm mt-1">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="formType">{t("formType")}</Label>
                  <Select onValueChange={(value) => form.setValue("formType", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder={t("selectForm")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="I-130">Form I-130 (Family Petition)</SelectItem>
                      <SelectItem value="I-485">Form I-485 (Adjustment of Status)</SelectItem>
                      <SelectItem value="N-400">Form N-400 (Naturalization)</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="message">{t("message")}</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    {...form.register("message")}
                    placeholder={t("messagePlaceholder")}
                    className="mt-2"
                  />
                  {form.formState.errors.message && (
                    <p className="text-red-600 text-sm mt-1">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 font-medium"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
          

        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
              <p className="text-gray-600 mb-6">Thank you for your message. We'll get back to you soon!</p>
              <Button 
                onClick={() => setShowSuccessPopup(false)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
