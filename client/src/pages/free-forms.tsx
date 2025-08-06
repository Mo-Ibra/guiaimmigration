import { Header } from ".././components/header";
import { Footer } from ".././components/footer";
import { useLanguage } from ".././components/language-provider";
import { Download, FileText, AlertCircle } from "lucide-react";
import { Button } from ".././components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from ".././lib/queryClient";
import type { Guide } from "@shared/schema";

export default function FreeForms() {
  const { t, language } = useLanguage();

  // Fetch free guides (price = 0)
  const { data: allGuides = [], isLoading } = useQuery<Guide[]>({
    queryKey: ["/api/guides"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/guides");
      return response.json();
    },
  });

  // Filter guides with price = 0 (handle both string and number formats)
  const freeGuides = allGuides.filter(guide =>
    parseFloat(guide.price.toString()) === 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t("freeChecklistsTitle")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("freeChecklistsSubtitle")}
            </p>
          </div>

          {/* Coming Soon Notice */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-4">
                  <FileText className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("comingSoon")}
              </h2>
              
              <p className="text-gray-600 mb-8">
                {t("freeChecklistsComingSoon")}
              </p>

              <div className="bg-white rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("availableChecklists")}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading free guides...</p>
                    </div>
                  ) : freeGuides.length > 0 ? (
                    freeGuides.map((guide) => (
                      <div key={guide.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {language === "es" ? guide.titleEs : guide.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {language === "es" ? guide.descriptionEs : guide.description}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (guide.fileContent && guide.fileName) {
                              // Generate download link for free guide
                              try {
                                const response = await apiRequest('POST', '/api/generate-download-link', {
                                  guideId: guide.id,
                                  customerEmail: 'free-access@example.com' // Special email for free access
                                });

                                const data = await response.json();
                                window.open(data.downloadUrl, '_blank');
                              } catch (error) {
                                console.error('Download error:', error);
                                alert('Error downloading file');
                              }
                            } else {
                              // No file available, show message or redirect to guide page
                              alert('This guide is currently being prepared. Please check back soon!');
                            }
                          }}
                          disabled={!guide.fileContent}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {guide.fileContent ? 'Download' : 'Coming Soon'}
                        </Button>
                      </div>
                    ))
                  ) : (
                    // Fallback to hardcoded items when no free guides are available
                    <>
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">{t("i130ChecklistTitle")}</div>
                            <div className="text-sm text-gray-500">{t("i130ChecklistDesc")}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">{t("i485ChecklistTitle")}</div>
                            <div className="text-sm text-gray-500">{t("i485ChecklistDesc")}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">{t("n400ChecklistTitle")}</div>
                            <div className="text-sm text-gray-500">{t("n400ChecklistDesc")}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">{t("i765ChecklistTitle")}</div>
                            <div className="text-sm text-gray-500">{t("i765ChecklistDesc")}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="font-medium text-yellow-800">{t("importantNotice")}</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      {t("importantNoticeText")}
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => window.open('https://www.uscis.gov/forms', '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t("visitUscisFormsPage")}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}