const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });

        const dbUser = result.rows[0];
        if (password !== dbUser.password_hash) return res.status(401).json({ error: 'Credenciais inválidas' });

        const token = jwt.sign({ id: dbUser.id, role: dbUser.role, email: dbUser.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
        
        // TRADUÇÃO: Mapeando do PostgreSQL para o formato que o React conhece
        const frontendUser = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            profile: dbUser.role, // O React espera 'profile' em vez de 'role'
            department: dbUser.department,
            jobTitle: dbUser.job_title, // O React espera 'jobTitle'
            managerId: dbUser.manager_id,
            createdAt: dbUser.created_at,
            status: 'active',
            roleDescription: dbUser.role === 'admin' ? 'Admin' : dbUser.role === 'manager' ? 'Gestor' : 'Colaborador'
        };

        res.json({ user: frontendUser, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;