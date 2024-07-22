import { NavLink } from "react-router-dom";
import axios from 'axios'; // Importer Axios

const Navigation = () => {
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    // Fonction pour gérer la déconnexion
    const handleLogout = async () => {
        try {
            // Envoyer une requête DELETE pour supprimer la session côté serveur
            await axios.delete(`http://localhost:8002/api/logout.php?user_id=${userId}`);

            // Supprimer les informations de session et de stockage local
            localStorage.removeItem('userToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            
            // Rediriger vers la page de connexion
            window.location.href = '/login';
        } catch (error) {
            console.error('Error logging out:', error);
            // Gérer l'erreur de déconnexion ici
        }
    };

    return (
        <>
        <button className="menu-burger">|||</button>
        <div className="nav-bar">
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
