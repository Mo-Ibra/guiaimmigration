import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { useLanguage } from "../../components/language-provider";
import { Link } from "wouter";

export default function FilingOrder() {
  const { t, language } = useLanguage();

  const filingScenarios = [
    {
      title: "Family-Based Immigration (Immediate Relatives)",
      description: "For spouses, unmarried children under 21, and parents of U.S. citizens",
      steps: [
        { step: 1, form: "I-130", description: "Petition for Alien Relative" },
        { step: 2, form: "I-485", description: "Adjustment of Status (if in the U.S.)" },
        { step: 3, form: "I-131", description: "Travel Document (optional, if needed)" },
        { step: 4, form: "I-765", description: "Work Authorization (optional)" }
      ]
    },
    {
      title: "Family-Based Immigration (Preference Categories)",
      description: "For other family members with longer wait times",
      steps: [
        { step: 1, form: "I-130", description: "Petition for Alien Relative" },
        { step: 2, form: "Wait", description: "Wait for priority date to become current" },
        { step: 3, form: "I-485", description: "Adjustment of Status (when priority date is current)" },
        { step: 4, form: "I-131/I-765", description: "Travel/Work documents (if needed)" }
      ]
    },
    {
      title: "Employment-Based Immigration",
      description: "For employer-sponsored permanent residence",
      steps: [
        { step: 1, form: "PERM", description: "Labor Certification (if required)" },
        { step: 2, form: "I-140", description: "Immigrant Petition for Alien Worker" },
        { step: 3, form: "I-485", description: "Adjustment of Status (when priority date current)" },
        { step: 4, form: "I-131/I-765", description: "Travel/Work documents (if needed)" }
      ]
    },
    {
      title: "Naturalization Process",
      description: "For permanent residents applying for U.S. citizenship",
      steps: [
        { step: 1, form: "N-400", description: "Application for Naturalization" },
        { step: 2, form: "Interview", description: "USCIS Interview and Civics Test" },
        { step: 3, form: "Oath", description: "Oath of Allegiance Ceremony" }
      ]
    }
  ];

  const filingScenariosEs = [
    {
      title: "Inmigración Basada en Familia (Parientes Inmediatos)",
      description: "Para cónyuges, hijos solteros menores de 21 años y padres de ciudadanos estadounidenses",
      steps: [
        { step: 1, form: "I-130", description: "Petición para Pariente Extranjero" },
        { step: 2, form: "I-485", description: "Ajuste de Estatus (si está en EE.UU.)" },
        { step: 3, form: "I-131", description: "Documento de Viaje (opcional, si es necesario)" },
        { step: 4, form: "I-765", description: "Autorización de Trabajo (opcional)" }
      ]
    },
    {
      title: "Inmigración Basada en Familia (Categorías de Preferencia)",
      description: "Para otros miembros de la familia con tiempos de espera más largos",
      steps: [
        { step: 1, form: "I-130", description: "Petición para Pariente Extranjero" },
        { step: 2, form: "Esperar", description: "Esperar a que la fecha de prioridad esté vigente" },
        { step: 3, form: "I-485", description: "Ajuste de Estatus (cuando la fecha de prioridad esté vigente)" },
        { step: 4, form: "I-131/I-765", description: "Documentos de viaje/trabajo (si es necesario)" }
      ]
    },
    {
      title: "Inmigración Basada en Empleo",
      description: "Para residencia permanente patrocinada por el empleador",
      steps: [
        { step: 1, form: "PERM", description: "Certificación Laboral (si es requerida)" },
        { step: 2, form: "I-140", description: "Petición de Inmigrante para Trabajador Extranjero" },
        { step: 3, form: "I-485", description: "Ajuste de Estatus (cuando la fecha de prioridad esté vigente)" },
        { step: 4, form: "I-131/I-765", description: "Documentos de viaje/trabajo (si es necesario)" }
      ]
    },
    {
      title: "Proceso de Naturalización",
      description: "Para residentes permanentes que solicitan ciudadanía estadounidense",
      steps: [
        { step: 1, form: "N-400", description: "Solicitud de Naturalización" },
        { step: 2, form: "Entrevista", description: "Entrevista de USCIS y Examen Cívico" },
        { step: 3, form: "Juramento", description: "Ceremonia de Juramento de Lealtad" }
      ]
    }
  ];

  const currentScenarios = language === 'es' ? filingScenariosEs : filingScenarios;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/resources" className="text-blue-600 hover:text-blue-700">
              ← {t("backToResources")}
            </Link>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("filingOrderTitle")}</h1>
            <p className="text-xl text-gray-600">
              {t("filingOrderSubtitle")}
            </p>
          </div>
          
          <div className="space-y-8">
            {currentScenarios.map((scenario, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {scenario.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {scenario.description}
                </p>
                
                <div className="space-y-4">
                  {scenario.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {step.step}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            {step.form}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Important Notes */}
          <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">Important Notes</h3>
            <ul className="space-y-2 text-yellow-700 text-sm">
              <li>• Filing order may vary based on individual circumstances</li>
              <li>• Some forms can be filed concurrently (at the same time)</li>
              <li>• Priority dates and processing times can affect timing</li>
              <li>• Always check current USCIS guidelines before filing</li>
              <li>• Consider consulting an immigration attorney for complex cases</li>
            </ul>
          </div>
          
          {/* Legal Disclaimer */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Legal Disclaimer</h3>
            <p className="text-red-700 text-sm">
              This filing order guide is for educational purposes only and does not constitute legal advice. 
              Immigration cases vary significantly based on individual circumstances. Always consult with a qualified 
              immigration attorney before filing any forms to ensure you follow the correct process for your specific situation.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}