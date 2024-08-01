import { useState } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    const handleLogout = async () => {
        try {
            await axios.delete(`http://localhost:8002/api/Users/Logout.php?user_id=${userId}`);
            localStorage.removeItem('userToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            window.location.href = '/login';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleMenu = () => {
        if (isMenuOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setIsMenuOpen(false);
                setIsClosing(false);
            }, 1500); // Durée de l'animation
        } else {
            setIsMenuOpen(true);
        }
    };

    const closeMenu = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsMenuOpen(false);
            setIsClosing(false);
        }, 1000); // Durée de l'animation
    };

    return (
        <>
            <button className={`menu-burger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                {isMenuOpen ? 'X' : '|||'}
            </button>
            <div className={`nav-bar ${isMenuOpen ? 'open' : ''} ${isClosing ? 'close' : ''}`}>
                <NavLink
                    style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
                    to="/"
                    onClick={closeMenu}
                >
                    <h2>HOME</h2>
                </NavLink>
                <NavLink
                    style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
                    to="/guess-monster"
                    onClick={closeMenu}
                >
                    <h2>GUESS MONSTER</h2>
                </NavLink>
                {!userId && (
                    <NavLink
                        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
                        to="/signup"
                        onClick={closeMenu}
                    >
                        <h2>SIGN UP</h2>
                    </NavLink>
                )}
                {!userId && (
                    <NavLink
                        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
                        to="/login"
                        onClick={closeMenu}
                    >
                        <h2>LOGIN</h2>
                    </NavLink>
                )}
                {userId && (
                    <NavLink
                        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
                        to="/profile"
                        onClick={closeMenu}
                    >
                        <h2>PROFILE</h2>
                    </NavLink>
                )}
                {userId && (
                    <NavLink
                        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
                        to="/logout"
                        onClick={() => { handleLogout(); closeMenu(); }}
                    >
                        <h2>LOGOUT</h2>
                    </NavLink>
                )}
                {userRole === 'admin' && (
                    <NavLink
                        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
                        to="/admin"
                        onClick={closeMenu}
                    >
                        <h2>ADMIN</h2>
                    </NavLink>
                )}
            </div>
        </>
    );
};

const linkStyle = {
    textDecoration: 'none',
    color: 'black',
    fontSize: '1em',
    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.813)',
    padding: '1em',
    margin: '1em',
    background: 'black',
    borderRadius: '64px',
    border: '1px solid white',
};

const activeLinkStyle = {
    background: 'rgba(100,100,100,0.8)'
};

export default Navigation;
