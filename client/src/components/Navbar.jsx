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
            <Link to="/profile" className="nav-item" style={{ padding: 0 }}>
              <div className="nav-profile-wrapper">
                <img
                  src={authUser.profilePic || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E"}
                  alt="Profile"
                  className="nav-avatar"
                />
                <span className="nav-username">{authUser.fullName}</span>
              </div>
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
