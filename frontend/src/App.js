import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Navbar from "./screens/Navbar"; // Import Navbar
import PredictionForm from "./screens/LessonPrediction";
import PeerPrediction from "./screens/PeerPrediction";
import LessonPrediction from "./screens/ContentPreference";
import AddCoursePage from "./screens/AddCourse";
import AddSpecialization from "./screens/AddSpecialization";
import AdminDashboard from "./screens/AdminDashboard";
import CourseDetailsPage from "./screens/CourseDetailsPage";
import SpecializationDetailPage from "./screens/SpecializationDetail";
import FilteredCourses from "./screens/FilteredContent";

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar displayed on all pages */}
      <Container sx={{ mt: 10 }}> {/* Ensure content doesn't overlap with fixed Navbar */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/lesson" element={<PredictionForm />} />
          <Route path="/peer" element={<PeerPrediction />} />
          <Route path="/content" element={<LessonPrediction />} />
          <Route path="/addcourse" element={<AddCoursePage />} />
          <Route path="/addspecial" element={<AddSpecialization />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/lesson/:id" element={<CourseDetailsPage />} />
          <Route path="/specialization/:specializationId" element={<SpecializationDetailPage />} />
          <Route path="/filtered" element={<FilteredCourses />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
