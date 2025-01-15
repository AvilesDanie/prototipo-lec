import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ExerciseList = () => {
  const { gameMode } = useParams(); // Obtener el modo de juego desde la URL
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/exercises/details");
        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
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

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{gameMode} - Exercise List</h1>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.codewarsId}>
            <h3>{exercise.codewarsDetails.name}</h3>
            <p>{exercise.codewarsDetails.description}</p>
            <button onClick={() => handleExerciseSelect(exercise.codewarsId)}>Go to Exercise</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseList;
