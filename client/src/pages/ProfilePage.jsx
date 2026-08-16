import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Camera, User, Mail, Loader, KeyRound, Trash2, AlertTriangle, X, Lock } from "lucide-react";
import { compressImage } from "../lib/imageCompressor.js";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, changePassword, deleteAccount } = useAuth();
  const [selectedImg, setSelectedImg] = useState(null);
  
  // Profile update state
  const [newName, setNewName] = useState(authUser?.fullName || "");
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      // Compress profile image to 300x300 (ideal size) and 70% quality
      const compressedBase64 = await compressImage(file, 300, 300, 0.7);
      setSelectedImg(compressedBase64);
      await updateProfile({ profilePic: compressedBase64 });
    } catch (error) {
      toast.error("Failed to process profile image");
      console.error(error);
    }
  };

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return toast.error("Name cannot be empty");
    if (newName.trim() === authUser?.fullName) return toast.error("Name is already set to this value");

    setIsUpdatingName(true);
    const success = await updateProfile({ fullName: newName.trim() });
    setIsUpdatingName(false);
    if (success) {
      toast.success("Name updated successfully!");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      return toast.error("All password fields are required");
    }
    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    setIsUpdatingPassword(true);
    const success = await changePassword(currentPassword, newPassword);
    setIsUpdatingPassword(false);
    
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (confirmEmail.trim().toLowerCase() !== authUser?.email.toLowerCase()) {
      return toast.error("Email address does not match");
    }

    setIsDeleting(true);
    await deleteAccount();
    setIsDeleting(false);
    setShowDeleteModal(false);
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
      <div className="profile-container animate-fadeIn">
        
        {/* Left Side: Avatar & Account Metadata */}
        <div className="profile-card glass-panel">
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "6px" }}>Profile Avatar</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "28px" }}>
            Upload a profile photo
          </p>

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
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "24px", textAlign: "center" }}>
            {isUpdatingProfile ? "Uploading image..." : "Click the camera icon to update your photo"}
          </p>

          <div className="profile-meta-row">
            <span>Email Address</span>
            <span style={{ color: "var(--text-secondary)" }}>{authUser?.email}</span>
          </div>
          <div className="profile-meta-row">
            <span>Member Since</span>
            <span>{formatDate(authUser?.createdAt)}</span>
          </div>
          <div className="profile-meta-row" style={{ border: "none", paddingTop: "12px" }}>
            <span>Account Status</span>
            <span style={{ color: "var(--success)", fontWeight: "600" }}>Active</span>
          </div>
        </div>

        {/* Right Side: Account Settings Forms */}
        <div className="profile-settings-card glass-panel">
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "20px" }}>Account Settings</h2>

          {/* Form 1: Edit Name */}
          <form onSubmit={handleNameUpdate} className="profile-settings-form">
            <div className="input-group">
              <label htmlFor="editName" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                <User size={14} /> Update Full Name
              </label>
              <div className="input-with-icon" style={{ marginTop: 8 }}>
                <span className="input-icon">
                  <User size={18} />
                </span>
                <input
                  id="editName"
                  type="text"
                  className="input-field"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: "flex-end", padding: "10px 20px", fontSize: "0.9rem" }} disabled={isUpdatingName}>
              {isUpdatingName ? (
                <>
                  <Loader className="animate-spin" size={16} style={{ animation: "spin 1s linear infinite" }} />
                  Saving...
                </>
              ) : (
                "Save Name"
              )}
            </button>
          </form>

          <hr style={{ border: "none", borderTop: "1px solid var(--glass-border)", margin: "24px 0" }} />

          {/* Form 2: Change Password */}
          <form onSubmit={handlePasswordUpdate} className="profile-settings-form">
            <div className="input-group">
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                <KeyRound size={14} /> Change Password
              </label>
              
              <div className="input-with-icon" style={{ marginTop: 12 }}>
                <span className="input-icon">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  className="input-field"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                />
              </div>

              <div className="input-with-icon" style={{ marginTop: 12 }}>
                <span className="input-icon">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  className="input-field"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password (min 6 characters)"
                />
              </div>
            </div>
            <button type="submit" className="btn-secondary" style={{ alignSelf: "flex-end", padding: "10px 20px", fontSize: "0.9rem" }} disabled={isUpdatingPassword}>
              {isUpdatingPassword ? (
                <>
                  <Loader className="animate-spin" size={16} style={{ animation: "spin 1s linear infinite" }} />
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>

          <hr style={{ border: "none", borderTop: "1px solid var(--glass-border)", margin: "24px 0" }} />

          {/* Danger Zone: Delete Account */}
          <div className="danger-zone">
            <div className="danger-zone-info">
              <h3 className="danger-zone-title">
                <AlertTriangle size={18} /> Danger Zone
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginTop: 4 }}>
                Permanently delete your account and all message history. This action is irreversible.
              </p>
            </div>
            <button
              type="button"
              className="btn-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>

      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel animate-scaleIn">
            <div className="modal-header">
              <div className="modal-title-container">
                <AlertTriangle size={20} style={{ color: "var(--error)" }} />
                <span>Delete Account Permanently?</span>
              </div>
              <button className="btn-icon" onClick={() => { setShowDeleteModal(false); setConfirmEmail(""); }}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                This will delete your profile, messages, attachments, and files permanently. To verify, please type your email address **`{authUser?.email}`** below:
              </p>
              <div className="input-group" style={{ marginTop: 16 }}>
                <input
                  type="email"
                  className="input-field"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="Enter your email to confirm"
                  style={{ borderColor: confirmEmail.trim().toLowerCase() === authUser?.email.toLowerCase() ? "var(--success)" : "rgba(255,255,255,0.1)" }}
                />
              </div>
            </div>
            <div className="modal-body-confirm" style={{ padding: "0 24px 20px" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontStyle: "italic" }}>
                Warning: Deleting this account will also remove all your messages from the chat histories of your friends.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => { setShowDeleteModal(false); setConfirmEmail(""); }} disabled={isDeleting}>
                Cancel
              </button>
              <button
                className="btn-danger-confirm"
                onClick={handleDeleteAccount}
                disabled={confirmEmail.trim().toLowerCase() !== authUser?.email.toLowerCase() || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader className="animate-spin" size={16} style={{ animation: "spin 1s linear infinite" }} />
                    Deleting...
                  </>
                ) : (
                  "Delete My Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
