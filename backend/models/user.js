const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  level: {
    type: Number,
    default: 1, // Nivel inicial del usuario
  },
  experiencePoints: {
    type: Number,
    default: 0, // Puntos de experiencia
  },
  completedChallenges: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Exercise',
    },
  ],
  progress: {
    type: Number,
    default: 0, // Progreso total en porcentaje
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tagsWithMistakes: [
    {
      tag: String,
      priority: { type: Number, default: 0 } // La prioridad de los ejercicios relacionados con este tag
    }
  ],  
});

module.exports = mongoose.model('User', userSchema);
