import { ExternalLink, FileText, Globe, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "./language-provider";

export function Resources() {
  const { t } = useLanguage();
  return (
    <section id="resources" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            {t("essentialResources")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("essentialResourcesDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* I-864P Poverty Guidelines */}
          <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{t("i864Guidelines")}</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {t("i864Desc")}
            </p>
            
            <a 
              href="https://www.uscis.gov/i-864p" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block w-full"
            >
              <Button className="w-full bg-green-600 hover:bg-green-700">
                View Poverty Guidelines
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>

          {/* USCIS Website */}
          <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{t("officialUscis")}</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {t("officialUscisDesc")}
            </p>
            
            <a 
              href="https://www.uscis.gov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block w-full"
            >
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Visit USCIS.gov
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>

          {/* USCIS Online Filing Portal */}
          <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 rounded-full p-3 mr-4">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{t("onlineFiling")}</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {t("onlineFilingDesc")}
            </p>
            
            <a 
              href="https://myaccount.uscis.gov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block w-full"
            >
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Access Online Filing
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  {t("essentialResourcesDisclaimer")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}