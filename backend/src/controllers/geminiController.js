const { suggestWithAI } = require('../services/geminiService');

exports.generatePDISuggestion = async (req, res) => {
    try {
        const { prompt, schema } = req.body;
        const result = await suggestWithAI(prompt, schema);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};