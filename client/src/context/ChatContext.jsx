import { createContext, useContext, useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios.js";
import { useAuth } from "./AuthContext.jsx";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { socket, authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});

  // Reset unread count when user selects a conversation
  useEffect(() => {
    if (selectedUser?._id) {
      setUnreadMessages((prev) => ({
        ...prev,
        [selectedUser._id]: 0,
      }));
    }
  }, [selectedUser]);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.35);
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const updateLastMessageTime = (userId, time = new Date()) => {
    setUsers((prevUsers) => {
      const updated = prevUsers.map((u) => {
        if (u._id === userId) {
          return { ...u, lastMessageTime: time };
        }
        return u;
      });
      // Re-sort: latest message time first, then alphabetically
      return [...updated].sort((a, b) => {
        const t1 = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
        const t2 = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
        if (t1 !== t2) return t2 - t1;
        return a.fullName.localeCompare(b.fullName);
      });
    });
  };

  const getUsers = async () => {
    setIsUsersLoading(true);
    try {
      const res = await axiosInstance.get("/api/messages/users");
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setIsUsersLoading(false);
    }
  };

  const getMessages = async (userId) => {
    setIsMessagesLoading(true);
    try {
      const res = await axiosInstance.get(`/api/messages/${userId}`);
      setMessages(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const res = await axiosInstance.post(`/api/messages/send/${selectedUser._id}`, messageData);
      setMessages((prev) => [...prev, res.data]);
      // Update last message time on frontend to sort selected user to top
      updateLastMessageTime(selectedUser._id, res.data.createdAt);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      return null;
    }
  };

  const clearChat = async (userId) => {
    try {
      await axiosInstance.delete(`/api/messages/clear/${userId}`);
      setMessages([]);
      toast.success("Chat history cleared");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear chat");
      return false;
    }
  };

  // Real-time socket message listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      // Append if the message belongs to the active conversation
      const isFromSelectedUser = newMessage.senderId === selectedUser?._id;
      if (isFromSelectedUser) {
        setMessages((prev) => [...prev, newMessage]);
        // Update last message time for selected user
        updateLastMessageTime(selectedUser._id, newMessage.createdAt);
      } else {
        // Increment unread count
        setUnreadMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
        
        // Play soft synthesized alert sound
        playNotificationSound();

        // Update last message time for sender so they bubble up!
        updateLastMessageTime(newMessage.senderId, newMessage.createdAt);

        // Show notification toast for messages from other users
        const sender = users.find(u => u._id === newMessage.senderId);
        if (sender) {
          toast(`New message from ${sender.fullName}`, {
            icon: '💬',
            duration: 3000,
          });
        }
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, users]);

  return (
    <ChatContext.Provider
      value={{
        users,
        messages,
        selectedUser,
        isUsersLoading,
        isMessagesLoading,
        unreadMessages,
        getUsers,
        getMessages,
        sendMessage,
        clearChat,
        setSelectedUser,
        setUnreadMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
