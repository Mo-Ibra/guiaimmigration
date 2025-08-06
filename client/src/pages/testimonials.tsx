import { useState } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useLanguage } from "../components/language-provider";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Star, Send, Quote, ArrowDown } from "lucide-react";
import { apiRequest } from "../lib/queryClient";

export default function TestimonialsSubmit() {
  const { language, t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    caseType: "",
    rating: 5,
    testimonial: "",
    timeline: "",
    allowContact: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/testimonials", formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
        onClick={interactive ? () => handleInputChange("rating", i + 1) : undefined}
      />
    ));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="bg-white p-12 rounded-lg shadow-sm text-center">
              <div className="text-green-600 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {language === "es" ? "¡Gracias por compartir tu historia!" : "Thank you for sharing your story!"}
              </h2>
              <p className="text-gray-600">
                {language === "es" 
                  ? "Tu testimonio ha sido enviado y nos ayudará a inspirar a otras personas en su viaje de inmigración."
                  : "Your testimonial has been submitted and will help inspire others on their immigration journey."}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {language === "es" ? "Comparte tu Historia de Éxito" : "Share Your Success Story"}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {language === "es" 
                ? "Ayuda a inspirar a otros compartiendo tu experiencia exitosa con nuestros recursos de inmigración"
                : "Help inspire others by sharing your successful experience with our immigration resources"}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "es" ? "Nombre completo" : "Full Name"}
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "es" ? "Correo electrónico" : "Email Address"}
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "es" ? "Tipo de caso de inmigración" : "Immigration Case Type"}
                </label>
                <Select value={formData.caseType} onValueChange={(value) => handleInputChange("caseType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "es" ? "Selecciona tu tipo de caso..." : "Select your case type..."} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="I-130">{language === "es" ? "Petición Familiar (I-130)" : "Family Petition (I-130)"}</SelectItem>
                    <SelectItem value="I-485">{language === "es" ? "Ajuste de Estatus (I-485)" : "Adjustment of Status (I-485)"}</SelectItem>
                    <SelectItem value="N-400">{language === "es" ? "Naturalización (N-400)" : "Naturalization (N-400)"}</SelectItem>
                    <SelectItem value="I-765">{language === "es" ? "Autorización de Trabajo (I-765)" : "Work Authorization (I-765)"}</SelectItem>
                    <SelectItem value="I-131">{language === "es" ? "Documento de Viaje (I-131)" : "Travel Document (I-131)"}</SelectItem>
                    <SelectItem value="translation">{language === "es" ? "Servicios de Traducción" : "Translation Services"}</SelectItem>
                    <SelectItem value="other">{language === "es" ? "Otro" : "Other"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "es" ? "Calificación de tu experiencia" : "Rate Your Experience"}
                </label>
                <div className="flex gap-1">
                  {renderStars(formData.rating, true)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "es" ? "Comparte tu historia" : "Share Your Story"}
                </label>
                <Textarea
                  value={formData.testimonial}
                  onChange={(e) => handleInputChange("testimonial", e.target.value)}
                  placeholder={language === "es" 
                    ? "Cuéntanos sobre tu experiencia usando nuestros recursos. ¿Cómo te ayudaron? ¿Qué fue lo más útil?"
                    : "Tell us about your experience using our resources. How did they help you? What was most useful?"}
                  rows={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "es" ? "Cronología del resultado" : "Timeline/Outcome"}
                </label>
                <Input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange("timeline", e.target.value)}
                  placeholder={language === "es" 
                    ? "Ej: Aprobado en 12 meses, Ciudadanía obtenida, etc."
                    : "e.g. Approved in 12 months, Citizenship obtained, etc."}
                />
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="allowContact"
                  checked={formData.allowContact}
                  onChange={(e) => handleInputChange("allowContact", e.target.checked)}
                  className="mt-1 mr-3"
                />
                <label htmlFor="allowContact" className="text-sm text-gray-700">
                  {language === "es" 
                    ? "Acepto que se publique mi testimonio en el sitio web y permito contacto para preguntas de seguimiento"
                    : "I agree to have my testimonial published on the website and allow contact for follow-up questions"}
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {language === "es" ? "Enviando..." : "Submitting..."}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    {language === "es" ? "Enviar Historia" : "Submit Story"}
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}