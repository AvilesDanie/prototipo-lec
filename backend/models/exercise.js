const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  codewarsId: { type: String, unique: true, required: true },
  difficulty: { type: String, required: true },
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
