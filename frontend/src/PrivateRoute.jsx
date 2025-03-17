import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/authentication/sign-in" replace />;
  }
  try {
    const decoded = jwtDecode(token);
    if (allowedRoles && !allowedRoles.includes(decoded.type)) {
      return <Navigate to="/dashboard" replace />;
    }
  } catch (error) {
    return <Navigate to="/authentication/sign-in" replace />;
  }
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
