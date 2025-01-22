import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Game3.css';  // Importar el archivo CSS
import { Link } from 'react-router-dom';

const Game3 = () => {
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [correctSolution, setCorrectSolution] = useState('');
  const [gameResult, setGameResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30); // Temporizador de 30 segundos
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exerciseRes = await axios.get(`http://localhost:5000/api/codewars/challenge/${exerciseId}`);
        setExercise(exerciseRes.data);
        const solutionRes = await axios.get(`http://localhost:5000/api/exercises/codewars/${exerciseId}`);
        setCorrectSolution(solutionRes.data.answer.python);

        const randomSolutionsRes = await axios.get(`http://localhost:5000/api/exercises/random/${exerciseId}`);
        const randomSolutions = randomSolutionsRes.data.map((item) => item.answer.python);

        const combinedSolutions = [...randomSolutions, solutionRes.data.answer.python];
        const shuffledSolutions = combinedSolutions.sort(() => Math.random() - 0.5);

        setSolutions(shuffledSolutions);
        setLoading(false);
      } catch (err) {
        setError('Error al obtener los datos');
        setLoading(false);
      }
    };

    fetchData();
  }, [exerciseId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameResult('timeout'); // Tiempo agotado
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Limpieza del intervalo
  }, []);

  const handleButtonClick = async (selectedSolution) => {
    if (selectedSolution === correctSolution) {
      setGameResult('win');
      try {
        await axios.put(`http://localhost:5000/api/users/progress-unified`, {
          userId,
          exerciseId,
          experiencePoints: timeLeft > 15 ? 150 : 100, // Más puntos si responde rápido
          successful: true, // Marcado como exitoso
        });
      } catch (err) {
        console.error('Error al actualizar el progreso del usuario:', err);
        alert('Error al actualizar el progreso del usuario.');
      }
    } else {
      setGameResult('lose');
      try {
        await axios.put(`http://localhost:5000/api/users/progress-unified`, {
          userId,
          exerciseId,
          experiencePoints: 0, // No se ganan puntos al fallar
          successful: false, // Marcado como fallo
        });
      } catch (err) {
        console.error('Error al registrar el fallo del usuario:', err);
      }
    }
  };
  

  const goToExerciseList = () => {
    navigate(`/user/${userId}/game/game3`);
  };

  const restartGame = () => {
    setGameResult(null);
    setTimeLeft(30); // Reiniciar el temporizador
  };
  const removeTripleBackticksContent = (str) => {
    // Usamos una expresión regular para encontrar y eliminar contenido entre triple comillas
    return str.replace(/```[^`]*```/g, '');
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
    <li><Link to="/"><i className="fas fa-home"></i> Inicio</Link></li>
    <li><Link to="/"><i className="fas fa-gamepad"></i> Juegos</Link></li>
    <li><Link to="/ranking"><i className="fas fa-trophy"></i> Ranking</Link></li>
    <li><Link to="#profile"><i className="fas fa-user"></i> Perfil</Link></li>
    <li><Link to="#settings"><i className="fas fa-cogs"></i> Configuración</Link></li>
  </ul>
</nav>

      

      {/* Contenido principal */}
      <div className="game-container">
        <div className="exercise-info">
          <h1>{exercise?.name}</h1>
          <p>
            {<div>
              <div dangerouslySetInnerHTML={{ __html: removeTripleBackticksContent(exercise.description) }} />
            </div> || "No Description Available"}
          </p>
          <p><strong>Tiempo restante: {timeLeft} segundos</strong></p>
        </div>

        <div className="solutions">
          <h2>Selecciona la solución correcta:</h2>
          {solutions.map((solution, index) => (
            <button
              key={index}
              className={`solution-button ${gameResult && solution === correctSolution ? 'correct' : ''}`}
              onClick={() => handleButtonClick(solution)}
              disabled={!!gameResult} // Desactiva los botones si ya hay resultado
            >
              {solution}
            </button>
          ))}
        </div>

        {gameResult && (
          <div className="result-modal">
            {gameResult === 'win' ? (
              <>
                <p>¡Has ganado! Obtuviste {timeLeft > 15 ? 150 : 100} puntos de experiencia.</p>
                <button onClick={goToExerciseList}>Volver a la lista de ejercicios</button>
              </>
            ) : gameResult === 'timeout' ? (
              <>
                <p>¡Tiempo agotado! Inténtalo de nuevo.</p>
                <button onClick={restartGame}>Reintentar</button>
              </>
            ) : (
              <>
                <p>¡Has perdido! Inténtalo de nuevo.</p>
                <button onClick={restartGame}>Reintentar</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game3;