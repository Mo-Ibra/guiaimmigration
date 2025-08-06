import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { useLanguage } from "../../components/language-provider";
import { Link } from "wouter";

export default function CommonMistakes() {
  const { t, language } = useLanguage();

  const mistakes = [
    {
      category: "General Filing Mistakes",
      items: [
        {
          mistake: "Using outdated forms",
          consequence: "Rejection and delays",
          solution: "Always download the latest version from USCIS.gov before filing"
        },
        {
          mistake: "Incomplete signatures",
          consequence: "Form rejection",
          solution: "Sign and date every required signature field, including spouse signatures where needed"
        },
        {
          mistake: "Wrong filing fees",
          consequence: "Rejection or processing delays",
          solution: "Check current fee schedule on USCIS website before submitting payment"
        },
        {
          mistake: "Missing supporting documents",
          consequence: "Request for Evidence (RFE) or denial",
          solution: "Review document checklist carefully and include all required evidence"
        }
      ]
    },
    {
      category: "Form I-130 (Family Petition)",
      items: [
        {
          mistake: "Incorrect relationship proof",
          consequence: "Denial of petition",
          solution: "Provide certified copies of marriage certificates, birth certificates, and adoption decrees"
        },
        {
          mistake: "Wrong petitioner information",
          consequence: "Processing delays",
          solution: "Ensure petitioner's name matches exactly with citizenship/residency documents"
        },
        {
          mistake: "Missing translation of foreign documents",
          consequence: "RFE or rejection",
          solution: "All foreign language documents must be translated by certified translators"
        }
      ]
    },
    {
      category: "Form I-485 (Adjustment of Status)",
      items: [
        {
          mistake: "Incorrect priority date",
          consequence: "Filing rejection if not current",
          solution: "Check Visa Bulletin monthly to ensure priority date is current before filing"
        },
        {
          mistake: "Missing medical examination",
          consequence: "RFE and significant delays",
          solution: "Complete Form I-693 with USCIS-designated civil surgeon before filing"
        },
        {
          mistake: "Insufficient financial support evidence",
          consequence: "Denial based on public charge grounds",
          solution: "Include complete Affidavit of Support (I-864) with required financial documents"
        },
        {
          mistake: "Wrong photos",
          consequence: "RFE for correct photos",
          solution: "Use recent passport-style photos meeting USCIS specifications"
        }
      ]
    },
    {
      category: "Form N-400 (Naturalization)",
      items: [
        {
          mistake: "Insufficient physical presence",
          consequence: "Application denial",
          solution: "Calculate physical presence carefully - must be at least 30 months in past 5 years"
        },
        {
          mistake: "Unreported travel outside U.S.",
          consequence: "Denial for failure to disclose",
          solution: "List ALL trips outside the U.S., even brief ones, with exact dates"
        },
        {
          mistake: "Outstanding tax obligations",
          consequence: "Denial for failure to pay taxes",
          solution: "File all required tax returns and resolve any outstanding tax issues before applying"
        },
        {
          mistake: "Criminal history disclosure",
          consequence: "Denial for misrepresentation",
          solution: "Disclose ALL arrests and citations, even if charges were dropped or expunged"
        }
      ]
    }
  ];

  const mistakesEs = [
    {
      category: "Errores Generales de Presentación",
      items: [
        {
          mistake: "Usar formularios desactualizados",
          consequence: "Rechazo y retrasos",
          solution: "Siempre descargue la versión más reciente de USCIS.gov antes de presentar"
        },
        {
          mistake: "Firmas incompletas",
          consequence: "Rechazo del formulario",
          solution: "Firme y feche cada campo de firma requerido, incluyendo firmas de cónyuge cuando sea necesario"
        },
        {
          mistake: "Tarifas de presentación incorrectas",
          consequence: "Rechazo o retrasos en el procesamiento",
          solution: "Verifique el programa de tarifas actual en el sitio web de USCIS antes de enviar el pago"
        },
        {
          mistake: "Documentos de apoyo faltantes",
          consequence: "Solicitud de Evidencia (RFE) o negación",
          solution: "Revise cuidadosamente la lista de documentos e incluya toda la evidencia requerida"
        }
      ]
    },
    {
      category: "Formulario I-130 (Petición Familiar)",
      items: [
        {
          mistake: "Prueba de parentesco incorrecta",
          consequence: "Negación de la petición",
          solution: "Proporcione copias certificadas de certificados de matrimonio, certificados de nacimiento y decretos de adopción"
        },
        {
          mistake: "Información incorrecta del peticionario",
          consequence: "Retrasos en el procesamiento",
          solution: "Asegúrese de que el nombre del peticionario coincida exactamente con los documentos de ciudadanía/residencia"
        },
        {
          mistake: "Falta traducción de documentos extranjeros",
          consequence: "RFE o rechazo",
          solution: "Todos los documentos en idioma extranjero deben ser traducidos por traductores certificados"
        }
      ]
    },
    {
      category: "Formulario I-485 (Ajuste de Estatus)",
      items: [
        {
          mistake: "Fecha de prioridad incorrecta",
          consequence: "Rechazo de presentación si no está vigente",
          solution: "Revise el Boletín de Visas mensualmente para asegurar que la fecha de prioridad esté vigente antes de presentar"
        },
        {
          mistake: "Examen médico faltante",
          consequence: "RFE y retrasos significativos",
          solution: "Complete el Formulario I-693 con un cirujano civil designado por USCIS antes de presentar"
        },
        {
          mistake: "Evidencia insuficiente de apoyo financiero",
          consequence: "Negación basada en motivos de carga pública",
          solution: "Incluya la Declaración Jurada de Apoyo completa (I-864) con los documentos financieros requeridos"
        },
        {
          mistake: "Fotos incorrectas",
          consequence: "RFE para fotos correctas",
          solution: "Use fotos recientes estilo pasaporte que cumplan con las especificaciones de USCIS"
        }
      ]
    },
    {
      category: "Formulario N-400 (Naturalización)",
      items: [
        {
          mistake: "Presencia física insuficiente",
          consequence: "Negación de la solicitud",
          solution: "Calcule cuidadosamente la presencia física - debe ser al menos 30 meses en los últimos 5 años"
        },
        {
          mistake: "Viajes no reportados fuera de EE.UU.",
          consequence: "Negación por falta de divulgación",
          solution: "Liste TODOS los viajes fuera de EE.UU., incluso los breves, con fechas exactas"
        },
        {
          mistake: "Obligaciones fiscales pendientes",
          consequence: "Negación por falta de pago de impuestos",
          solution: "Presente todas las declaraciones de impuestos requeridas y resuelva cualquier problema fiscal pendiente antes de solicitar"
        },
        {
          mistake: "Divulgación de historial criminal",
          consequence: "Negación por tergiversación",
          solution: "Divulgue TODOS los arrestos y citaciones, incluso si los cargos fueron retirados o eliminados"
        }
      ]
    }
  ];

  const currentMistakes = language === 'es' ? mistakesEs : mistakes;

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("commonMistakesTitle")}</h1>
            <p className="text-xl text-gray-600">
              {t("commonMistakesSubtitle")}
            </p>
          </div>
          
          <div className="space-y-8">
            {currentMistakes.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {category.category}
                </h2>
                
                <div className="space-y-6">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-4 border-red-400 pl-6">
                      <h3 className="text-lg font-semibold text-red-600 mb-2">
                        ❌ {item.mistake}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        <strong>Consequence:</strong> {item.consequence}
                      </p>
                      <p className="text-green-700">
                        <strong>✓ Solution:</strong> {item.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Prevention Tips */}
          <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Prevention Tips</h3>
            <ul className="space-y-2 text-green-700 text-sm">
              <li>• Always use the most current version of forms from USCIS.gov</li>
              <li>• Double-check all information before submitting</li>
              <li>• Keep copies of everything you submit</li>
              <li>• Consider professional help for complex cases</li>
              <li>• Allow extra time for document gathering and review</li>
              <li>• Track your case status regularly on USCIS website</li>
            </ul>
          </div>
          
          {/* Legal Disclaimer */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Legal Disclaimer</h3>
            <p className="text-yellow-700 text-sm">
              This information is for educational purposes only and does not constitute legal advice. 
              Immigration law is complex and individual cases vary significantly. Always consult with a qualified 
              immigration attorney for advice specific to your situation, especially if you have any complications 
              or concerns about your case.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}