const User = require('../models/user');
const mongoose = require('mongoose');
const Exercise = require('../models/exercise');
const axios = require('axios'); // Asegúrate de importar axios para hacer solicitudes HTTP
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Crear un nuevo usuario
const createUser = async (req, res) => {
  const { username, email, password, level, experiencePoints, progress } = req.body;

  if (!password) {
      return res.status(400).json({ message: "La contraseña es obligatoria" });
  }

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "El usuario ya está registrado" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
          username,
          email,
          password: hashedPassword,
          level,
          experiencePoints,
          progress
      });
      await user.save();

      res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (err) {
      res.status(500).json({ error: err.message });
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
const updateUserProgressUnified = async (req, res) => {
  try {
    const { userId, exerciseId, experiencePoints, successful } = req.body;

    console.log('Datos recibidos en el backend:', req.body);

    const user = await User.findById(userId);
    if (!user) {
      console.log('Usuario no encontrado:', userId);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log('Usuario encontrado:', user);

    // Intentar buscar el ejercicio por ObjectId o codewarsId
    let exercise = await Exercise.findOne({ codewarsId: exerciseId });

    if (!exercise) {
      console.log('Ejercicio no encontrado:', exerciseId);
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }

    console.log('Ejercicio encontrado:', exercise);

    // Obtener los detalles del ejercicio desde la API de Codewars
    const codewarsResponse = await axios.get(
      `https://www.codewars.com/api/v1/code-challenges/${exercise.codewarsId}`
    );
    const tags = codewarsResponse.data.tags || [];

    console.log('Tags obtenidos desde Codewars:', tags);

    // Actualizar puntos de experiencia y nivel
    user.experiencePoints += experiencePoints;
    user.level = Math.floor(user.experiencePoints / 1000);

    // Asegurarse de no duplicar desafíos completados
    if (!user.completedChallenges.includes(exercise._id)) {
      user.completedChallenges.push(exercise._id);
    }

    user.progress = Math.min((user.completedChallenges.length * 100) / 10, 100);

    // Manejar los tags en caso de éxito o error
    if (successful) {
      tags.forEach((tag) => {
        const tagObj = user.tagsWithMistakes.find((t) => t.tag === tag);
        if (tagObj) {
          tagObj.priority = Math.max(tagObj.priority - 1, 0);
        }
      });
    } else {
      tags.forEach((tag) => {
        const tagObj = user.tagsWithMistakes.find((t) => t.tag === tag);
        if (tagObj) {
          tagObj.priority += 1;
        } else {
          user.tagsWithMistakes.push({ tag, priority: 1 });
        }
      });
    }

    await user.save();
    console.log('Usuario actualizado:', user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al actualizar el progreso del usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el progreso del usuario' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  // Verificar que se proporcionen el email y la contraseña
  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña son requeridos" });
  }

  try {
    // Buscar el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar la contraseña proporcionada con la almacenada (cifrada)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Generar un token JWT con la ID del usuario
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    if (!process.env.JWT_SECRET) {
      throw new Error('La clave secreta no está configurada en .env');
    }
    // Enviar el token al cliente
    console.log(user);
    res.json({userId:user._id,token, message: "Inicio de sesión exitoso" });

  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};







module.exports = { createUser, getUsers, getUserById, deleteUser, updateUser, updateUserProgressUnified,  login };
