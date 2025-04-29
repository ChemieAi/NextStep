import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CvBuilder from "../pages/CvBuilder";
import CvPreview from "../pages/CvPreview";
import Profile from "../pages/Profile";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cv-builder" element={<CvBuilder />} />
      <Route path="/cv-preview" element={<CvPreview />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default AppRouter;
