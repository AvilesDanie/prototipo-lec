import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Game3 = () => {
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [correctSolution, setCorrectSolution] = useState('');
  const [gameResult, setGameResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30); // Temporizador de 30 segundos
  const userId = "67869f7defd086ba28f87d41";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exerciseRes = await axios.get(`http://localhost:5000/api/codewars/challenge/${exerciseId}`);
        setExercise(exerciseRes.data);
        const solutionRes = await axios.get(`http://localhost:5000/api/exercises/codewars/${exerciseId}`);
        setCorrectSolution(solutionRes.data.answer.python);

        const randomSolutionsRes = await axios.get('http://localhost:5000/api/exercises/random?count=3');
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
        await axios.put(`http://localhost:5000/api/users/progress/${userId}`, {
          experiencePoints: timeLeft > 15 ? 150 : 100, // Más puntos si queda mucho tiempo
          idExercice: exerciseId
        });
      } catch (err) {
        console.error('Error al actualizar el progreso del usuario');
      }
    } else {
      setGameResult('lose');
    }
  };

  const goToExerciseList = () => {
    navigate('/game/game3');
  };

  const restartGame = () => {
    setGameResult(null);
    setTimeLeft(30); // Reiniciar el temporizador
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="game-container">
      <div className="exercise-info">
        <h1>{exercise?.name}</h1>
        <p>{exercise?.description}</p>
        <p>Tiempo restante: {timeLeft} segundos</p>
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
  );
};

export default Game3;
