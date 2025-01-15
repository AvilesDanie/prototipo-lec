const User = require('../models/user');

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { username, level, experiencePoints, completedChallenges, progress } = req.body;
    const newUser = new User({ username, level, experiencePoints, completedChallenges, progress });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

// Obtener un usuario por su ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

// Eliminar un usuario por su ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

// Actualizar los puntos de experiencia y nivel de un usuario
const updateUser = async (req, res) => {
  try {
    const { experiencePoints, level } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.experiencePoints = experiencePoints;
    user.level = level;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Actualizar el nivel y puntos del usuario
const updateUserProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { experiencePoints,idExercice} = req.body; // Suponiendo que solo pasas los puntos de experiencia

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.experiencePoints += experiencePoints;
    user.level = Math.floor(user.experiencePoints / 1000);
    user.completedChallenges.push(idExercice);
    user.progress = Math.min((user.completedChallenges.length * 100) / 10, 100);  // Asegúrate de que el progreso no supere 100

    await user.save();
    console.log(req.body); 
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user progress', error: err });
  }
};


module.exports = { createUser, getUsers, getUserById, deleteUser, updateUser, updateUserProgress  };
