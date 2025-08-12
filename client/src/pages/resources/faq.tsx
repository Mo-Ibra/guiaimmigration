import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { useLanguage } from "../../components/language-provider";
import { Link } from "wouter";
import { useState } from "react";

export default function FAQ() {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqCategories = [
    {
      category: "General Immigration Questions",
      questions: [
        {
          q: "How long does it take to get a green card?",
          a: "Processing times vary significantly based on your category and country of birth. Family-based cases for immediate relatives typically take 12-24 months, while preference categories can take several years. Employment-based cases range from 1-10+ years depending on category and country."
        },
        {
          q: "Can I travel while my green card application is pending?",
          a: "Yes, but you need advance parole (Form I-131) to re-enter the U.S. without abandoning your application. Apply for this document before traveling, as processing takes 4-6 months."
        },
        {
          q: "What happens if USCIS requests more evidence (RFE)?",
          a: "You typically have 87 days to respond to an RFE. Provide exactly what they request with clear documentation. If you can't obtain certain documents, explain why and provide alternative evidence."
        },
        {
          q: "Can I work while my green card application is pending?",
          a: "You need work authorization (Form I-765) unless you already have a valid work visa. The work permit typically takes 3-5 months to process and is valid for 1-2 years."
        }
      ]
    },
    {
      category: "Family-Based Immigration",
      questions: [
        {
          q: "Who can petition for family members?",
          a: "U.S. citizens can petition for spouses, unmarried children of any age, married children, parents (if citizen is 21+), and siblings. Permanent residents can petition for spouses and unmarried children only."
        },
        {
          q: "What is the difference between immediate relatives and preference categories?",
          a: "Immediate relatives (spouses, unmarried children under 21, and parents of U.S. citizens) have no numerical limits and shorter wait times. Preference categories have annual limits and longer wait times."
        },
        {
          q: "Can I petition for my stepchild or adopted child?",
          a: "Yes, but the relationship must have been established before the child turned 18. You need to provide evidence of the parent-child relationship and that it was established before age 18."
        }
      ]
    },
    {
      category: "Employment-Based Immigration",
      questions: [
        {
          q: "Do I need a job offer for employment-based green card?",
          a: "Most categories require a job offer and employer sponsorship. Exceptions include EB-1A (extraordinary ability), EB-1B (outstanding researchers), and EB-2 NIW (national interest waiver) where you can self-petition."
        },
        {
          q: "What is PERM labor certification?",
          a: "PERM is the process where employers must test the U.S. job market and prove no qualified U.S. workers are available for the position. Required for most EB-2 and EB-3 cases."
        },
        {
          q: "Can I change employers during green card process?",
          a: "It depends on the stage. Generally, you can change employers 180+ days after I-485 filing if the new job is same/similar. Earlier changes may require starting the process over."
        }
      ]
    },
    {
      category: "Naturalization",
      questions: [
        {
          q: "When can I apply for U.S. citizenship?",
          a: "Generally 5 years after becoming a permanent resident (3 years if married to U.S. citizen). You must also meet physical presence, English, and civics requirements."
        },
        {
          q: "What if I fail the naturalization test?",
          a: "You get a second chance to retake the portion you failed. If you fail both attempts, you must reapply and pay the fee again, but there's no waiting period to reapply."
        },
        {
          q: "Do I need to give up my original citizenship?",
          a: "The U.S. doesn't require you to give up other citizenships, but some countries don't allow dual citizenship. Check with your home country's laws."
        }
      ]
    },
    {
      category: "Common Issues",
      questions: [
        {
          q: "What if my case is taking longer than normal processing times?",
          a: "You can submit a case inquiry if your case is outside normal processing times. Check current processing times on the USCIS website for your service center and form type."
        },
        {
          q: "Can I appeal if my application is denied?",
          a: "Appeal options depend on the type of case. Some denials can be appealed, others require filing a motion to reopen/reconsider, and some require starting over. Check your denial notice for specific options."
        },
        {
          q: "What if I made a mistake on my application?",
          a: "Minor errors can sometimes be corrected at interview or through a motion. Significant errors may require withdrawal and refiling. Never ignore mistakes - address them proactively."
        }
      ]
    }
  ];

  const faqCategoriesEs = [
    {
      category: "Preguntas Generales de Inmigración",
      questions: [
        {
          q: "¿Cuánto tiempo toma obtener una tarjeta verde?",
          a: "Los tiempos de procesamiento varían significativamente según su categoría y país de nacimiento. Los casos familiares para parientes inmediatos típicamente toman 12-24 meses, mientras que las categorías de preferencia pueden tomar varios años. Los casos basados en empleo van de 1-10+ años dependiendo de la categoría y país."
        },
        {
          q: "¿Puedo viajar mientras mi solicitud de tarjeta verde está pendiente?",
          a: "Sí, pero necesita permiso de viaje anticipado (Formulario I-131) para reingresar a EE.UU. sin abandonar su solicitud. Solicite este documento antes de viajar, ya que el procesamiento toma 4-6 meses."
        },
        {
          q: "¿Qué pasa si USCIS solicita más evidencia (RFE)?",
          a: "Típicamente tiene 87 días para responder a un RFE. Proporcione exactamente lo que solicitan con documentación clara. Si no puede obtener ciertos documentos, explique por qué y proporcione evidencia alternativa."
        },
        {
          q: "¿Puedo trabajar mientras mi solicitud de tarjeta verde está pendiente?",
          a: "Necesita autorización de trabajo (Formulario I-765) a menos que ya tenga una visa de trabajo válida. El permiso de trabajo típicamente toma 3-5 meses en procesar y es válido por 1-2 años."
        }
      ]
    },
    {
      category: "Inmigración Basada en Familia",
      questions: [
        {
          q: "¿Quién puede hacer petición para miembros de la familia?",
          a: "Los ciudadanos estadounidenses pueden hacer petición para cónyuges, hijos solteros de cualquier edad, hijos casados, padres (si el ciudadano tiene 21+), y hermanos. Los residentes permanentes pueden hacer petición solo para cónyuges e hijos solteros."
        },
        {
          q: "¿Cuál es la diferencia entre parientes inmediatos y categorías de preferencia?",
          a: "Los parientes inmediatos (cónyuges, hijos solteros menores de 21, y padres de ciudadanos estadounidenses) no tienen límites numéricos y tiempos de espera más cortos. Las categorías de preferencia tienen límites anuales y tiempos de espera más largos."
        },
        {
          q: "¿Puedo hacer petición para mi hijastro o hijo adoptado?",
          a: "Sí, pero la relación debe haberse establecido antes de que el niño cumpliera 18 años. Necesita proporcionar evidencia de la relación padre-hijo y que se estableció antes de los 18 años."
        }
      ]
    },
    {
      category: "Inmigración Basada en Empleo",
      questions: [
        {
          q: "¿Necesito una oferta de trabajo para la tarjeta verde basada en empleo?",
          a: "La mayoría de categorías requieren una oferta de trabajo y patrocinio del empleador. Las excepciones incluyen EB-1A (habilidad extraordinaria), EB-1B (investigadores destacados), y EB-2 NIW (exención de interés nacional) donde puede hacer autopetición."
        },
        {
          q: "¿Qué es la certificación laboral PERM?",
          a: "PERM es el proceso donde los empleadores deben probar el mercado laboral estadounidense y demostrar que no hay trabajadores estadounidenses calificados disponibles para el puesto. Requerido para la mayoría de casos EB-2 y EB-3."
        },
        {
          q: "¿Puedo cambiar de empleador durante el proceso de tarjeta verde?",
          a: "Depende de la etapa. Generalmente, puede cambiar empleadores 180+ días después de presentar I-485 si el nuevo trabajo es igual/similar. Cambios anteriores pueden requerir comenzar el proceso de nuevo."
        }
      ]
    },
    {
      category: "Naturalización",
      questions: [
        {
          q: "¿Cuándo puedo solicitar la ciudadanía estadounidense?",
          a: "Generalmente 5 años después de convertirse en residente permanente (3 años si está casado con ciudadano estadounidense). También debe cumplir con los requisitos de presencia física, inglés y educación cívica."
        },
        {
          q: "¿Qué pasa si fallo el examen de naturalización?",
          a: "Tiene una segunda oportunidad para retomar la parte que falló. Si falla ambos intentos, debe volver a solicitar y pagar la tarifa de nuevo, pero no hay período de espera para volver a solicitar."
        },
        {
          q: "¿Necesito renunciar a mi ciudadanía original?",
          a: "EE.UU. no requiere que renuncie a otras ciudadanías, pero algunos países no permiten ciudadanía dual. Consulte con las leyes de su país de origen."
        }
      ]
    },
    {
      category: "Problemas Comunes",
      questions: [
        {
          q: "¿Qué pasa si mi caso está tomando más tiempo que los tiempos normales de procesamiento?",
          a: "Puede enviar una consulta de caso si su caso está fuera de los tiempos normales de procesamiento. Verifique los tiempos actuales de procesamiento en el sitio web de USCIS para su centro de servicio y tipo de formulario."
        },
        {
          q: "¿Puedo apelar si mi solicitud es negada?",
          a: "Las opciones de apelación dependen del tipo de caso. Algunas negaciones pueden ser apeladas, otras requieren presentar una moción para reabrir/reconsiderar, y algunas requieren comenzar de nuevo. Revise su aviso de negación para opciones específicas."
        },
        {
          q: "¿Qué pasa si cometí un error en mi solicitud?",
          a: "Los errores menores a veces pueden corregirse en la entrevista o a través de una moción. Los errores significativos pueden requerir retiro y volver a presentar. Nunca ignore los errores - abórdelos proactivamente."
        }
      ]
    }
  ];

  const currentFaqCategories = language === 'es' ? faqCategoriesEs : faqCategories;

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const index = categoryIndex * 1000 + questionIndex;
    setOpenIndex(openIndex === index ? null : index);
  };

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("faqTitle")}</h1>
            <p className="text-xl text-gray-600">
              {t("faqSubtitle")}
            </p>
          </div>
          
          <div className="space-y-8">
            {currentFaqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {category.category}
                </h2>
                
                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const index = categoryIndex * 1000 + questionIndex;
                    const isOpen = openIndex === index;
                    
                    return (
                      <div key={questionIndex} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">
                            {faq.q}
                          </span>
                          <svg
                            className={`w-5 h-5 text-gray-500 transition-transform ${
                              isOpen ? 'transform rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Still Have Questions */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Still Have Questions?</h3>
            <p className="text-blue-700 mb-6">
              Can't find the answer you're looking for? Our team is here to help with you non-legal immigration questions.
            </p>
            <Link href="/#contact">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Contact Us
              </button>
            </Link>
          </div>
          
          {/* Legal Disclaimer */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Legal Disclaimer</h3>
            <p className="text-yellow-700 text-sm">
              This FAQ is for educational purposes only and does not constitute legal advice. 
              Immigration law is complex and individual cases vary significantly. Always consult with a qualified 
              immigration attorney for advice specific to your situation.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}