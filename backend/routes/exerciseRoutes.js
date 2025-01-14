const express = require('express');
const router = express.Router();
const { createExercise, getExercises, getExerciseById, deleteExercise } = require('../controllers/exerciseController');

// Crear ejercicio
router.post('/exercises', createExercise);

// Obtener todos los ejercicios
router.get('/exercises', getExercises);

// Obtener un ejercicio por su ID
router.get('/exercises/:id', getExerciseById);

// Eliminar un ejercicio por su ID
router.delete('/exercises/:id', deleteExercise);

module.exports = router;
