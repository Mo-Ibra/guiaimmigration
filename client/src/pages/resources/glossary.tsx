import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { useLanguage } from "../../components/language-provider";
import { Link } from "wouter";

export default function Glossary() {
  const { t, language } = useLanguage();

  const glossaryTermsEn = [
    {
      term: "Adjustment of Status",
      definition: "The process of changing from a temporary visa status to permanent resident (green card) while remaining in the United States."
    },
    {
      term: "Affidavit of Support",
      definition: "Form I-864, a legal document where a sponsor agrees to financially support an immigrant and prevent them from becoming a public charge."
    },
    {
      term: "Alien Registration Number (A-Number)",
      definition: "A unique identifier assigned to immigrants by USCIS, typically found on immigration documents."
    },
    {
      term: "Beneficiary",
      definition: "The person who benefits from an immigration petition filed on their behalf by a petitioner."
    },
    {
      term: "Consular Processing",
      definition: "The process of obtaining an immigrant visa through a U.S. consulate or embassy in another country."
    },
    {
      term: "EAD (Employment Authorization Document)",  
      definition: "Work permit that allows certain non-citizens to work legally in the United States."
    },
    {
      term: "Green Card",
      definition: "Common term for a Permanent Resident Card, which proves lawful permanent resident status in the U.S."
    },
    {
      term: "I-94",
      definition: "Arrival/departure record that shows when and where a person entered the U.S. and their authorized period of stay."
    },
    {
      term: "Naturalization",
      definition: "The process by which a permanent resident becomes a U.S. citizen."
    },
    {
      term: "Petitioner", 
      definition: "The U.S. citizen or permanent resident who files an immigration petition for a beneficiary."
    },
    {
      term: "Priority Date",
      definition: "The date USCIS received a properly filed petition, used to determine when an immigrant visa becomes available."
    },
    {
      term: "Public Charge",
      definition: "Someone who is likely to become primarily dependent on government assistance for subsistence."
    },
    {
      term: "Receipt Number",
      definition: "A unique identifier assigned to each case filed with USCIS, used to track case status."
    },
    {
      term: "Sponsor",
      definition: "A person who agrees to financially support an immigrant by filing an Affidavit of Support."
    },
    {
      term: "USCIS",
      definition: "U.S. Citizenship and Immigration Services, the government agency that oversees immigration and naturalization."
    },
    {
      term: "Visa Bulletin",
      definition: "Monthly publication showing priority date cutoffs for immigrant visa categories."
    }
  ];

  const glossaryTermsEs = [
    {
      term: "Ajuste de Estatus",
      definition: "El proceso de cambiar de un estatus de visa temporal a residente permanente (tarjeta verde) mientras permanece en Estados Unidos."
    },
    {
      term: "Declaración Jurada de Apoyo",
      definition: "Formulario I-864, un documento legal donde un patrocinador acepta apoyar financieramente a un inmigrante y prevenir que se convierta en carga pública."
    },
    {
      term: "Número de Registro de Extranjero (Número A)",
      definition: "Un identificador único asignado a inmigrantes por USCIS, típicamente encontrado en documentos de inmigración."
    },
    {
      term: "Beneficiario",
      definition: "La persona que se beneficia de una petición de inmigración presentada en su nombre por un peticionario."
    },
    {
      term: "Procesamiento Consular",
      definition: "El proceso de obtener una visa de inmigrante a través de un consulado o embajada de EE.UU. en otro país."
    },
    {
      term: "EAD (Documento de Autorización de Empleo)",  
      definition: "Permiso de trabajo que permite a ciertos no ciudadanos trabajar legalmente en Estados Unidos."
    },
    {
      term: "Tarjeta Verde",
      definition: "Término común para una Tarjeta de Residente Permanente, que prueba el estatus de residente permanente legal en EE.UU."
    },
    {
      term: "I-94",
      definition: "Registro de llegada/salida que muestra cuándo y dónde una persona entró a EE.UU. y su período autorizado de estadía."
    },
    {
      term: "Naturalización",
      definition: "El proceso por el cual un residente permanente se convierte en ciudadano estadounidense."
    },
    {
      term: "Peticionario", 
      definition: "El ciudadano estadounidense o residente permanente que presenta una petición de inmigración para un beneficiario."
    },
    {
      term: "Fecha de Prioridad",
      definition: "La fecha cuando USCIS recibió una petición debidamente presentada, usada para determinar cuándo una visa de inmigrante estará disponible."
    },
    {
      term: "Carga Pública",
      definition: "Alguien que probablemente se convertirá principalmente dependiente de asistencia gubernamental para subsistencia."
    },
    {
      term: "Número de Recibo",
      definition: "Un identificador único asignado a cada caso presentado con USCIS, usado para rastrear el estado del caso."
    },
    {
      term: "Patrocinador",
      definition: "Una persona que acepta apoyar financieramente a un inmigrante al presentar una Declaración Jurada de Apoyo."
    },
    {
      term: "USCIS",
      definition: "Servicios de Ciudadanía e Inmigración de EE.UU., la agencia gubernamental que supervisa inmigración y naturalización."
    },
    {
      term: "Boletín de Visas",
      definition: "Publicación mensual que muestra las fechas límite de prioridad para categorías de visa de inmigrante."
    }
  ];

  const glossaryTerms = language === 'es' ? glossaryTermsEs : glossaryTermsEn;

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("glossaryTitle")}</h1>
            <p className="text-xl text-gray-600">
              {t("glossarySubtitle")}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm">
            <div className="divide-y divide-gray-200">
              {glossaryTerms.map((item, index) => (
                <div key={index} className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.term}
                  </h3>
                  <p className="text-gray-600">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Legal Disclaimer */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Legal Disclaimer</h3>
            <p className="text-yellow-700 text-sm">
              This glossary is for educational purposes only and does not constitute legal advice. 
              Immigration law is complex and frequently changes. Always consult with a qualified 
              immigration attorney for advice specific to your situation.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}