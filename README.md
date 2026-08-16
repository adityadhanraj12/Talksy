# 💬 Talksy - Premium Real-Time Chat Application

Talksy is a feature-rich, high-performance, real-time messaging application designed with a sleek, glassmorphic dark-themed user interface. Built using the modern MERN stack (MongoDB, Express, React, Node.js) and powered by Socket.io, it provides instant communication with low-latency messaging, image sharing, unread badges, and user-relationship management.

🌐 **Live Demo:** [https://talksy-neon-theta.vercel.app](https://talksy-neon-theta.vercel.app)

---

## ✨ Features

- **⚡ Real-Time Messaging**: Low-latency, instant messaging powered by Socket.io.
- **📸 Smart Image Attachments**: Direct image sending with **automatic frontend canvas compression** (rescaling to max 800px and compressing to 70% quality) for super-fast uploads, keeping payloads under 100KB.
- **🟢 Live Connection Tracking**: Instant indicators showing which contacts are online and offline.
- **📈 Real-Time Sidebar Sorting**: Contacts are automatically sorted by the most recent message (latest first). Real-time message exchanges instantly bubble that contact to the top.
- **🔴 Unread Message Badges**: Real-time unread message counts display next to contacts and reset automatically when opened.
- **🔔 Synthesized Audio Chimes**: Custom notification sound synthesized dynamically using the Web Audio API on new background messages.
- **🔒 Security & Auth**: Password hashing using `bcryptjs` and session authentication using secure, HTTP-only JWT cookies.
- **🛠️ Relationship Management**: Dropdown controls inside the chat header allowing users to **Clear Chat History** or **Block/Unblock Contacts** to control their feed.
- **👤 Interactive Profile Settings**: Complete settings panel allowing name changes, avatar image uploads (auto-compressed to under 15KB), current/new password changes, and a secure confirmation modal for account deletions.
- **📱 Responsive Layout Lock**: Mobile-optimized viewport locking down to 768px for portrait and landscape single-panel toggling, with a zero-window-scrollbar constraint to prevent header-scrolling layout bugs.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Functional Components & Hooks)
- **Vite** (Next-generation frontend tooling)
- **Lucide React** (Premium UI icons)
- **Tailwind CSS / Vanilla CSS** (Responsive custom glassmorphic styling system)
- **Axios** (HTTP client with custom configurations)
- **React Hot Toast** (Clean, non-intrusive alert toasts)

### Backend
- **Node.js** & **Express.js** (Server-side application logic)
- **Socket.io** (WebSockets connection gateway)
- **MongoDB** & **Mongoose** (NoSQL document model storing users & messages)
- **JSON Web Token (JWT)** (Secure token cookies)
- **Bcrypt.js** (Secure cryptographic password hashing)

---

## 📂 Directory Structure

```text
Talksy/
├── client/                     # Frontend Vite-React App
│   ├── src/
│   │   ├── components/         # Reusable UI Elements (Navbar, Sidebar, MessageInput, etc.)
│   │   ├── context/            # AuthContext & ChatContext State Containers
│   │   ├── lib/                # Shared utilities (axios, imageCompressor)
│   │   ├── pages/              # Page Components (HomePage, SignUpPage, ProfilePage, etc.)
│   │   ├── index.css           # Global custom CSS styles
│   │   └── main.jsx            # React Entry point
│   ├── index.html              # HTML Root index file
│   ├── vite.config.js          # Vite Compiler settings
│   └── vercel.json             # Vercel SPA routing & cache controls
└── server/                     # Backend Node-Express Server
    ├── config/                 # Database connector
    ├── controllers/            # Controller endpoints (auth, messages)
    ├── lib/                    # Shared modules (socket, utils)
    ├── middleware/             # Route guards (auth protect)
    ├── models/                 # Database Schemas (User, Message)
    ├── routes/                 # Express REST endpoint maps
    └── server.js               # Express application initializer
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory and add the following keys:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
CLIENT_URL=https://talksy-neon-theta.vercel.app
```

---

## 🚀 Local Installation & Setup

Follow these steps to run Talksy on your local machine:

### Prerequisites
- Node.js installed (v16+)
- A MongoDB cluster (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/adityadhanraj12/Talksy.git
cd Talksy
```

### 2. Set Up the Backend
```bash
cd server
npm install
# Create and configure server/.env as shown in Environment Variables
npm start
```
The server will boot up on `http://localhost:5001`.

### 3. Set Up the Frontend
```bash
cd ../client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser to experience the application locally!

---

## 🛡️ License

This project is licensed under the MIT License.
