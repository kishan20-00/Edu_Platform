import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  Container,
  Paper,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phoneNum: "",
    Gender: "",
    preferredStudyMethod: "",
    dislikedLesson: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  // Fetch user data on component mount
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
        setFormData({
          name: res.data.name,
          age: res.data.age,
          phoneNum: res.data.phoneNum,
          Gender: res.data.Gender,
          preferredStudyMethod: res.data.preferredStudyMethod,
          dislikedLesson: res.data.dislikedLesson,
        });
      } catch (err) {
        console.error("Error fetching user data", err);
        setSnackbarMessage("Failed to fetch user data");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
    fetchUser();
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        "https://edu-platform-ten.vercel.app/api/auth/updateProfile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbarMessage("Profile updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setUser(res.data.user); // Update the user state with the latest data
    } catch (err) {
      console.error("Error updating profile", err);
      setSnackbarMessage("Failed to update profile");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Close the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Options for dropdowns
  const genderOptions = ["M", "F"];
  const studyMethodOptions = ["figures", "Only school lessons", "practicing"];
  const dislikedLessonOptions = [
    "circle theory",
    "decimals",
    "fractions",
    "geometry",
    "none",
    "percentages",
    "probability",
    "roman numbers",
    "area",
    "set theory",
    "simaltaneous equations",
    "triangle theory",
    "triangles",
    "volume and capacity"
    ];

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Profile
        </Typography>
        {user ? (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNum"
              value={formData.phoneNum}
              onChange={handleChange}
              margin="normal"
              required
            />

            {/* Gender Dropdown */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Gender</InputLabel>
              <Select
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                label="Gender"
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Preferred Study Method Dropdown */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Preferred Study Method</InputLabel>
              <Select
                name="preferredStudyMethod"
                value={formData.preferredStudyMethod}
                onChange={handleChange}
                label="Preferred Study Method"
              >
                {studyMethodOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Disliked Lesson Dropdown */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Disliked Lesson</InputLabel>
              <Select
                name="dislikedLesson"
                value={formData.dislikedLesson}
                onChange={handleChange}
                label="Disliked Lesson"
              >
                {dislikedLessonOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
              <Button type="submit" variant="contained" color="primary">
                Update Profile
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;