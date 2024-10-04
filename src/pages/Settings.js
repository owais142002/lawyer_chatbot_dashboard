import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig"; // Use centralized base URL
import { useNavigate } from "react-router-dom"; // For redirecting after login

function Settings() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // For redirection

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      setIsAuthenticated(true);
      setMessage("You are already logged in.");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });

      if (response.data.status === 200) {
        const token = response.data.data.access_token;
        localStorage.setItem("access_token", token);
        setMessage("Logged in successfully.");
        setIsAuthenticated(true);
        navigate("/"); // Redirect to home after login
      } else {
        setMessage("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setMessage("Logged out successfully.");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Settings</h2>
        {isAuthenticated ? (
          <div>
            <p className="text-green-600 mb-4">{message}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Authenticate
            </button>
          </form>
        )}
        {message && <p className="text-red-600 mt-4">{message}</p>}
      </div>
    </div>
  );
}

export default Settings;
