const { GoogleGenerativeAI } = require("@google/generative-ai");

const suggestWithAI = async (prompt, schema, temperature = 0.9) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            const generationConfig = { temperature, responseMimeType: "application/json", responseSchema: schema };
            const model = genAI.getGenerativeModel({ model: modelName, generationConfig });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            
            const cleanText = text.replace(/```json|```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (error) {
            lastError = error;
        }
    }
    throw new Error(`Falha na IA: ${lastError.message}`);
};

module.exports = { suggestWithAI };