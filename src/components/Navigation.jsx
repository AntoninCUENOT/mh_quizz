import { NavLink } from "react-router-dom";

const Navigation = () => {
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    const handleLogout = () => {
        // Supprimer les informations de session et de stockage local
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        // Rediriger vers la page de connexion
        window.location.href = '/login';
    };

    return (
        <div style={navStyle}>
            <NavLink
                style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
                to="/"
            >
                <h2>HOME</h2>
            </NavLink>
            <NavLink
                style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
                to="/guess-monster"
            >
                <h2>GUESS MONSTER</h2>
            </NavLink>
            {!userId && (
                <NavLink
                    style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
                    to="/signup"
                >
                    <h2>SIGN UP</h2>
                </NavLink>
            )}
            {!userId && (
                <NavLink
                    style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
                    to="/login"
                >
                    <h2>LOGIN</h2>
                </NavLink>
            )}
            {userId && (
                <NavLink
                    style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
                    to="/logout"
                    onClick={handleLogout} // Ajouter la fonction de logout au clic
                >
                    <h2>LOGOUT</h2>
                </NavLink>
            )}
            {userRole === 'admin' && (
                <NavLink
                    style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
                    to="/admin"
                >
                    <h2>ADMIN</h2>
                </NavLink>
            )}
        </div>
    );
};

const navStyle = {
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: '1em',
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
