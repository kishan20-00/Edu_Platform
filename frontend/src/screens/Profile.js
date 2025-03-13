import React, { useEffect, useState } from "react";
import { Typography, Box, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details (Mock example - update as needed)
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      // Fetch user data from backend (replace with actual API call)
      setUser({
        name: "John Doe",
        email: "johndoe@example.com",
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4">Profile</Typography>
      {user ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Name: {user.name}</Typography>
          <Typography variant="h6">Email: {user.email}</Typography>
          <Button variant="contained" color="secondary" sx={{ mt: 3 }} onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ mt: 3 }}>
          Loading...
        </Typography>
      )}
    </Container>
  );
};

export default Profile;
