import api from './axios';

export const suggestWithAI = async (prompt, schema) => {
    try {
        const response = await api.post('/gemini/suggest', { prompt, schema });
        return response.data;
    } catch (error) {
        console.error("Falha ao contactar a IA no backend:", error);
        throw new Error("Não foi possível gerar a sugestão.");
    }
};