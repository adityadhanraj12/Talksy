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
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      return null;
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
      } else {
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
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
