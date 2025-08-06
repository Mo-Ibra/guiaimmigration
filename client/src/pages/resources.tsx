import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useLanguage } from "../components/language-provider";
import { Link } from "wouter";

export default function Resources() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("resourcesTitle")}</h1>
            <p className="text-xl text-gray-600 mb-8">
              {t("resourcesSubtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/resources/glossary">
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="text-blue-600 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">{t("glossaryTitle")}</h3>
                <p className="text-gray-600 mb-4">{t("resourcesGlossaryDesc")}</p>
                <div className="text-blue-600 group-hover:text-blue-700 font-medium">{t("resourcesLearnMore")}</div>
              </div>
            </Link>
            
            <Link href="/resources/filing-order">
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="text-blue-600 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">{t("filingOrderTitle")}</h3>
                <p className="text-gray-600 mb-4">{t("resourcesFilingOrderDesc")}</p>
                <div className="text-blue-600 group-hover:text-blue-700 font-medium">{t("resourcesViewOrder")}</div>
              </div>
            </Link>
            
            <Link href="/resources/common-mistakes">
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="text-red-600 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">{t("commonMistakesTitle")}</h3>
                <p className="text-gray-600 mb-4">{t("resourcesCommonMistakesDesc")}</p>
                <div className="text-blue-600 group-hover:text-blue-700 font-medium">{t("resourcesAvoidMistakes")}</div>
              </div>
            </Link>
            
            <Link href="/resources/fees">
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="text-green-600 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">{t("filingFeesTitle")}</h3>
                <p className="text-gray-600 mb-4">{t("resourcesFilingFeesDesc")}</p>
                <div className="text-blue-600 group-hover:text-blue-700 font-medium">{t("resourcesViewFees")}</div>
              </div>
            </Link>
            
            <Link href="/translations">
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="text-purple-600 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">{t("translationsTitle")}</h3>
                <p className="text-gray-600 mb-4">{t("resourcesTranslationDesc")}</p>
                <div className="text-blue-600 group-hover:text-blue-700 font-medium">{t("resourcesGetTranslation")}</div>
              </div>
            </Link>
            
            <Link href="/resources/faq">
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="text-orange-600 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">{t("faqTitle")}</h3>
                <p className="text-gray-600 mb-4">{t("resourcesFaqDesc")}</p>
                <div className="text-blue-600 group-hover:text-blue-700 font-medium">{t("resourcesReadFaq")}</div>
              </div>
            </Link>
          </div>
          
          {/* Additional Resources Section */}
          <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6">{t("additionalResources")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">{t("freeChecklists")}</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><Link href="/free-forms" className="hover:text-blue-600">{t("freeFormsLink")}</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t("officialUscisLinks")}</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><a href="https://www.uscis.gov/forms" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">{t("downloadOfficialForms")}</a></li>
                    <li><a href="https://egov.uscis.gov/processing-times/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">{language === 'es' ? 'Verificar Tiempos de Procesamiento' : 'Check Processing Times'}</a></li>
                    <li><a href="https://www.uscis.gov/about-us/find-a-uscis-office" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">{language === 'es' ? 'Encontrar Oficinas de USCIS' : 'Find USCIS Offices'}</a></li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">{language === 'es' ? 'Descargo de Responsabilidad Legal' : 'Legal Disclaimer'}</h3>
                <p className="text-sm text-gray-600">
                  {language === 'es' 
                    ? 'Guía Inmigración no es un bufete de abogados y no proporciona asesoría legal. Nuestros recursos son solo para fines educativos. Recomendamos encarecidamente consultar con un abogado de inmigración calificado para asesoría legal específica a su situación.'
                    : 'Guia Immigration is not a law firm and does not provide legal advice. Our resources are for educational purposes only. We strongly recommend consulting with a qualified immigration attorney for legal advice specific to your situation.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}