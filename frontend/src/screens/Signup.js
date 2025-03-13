// src/pages/Signup.js
import React, { useState } from "react";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("https://edu-platform-ten.vercel.app/api/auth/register", { name, email, password });
      alert("Signup Successful! Please Login");
      navigate("/login");
    } catch (err) {
      alert("Error Signing Up");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 5 }}>
      <Typography variant="h4" align="center">Sign Up</Typography>
      <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleSignup}>Sign Up</Button>
      <Typography align="center">
        Already have an account? <Link href="/login">Login</Link>
      </Typography>
    </Box>
  );
};

export default Signup;