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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
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
  const [contentPreference, setContentPreference] = useState(null);
  const [lessonPreference, setLessonPreference] = useState(null);
  const [peerPreference, setPeerPreference] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [stressLevel, setStressLevel] = useState(""); // State for stress level
  const [prediction, setPrediction] = useState(null); // State for predicted lesson
  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();

  // Fetch user data and preferences on component mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user profile
        const profileResponse = await axios.get(
          "https://edu-platform-ten.vercel.app/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(profileResponse.data);
        setFormData({
          name: profileResponse.data.name,
          age: profileResponse.data.age,
          phoneNum: profileResponse.data.phoneNum,
          Gender: profileResponse.data.Gender,
          preferredStudyMethod: profileResponse.data.preferredStudyMethod,
          dislikedLesson: profileResponse.data.dislikedLesson,
        });

        const email = profileResponse.data.email;

        // Fetch content preference
        const contentPreferenceResponse = await axios.get(
          `https://edu-platform-ten.vercel.app/api/content?email=${email}`
        );
        setContentPreference(contentPreferenceResponse.data);

        // Fetch lesson preference
        const lessonPreferenceResponse = await axios.get(
          `https://edu-platform-ten.vercel.app/api/lesson?email=${email}`
        );
        setLessonPreference(lessonPreferenceResponse.data);

        // Fetch peer preference
        const peerPreferenceResponse = await axios.get(
          `https://edu-platform-ten.vercel.app/api/peer?email=${email}`
        );
        setPeerPreference(peerPreferenceResponse.data);
      } catch (err) {
        console.error("Error fetching data", err);
        setSnackbarMessage("Failed to fetch data");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchData();
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

  // Handle stress level change
  const handleStressLevelChange = async (e) => {
    const selectedStressLevel = e.target.value;
    setStressLevel(selectedStressLevel);
    setLoading(true);

    try {
      // Fetch the latest marks from the user's profile
      const token = localStorage.getItem("token");
      const profileResponse = await axios.get(
        "https://edu-platform-ten.vercel.app/api/auth/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Extract the last value from each marks array
      const marksFields = [
        "numberSequencesMarks",
        "perimeterMarks",
        "ratioMarks",
        "fractionsDecimalsMarks",
        "indicesMarks",
        "algebraMarks",
        "anglesMarks",
        "volumeCapacityMarks",
        "areaMarks",
        "probabilityMarks",
      ];

      const processedData = {};
      marksFields.forEach((field) => {
        const marksArray = profileResponse.data[field];
        const lastMark = marksArray.length > 0 ? marksArray[marksArray.length - 1] : 0;
        processedData[field.replace(/([A-Z])/g, " $1").toLowerCase()] = lastMark;
      });

      // Add stress level and cognitive performance to the data
      processedData.stress_level = selectedStressLevel;
      processedData.cognitive_performance = contentPreference?.cognitive || "Average";

      // Send data to the Flask backend for prediction
      const response = await axios.post("http://127.0.0.1:5003/predict", processedData);
      const predictedLesson = response.data.predicted_lesson;
      setPrediction(predictedLesson);

      // Save the prediction to the database
      if (user?.email) {
        await axios.post("https://edu-platform-ten.vercel.app/api/content/save", {
          email: user.email,
          preferences: predictedLesson,
          stressLevel: selectedStressLevel,
          cognitive: contentPreference?.cognitive,
        });
      }
    } catch (error) {
      setSnackbarMessage("Error making prediction or saving data. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error(error);
    } finally {
      setLoading(false);
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
    "volume and capacity",
  ];
  const stressLevelOptions = ["Low", "Medium", "High"];

  // Sort lesson preferences by probability and assign ranks (1-5)
  const sortedLessonPreferences = lessonPreference
    ? lessonPreference.preferences
        .sort((a, b) => b.probability - a.probability) // Sort by probability (descending)
        .slice(0, 5) // Limit to top 5 lessons
        .map((pref, index) => ({ ...pref, rank: index + 1 })) // Add rank (1-5)
    : [];

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

            

            {/* Loading Spinner */}
            {loading && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <CircularProgress />
              </Box>
            )}

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

        {/* Stress Level Dropdown */}
        <FormControl fullWidth margin="normal" required>
              <InputLabel>How are you feeling today?</InputLabel>
              <Select
                name="stress_level"
                value={stressLevel}
                onChange={handleStressLevelChange}
                label="How are you feeling today?"
                disabled={loading}
              >
                {stressLevelOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Display Prediction */}
            {prediction && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  Predicted Lesson: {prediction}
                </Typography>
              </Box>
            )}

        {/* Display Content Preference */}
        {contentPreference && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Content Preference
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Preferences</TableCell>
                    <TableCell>{contentPreference.preferences}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Stress Level</TableCell>
                    <TableCell>{contentPreference.stressLevel}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cognitive</TableCell>
                    <TableCell>{contentPreference.cognitive}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Display Lesson Preference */}
        {lessonPreference && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Lesson Preference (Top 5)
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Lesson</TableCell>
                    <TableCell>Probability</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedLessonPreferences.map((pref, index) => (
                    <TableRow key={index}>
                      <TableCell>{pref.rank}</TableCell>
                      <TableCell>{pref.lesson}</TableCell>
                      <TableCell>{pref.probability}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Display Peer Preference */}
        {peerPreference && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Peer Preference
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Preferences</TableCell>
                    <TableCell>{peerPreference.preferences}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
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