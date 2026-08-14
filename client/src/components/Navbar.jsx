import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { MessageSquare, User, LogOut } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <MessageSquare className="nav-logo-icon" size={24} />
        <span>Talksy</span>
      </Link>

      <div className="nav-links">
        {authUser ? (
          <>
            <Link to="/profile" className="nav-item">
              {authUser.profilePic ? (
                <img
                  src={authUser.profilePic}
                  alt="Profile"
                  style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <User size={18} />
              )}
              <span>Profile</span>
            </Link>

            <button onClick={logout} className="nav-item logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
