const express = require('express');
const router = express.Router();
const { evaluarCodigo } = require('../controllers/codeEvaluationController');

// Ruta para evaluar el código
router.post('/evaluate-code', evaluarCodigo);

module.exports = router;
