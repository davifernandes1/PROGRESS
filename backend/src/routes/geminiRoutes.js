const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');
const authenticateToken = require('../middlewares/auth');

router.post('/suggest', authenticateToken, geminiController.generatePDISuggestion);

module.exports = router;