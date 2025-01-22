import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Game2.css';  // Importar el archivo CSS
import { Link } from 'react-router-dom';
const Game2Exercise = () => {
  const { exerciseId } = useParams(); // Captura el codewarsId desde la URL
  const [exercise, setExercise] = useState(null);
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [modifiedCode, setModifiedCode] = useState(''); // Nuevo estado para el código modificado
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctLine, setCorrectLine] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [gameResult, setGameResult] = useState(null); // Resultado del juego 
  const userId = '67869f7defd086ba28f87d41'; // ID del usuario
  const navigate = useNavigate();

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
    const fetchIncorrectOptions = async () => {
      try {
        if (exercise && exercise.answer && exercise.answer.python) {
          const codeLines = exercise.answer.python.split('\n');
          const lineIndex = Math.floor(Math.random() * codeLines.length); // Escoger una línea aleatoria
          setCorrectLine(codeLines[lineIndex]);

          // Obtener líneas aleatorias de otros ejercicios
          const otherExercisesRes = await axios.get(`http://localhost:5000/api/exercises`);
          const otherExercises = otherExercisesRes.data.filter((ex) => ex.codewarsId !== exerciseId);

          const incorrectOptions = [];
          while (incorrectOptions.length < 3 && otherExercises.length > 0) {
            const randomExercise = otherExercises[Math.floor(Math.random() * otherExercises.length)];
            const lines = randomExercise.answer.python.split('\n');
            const randomLine = lines[Math.floor(Math.random() * lines.length)];
            if (!incorrectOptions.includes(randomLine) && randomLine !== codeLines[lineIndex]) {
              incorrectOptions.push(randomLine);
            }
          }

          // Crear opciones
          const allOptions = [codeLines[lineIndex], ...incorrectOptions];
          const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
          setOptions(shuffledOptions);

          // Modificar el código para que falte la línea correcta
          const modifiedLines = [...codeLines];
          modifiedLines[lineIndex] = '________';
          setModifiedCode(modifiedLines.join('\n')); // Guardar el código modificado
        }
      } catch (err) {
        console.error('Error al obtener las opciones incorrectas:', err);
      }
    };

    fetchIncorrectOptions();
  }, [exercise]);

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    if (option === correctLine) {
      await handleGameCompletion(true);
    } else {
      await handleGameCompletion(false); // Esto asegura que los tags incorrectos se actualicen.
    }
  };
  

  const handleGameCompletion = async (isWin) => {
    try {
      const payload = {
        userId,
        exerciseId,
        experiencePoints: isWin ? 100 : 0, // 100 puntos si gana
        successful: isWin, // Determina si el intento fue exitoso
      };
  
      console.log('Payload enviado:', payload);
  
      const response = await axios.put(`http://localhost:5000/api/users/progress-unified`, payload);
  
      console.log('Respuesta del backend:', response.data);
  
      if (isWin) {
        setGameResult('win');
      } else {
        setGameResult('lose');
      }
    } catch (err) {
      console.error('Error al actualizar el progreso:', err);
      alert('Ocurrió un error al actualizar el progreso. Por favor, intenta nuevamente.');
    }
  };
  

  const restartGame = () => {
    setGameResult(null);
    setSelectedOption('');
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
    
    <div className="exercise-container">
      <div className="exercise-info">
        <h1>{exerciseDetails?.name}</h1>
        <p>{<div>
      {/* Renderizamos el HTML usando dangerouslySetInnerHTML */}
      <div dangerouslySetInnerHTML={{ __html: exerciseDetails.description }} />
    </div> || "No Description Available"}</p>
      </div>

      <div className="exercise-code">
        <h2>Python Code</h2>
        <pre>{modifiedCode || 'Cargando código...'}</pre>
      </div>

      <div className="options">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option ${selectedOption === option ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {gameResult && (
        <div className="result-modal">
          {gameResult === 'win' ? (
            <p>¡Correcto! Has completado el ejercicio.</p>
          ) : (
            <p>¡Incorrecto! Intenta nuevamente.</p>
          )}
          <button onClick={restartGame}>Reintentar</button>
          <button onClick={() => navigate('/game/game2')}>Volver a la lista de ejercicios</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Game2Exercise;
