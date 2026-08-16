import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, unreadMessages } = useChat();
  const { onlineUsers } = useAuth();
  
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  // Filter users based on search queries and online statuses
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const isOnline = onlineUsers.includes(user._id);
    
    if (showOnlineOnly) {
      return matchesSearch && isOnline;
    }
    return matchesSearch;
  });

  // Foolproof online contacts counter matching green dots
  const onlineContactsCount = users.filter((user) => onlineUsers.includes(user._id)).length;

  if (isUsersLoading) {
    return (
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title-row">
            <span className="sidebar-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={20} /> Loading Contacts...
            </span>
          </div>
        </div>
        <div className="user-list" style={{ overflow: "hidden" }}>
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="user-item" style={{ cursor: "default" }}>
              <div className="avatar-wrapper skeleton skeleton-avatar"></div>
              <div className="user-item-info" style={{ width: "100%" }}>
                <div className="skeleton skeleton-text title"></div>
                <div className="skeleton skeleton-text sub"></div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title-row">
          <span className="sidebar-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={20} />
            <span>Contacts</span>
          </span>
          <label className="sidebar-online-toggle">
            <span className="switch">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
              />
              <span className="slider"></span>
            </span>
            <span>Online ({onlineContactsCount})</span>
          </label>
        </div>

        {/* Search contacts input bar */}
        <div className="sidebar-search">
          <span className="input-icon">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="input-field"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="user-list">
        {filteredUsers.length === 0 ? (
          <div className="user-list-empty">
            {showOnlineOnly ? "No online contacts found" : "No contacts found"}
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const unreadCount = unreadMessages[user._id] || 0;
            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`user-item ${selectedUser?._id === user._id ? "active" : ""}`}
              >
                <div className="avatar-wrapper">
                  <img
                    src={user.profilePic || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E"}
                    alt={user.fullName}
                    className="avatar-img"
                  />
                  {isOnline && <span className="status-indicator"></span>}
                </div>
                <div className="user-item-info" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "8px" }}>
                  <div style={{ textAlign: "left", minWidth: 0 }}>
                    <div className="user-item-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.fullName}</div>
                    <div className="user-item-status">{isOnline ? "Online" : "Offline"}</div>
                  </div>
                  {unreadCount > 0 && (
                    <span className="unread-badge">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
