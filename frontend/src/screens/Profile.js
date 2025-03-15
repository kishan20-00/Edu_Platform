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
  Grid,
  Card,
  CardContent,
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
  const [stressLevel, setStressLevel] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [peerPrediction, setPeerPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cognitivePerformance, setCognitivePerformance] = useState("");
  const navigate = useNavigate();

  const timeFieldMapping = {
    numberSequencesTime: "number sequences time(s)",
    ratioTime: "ratio time(s)",
    perimeterTime: "perimeter time(s)",
    fractionsDecimalsTime: "fractions/decimals time(s)",
    indicesTime: "indices time(s)",
    algebraTime: "algebra time(s)",
    anglesTime: "angles time(s)",
    volumeCapacityTime: "volume and capacity time(s)",
    areaTime: "area time(s)",
    probabilityTime: "probability time(s)",
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
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
        setCognitivePerformance(profileResponse.data.cognitivePerformance || "Average");

        const email = profileResponse.data.email;

        const contentPreferenceResponse = await axios.get(
          `https://edu-platform-ten.vercel.app/api/content?email=${email}`
        );
        setContentPreference(contentPreferenceResponse.data);

        const lessonPreferenceResponse = await axios.get(
          `https://edu-platform-ten.vercel.app/api/lesson?email=${email}`
        );
        setLessonPreference(lessonPreferenceResponse.data);

        const peerPreferenceResponse = await axios.get(
          `https://edu-platform-ten.vercel.app/api/peer?email=${email}`
        );
        setPeerPreference(peerPreferenceResponse.data);

        await handlePeerPrediction(profileResponse.data);
      } catch (err) {
        console.error("Error fetching data", err);
        setSnackbarMessage("Failed to fetch data");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
      setUser(res.data.user);
    } catch (err) {
      console.error("Error updating profile", err);
      setSnackbarMessage("Failed to update profile");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleStressLevelChange = async (e) => {
    const selectedStressLevel = e.target.value;
    setStressLevel(selectedStressLevel);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const profileResponse = await axios.get(
        "https://edu-platform-ten.vercel.app/api/auth/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

      processedData.stress_level = selectedStressLevel;
      processedData.cognitive_performance = cognitivePerformance;

      const response = await axios.post("http://127.0.0.1:5003/predict", processedData);
      const predictedLesson = response.data.predicted_lesson;
      setPrediction(predictedLesson);

      if (user?.email) {
        await axios.post("https://edu-platform-ten.vercel.app/api/content/save", {
          email: user.email,
          preferences: predictedLesson,
          stressLevel: selectedStressLevel,
          cognitive: cognitivePerformance,
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

  const handlePeerPrediction = async (profileData) => {
    setLoading(true);
    try {
      const marksFields = [
        "numberSequencesMarks",
        "ratioMarks",
        "perimeterMarks",
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
        const marksArray = profileData[field];
        const lastMark = marksArray.length > 0 ? marksArray[marksArray.length - 1] : 0;
        const mappedField =
          field === "fractionsDecimalsMarks" ? "fractions/decimals marks" :
          field === "volumeCapacityMarks" ? "volume and capacity marks" :
          field.replace(/([A-Z])/g, " $1").toLowerCase();
        processedData[mappedField] = lastMark;
      });

      Object.keys(timeFieldMapping).forEach((profileField) => {
        const flaskField = timeFieldMapping[profileField];
        const timeValue = profileData[profileField];
        processedData[flaskField] = parseInt(timeValue) || 0;
      });

      processedData["Age"] = parseInt(profileData.age) || 0;
      processedData["Male/Female"] = profileData.Gender;
      processedData["Preferred Study Method"] = profileData.preferredStudyMethod;

      const response = await axios.post("http://localhost:5002/predict", processedData);
      const predictedClass = response.data["Predicted Class"];
      setPeerPrediction(predictedClass);

      if (profileData.email) {
        await axios.post("https://edu-platform-ten.vercel.app/api/peer/save", {
          email: profileData.email,
          preferences: predictedClass,
        });
      }
    } catch (error) {
      setSnackbarMessage("Error making peer prediction. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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

  const sortedLessonPreferences = lessonPreference
    ? lessonPreference.preferences
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 5)
        .map((pref, index) => ({ ...pref, rank: index + 1 }))
    : [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Left Side: Update Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
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

                {prediction && (
                  <Card sx={{ mt: 3, backgroundColor: "#f0f4c3" }}>
                    <CardContent>
                      <Typography variant="h6" color="text.primary">
                        Predicted Lesson: {prediction}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {peerPrediction && (
                  <Card sx={{ mt: 3, backgroundColor: "#ffccbc" }}>
                    <CardContent>
                      <Typography variant="h6" color="text.primary">
                        Predicted Peer Class: {peerPrediction}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

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
          </Paper>
        </Grid>

        {/* Right Side: Charts and Preferences */}
        <Grid item xs={12} md={6}>
          {/* Content Preference */}
          {contentPreference && (
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Content Preference
              </Typography>
              <TableContainer>
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
            </Paper>
          )}

          {/* Lesson Preference */}
          {lessonPreference && (
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Lesson Preference (Top 5)
              </Typography>
              <TableContainer>
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
            </Paper>
          )}

          {/* Peer Preference */}
          {peerPreference && (
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Peer Preference
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Preferences</TableCell>
                      <TableCell>Index No.{peerPreference.preferences}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Grid>
      </Grid>

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