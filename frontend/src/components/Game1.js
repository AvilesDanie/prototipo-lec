import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Game1.css'; // Importar el archivo CSS
import { Link } from 'react-router-dom';
const Game1Exercise = () => {
  const { exerciseId } = useParams(); // Captura el codewarsId desde la URL
  const [exercise, setExercise] = useState(null);
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lines, setLines] = useState([]);
  const [orderedLines, setOrderedLines] = useState([]);
  const [gameResult, setGameResult] = useState(null);

  const { userId } = useParams(); // ID del usuario (ajustar si es necesario)
  const navigate = useNavigate(); // Usamos useNavigate para la navegación

  // Obtener detalles del ejercicio y usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        const exerciseRes = await axios.get(`http://localhost:5000/api/exercises/codewars/${exerciseId}`);
        setExercise(exerciseRes.data);

        const exerciseDetailsRes = await axios.get(`http://localhost:5000/api/codewars/challenge/${exerciseId}`);
        setExerciseDetails(exerciseDetailsRes.data);

        setLoading(false);
      } catch (err) {
        setError('Error al obtener los datos');
        setLoading(false);
      }
    };

    fetchData();
  }, [exerciseId]);

  // Configurar líneas del código
  useEffect(() => {
    if (exercise && exercise.answer && exercise.answer.python) {
      const codeLines = exercise.answer.python.split('\n');
      const shuffledLines = [...codeLines].sort(() => Math.random() - 0.5);
      setLines(shuffledLines);
      setOrderedLines(codeLines);
    }
  }, [exercise]);

  // Mover líneas de código
  const handleLineMove = (fromIndex, toIndex) => {
    const updatedLines = [...lines];
    const [movedLine] = updatedLines.splice(fromIndex, 1);
    updatedLines.splice(toIndex, 0, movedLine);
    setLines(updatedLines);
  };

  // Verificar respuesta del usuario
  const checkAnswer = () => {
    const userCode = lines.join('\n');
    const correctCode = orderedLines.join('\n');
    return userCode === correctCode;
  };

  // Manejo del resultado del juego
  const handleGameCompletion = async (isWin) => {
    try {
      const payload = {
        userId,
        exerciseId,
        experiencePoints: isWin ? 100 : 0,
        successful: isWin,
      };

      await axios.put(`http://localhost:5000/api/users/progress-unified`, payload);

      setGameResult(isWin ? 'win' : 'lose');
    } catch (err) {
      console.error('Error al actualizar el progreso:', err);
    }
  };

  // Funciones de navegación
  const goToExerciseList = () => navigate(`/user/${userId}/game/game1`);
  const restartGame = () => {
    setGameResult(null);
    setLines([...orderedLines].sort(() => Math.random() - 0.5));
  };

  /*const removeTripleBackticksContent = (str) => {
    // Usamos una expresión regular para encontrar y eliminar contenido entre triple comillas
    return str.replace(/```[^`]*```/g, '');
  };
*/
  
// Función para limpiar la descripción
const removeTripleBackticksContent = (description) => {
  return description
    .replace(/```[\s\S]*?```/g, '')  // Elimina bloques de código entre ```
    .replace(/~~~[\s\S]*?~~~/g, '')  // Elimina bloques de código entre ~~~
    .replace(/`[^`]+`/g, '')         // Elimina texto entre comillas invertidas (`example`)
    .replace(/\*\*[^*]+\*\*/g, '')   // Elimina texto entre ** **
    .replace(/\[.*?\]\(.*?\)/g, '')   // Elimina enlaces en formato [texto](url)
    .replace(/####\s?.*/g, '')       // Elimina encabezados "####"
    .replace(/- Task:.*|Examples:.*|Note:.*|Bash Note:.*|See "Sample Tests".*/gi, '')  // Filtra secciones irrelevantes
    .replace(/\s+/g, ' ')            // Reduce espacios múltiples a uno solo
    .trim();                         // Elimina espacios iniciales y finales
};




  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* NavBar interactivo */}
      <link  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"rel="stylesheet"/>
      <nav className="game-navbar">
  <div className="logo">🎮 GameConsole</div>
  <ul className="nav-links">
    <li><Link to={`/user/${userId}`}><i className="fas fa-home"></i> Home</Link></li>
    <li><Link to={`/user/${userId}/game/game1`}><i className="fas fa-gamepad"></i> Juegos</Link></li>
    <li><Link to={`/user/${userId}/ranking`}><i className="fas fa-trophy"></i> Ranking</Link></li>
    <li><Link to="#profile"><i className="fas fa-user"></i> Perfil</Link></li>
    <li><Link to="/"><i className="fas fa-cogs"></i> Exit</Link></li>
  </ul>
</nav>
    <div className="exercise-container">
      <div className="exercise-info">
        <h1>{exerciseDetails?.name || 'Exercise'}</h1>
        <p>
          <div dangerouslySetInnerHTML={{ __html: removeTripleBackticksContent(exerciseDetails?.description) || 'No Description Available' }} />
        </p>
      </div>

      <div className="exercise-code">
        <h2>Arrange the Code</h2>
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
          Submit
        </button>
      </div>

      {gameResult && (
        <div className="result-modal">
          {gameResult === 'win' ? (
            <>
              <p>🎉 ¡Has ganado! 🎉</p>
              <button onClick={goToExerciseList}>Volver a la lista de ejercicios</button>
            </>
          ) : (
            <>
              <p>😢 ¡Has perdido! 😢</p>
              <button onClick={restartGame}>Reintentar</button>
              <button onClick={goToExerciseList}>Volver a la lista de ejercicios</button>
            </>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default Game1Exercise;
