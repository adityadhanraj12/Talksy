import { useChat } from "../context/ChatContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChat();
  const { onlineUsers } = useAuth();
  
  const isOnline = onlineUsers.includes(selectedUser._id);

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
          <div className="chat-header-name">{selectedUser.fullName}</div>
          <div className={`chat-header-status ${isOnline ? "online" : ""}`}>
            {isOnline ? "Online" : "Offline"}
          </div>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)} className="btn-icon" style={{ width: "32px", height: "32px" }}>
        <X size={16} />
      </button>
    </header>
  );
};

export default ChatHeader;
