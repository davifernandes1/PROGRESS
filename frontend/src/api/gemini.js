/**
 * Chama a API do Gemini para gerar conteúdo com base em um prompt e um schema JSON.
 * @param {string} prompt - O prompt para a IA.
 * @param {object} schema - O schema JSON que a resposta deve seguir.
 * @param {string} apiKey - A sua chave da API do Google.
 * @param {number} temperature - Um valor entre 0 e 1 para controlar a criatividade da resposta.
 * @returns {Promise<object>} - A resposta JSON parseada da IA.
 */
export const suggestWithAI = async (prompt, schema, apiKey, temperature = 0.9) => {
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: temperature, // Adicionamos o parâmetro de temperatura aqui
        }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Erro da API: ${response.status} - ${errorBody}`);
    }

    const result = await response.json();
    const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) {
        throw new Error("Resposta da IA inválida ou vazia.");
    }

    return JSON.parse(jsonText);
};
