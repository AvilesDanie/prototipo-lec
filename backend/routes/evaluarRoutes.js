const express = require("express");
const { evaluarCodigo } = require("../controllers/evaluarController");

const router = express.Router();

router.post("/", evaluarCodigo);

module.exports = router;
