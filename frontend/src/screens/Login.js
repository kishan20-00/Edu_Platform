import React, { useState } from "react";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Define admin credentials (for demonstration purposes)
  const ADMIN_EMAIL = "admin@gmail.com";
  const ADMIN_PASSWORD = "12345678";

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://edu-platform-ten.vercel.app/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token); // Store token in local storage

      // Check if the logged-in user is an admin
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        alert("Admin Login Successful!");
        navigate("/admin-dashboard"); // Redirect to admin dashboard
      } else {
        alert("Login Successful!");
        navigate("/"); // Redirect to home page
      }
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 5 }}>
      <Typography variant="h4" align="center">Login</Typography>
      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
      <Typography align="center">
        Don't have an account? <Link href="/signup">Sign Up</Link>
      </Typography>
    </Box>
  );
};

export default Login;