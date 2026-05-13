const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/auth');
const { authorizeRole } = require('../middlewares/roles');

// Apenas Admin e Manager podem listar e criar utilizadores
router.get('/', authenticateToken, authorizeRole('admin', 'manager'), userController.getAllUsers);
router.post('/', authenticateToken, authorizeRole('admin'), userController.createUser);
router.delete('/:id', authenticateToken, authorizeRole('admin'), userController.deleteUser);

module.exports = router;