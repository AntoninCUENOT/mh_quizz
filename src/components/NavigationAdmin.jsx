import { NavLink } from "react-router-dom";

const NavigationAdmin = () => {
  return (
    <div style={navStyle}>
        <NavLink style={linkStyle} to="/" className={(nav) => (nav.isActive ? "nav-active" : "")}>
          <h2>HOME</h2>
        </NavLink>
        <NavLink  style={linkStyle}
          to="/admin"
          className={(nav) => (nav.isActive ? "nav-active" : "")}
        >
          <h2>ADMIN</h2>
        </NavLink>
        <NavLink  style={linkStyle}
          to="/admin/monster"
          className={(nav) => (nav.isActive ? "nav-active" : "")}
        >
          <h2>ADD MONSTER</h2>
        </NavLink>
        <NavLink  style={linkStyle}
          to="/admin/wallpaper"
          className={(nav) => (nav.isActive ? "nav-active" : "")}
        >
          <h2>WALLPAPER</h2>
        </NavLink>
    </div>
  );
};

const navStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '1em',
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

export default NavigationAdmin;
