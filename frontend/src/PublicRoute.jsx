import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      // Only redirect if a valid type exists in the token payload
      if (decoded && decoded.type) {
        return <Navigate to="/dashboard" replace />;
      }
    } catch (error) {
      // If token is invalid, clear it and allow access
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return children;
    }
  }
  return children;
};

export default PublicRoute;
