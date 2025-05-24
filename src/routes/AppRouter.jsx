import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CvBuilder from "../pages/CvBuilder";
import CvPreview from "../pages/CvPreview";
import Profile from "../pages/Profile";
import RouteChangeLoader from "../components/RouteChangeLoader";
import Contact from '../pages/Contact';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyWaiting from '../pages/VerifyWaiting';
import ProtectedRoute from "../components/ProtectedRoute";
import UpdatePassword from "../pages/UpdatePassword";

const AppRouter = () => {
  return (
    <RouteChangeLoader>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* ProtectedRoute ile korunan rotalar */}
        <Route path="/cv-builder" element={
          <ProtectedRoute>
            <CvBuilder />
          </ProtectedRoute>
        } />

        <Route path="/cv-preview" element={
          <ProtectedRoute>
            <CvPreview />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route
          path="/update-password"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          } />

        {/* Diğer rotalar */}
        <Route path="/iletisim" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-waiting" element={<VerifyWaiting />} />
      </Routes>
    </RouteChangeLoader>
  );
};

export default AppRouter;
