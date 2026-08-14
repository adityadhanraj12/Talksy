import { useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import { Loader } from "lucide-react";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } = useChat();
  const { authUser } = useAuth();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Format message time helper
  const formatMessageTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isMessagesLoading) {
    return (
      <div className="chat-container">
        <ChatHeader />
        <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <Loader style={{ animation: "spin 1.5s linear infinite", color: "var(--accent-primary)", marginBottom: "12px" }} size={32} />
          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Loading history...</span>
        </div>
        <MessageInput disabled={true} />
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <ChatHeader />

      <div className="messages-box">
        {messages.length === 0 ? (
          <div style={{ margin: "auto", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Say hello to {selectedUser.fullName}! 👋
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === authUser._id;
            return (
              <div
                key={message._id}
                className={`message-wrapper ${isMe ? "sender" : "receiver"}`}
              >
                <img
                  src={isMe ? (authUser.profilePic || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E") : (selectedUser.profilePic || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E")}
                  alt="avatar"
                  className="message-avatar"
                />
                <div className="message-bubble">
                  {message.image && (
                    <img src={message.image} alt="Sent attachment" className="message-image" />
                  )}
                  {message.text && <p className="message-content">{message.text}</p>}
                  <span className="message-time">{formatMessageTime(message.createdAt)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
