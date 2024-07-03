import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminMonster from "./pages/AdminMonster";
import QuizzGuessMonster from "./pages/QuizzGuessMonster";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        {/* path="*" fonctionne si jamais l'url ne correspond à rien de déclaré au dessus */}
        <Route path="*" element={<Home />} />
        <Route path="/admin/monster" element={<AdminMonster />} />
        <Route path="/guess-monster" element={<QuizzGuessMonster />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
