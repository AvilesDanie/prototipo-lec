const axios = require("axios");

const obtenerEjercicios = async (req, res) => {
  try {
    const response = await axios.get("https://api.hackerrank.com/v3/exercises", {
      headers: {
        "X-API-Key": process.env.HACKERRANK_API_KEY, // Tu clave de API de HackerRank
      },
    });

    // Devuelve los ejercicios al frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error obteniendo ejercicios de HackerRank:", error.message);
    res.status(500).json({ error: "No se pudieron obtener los ejercicios" });
  }
};

module.exports = { obtenerEjercicios };
