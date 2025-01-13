const express = require('express');
const router = express.Router();
const { getChallengeById } = require('../controllers/codewarsController');

// Ruta para obtener un desafío por ID desde Codewars
router.get('/codewars/challenge/:id', getChallengeById);

module.exports = router;
