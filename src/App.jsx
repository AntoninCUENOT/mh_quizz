import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminMonster from "./pages/AdminMonster";
import QuizzGuessMonster from "./pages/QuizzGuessMonster";
import AdminWallpaper from "./pages/AdminWallpaper";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/guess-monster" element={<QuizzGuessMonster />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/monster" element={<AdminMonster />} />
        <Route path="/admin/wallpaper" element={<AdminWallpaper />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
