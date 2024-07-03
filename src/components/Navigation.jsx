import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div style={navStyle}>
        <NavLink to="/" className={(nav) => (nav.isActive ? "nav-active" : "")}>
          <h2>HOME</h2>
        </NavLink>
        <NavLink to="/guess-monster" className={(nav) => (nav.isActive ? "nav-active" : "")}>
          <h2>GUESS MONSTER</h2>
        </NavLink>
        <NavLink
          to="/admin"
          className={(nav) => (nav.isActive ? "nav-active" : "")}
        >
          <h2>ADMIN</h2>
        </NavLink>
        <NavLink
          to="/admin/monster"
          className={(nav) => (nav.isActive ? "nav-active" : "")}
        >
          <h2>ADD MONSTER</h2>
        </NavLink>
    </div>
  );
};

const navStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '1em',
    backgroundColor: '#f8f9fa'
};

// const linkStyle = {
//     textDecoration: 'none',
//     color: '#007bff',
//     fontSize: '1.2em'
// };

export default Navigation;
