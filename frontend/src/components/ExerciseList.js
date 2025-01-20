import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../css/ExerciseList.css';  // Importa el archivo CSS

const ExerciseList = () => {
  const { gameMode } = useParams(); // Obtener el modo de juego desde la URL
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = "67869f7defd086ba28f87d41"; // Reemplaza con un ID dinámico o autenticado

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
    navigate(`/game/${gameMode}/exercise/${exerciseId}`);
  };

  if (loading) return <p>Loading recommended exercises...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="exercise-list-container">
      <h1>{gameMode} - Recommended Exercises</h1>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.codewarsId}>
            <h3>{exercise.name || "No Name Available"}</h3>
            <p>{<div>
      {/* Renderizamos el HTML usando dangerouslySetInnerHTML */}
      <div dangerouslySetInnerHTML={{ __html: exercise.description }} />
    </div> || "No Description Available"}</p>
            {exercise.priority > 0 && <p className="priority-high">Prioridad alta debido a errores en temas similares.</p>}
            <button onClick={() => handleExerciseSelect(exercise.codewarsId)}>Go to Exercise</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseList;
