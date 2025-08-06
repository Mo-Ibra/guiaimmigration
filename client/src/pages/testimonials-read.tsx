import { useState } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useLanguage } from "../components/language-provider";
import { Button } from "../components/ui/button";
import { Star, Quote, ArrowDown } from "lucide-react";
import { Link } from "wouter";

export default function TestimonialsRead() {
  const { language, t } = useLanguage();

  // Sample testimonials data
  const testimonials = [
    {
      name: language === "es" ? "María González" : "Maria González",
      case: language === "es" ? "Petición Familiar I-130" : "Family Petition I-130",
      quote: language === "es" 
        ? "Los guías paso a paso fueron increíbles. Me ayudaron a completar mi petición familiar sin errores y mi esposo ya recibió su visa."
        : "The step-by-step guides were incredible. They helped me complete my family petition without errors and my husband already received his visa.",
      rating: 5,
      timeline: language === "es" ? "Aprobado en 14 meses" : "Approved in 14 months"
    },
    {
      name: language === "es" ? "Carlos Rodríguez" : "Carlos Rodriguez", 
      case: language === "es" ? "Naturalización N-400" : "Naturalization N-400",
      quote: language === "es"
        ? "Gracias a las listas de verificación detalladas, pude prepararme perfectamente para mi entrevista de ciudadanía. ¡Ahora soy ciudadano americano!"
        : "Thanks to the detailed checklists, I was able to prepare perfectly for my citizenship interview. I'm now an American citizen!",
      rating: 5,
      timeline: language === "es" ? "Ciudadanía obtenida" : "Citizenship obtained"
    },
    {
      name: language === "es" ? "Ana Martínez" : "Ana Martinez",
      case: language === "es" ? "Ajuste de Estatus I-485" : "Adjustment of Status I-485", 
      quote: language === "es"
        ? "El servicio de traducción fue rápido y preciso. Todos mis documentos fueron aceptados por USCIS sin problemas."
        : "The translation service was fast and accurate. All my documents were accepted by USCIS without any issues.",
      rating: 5,
      timeline: language === "es" ? "Tarjeta verde aprobada" : "Green card approved"
    },
    {
      name: language === "es" ? "Roberto Silva" : "Roberto Silva",
      case: language === "es" ? "Autorización de Trabajo I-765" : "Work Authorization I-765",
      quote: language === "es"
        ? "La guía I-765 me ahorró cientos de dólares en honorarios de abogado. Todo fue muy claro y fácil de seguir."
        : "The I-765 guide saved me hundreds of dollars in attorney fees. Everything was very clear and easy to follow.",
      rating: 5,
      timeline: language === "es" ? "Autorización recibida" : "Authorization received"
    },
    {
      name: language === "es" ? "Lucia Hernández" : "Lucia Hernandez",
      case: language === "es" ? "Renovación de Tarjeta Verde I-90" : "Green Card Renewal I-90",
      quote: language === "es"
        ? "Pensé que renovar mi tarjeta verde sería complicado, pero con esta guía fue muy sencillo. ¡Muchas gracias!"
        : "I thought renewing my green card would be complicated, but with this guide it was very simple. Thank you so much!",
      rating: 5,
      timeline: language === "es" ? "Renovación completada" : "Renewal completed"
    },
    {
      name: language === "es" ? "José Ramírez" : "Jose Ramirez",
      case: language === "es" ? "Petición de Prometido I-129F" : "Fiancé Petition I-129F",
      quote: language === "es"
        ? "Mi prometida ya está aquí en Estados Unidos gracias a esta guía. El proceso fue mucho más fácil de lo que esperaba."
        : "My fiancée is now here in the United States thanks to this guide. The process was much easier than I expected.",
      rating: 5,
      timeline: language === "es" ? "Visa K-1 aprobada" : "K-1 visa approved"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {language === "es" ? "Historias de Éxito" : "Success Stories"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "es" 
                ? "Lee cómo nuestras guías han ayudado a miles de personas a navegar exitosamente sus procesos de inmigración"
                : "Read how our guides have helped thousands of people successfully navigate their immigration processes"
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-blue-600 mr-3" />
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                </div>
                
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600 mb-1">{testimonial.case}</div>
                  <div className="text-sm font-medium text-green-600">{testimonial.timeline}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/testimonials/submit">
              <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                {language === "es" ? "Comparte tu Historia" : "Share Your Story"}
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}