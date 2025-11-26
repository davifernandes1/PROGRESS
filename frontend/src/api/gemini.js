import { GoogleGenerativeAI } from "@google/generative-ai";

export const suggestWithAI = async (prompt, schema, apiKey, temperature = 0.9) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    
    const modelsToTry = [
        "gemini-2.0-flash",       
        "gemini-2.5-flash",       
        "gemini-flash-latest",    
        "gemini-pro-latest"       
    ];

    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Tentando conectar com modelo: ${modelName}...`);
            
        
            const generationConfig = {
                temperature: temperature,
                responseMimeType: "application/json", 
                responseSchema: schema 
            };

            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: generationConfig
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log(`Sucesso com o modelo: ${modelName}`);
            
            
            const cleanText = text.replace(/```json|```/g, '').trim();
            
            return JSON.parse(cleanText);

        } catch (error) {
            console.warn(`Falha ao usar ${modelName}:`, error.message);
            lastError = error;
           
        }
    }

   
    console.error("Todos os modelos falharam. Último erro:", lastError);
    throw new Error(`Falha na IA. Nenhum modelo disponível respondeu. Verifique o console.`);
};