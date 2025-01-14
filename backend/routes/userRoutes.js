const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, deleteUser } = require('../controllers/userController');

// Crear usuario
router.post('/users', createUser);

// Obtener todos los usuarios
router.get('/users', getUsers);

// Obtener un usuario por su ID
router.get('/users/:id', getUserById);

// Eliminar un usuario por su ID
router.delete('/users/:id', deleteUser);

module.exports = router;
