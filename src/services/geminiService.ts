import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  getChatResponse: async (history: { role: string; parts: { text: string }[] }[], message: string, petContext?: string) => {
    try {
      // Map history to the format expected by the SDK
      const contents = history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: msg.parts
      }));

      // Add the new message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contents,
        config: {
          systemInstruction: `Eres VitalPaw Copilot, un asistente experto en salud canina integrado en la app K9 VitalPaw. 
          Tu tono es profesional, empático y clínico, pero accesible. 
          Diseño: Clinical Sanctuary (premium, limpio, sofisticado).
          
          Contexto del perro actual: ${petContext || "No hay perro seleccionado"}.
          
          Reglas:
          1. Proporciona consejos basados en el historial médico si está disponible.
          2. Siempre aclara que no eres un sustituto de un veterinario real.
          3. Si detectas síntomas graves (dificultad respiratoria, convulsiones, sangrado profuso), insta a acudir a urgencias inmediatamente.
          4. Responde en español.
          5. Sé conciso y usa formato markdown para listas o puntos clave.`
        }
      });

      return response.text || "Lo siento, no he podido generar una respuesta.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Lo siento, he tenido un problema al procesar tu consulta. Por favor, inténtalo de nuevo en unos momentos.";
    }
  }
};
