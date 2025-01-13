const Exercise = require('../models/exercise');

const createExercise = async (req, res) => {
  try {
    const { codewarsId, difficulty } = req.body;
    const exercise = new Exercise({ codewarsId, difficulty });
    await exercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ error: 'Error creating exercise' });
  }
};

module.exports = { createExercise };
