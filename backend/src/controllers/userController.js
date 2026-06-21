const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Listar todos os utilizadores (Traduzindo para o formato do Front-end)
exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY name ASC');
        const formattedUsers = result.rows.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            profile: u.role, // Tradução: role -> profile
            department: u.department,
            jobTitle: u.job_title,
            managerId: u.manager_id,
            createdAt: u.created_at,
            status: 'active'
        }));
        res.json(formattedUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Criar novo utilizador
exports.createUser = async (req, res) => {
    const { name, email, password, profile, department, jobTitle, managerId } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || '123456', salt);

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role, department, job_title, manager_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, email, hashedPassword, profile, department, jobTitle, managerId || null]
        );
        
        const newUser = result.rows[0];
        
        // CORREÇÃO: O Front-end agora recebe o departamento e o cargo na mesma hora
        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            profile: newUser.role,
            department: newUser.department,      // <-- Adicionado
            jobTitle: newUser.job_title,         // <-- Adicionado
            managerId: newUser.manager_id,       // <-- Adicionado
            createdAt: newUser.created_at,       // <-- Adicionado
            status: 'active'
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar utilizador: ' + err.message });
    }
};

// Apagar utilizador
exports.deleteUser = async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
        res.json({ message: 'Utilizador removido com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};