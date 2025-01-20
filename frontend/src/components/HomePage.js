import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserInfo from './UserInfo';
import '../css/HomePage.css';  // Importa el archivo CSS

const HomePage = () => {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [user, setUser] = useState(null);  // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = "67869f7defd086ba28f87d41"; // Reemplázalo con el ID dinámico o de la sesión

  // Función para obtener los datos del usuario desde el backend
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setUser(response.data);  // Establecer los datos del usuario
      setLoading(false);
    } catch (err) {
      setError("Error al obtener los datos del usuario");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);  // Llamar a la función cuando el componente se monta

  const handleGameSelection = (gameMode) => {
    navigate(`/game/${gameMode}`);
  };

  const handleShowUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="home-container">
      <h1>Choose a Game Mode</h1>
      <div>
        <button 
          className="game-mode-button" 
          onClick={() => handleGameSelection('game1')}
        >
          Mode 1: Ordering Code Lines
        </button>
        <p className="game-description">Description: In this mode, you'll have to order code lines to complete the function.</p>
      </div>
      <div>
        <button 
          className="game-mode-button" 
          onClick={() => handleGameSelection('game2')}
        >
          Mode 2: Completing Missing Code
        </button>
        <p className="game-description">Description: In this mode, you need to fill in the missing parts of a code snippet.</p>
      </div>
      <div>
        <button 
          className="game-mode-button" 
          onClick={() => handleGameSelection('game3')}
        >
          Mode 3: Answer Selection
        </button>
        <p className="game-description">Description: In this mode, you need to select the correct answer based on a given problem.</p>
      </div>

      <div>
        <button 
          className="user-info-toggle" 
          onClick={handleShowUserInfo}
        >
          {showUserInfo ? "Hide User Info" : "Show User Info"}
        </button>
        {showUserInfo && user && <UserInfo user={user} />}
      </div>
    </div>
  );
};

export default HomePage;
