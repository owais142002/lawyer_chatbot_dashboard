import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token"); // Check if token exists in localStorage
  return token ? children : <Navigate to="/settings" />; // Redirect to Settings if no token
}

export default PrivateRoute;
