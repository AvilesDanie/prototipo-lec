const mongoose = require("mongoose");

const EjercicioSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  solucion: { type: String, required: true },
  lenguaje: { type: String, required: true }, // Lenguaje esperado (ej. "Python")
});

module.exports = mongoose.model("Ejercicio", EjercicioSchema);
