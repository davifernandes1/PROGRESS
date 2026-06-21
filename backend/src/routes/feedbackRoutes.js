const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../middlewares/auth');

const formatFeedback = (f) => ({
    id: f.id,
    managerId: f.sender_id,
    collaboratorId: f.receiver_id,
    pdiId: f.pdi_id,
    feedbackText: f.feedback_text,
    type: f.type,
    meetingDate: f.meeting_date,
    dateSubmitted: f.created_at
});

// GET: Listar Feedbacks
router.get('/', authenticateToken, async (req, res) => {
    try {
        let query = 'SELECT * FROM feedbacks';
        let params = [];
        if (req.user.role === 'collaborator') {
            query += ' WHERE receiver_id = $1';
            params = [req.user.id];
        } else if (req.user.role === 'manager') {
            query += ' WHERE sender_id = $1 OR receiver_id = $1';
            params = [req.user.id];
        }
        const result = await pool.query(query, params);
        res.json(result.rows.map(formatFeedback));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST: Criar Feedback
router.post('/', authenticateToken, async (req, res) => {
    const { managerId, collaboratorId, pdiId, feedbackText, type, meetingDate } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO feedbacks (sender_id, receiver_id, pdi_id, feedback_text, type, meeting_date) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [managerId, collaboratorId, pdiId || null, feedbackText, type, meetingDate || null]
        );
        res.status(201).json(formatFeedback(result.rows[0]));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT: Atualizar Feedback
router.put('/:id', authenticateToken, async (req, res) => {
    const { managerId, collaboratorId, pdiId, feedbackText, type, meetingDate } = req.body;
    try {
        const result = await pool.query(
            `UPDATE feedbacks SET sender_id = $1, receiver_id = $2, pdi_id = $3, feedback_text = $4, type = $5, meeting_date = $6 
             WHERE id = $7 RETURNING *`,
            [managerId, collaboratorId, pdiId || null, feedbackText, type, meetingDate || null, req.params.id]
        );
        res.json(formatFeedback(result.rows[0]));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE: Apagar Feedback
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM feedbacks WHERE id = $1', [req.params.id]);
        res.json({ message: 'Feedback removido com sucesso' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;