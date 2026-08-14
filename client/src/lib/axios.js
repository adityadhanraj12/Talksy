import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://talksy-oq4x.onrender.com",
  withCredentials: true, // Send cookies with requests
});
