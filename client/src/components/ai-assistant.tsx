import { useState } from "react";
import { useLanguage } from "./language-provider";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { apiRequest } from "../lib/queryClient";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistant() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await apiRequest("POST", "/api/ai-chat", {
        message: userMessage,
        language: language
      });

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant" as const, content: data.response }]);
    } catch (error) {
      const errorMessage = language === "es" 
        ? "Lo siento, ocurrió un error. Por favor intenta de nuevo."
        : "Sorry, an error occurred. Please try again.";
      setMessages([...newMessages, { role: "assistant" as const, content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const exampleQuestions = language === "es" ? [
    "¿Cuáles son los requisitos para la Form I-130?",
    "¿Cuánto tiempo toma el proceso de naturalización?",
    "¿Qué documentos necesito para ajustar mi estatus?"
  ] : [
    "What are the requirements for Form I-130?",
    "How long does the naturalization process take?",
    "What documents do I need for adjustment of status?"
  ];

  return (
    <section id="ai-assistant" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("aiAssistantTitle")}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("aiAssistantDesc")}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === "es" ? "¡Hola! ¿En qué puedo ayudarte?" : "Hello! How can I help you?"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === "es" 
                    ? "Haz una pregunta sobre inmigración o prueba uno de estos ejemplos:"
                    : "Ask an immigration question or try one of these examples:"}
                </p>
                
                <div className="space-y-2">
                  {exampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="block w-full text-left px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 p-6">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={language === "es" ? "Escribe tu pregunta..." : "Type your question..."}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {language === "es" ? "Aviso Importante" : "Important Notice"}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {language === "es" 
                    ? "Este asistente de IA proporciona información general sobre inmigración y no constituye asesoramiento legal. Para asesoramiento específico sobre su caso, consulte siempre con un abogado de inmigración calificado."
                    : "This AI assistant provides general immigration information and does not constitute legal advice. For specific guidance about your case, always consult with a qualified immigration attorney."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}