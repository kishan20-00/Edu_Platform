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
import ContentPrefer from "./screens/ContentPreference";
import AddCoursePage from "./screens/AddCourse";

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
          <Route path="/content" element={<ContentPrefer />} />
          <Route path="/addcourse" element={<AddCoursePage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
