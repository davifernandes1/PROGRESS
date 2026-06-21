const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../middlewares/auth');

// Converter do banco para o formato do React
const formatPdi = (p) => ({
    id: p.id,
    title: p.title,
    overallDescription: p.overall_description,
    status: p.status,
    startDate: p.start_date,
    dueDate: p.due_date,
    collaboratorId: p.collaborator_id,
    managerId: p.manager_id,
    priority: p.priority,
    progress: p.progress,
    objectives: p.objectives || []
});

// GET: Listar PDIs e seus Objetivos
router.get('/', authenticateToken, async (req, res) => {
    try {
        let query = `
            SELECT p.*,
                   COALESCE(
                       (SELECT json_agg(json_build_object(
                           'id', o.id,
                           'text', o.description,
                           'status', o.status,
                           'activityType', o.activity_type,
                           'estimatedDurationDays', o.estimated_duration_days
                       )) FROM pdi_objectives o WHERE o.pdi_id = p.id),
                       '[]'::json
                   ) AS objectives
            FROM pdis p
        `;
        let params = [];

        if (req.user.role === 'collaborator') {
            query += ' WHERE p.collaborator_id = $1';
            params = [req.user.id];
        } else if (req.user.role === 'manager') {
            query += ' WHERE p.manager_id = $1 OR p.collaborator_id = $1';
            params = [req.user.id];
        }

        const result = await pool.query(query, params);
        res.json(result.rows.map(formatPdi));
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// POST: Criar PDI e gravar os Objetivos
router.post('/', authenticateToken, async (req, res) => {
    const { title, overallDescription, status, startDate, dueDate, collaboratorId, managerId, priority, progress, objectives } = req.body;
    
    // Inicia uma Transação de Banco de Dados
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Garante que não vem 'Pendente' e falhe a restrição do DB
        let dbStatus = status;
        if (dbStatus === 'Pendente') dbStatus = 'Não Iniciado';

        const pdiRes = await client.query(
            `INSERT INTO pdis (title, overall_description, status, start_date, due_date, collaborator_id, manager_id, priority, progress) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [title, overallDescription, dbStatus || 'Não Iniciado', startDate, dueDate, collaboratorId, managerId, priority || 'Média', progress || 0]
        );
        const newPdi = pdiRes.rows[0];

        // Se houver objetivos enviados pelo Frontend, insere-os na tabela de objetivos
        const savedObjectives = [];
        if (objectives && objectives.length > 0) {
            for (const obj of objectives) {
                if (!obj.text) continue; // Pula se estiver vazio
                const objRes = await client.query(
                    `INSERT INTO pdi_objectives (pdi_id, description, status, activity_type, estimated_duration_days) 
                     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                    [newPdi.id, obj.text, obj.status || 'pendente', obj.activityType, obj.estimatedDurationDays || null]
                );
                savedObjectives.push({
                    id: objRes.rows[0].id, text: objRes.rows[0].description, 
                    status: objRes.rows[0].status, activityType: objRes.rows[0].activity_type, 
                    estimatedDurationDays: objRes.rows[0].estimated_duration_days
                });
            }
        }

        await client.query('COMMIT'); // Salva Tudo
        res.status(201).json(formatPdi({ ...newPdi, objectives: savedObjectives }));
    } catch (err) { 
        await client.query('ROLLBACK'); // Desfaz Tudo se der erro
        res.status(500).json({ error: err.message }); 
    } finally {
        client.release();
    }
});

// PUT: Atualizar PDI e Objetivos
router.put('/:id', authenticateToken, async (req, res) => {
    const { title, overallDescription, status, startDate, dueDate, collaboratorId, managerId, priority, progress, objectives } = req.body;
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let dbStatus = status;
        if (dbStatus === 'Pendente') dbStatus = 'Não Iniciado';

        const pdiRes = await client.query(
            `UPDATE pdis SET title = $1, overall_description = $2, status = $3, start_date = $4, due_date = $5, collaborator_id = $6, manager_id = $7, priority = $8, progress = $9 
             WHERE id = $10 RETURNING *`,
            [title, overallDescription, dbStatus, startDate, dueDate, collaboratorId, managerId, priority, progress, req.params.id]
        );

        if (pdiRes.rows.length === 0) throw new Error('PDI não encontrado');
        const updatedPdi = pdiRes.rows[0];

        // Apaga os objetivos antigos e insere os novos atualizados
        await client.query('DELETE FROM pdi_objectives WHERE pdi_id = $1', [req.params.id]);
        
        const savedObjectives = [];
        if (objectives && objectives.length > 0) {
            for (const obj of objectives) {
                if (!obj.text) continue;
                const objRes = await client.query(
                    `INSERT INTO pdi_objectives (pdi_id, description, status, activity_type, estimated_duration_days) 
                     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                    [updatedPdi.id, obj.text, obj.status || 'pendente', obj.activityType, obj.estimatedDurationDays || null]
                );
                savedObjectives.push({
                    id: objRes.rows[0].id, text: objRes.rows[0].description, 
                    status: objRes.rows[0].status, activityType: objRes.rows[0].activity_type, 
                    estimatedDurationDays: objRes.rows[0].estimated_duration_days
                });
            }
        }

        await client.query('COMMIT');
        res.json(formatPdi({ ...updatedPdi, objectives: savedObjectives }));
    } catch (err) { 
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message }); 
    } finally {
        client.release();
    }
});

// DELETE: Apagar PDI
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM pdis WHERE id = $1', [req.params.id]);
        res.json({ message: 'PDI removido com sucesso' });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

module.exports = router;