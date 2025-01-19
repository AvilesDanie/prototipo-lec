const express = require('express');
const router = express.Router();
const { createExercise, getExercises, getExerciseById, deleteExercise, getExercisesWithDetails, getExerciseByCodewarsId, getRecommendedExercises } = require('../controllers/exerciseController');

// Obtener lista de ejercicios con detalles de Codewars
router.get('/exercises/details', getExercisesWithDetails);

// Crear ejercicio
router.post('/exercises', createExercise);

// Obtener todos los ejercicios
router.get('/exercises', getExercises);

// Obtener un ejercicio por su ID
router.get('/exercises/:id', getExerciseById);

// Eliminar un ejercicio por su ID
router.delete('/exercises/:id', deleteExercise);

// Obtener ejercicio por codewarsId
router.get('/exercises/codewars/:codewarsId', getExerciseByCodewarsId);

// Obtener ejercicios recomendados para un usuario
router.get('/exercises/recommendations/:userId', getRecommendedExercises);

module.exports = router;
