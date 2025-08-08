import { Request, Response } from "express";

export const AIChatRoute = async (req: Request, res: Response) => {
  try {
    const { message, language } = req.body;

    if (!process.env.PERPLEXITY_API_KEY) {
      throw new Error("Missing PERPLEXITY_API_KEY");
    }

    const systemPrompt =
      language === "es"
        ? "Eres un asistente especializado en inmigración estadounidense. Proporciona información precisa y útil sobre procesos de inmigración, pero siempre recuerda a los usuarios que consulten con un abogado de inmigración calificado para asesoramiento legal específico. No brindes asesoramiento legal directo."
        : "You are a U.S. immigration specialist assistant. Provide accurate and helpful information about immigration processes, but always remind users to consult with a qualified immigration attorney for specific legal advice. Do not provide direct legal advice.";

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.2,
        top_p: 0.9,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse =
      data.choices?.[0]?.message?.content ||
      "I apologize, but I couldn't process your question at this time. Please try again.";

    res.json({ response: aiResponse });
  } catch (error: any) {
    console.error("AI chat error:", error);
    const fallbackResponse =
      req.body.language === "es"
        ? "Lo siento, no pude procesar tu pregunta en este momento. Para obtener asistencia específica con tu caso de inmigración, te recomendamos consultar con un abogado de inmigración calificado."
        : "I apologize, but I couldn't process your question at this time. For specific assistance with your immigration case, we recommend consulting with a qualified immigration attorney.";

    res.json({ response: fallbackResponse });
  }
};
