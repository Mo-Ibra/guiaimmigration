import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { useLanguage } from "../../components/language-provider";
import { Link } from "wouter";

export default function Fees() {
  const { t, language } = useLanguage();

  const feeCategories = [
    {
      category: "Family-Based Immigration",
      forms: [
        { form: "I-130", description: "Petition for Alien Relative", fee: "$535" },
        { form: "I-485", description: "Adjustment of Status", fee: "$1,225" },
        { form: "I-131", description: "Travel Document", fee: "$575" },
        { form: "I-765", description: "Work Authorization", fee: "$410" },
        { form: "I-864", description: "Affidavit of Support", fee: "No fee" }
      ]
    },
    {
      category: "Employment-Based Immigration",
      forms: [
        { form: "I-140", description: "Immigrant Petition for Alien Worker", fee: "$700" },
        { form: "I-485", description: "Adjustment of Status", fee: "$1,225" },
        { form: "I-131", description: "Travel Document", fee: "$575" },
        { form: "I-765", description: "Work Authorization", fee: "$410" }
      ]
    },
    {
      category: "Naturalization",
      forms: [
        { form: "N-400", description: "Application for Naturalization", fee: "$725" },
        { form: "N-600", description: "Certificate of Citizenship", fee: "$1,170" },
        { form: "N-565", description: "Replacement Naturalization Certificate", fee: "$555" }
      ]
    },
    {
      category: "Temporary Visas",
      forms: [
        { form: "I-129", description: "Nonimmigrant Worker Petition", fee: "$460" },
        { form: "I-539", description: "Extend/Change Nonimmigrant Status", fee: "$370" },
        { form: "I-212", description: "Permission to Reapply for Admission", fee: "$930" }
      ]
    },
    {
      category: "Asylum and Refugee",
      forms: [
        { form: "I-589", description: "Asylum Application", fee: "No fee" },
        { form: "I-730", description: "Refugee/Asylee Relative Petition", fee: "No fee" },
        { form: "I-912", description: "Fee Waiver Request", fee: "No fee" }
      ]
    }
  ];

  const feeCategoriesEs = [
    {
      category: "Inmigración Basada en Familia",
      forms: [
        { form: "I-130", description: "Petición para Pariente Extranjero", fee: "$535" },
        { form: "I-485", description: "Ajuste de Estatus", fee: "$1,225" },
        { form: "I-131", description: "Documento de Viaje", fee: "$575" },
        { form: "I-765", description: "Autorización de Trabajo", fee: "$410" },
        { form: "I-864", description: "Declaración Jurada de Apoyo", fee: "Sin tarifa" }
      ]
    },
    {
      category: "Inmigración Basada en Empleo",
      forms: [
        { form: "I-140", description: "Petición de Inmigrante para Trabajador Extranjero", fee: "$700" },
        { form: "I-485", description: "Ajuste de Estatus", fee: "$1,225" },
        { form: "I-131", description: "Documento de Viaje", fee: "$575" },
        { form: "I-765", description: "Autorización de Trabajo", fee: "$410" }
      ]
    },
    {
      category: "Naturalización",
      forms: [
        { form: "N-400", description: "Solicitud de Naturalización", fee: "$725" },
        { form: "N-600", description: "Certificado de Ciudadanía", fee: "$1,170" },
        { form: "N-565", description: "Certificado de Naturalización de Reemplazo", fee: "$555" }
      ]
    },
    {
      category: "Visas Temporales",
      forms: [
        { form: "I-129", description: "Petición de Trabajador No Inmigrante", fee: "$460" },
        { form: "I-539", description: "Extender/Cambiar Estatus de No Inmigrante", fee: "$370" },
        { form: "I-212", description: "Permiso para Solicitar Readmisión", fee: "$930" }
      ]
    },
    {
      category: "Asilo y Refugiado",
      forms: [
        { form: "I-589", description: "Solicitud de Asilo", fee: "Sin tarifa" },
        { form: "I-730", description: "Petición de Pariente Refugiado/Asilado", fee: "Sin tarifa" },
        { form: "I-912", description: "Solicitud de Exención de Tarifa", fee: "Sin tarifa" }
      ]
    }
  ];

  const currentFeeCategories = language === 'es' ? feeCategoriesEs : feeCategories;

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("filingFeesTitle")}</h1>
            <p className="text-xl text-gray-600 mb-4">
              {t("filingFeesSubtitle")}
            </p>
            <p className="text-sm text-gray-500">
              {language === 'es' 
                ? "Última actualización: Diciembre 2025 • Siempre verifique las tarifas actuales en USCIS.gov antes de presentar"
                : "Last updated: December 2025 • Always verify current fees on USCIS.gov before filing"
              }
            </p>
          </div>
          
          <div className="space-y-8">
            {currentFeeCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {category.category}
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">
                          {language === 'es' ? 'Formulario' : 'Form'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">
                          {language === 'es' ? 'Descripción' : 'Description'}
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900">
                          {language === 'es' ? 'Tarifa de Presentación' : 'Filing Fee'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.forms.map((form, formIndex) => (
                        <tr key={formIndex} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium text-blue-600">{form.form}</td>
                          <td className="py-3 px-4 text-gray-600">{form.description}</td>
                          <td className="py-3 px-4 text-right font-semibold">
                            <span className={form.fee === "No fee" ? "text-green-600" : "text-gray-900"}>
                              {form.fee}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
          
          {/* Fee Payment Information */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Payment Information</h3>
            <div className="space-y-2 text-blue-700 text-sm">
              <p>• <strong>Payment Methods:</strong> Check, money order, or credit card (if filing online)</p>
              <p>• <strong>Make checks payable to:</strong> "U.S. Department of Homeland Security"</p>
              <p>• <strong>Fee Waivers:</strong> Available for some forms if you meet income requirements (Form I-912)</p>
              <p>• <strong>Reduced Fees:</strong> Available for some applicants in specific categories</p>
              <p>• <strong>Biometric Services Fee:</strong> $85 additional fee may apply for some applications</p>
            </div>
          </div>
          
          {/* Important Notes */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">Important Notes</h3>
            <ul className="space-y-2 text-yellow-700 text-sm">
              <li>• Fees are subject to change - always verify current fees on USCIS.gov</li>
              <li>• Filing fees are generally non-refundable, even if your application is denied</li>
              <li>• Some forms require additional biometric services fees</li>
              <li>• Premium processing is available for some forms for an additional $2,500</li>
              <li>• Fee waivers may be available if you cannot afford the filing fee</li>
            </ul>
          </div>
          
          {/* Official Source */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">For the most current fee information, visit:</p>
            <a 
              href="https://www.uscis.gov/forms/filing-fees" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Official USCIS Fee Schedule
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}