import { Shield } from "lucide-react";
import { useState } from "react";

type Language = "en" | "es";

const DisclaimerCard = () => {
  const [language, setLanguage] = useState<Language>("en");

  const content: Record<
    Language,
    {
      title: string;
      subtitle: string;
      text: string;
      toggle: string;
    }
  > = {
    en: {
      title: "Legal Notice",
      subtitle: "Please Read Before Proceeding",
      text: "This website was created to assist individuals with straightforward processes. If you are not sure about your current status, have pending removal proceedings, or have misrepresented yourself to USCIS, you are urged to consult an attorney before submitting any form independently.",
      toggle: "Español",
    },
    es: {
      title: "Aviso Legal",
      subtitle: "Por Favor Lea Antes de Continuar",
      text: "Esta página web fue creada para asistir a individuos con procesos sin complicaciones. Si no está seguro sobre su estatus actual, está en procedimientos de deportación, o se ha presentado falsamente ante USCIS, se le recomienda encarecidamente que consulte con un abogado antes de someter alguna forma independiente.",
      toggle: "English",
    },
  };

  const currentContent = content[language];

  return (
    <section id="disclaimer" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-l-4 border-red-400 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {currentContent.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentContent.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              className="text-sm text-red-700 hover:text-red-900 font-medium underline"
            >
              {currentContent.toggle}
            </button>
          </div>

          <p className="text-gray-700 leading-relaxed">{currentContent.text}</p>
        </div>
      </div>
    </section>
  );
};

export default DisclaimerCard;
