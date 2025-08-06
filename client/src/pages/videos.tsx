import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useLanguage } from "../components/language-provider";

export default function Videos() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("videosTitle")}</h1>
            <p className="text-xl text-gray-600 mb-8">
              {t("videosDesc")}
            </p>
          </div>
          
          <div className="bg-white p-16 rounded-lg shadow-sm text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-semibold text-gray-600 mb-6">{t("comingSoon")}</h2>
              <p className="text-lg text-gray-500 mb-8">
                {t("videosComingSoonDesc")}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">{t("formCompletionGuides")}</h3>
                  <p className="text-gray-600">{t("formCompletionDesc")}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">{t("documentPreparation")}</h3>
                  <p className="text-gray-600">{t("documentPreparationDesc")}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">{t("commonMistakes")}</h3>
                  <p className="text-gray-600">{t("commonMistakesDesc")}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">{t("filingProcess")}</h3>
                  <p className="text-gray-600">{t("filingProcessDesc")}</p>
                </div>
              </div>
              
              <div className="mt-12">
                <p className="text-gray-600 mb-4">{t("notifyAvailable")}</p>
                <div className="flex max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder={t("emailPlaceholder")}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-r-md hover:bg-blue-700 transition-colors">
                    {t("notifyMe")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}