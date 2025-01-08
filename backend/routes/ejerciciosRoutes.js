const express = require("express");
const { obtenerEjercicios } = require("../controllers/ejerciciosController");

const router = express.Router();

router.get("/", obtenerEjercicios); // Devuelve ejercicios desde HackerRank

module.exports = router;
