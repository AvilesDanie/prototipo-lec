const Exercise = require('../models/exercise');

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
      return res.status(404).json({ error: "Ejercicio no encontrado" });
    }
    res.status(200).json(exercise);
  } catch (error) {
    console.error("Error al obtener ejercicio:", error);
    res.status(500).json({ error: "Error al obtener el ejercicio" });
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

module.exports = { createExercise, getExercises, getExerciseById, deleteExercise };
