import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../css/ExerciseList.css';  // Importa el archivo CSS
import { Link } from 'react-router-dom';

const ExerciseList = () => {
  const { gameMode } = useParams(); // Obtener el modo de juego desde la URL
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userId } =useParams(); // Reemplaza con un ID dinámico o autenticado

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/exercises/recommendations/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch recommended exercises");
        }
        const data = await response.json();
        setExercises(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExercises();
  }, [gameMode]);

  const handleExerciseSelect = (exerciseId) => {
    navigate(`/user/${userId}/game/${gameMode}/exercise/${exerciseId}`);
  };
  
  const removeTripleBackticksContent = (str) => {
    // Usamos una expresión regular para encontrar y eliminar contenido entre triple comillas
    return str.replace(/```[^`]*```/g, '');
  };


  if (loading) return <p>Loading recommended exercises...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {/* NavBar interactivo */}
      <link  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"rel="stylesheet"/>
      <nav className="game-navbar">
  <div className="logo">🎮 GameConsole</div>
  <ul className="nav-links">
    <li><Link to={`/user/${userId}`}><i className="fas fa-home"></i> Home</Link></li>
    <li><Link to={`/user/${userId}/ranking`}><i className="fas fa-trophy"></i> Ranking</Link></li>
    <li><Link to="#profile"><i className="fas fa-user"></i> Perfil</Link></li>
    <li><Link to="/"><i className="fas fa-cogs"></i> Exit</Link></li>
  </ul>
</nav>
    <div className="exercise-list-container">
      <h1>{gameMode} - Recommended Exercises</h1>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.codewarsId}>
            <h3>{exercise.name || "No Name Available"}</h3>
            <p>{<div>
      {/* Renderizamos el HTML usando dangerouslySetInnerHTML */}
      <div dangerouslySetInnerHTML={{ __html: removeTripleBackticksContent(exercise.description) }} />
    </div> || "No Description Available"}</p>
            {exercise.priority > 0 && <p className="priority-high">Prioridad alta debido a errores en temas similares.</p>}
            <button onClick={() => handleExerciseSelect(exercise.codewarsId)}>Go to Exercise</button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default ExerciseList;
