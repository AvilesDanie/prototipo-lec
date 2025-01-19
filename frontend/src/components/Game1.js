import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Reemplazado useHistory por useNavigate


const Game1Exercise = () => {
  const { exerciseId } = useParams(); // Captura el codewarsId desde la URL
  const [exercise, setExercise] = useState(null);
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lines, setLines] = useState([]);
  const [orderedLines, setOrderedLines] = useState([]);
  const [gameResult, setGameResult] = useState(null);  // Nuevo estado para el resultado del juego
  const userId = "67869f7defd086ba28f87d41"; // ID del usuario (puedes obtenerlo dinámicamente)
  const navigate = useNavigate();  // Usamos useNavigate para la navegación

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exerciseRes = await axios.get(`http://localhost:5000/api/exercises/codewars/${exerciseId}`);
        setExercise(exerciseRes.data);

        const exerciseDetailsRes = await axios.get(`http://localhost:5000/api/codewars/challenge/${exerciseId}`);
        setExerciseDetails(exerciseDetailsRes.data);

        const userRes = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(userRes.data);

        setLoading(false);
      } catch (err) {
        setError('Error al obtener los datos');
        setLoading(false);
      }
    };

    fetchData();
  }, [exerciseId, userId]);

  useEffect(() => {
    if (exercise && exercise.answer && exercise.answer.python) {
      const codeLines = exercise.answer.python.split('\n');
      const shuffledLines = [...codeLines].sort(() => Math.random() - 0.5); // Aleatoriza las líneas
      setLines(shuffledLines);
      setOrderedLines(codeLines); // Guardamos las líneas en el orden correcto
    }
  }, [exercise]);

  const handleGameCompletion = async (isWin) => {
    const experiencePointsEarned = 100; // Suponiendo que el jugador gana 100 puntos por completar el ejercicio
    try {
      await axios.put(`http://localhost:5000/api/users/progress/${userId}`, {
        experiencePoints: experiencePointsEarned,
        idExercice: exerciseId
      });
      
      // Si el jugador ha ganado, mostramos el cuadro con la opción para volver a la lista de ejercicios
      if (isWin) {
        setGameResult('win');
      } else {
        setGameResult('lose');
      }
    } catch (err) {
      console.error('Error al actualizar el progreso del usuario');
    }
  };

  const handleLineMove = (fromIndex, toIndex) => {
    const updatedLines = [...lines];
    const [movedLine] = updatedLines.splice(fromIndex, 1);
    updatedLines.splice(toIndex, 0, movedLine);
    setLines(updatedLines);
  };

  // Verifica si las líneas ordenadas son iguales a las originales
  const checkAnswer = () => {
    const userCode = lines.join('\n');
    const correctCode = orderedLines.join('\n');
    return userCode === correctCode;
  };

  // Función para volver a la lista de ejercicios
  const goToExerciseList = () => {
    navigate('/game/game1');  // Usamos navigate() para redirigir
  };

  // Función para reiniciar el juego
  const restartGame = () => {
    setGameResult(null);
    setLines([...orderedLines].sort(() => Math.random() - 0.5));  // Reordenar las líneas aleatoriamente
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!exerciseDetails) {
    return <p>No details available for this exercise.</p>;
  }

  return (
    <div className="exercise-container">
      {/* Contenedor del título y la descripción del ejercicio */}
      <div className="exercise-info">
        <h1>{exerciseDetails.name}</h1>
        <p>{exerciseDetails.description}</p>
      </div>

      {/* Contenedor de las líneas de código */}
      <div className="exercise-code">
        <h2>Python Code</h2>
        <div className="code-lines">
          {lines.map((line, index) => (
            <div
              key={index}
              className="code-line"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('index', index)}
              onDrop={(e) => {
                const fromIndex = parseInt(e.dataTransfer.getData('index'));
                handleLineMove(fromIndex, index);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Botón para completar el ejercicio */}
      <div className="completion-button">
        <button 
          onClick={() => {
            if (checkAnswer()) {
              handleGameCompletion(true);  // Llamar a la función con "true" para indicar que ganó
            } else {
              handleGameCompletion(false);  // Llamar a la función con "false" para indicar que perdió
              alert('Please try again! The code is not correct.');
            }
          }}
        >
          Completar
        </button>
      </div>

      {/* Mostrar el cuadro de resultado dependiendo de si el usuario ganó o perdió */}
      {gameResult && (
        <div className="result-modal">
          {gameResult === 'win' ? (
            <>
              <p>¡Has ganado! ¿Qué te gustaría hacer ahora?</p>
              <button onClick={goToExerciseList}>Volver a la lista de ejercicios</button>
            </>
          ) : (
            <>
              <p>¡Has perdido! ¿Qué te gustaría hacer ahora?</p>
              <button onClick={restartGame}>Repetir</button>
              <button onClick={goToExerciseList}>Volver a la lista de ejercicios</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default  Game1Exercise;
