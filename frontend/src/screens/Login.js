import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Paper,
  Container,
  CssBaseline,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"; // Icon for the login form

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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper
        elevation={3}
        sx={{
          marginTop: 15,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2, // Rounded corners
        }}
      >
        {/* Avatar Icon */}
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>

        {/* Title */}
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Login
        </Typography>

        {/* Email Field */}
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }} // Add margin bottom
        />

        {/* Password Field */}
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }} // Add margin bottom
        />

        {/* Login Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{ mb: 2 }} // Add margin bottom
        >
          Login
        </Button>

        {/* Sign Up Link */}
        <Typography align="center">
          Don't have an account?{" "}
          <Link href="/signup" underline="hover" sx={{ fontWeight: "bold" }}>
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;