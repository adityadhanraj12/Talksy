import { useRef, useState } from "react";
import { useChat } from "../context/ChatContext.jsx";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = ({ disabled = false }) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChat();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
    };
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    const data = {
      text: text.trim(),
      image: imagePreview,
    };

    // Reset local inputs first for positive UX snap
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    await sendMessage(data);
  };

  return (
    <div className="chat-input-area">
      {imagePreview && (
        <div className="image-preview-container animate-fadeIn">
          <img src={imagePreview} alt="Preview" className="image-preview" />
          <button type="button" onClick={removeImage} className="image-preview-remove">
            <X size={12} />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <button
          type="button"
          className="btn-icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Attach Image"
        >
          <Image size={20} />
        </button>

        <input
          type="text"
          className="input-field"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
        />

        <button
          type="submit"
          className="chat-send-btn"
          disabled={disabled || (!text.trim() && !imagePreview)}
          title="Send Message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
