const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const executionResultRoutes = require('./routes/executionResultRoutes');
const codeEvaluationRoutes = require('./routes/codeEvaluationRoutes'); // Importa las rutas de evaluación de código

const app = express();
app.use(express.json());

connectDB();

app.use('/api', userRoutes);
app.use('/api', exerciseRoutes);
app.use('/api', executionResultRoutes);
app.use('/api', codeEvaluationRoutes); // Agrega las rutas de evaluación de código

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
