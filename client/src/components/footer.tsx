import { useLanguage } from "./language-provider";
import logoImage from "../assets/image_1751031851986.png";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Legal Disclaimer */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-red-800 mb-3">
            {t("legalDisclaimer")}
          </h3>
          <p className="text-red-700 text-sm leading-relaxed">
            {t("disclaimerText")}
          </p>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              {t("siteName")}
            </h3>
            <p className="text-gray-300 mb-4">
              {t("tagline")}
            </p>
            {/* Logo */}
            <div className="flex justify-start">
              <img
                src={logoImage}
                alt="Guia Immigration - Immigration made easy. Para todos."
                className="w-48 h-auto object-contain"
              />
            </div>
          </div>

          {/* Our Guides */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Guides</h4>
            <ul className="space-y-2">
              <li>
                <a href="/forms?form=i-130" className="text-gray-300 hover:text-white transition-colors">
                  Form I-130
                </a>
              </li>
              <li>
                <a href="/forms?form=i-485" className="text-gray-300 hover:text-white transition-colors">
                  Form I-485
                </a>
              </li>
              <li>
                <a href="/forms?form=n-400" className="text-gray-300 hover:text-white transition-colors">
                  Form N-400
                </a>
              </li>
              <li>
                <a href="/forms?form=i-751" className="text-gray-300 hover:text-white transition-colors">
                  Form I-751
                </a>
              </li>
              <li>
                <a href="/forms" className="text-gray-300 hover:text-white transition-colors">
                  All Products
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="/#live-data" className="text-gray-300 hover:text-white transition-colors">
                  USCIS Office Locator
                </a>
              </li>
              <li>
                <a href="/#live-data" className="text-gray-300 hover:text-white transition-colors">
                  Processing Times
                </a>
              </li>
              <li>
                <a href="/#live-data" className="text-gray-300 hover:text-white transition-colors">
                  Current Filing Fees
                </a>
              </li>
              <li>
                <a href="/free-forms" className="text-gray-300 hover:text-white transition-colors">
                  Free Checklists
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/#contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/resources/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/testimonials" className="text-gray-300 hover:text-white transition-colors">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 {t("siteName")}. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}