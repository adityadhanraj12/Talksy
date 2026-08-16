import { useEffect } from "react";
import { useChat } from "../context/ChatContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import { MessageSquare } from "lucide-react";

const HomePage = () => {
  const { selectedUser } = useChat();

  useEffect(() => {
    // Add active class to body to lock viewport scrolling on Chat page
    document.body.classList.add("chat-page-active");
    document.documentElement.classList.add("chat-page-active");

    return () => {
      // Remove class on unmount
      document.body.classList.remove("chat-page-active");
      document.documentElement.classList.remove("chat-page-active");
    };
  }, []);

  return (
    <div className="main-content chat-page">
      <div className={`home-container glass-panel ${selectedUser ? "chat-active" : "list-active"}`}>
        <Sidebar />
        
        {selectedUser ? (
          <ChatContainer />
        ) : (
          <div className="chat-no-selection">
            <div className="no-selection-icon">
              <MessageSquare size={36} />
            </div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "8px", fontWeight: "700" }}>Welcome to Talksy!</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Select a contact from the sidebar to start a real-time conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
