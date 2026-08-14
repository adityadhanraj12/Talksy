import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Camera, User, Mail, Loader } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuth();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 5MB just to be safe, though server handles up to 10MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="main-content">
      <div className="profile-card glass-panel animate-fadeIn">
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "6px" }}>Profile</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "28px" }}>
          Manage your personal account settings
        </p>

        {/* Profile Avatar Upload */}
        <div className="profile-avatar-container">
          <img
            src={selectedImg || authUser?.profilePic || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E"}
            alt="Profile Avatar"
            className="profile-avatar-img"
          />
          <label htmlFor="avatar-upload" className="profile-avatar-upload">
            {isUpdatingProfile ? (
              <Loader size={18} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Camera size={18} />
            )}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
              disabled={isUpdatingProfile}
            />
          </label>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
          {isUpdatingProfile ? "Uploading image..." : "Click the camera icon to update your photo"}
        </p>

        {/* User Info Fields */}
        <div className="profile-info-group">
          <div className="profile-info-label">
            <User size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
            Full Name
          </div>
          <div className="profile-info-value">{authUser?.fullName}</div>
        </div>

        <div className="profile-info-group">
          <div className="profile-info-label">
            <Mail size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
            Email Address
          </div>
          <div className="profile-info-value">{authUser?.email}</div>
        </div>

        {/* Metadata Details */}
        <div className="profile-meta-row">
          <span>Member Since</span>
          <span>{formatDate(authUser?.createdAt)}</span>
        </div>
        <div className="profile-meta-row" style={{ marginTop: "12px", border: "none", paddingTop: "0" }}>
          <span>Account Status</span>
          <span style={{ color: "var(--success)", fontWeight: "600" }}>Active</span>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
