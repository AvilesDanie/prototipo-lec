import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ExerciseList from "./components/ExerciseList";
import Game1 from "./components/Game1";
import Game2 from "./components/Game2";
import Game3 from "./components/Game3";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:gameMode" element={<ExerciseList />} />
        <Route path="/game/game1/exercise/:exerciseId" element={<Game1 />} />
        <Route path="/game/game2/exercise/:exerciseId" element={<Game2 />} />
        <Route path="/game/game3/exercise/:exerciseId" element={<Game3 />} />
      </Routes>
    </Router>
  );
};

export default App;
