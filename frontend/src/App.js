import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import { Container } from "@mui/material";
import Home from "./screens/Home";
import Profile from "./screens/Profile";

function App() {
  return (
    <Router>
      <Container maxWidth="sm">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;