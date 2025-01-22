import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginRegister from "./components/LoginRegister";
import HomePage from "./components/HomePage";
import ExerciseList from "./components/ExerciseList";
import Game1 from "./components/Game1";
import Game2 from "./components/Game2";
import Game3 from "./components/Game3";
import RankingPage from "./components/RankingPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta predeterminada para Login */}
        <Route path="/" element={<LoginRegister />} />
        <Route path="/user/:userId" element={<HomePage />} />
        <Route path="/user/:userId/game/:gameMode" element={<ExerciseList />} />
        <Route path="/user/:userId/game/game1/exercise/:exerciseId" element={<Game1 />} />
        <Route path="/user/:userId/game/game2/exercise/:exerciseId" element={<Game2 />} />
        <Route path="/user/:userId/game/game3/exercise/:exerciseId" element={<Game3 />} />
        <Route path="/user/:userId/ranking" element={<RankingPage />} />
      </Routes>
    </Router>
  );
};

export default App;