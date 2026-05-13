const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../middlewares/auth');

router.get('/', authenticateToken, async (req, res) => {
    try {
        let query = 'SELECT * FROM pdis';
        let params = [];

        if (req.user.role === 'collaborator') {
            query += ' WHERE collaborator_id = $1';
            params = [req.user.id];
        } else if (req.user.role === 'manager') {
            query += ' WHERE manager_id = $1 OR collaborator_id = $1';
            params = [req.user.id];
        }

        const result = await pool.query(query, params);
        
        // TRADUÇÃO: Formatando os PDIs
        const formattedPdis = result.rows.map(p => ({
            id: p.id,
            title: p.title,
            overallDescription: p.overall_description,
            status: p.status,
            startDate: p.start_date,
            dueDate: p.due_date,
            collaboratorId: p.collaborator_id,
            managerId: p.manager_id,
            priority: p.priority,
            progress: p.progress
        }));

        res.json(formattedPdis);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;