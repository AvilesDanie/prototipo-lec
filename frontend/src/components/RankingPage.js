import React, { useEffect, useState } from "react";
import axios from "axios";
import '../css/RankingPage.css';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';

const RankingPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams(); 

  useEffect(() => {
    // Obtener usuarios desde el backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        // Ordenar usuarios por nivel y puntos de experiencia
        const sortedUsers = response.data.sort(
          (a, b) =>
            b.level - a.level || b.experiencePoints - a.experiencePoints
        );
        setUsers(sortedUsers);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los datos del ranking.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
          {/* NavBar interactivo */}
          <link  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"rel="stylesheet"/>
          <nav className="game-navbar">
      <div className="logo">🎮 GameConsole</div>
      <ul className="nav-links">
        <li><Link to={`/user/${userId}`}><i className="fas fa-home"></i> Home</Link></li>
        <li><Link to="/ranking"><i className="fas fa-trophy"></i> Ranking</Link></li>
        <li><Link to="#profile"><i className="fas fa-user"></i> Perfil</Link></li>
        <li><Link to="/"><i className="fas fa-cogs"></i> Exit</Link></li>
      </ul>
    </nav>
    <div className="ranking-page">
      <h1>Ranking de Usuarios</h1>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Usuario</th>
            <th>Nivel</th>
            <th>Puntos de Experiencia</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.level}</td>
              <td>{user.experiencePoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default RankingPage;
