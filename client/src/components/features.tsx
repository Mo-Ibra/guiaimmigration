import { useLanguage } from "./language-provider";
import {
  CheckCircle,
  FileText,
  Globe,
  Clock,
  ArrowRight,
  Star,
} from "lucide-react";

export function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Globe,
      title: t("bilingualSupport"),
      description: t("bilingualDesc"),
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-gradient-to-br from-blue-100 to-cyan-100",
      delay: "0",
    },
    {
      icon: FileText,
      title: t("stepByStep"),
      description: t("stepByStepDesc"),
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-gradient-to-br from-purple-100 to-pink-100",
      delay: "200",
    },
    {
      icon: Clock,
      title: t("liveUpdates"),
      description: t("liveUpdatesDesc"),
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      iconBg: "bg-gradient-to-br from-green-100 to-emerald-100",
      delay: "400",
    },
    {
      icon: CheckCircle,
      title: t("aiHelp"),
      description: t("aiHelpDesc"),
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      iconBg: "bg-gradient-to-br from-orange-100 to-red-100",
      delay: "600",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl -translate-x-1/2"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-blue-400/30 rounded-full"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-purple-400/30 rounded-full-delay-1"></div>
        <div className="absolute bottom-32 left-1/3 w-4 h-4 bg-green-400/30 rounded-full-delay-2"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-orange-400/30 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-blue-700 border border-blue-200/50 shadow-sm mb-6">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            {t("whyChooseUs") || "Why Choose Us"}
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            {t("featuresTitle") || "Powerful Features"}
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-6 rounded-full"></div>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("featuresSubtitle") ||
              "Everything you need to navigate your immigration journey with confidence and ease"}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div
                  className={`relative h-full bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm rounded-2xl p-8 text-center border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2`}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                  ></div>

                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div
                      className={`${feature.iconBg} rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <IconComponent
                        className="w-10 h-10 text-black"
                      />
                    </div>

                    {/* Floating ring effect */}
                    <div
                      className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-2xl border-2 border-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500`}
                    ></div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Learn more link */}
                    <div className="inline-flex items-center text-sm font-medium bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      {t("learnMore") || "Learn More"}
                      <ArrowRight className="w-4 h-4 ml-1 text-gray-600 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Corner decoration */}
                  <div
                    className={`absolute top-4 right-4 w-6 h-6 bg-gradient-to-br ${feature.gradient} opacity-20 rounded-full group-hover:opacity-40 group-hover:scale-150 transition-all duration-500`}
                  ></div>
                </div>

                {/* Background glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl rounded-2xl transition-opacity duration-500 -z-10`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 border border-gray-200 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 cursor-pointer group">
            <span className="text-sm font-medium mr-2">
              Ready to get started?
            </span>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </section>
  );
}
