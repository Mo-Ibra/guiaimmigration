import { useLanguage } from "./language-provider";
import { Star, Quote, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "wouter";

export function Testimonials() {
  const { language, t } = useLanguage();

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
        ? "Este sitio es uno de los mejores que me ayudó con la traducción y la explicación. Muchas gracias a todo el maravilloso equipo."
        : "This site is one of the best sites that helped me in translation and explanations. Thanks to the entire amazing team.",
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
      timeline: language === "es" ? "Tarjeta verde recibida" : "Green card received"
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
    <section id="success-stories" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("successStories")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("successStoriesDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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

        <div className="text-center space-y-4">
          <Link href="/testimonials">
            <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 mr-4">
              {language === "es" ? "Ver Más Testimonios" : "See More Testimonials"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/testimonials/submit">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
              {t("submitStory")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}