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

    // Brute-force scroll snapping to (0, 0) to prevent browser window scrolling
    const lockScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("scroll", lockScroll, { passive: true });
    
    // Initial snap
    window.scrollTo(0, 0);

    return () => {
      // Remove class and event listener on unmount
      document.body.classList.remove("chat-page-active");
      document.documentElement.classList.remove("chat-page-active");
      window.removeEventListener("scroll", lockScroll);
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
