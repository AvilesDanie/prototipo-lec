const axios = require('axios');

// Controlador para obtener un desafío desde la API de Codewars por su ID
const getChallengeById = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://www.codewars.com/api/v1/code-challenges/${id}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching from Codewars API:', error);
    res.status(500).json({ error: 'Error fetching challenge from Codewars' });
  }
};

module.exports = { getChallengeById };
