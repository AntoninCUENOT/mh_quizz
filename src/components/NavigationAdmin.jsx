import { useState } from 'react';
import { NavLink } from "react-router-dom";

const NavigationAdmin = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

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
    <div className={`nav-admin ${isMenuOpen ? 'open' : ''} ${isClosing ? 'close' : ''}`}>
        <NavLink
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
            to="/"
            onClick={closeMenu}
        >
            <h2>HOME</h2>
        </NavLink>
        <NavLink
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
            to="/admin/board"
            onClick={closeMenu}
        >
            <h2>BOARD</h2>
        </NavLink>
        <NavLink
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
            to="/admin/network"
            onClick={closeMenu}
        >
            <h2>NETWORK</h2>
        </NavLink>
        <NavLink
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
            to="/admin/monster"
            onClick={closeMenu}
        >
            <h2>ADD MONSTER</h2>
        </NavLink>
        <NavLink
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
            to="/admin/wallpaper"
            onClick={closeMenu}
        >
            <h2>WALLPAPER</h2>
        </NavLink>
        <NavLink
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
            to="/admin/listmonster"
            onClick={closeMenu}
        >
            <h2>MONSTER LIST</h2>
        </NavLink>
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
    margin:'1em',
    background:'black',
    borderRadius: '64px',
    border:'1px solid white'
};

const activeLinkStyle = {
  background: 'rgba(100,100,100,0.8)'
};

export default NavigationAdmin;
