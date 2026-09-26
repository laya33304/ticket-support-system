import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="logo">
        Support Desk
      </Link>

      <div className="nav-right">
        {user && (
          <span className="user-info">
            {user.name} ({user.role})
          </span>
        )}

        <button onClick={logout} className="button secondary">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;