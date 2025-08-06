import { Button } from "./ui/button";
import { useLanguage } from "./language-provider";
import { Globe, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useIsMobile } from "../hooks/use-mobile";
import { useState } from "react";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigation = (path: string, sectionId?: string) => {
    if (path === "/" && sectionId) {
      // Handle scrolling to sections on home page
      if (location !== "/") {
        window.location.href = `/#${sectionId}`;
      } else {
        setTimeout(() => scrollToSection(sectionId), 100);
      }
    }
    // Close mobile menu after navigation
    closeMobileMenu();
  };

  const handleLinkClick = (path: string) => {
    closeMobileMenu();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-blue-600">
                {t("siteName")}
              </h1>
              <p className="text-sm text-black italic -mt-1">
                Recursos Confiables de Inmigración
              </p>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer inline-block">
                  {t("home")}
                </span>
              </Link>
              <Link href="/forms">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer inline-block">
                  {t("guides")}
                </span>
              </Link>
              <Link href="/videos">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer inline-block">
                  {t("videos")}
                </span>
              </Link>
              <Link href="/translations">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer inline-block">
                  {t("translations")}
                </span>
              </Link>
              <Link href="/resources">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer inline-block">
                  {t("resources")}
                </span>
              </Link>
              <Link href="/testimonials">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer inline-block">
                  {t("testimonials")}
                </span>
              </Link>
              <button
                onClick={() => handleNavigation("/", "contact")}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors inline-block"
              >
                {t("contact")}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}

            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {language === "en" ? "ES" : "EN"}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeMobileMenu}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-4 space-y-2">
                <Link href="/" onClick={() => handleLinkClick("/")}>
                  <span className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-md hover:bg-gray-50">
                    {t("home")}
                  </span>
                </Link>
                <Link href="/forms" onClick={() => handleLinkClick("/forms")}>
                  <span className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-md hover:bg-gray-50">
                    {t("guides")}
                  </span>
                </Link>
                <Link href="/videos" onClick={() => handleLinkClick("/videos")}>
                  <span className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-md hover:bg-gray-50">
                    {t("videos")}
                  </span>
                </Link>
                <Link href="/translations" onClick={() => handleLinkClick("/translations")}>
                  <span className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-md hover:bg-gray-50">
                    {t("translations")}
                  </span>
                </Link>
                <Link href="/resources" onClick={() => handleLinkClick("/resources")}>
                  <span className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-md hover:bg-gray-50">
                    {t("resources")}
                  </span>
                </Link>
                <Link href="/testimonials" onClick={() => handleLinkClick("/testimonials")}>
                  <span className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-md hover:bg-gray-50">
                    {t("testimonials")}
                  </span>
                </Link>
                <button
                  onClick={() => handleNavigation("/", "contact")}
                  className="w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-gray-50"
                >
                  {t("contact")}
                </button>
              </nav>

              {/* Language Toggle in Sidebar */}
              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  {language === "en" ? "ES" : "EN"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}