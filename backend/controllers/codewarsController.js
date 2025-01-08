const axios = require("axios");

// Obtener lista de ejercicios completados por el usuario
const obtenerEjerciciosCompletados = async (req, res) => {
  const username = req.params.username; // Usuario de Codewars
  try {
    const response = await axios.get(`https://www.codewars.com/api/v1/users/${username}/code-challenges/completed?page=0`);
    res.json(response.data.data); // Devuelve solo la lista de ejercicios
  } catch (error) {
    console.error("Error obteniendo ejercicios completados:", error.message);
    res.status(500).json({ error: "No se pudieron obtener los ejercicios de Codewars" });
  }
};

// Obtener los detalles de un ejercicio específico
const obtenerEjercicioPorID = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.codewars.com/api/v1/code-challenges/${id}`);
    res.json(response.data); // Devuelve los detalles del ejercicio
  } catch (error) {
    console.error(`Error obteniendo el ejercicio con ID ${id}:`, error.message);
    res.status(404).json({ error: "Ejercicio no encontrado" });
  }
};

module.exports = { obtenerEjerciciosCompletados, obtenerEjercicioPorID };
