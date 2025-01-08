const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/prototipo")
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));


// Rutas
const ejerciciosRoutes = require("./routes/ejerciciosRoutes");
const evaluarRoutes = require("./routes/evaluarRoutes");
const codewarsRoutes = require("./routes/codewarsRoutes");
app.use("/api/codewars", codewarsRoutes);
app.use("/api/ejercicios", ejerciciosRoutes);
app.use("/api/evaluar", evaluarRoutes);

// Inicio del servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
