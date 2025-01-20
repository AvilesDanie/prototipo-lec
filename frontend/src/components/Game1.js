import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import '../css/Game1.css';  // Importar el archivo CSS

const Game1Exercise = () => {
  const { exerciseId } = useParams(); // Captura el codewarsId desde la URL
  const [exercise, setExercise] = useState(null);
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lines, setLines] = useState([]);
  const [orderedLines, setOrderedLines] = useState([]);
  const [gameResult, setGameResult] = useState(null); 
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
      const shuffledLines = [...codeLines].sort(() => Math.random() - 0.5); 
      setLines(shuffledLines);
      setOrderedLines(codeLines); 
    }
  }, [exercise]);

  const handleGameCompletion = async (isWin) => {
    try {
      const payload = {
        userId, 
        exerciseId, 
        experiencePoints: isWin ? 100 : 0, 
        successful: isWin, 
      };

      console.log('Payload enviado al backend:', payload); 

      const response = await axios.put(`http://localhost:5000/api/users/progress-unified`, payload);

      console.log('Respuesta del backend:', response.data); 

      if (isWin) {
        setGameResult('win');
      } else {
        setGameResult('lose');
      }
    } catch (err) {
      console.error('Error al actualizar el progreso del usuario:', err);
      console.log('Detalles del error:', err.response?.data || err.message);
    }
  };

  const handleLineMove = (fromIndex, toIndex) => {
    const updatedLines = [...lines];
    const [movedLine] = updatedLines.splice(fromIndex, 1);
    updatedLines.splice(toIndex, 0, movedLine);
    setLines(updatedLines);
  };

  const checkAnswer = () => {
    const userCode = lines.join('\n');
    const correctCode = orderedLines.join('\n');
    return userCode === correctCode;
  };

  const goToExerciseList = () => {
    navigate('/game/game1');  
  };

  const restartGame = () => {
    setGameResult(null);
    setLines([...orderedLines].sort(() => Math.random() - 0.5));  
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!exerciseDetails) {
    return <p>No details available for this exercise.</p>;
  }

  return (
    <div className="exercise-container">
      <div className="exercise-info">
        <h1>{exerciseDetails.name}</h1>
        <p>{<div>
      {/* Renderizamos el HTML usando dangerouslySetInnerHTML */}
      <div dangerouslySetInnerHTML={{ __html: exerciseDetails.description }} />
    </div> || "No Description Available"}</p>
      </div>

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

      <div className="completion-button">
        <button 
          onClick={() => {
            if (checkAnswer()) {
              handleGameCompletion(true);  
            } else {
              handleGameCompletion(false);  
              alert('Please try again! The code is not correct.');
            }
          }}
        >
          Completar
        </button>
      </div>

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

export default Game1Exercise;
