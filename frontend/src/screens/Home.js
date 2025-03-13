import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); // Check if user is logged in

  return (
    <>
      <AppBar position="fixed" sx={{ width: "100%" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Edu Platform
          </Typography>
          {isLoggedIn ? (
            <Button color="inherit" onClick={() => navigate("/profile")}>Profile</Button>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h3">Edu Platform</Typography>
        <Typography variant="subtitle1">Welcome to the best online education platform!</Typography>
      </Container>
    </>
  );
};

export default Home;
