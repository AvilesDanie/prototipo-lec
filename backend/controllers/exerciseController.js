const Exercise = require('../models/exercise');
const axios = require('axios');

// Crear un nuevo ejercicio
const createExercise = async (req, res) => {
  try {
    const { codewarsId, difficulty, answer } = req.body;
    const newExercise = new Exercise({ codewarsId, difficulty, answer });
    await newExercise.save();
    res.status(201).json(newExercise);
  } catch (error) {
    console.error("Error al crear ejercicio:", error);
    res.status(500).json({ error: "Error al crear el ejercicio" });
  }
};

// Obtener todos los ejercicios
const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.status(200).json(exercises);
  } catch (error) {
    console.error("Error al obtener los ejercicios:", error);
    res.status(500).json({ error: "Error al obtener los ejercicios" });
  }
};

// Obtener un ejercicio por su ID
const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Obtener detalles del ejercicio desde Codewars usando el codewarsId
    const codewarsResponse = await axios.get(`https://www.codewars.com/api/v1/code-challenges/${exercise.codewarsId}`);
    const codewarsData = codewarsResponse.data;

    res.json({
      name: codewarsData.name,
      description: codewarsData.description,
      answer: exercise.answer // La respuesta para los diferentes lenguajes
    });
  } catch (error) {
    console.error('Error fetching exercise:', error);
    res.status(500).json({ message: 'Error fetching exercise details' });
  }
};

// Eliminar un ejercicio por su ID
const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: "Ejercicio no encontrado" });
    }
    res.status(200).json({ message: "Ejercicio eliminado" });
  } catch (error) {
    console.error("Error al eliminar ejercicio:", error);
    res.status(500).json({ error: "Error al eliminar el ejercicio" });
  }
};

// Obtener la lista de ejercicios con información de Codewars
const getExercisesWithDetails = async (req, res) => {
  try {
    const exercises = await Exercise.find(); // Obtiene todos los ejercicios de la base de datos
    const exerciseDetails = await Promise.all(
      exercises.map(async (exercise) => {
        const response = await axios.get(`https://www.codewars.com/api/v1/code-challenges/${exercise.codewarsId}`);
        return {
          ...exercise.toObject(),
          codewarsDetails: response.data, // Detalles del ejercicio desde Codewars
        };
      })
    );
    res.status(200).json(exerciseDetails);
  } catch (error) {
    console.error("Error al obtener detalles de los ejercicios:", error);
    res.status(500).json({ error: "Error al obtener detalles de los ejercicios" });
  }
};

// Obtener un ejercicio por su codewarsId
const getExerciseByCodewarsId = async (req, res) => {
  try {
    const { codewarsId } = req.params;
    const exercise = await Exercise.findOne({ codewarsId });  // Buscar por el codewarsId

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.status(200).json(exercise);  // Responder con el ejercicio encontrado
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving exercise', error: err });
  }
};

module.exports = { createExercise, getExercises, getExerciseById, deleteExercise, getExercisesWithDetails, getExerciseByCodewarsId };
