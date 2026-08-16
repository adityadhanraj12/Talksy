import { useState, useRef, useEffect } from "react";
import { useChat } from "../context/ChatContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { X, MoreVertical, Trash2, ShieldAlert } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, clearChat } = useChat();
  const { onlineUsers, authUser, toggleBlockUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  
  const isOnline = onlineUsers.includes(selectedUser._id);
  const isBlocked = authUser?.blockedUsers?.includes(selectedUser._id);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearChat = async () => {
    if (window.confirm("Are you sure you want to clear your chat history with this contact? This action cannot be undone.")) {
      await clearChat(selectedUser._id);
      setShowMenu(false);
    }
  };

  const handleToggleBlock = async () => {
    const action = isBlocked ? "unblock" : "block";
    if (window.confirm(`Are you sure you want to ${action} this contact?`)) {
      await toggleBlockUser(selectedUser._id);
      setShowMenu(false);
    }
  };

  return (
    <header className="chat-header">
      <div className="chat-header-user">
        <div className="avatar-wrapper" style={{ width: "40px", height: "40px" }}>
          <img
            src={selectedUser.profilePic || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E"}
            alt={selectedUser.fullName}
            className="avatar-img"
          />
          {isOnline && <span className="status-indicator"></span>}
        </div>
        <div>
          <div className="chat-header-name" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {selectedUser.fullName}
            {isBlocked && (
              <span className="blocked-pill">Blocked</span>
            )}
          </div>
          <div className={`chat-header-status ${isOnline ? "online" : ""}`}>
            {isOnline ? "Online" : "Offline"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", position: "relative" }} ref={menuRef}>
        <button onClick={() => setShowMenu(!showMenu)} className="btn-icon" style={{ width: "32px", height: "32px" }}>
          <MoreVertical size={16} />
        </button>

        {showMenu && (
          <div className="chat-header-dropdown glass-panel">
            <button onClick={handleClearChat} className="dropdown-item danger">
              <Trash2 size={15} />
              <span>Clear Chat</span>
            </button>
            <button onClick={handleToggleBlock} className="dropdown-item">
              <ShieldAlert size={15} />
              <span>{isBlocked ? "Unblock User" : "Block User"}</span>
            </button>
          </div>
        )}

        <button onClick={() => setSelectedUser(null)} className="btn-icon" style={{ width: "32px", height: "32px" }}>
          <X size={16} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
