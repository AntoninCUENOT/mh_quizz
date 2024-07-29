import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminMonster from "./pages/AdminMonster";
import QuizzGuessMonster from "./pages/QuizzGuessMonster";
import AdminWallpaper from "./pages/AdminWallpaper";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminListMonster from "./pages/AdminListMonster";
import AdminEditMonster from "./pages/AdminEditMonster";
import AdminBoard from "./pages/AdminBoard";
import Footer from "./components/Footer";
import AdminReseaux from "./pages/AdminReseaux";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const PrivateRoute = ({ children, user }) => {
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

const LogRoute = ({ children, user }) => {
  return !user ? children : <Navigate to="/" />;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyToken = async (token) => {
    try {
      const response = await axios.post('http://localhost:8002/api/verify_token.php', { token });
      if (response.data.success) {
        setUser(response.data);
      } else {
        localStorage.removeItem('userToken');
      }
    } catch (error) {
      console.error('Token verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <h1 style={{textAlign: 'center'}}>Loading...</h1>;
  }

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/login" element={
          <LogRoute user={user}>
            <Login />
          </LogRoute>
        } />
        <Route path="/signup" element={
          <LogRoute user={user}>
            <SignUp />
          </LogRoute>
        } />
        <Route path="/profile" element={
          <LogRoute user={!user}>
            <Profile />
          </LogRoute>
        } />
        <Route path="/guess-monster" element={<QuizzGuessMonster />} />
        <Route path="/admin" element={
          <PrivateRoute user={user}>
            <Admin />
          </PrivateRoute>
        } />
        <Route path="/admin/board" element={
          <PrivateRoute user={user}>
            <AdminBoard />
          </PrivateRoute>
        } />
        <Route path="/admin/network" element={
          <PrivateRoute user={user}>
            <AdminReseaux />
          </PrivateRoute>
        } />
        <Route path="/admin/monster" element={
          <PrivateRoute user={user}>
            <AdminMonster />
          </PrivateRoute>
        } />
        <Route path="/admin/wallpaper" element={
          <PrivateRoute user={user}>
            <AdminWallpaper />
          </PrivateRoute>
        } />
        <Route path="/admin/listmonster" element={
          <PrivateRoute user={user}>
            <AdminListMonster />
          </PrivateRoute>
        } />
        <Route path="/admin/edit-monster/:monsterId" element={
          <PrivateRoute user={user}>
            <AdminEditMonster />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
    <Footer />
    </>
  );
};

export default App;
