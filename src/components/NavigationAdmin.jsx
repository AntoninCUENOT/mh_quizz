import { NavLink } from "react-router-dom";

const NavigationAdmin = () => {
  return (
    <div className="nav-admin">
        <NavLink
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
            to="/"
        >
            <h2>HOME</h2>
        </NavLink>
        <NavLink
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
            to="/admin/board"
        >
            <h2>BOARD</h2>
        </NavLink>
        <NavLink
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
            to="/admin/monster"
        >
            <h2>ADD MONSTER</h2>
        </NavLink>
        <NavLink
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
            to="/admin/wallpaper"
        >
            <h2>WALLPAPER</h2>
        </NavLink>
        <NavLink
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
            to="/admin/listmonster"
        >
            <h2>MONSTER LIST</h2>
        </NavLink>
    </div>
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
