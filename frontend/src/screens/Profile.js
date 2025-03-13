import React, { useEffect, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get("https://edu-platform-ten.vercel.app/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4">Profile</Typography>
      {user ? (
        <Box>
          <Typography variant="h6">Name: {user.name}</Typography>
          <Typography variant="h6">Email: {user.email}</Typography>
        </Box>
      ) : (
        <Typography>Loading...</Typography>
      )}
      <Button variant="contained" color="secondary" onClick={() => navigate("/home")}>Back to Home</Button>
    </Box>
  );
};

export default Profile;
