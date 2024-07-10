import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminMonster from "./pages/AdminMonster";
import QuizzGuessMonster from "./pages/QuizzGuessMonster";
import AdminWallpaper from "./pages/AdminWallpaper";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

const PrivateRoute = ({ children }) => {
  const userRole = localStorage.getItem('userRole');
  return userRole === 'admin' ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/guess-monster" element={<QuizzGuessMonster />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        } />
        <Route path="/admin/monster" element={
          <PrivateRoute>
            <AdminMonster />
          </PrivateRoute>
        } />
        <Route path="/admin/wallpaper" element={
          <PrivateRoute>
            <AdminWallpaper />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
