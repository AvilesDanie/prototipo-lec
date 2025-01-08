const express = require("express");
const { obtenerEjerciciosCompletados, obtenerEjercicioPorID } = require("../controllers/codewarsController");

const router = express.Router();

// Ruta para obtener ejercicios completados por un usuario
router.get("/:username/completed", obtenerEjerciciosCompletados);

// Ruta para obtener un ejercicio por ID
router.get("/:id", obtenerEjercicioPorID);

module.exports = router;
