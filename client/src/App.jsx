import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./components/layout/Dashboard";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import QRSwitch from "./pages/QRSwitch/QRSwitch";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  const user = localStorage.getItem("token");
  if (!user) {
    navigate("/login");
    return null;
  }

  return children;
};

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/createQR"
        element={
          <ProtectedRoute>
            <QRSwitch />
          </ProtectedRoute>
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

export default App;
