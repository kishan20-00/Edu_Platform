import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

function LessonPrediction() {
  // State to manage form data
  const [formData, setFormData] = useState({
    stress_level: "",
    cognitive_performance: "",
    "number sequences marks": 0,
    "perimeter marks": 0,
    "ratio marks": 0,
    "fractions/decimals marks": 0,
    "indices marks": 0,
    "algebra marks": 0,
    "angles marks": 0,
    "volume and capacity marks": 0,
    "area marks": 0,
    "probability marks": 0,
  });

  const [userEmail, setUserEmail] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user email and marks from profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://edu-platform-ten.vercel.app/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserEmail(res.data.email);

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

      const updatedFormData = { ...formData };
      marksFields.forEach((field) => {
        const marksArray = res.data[field];
        const lastMark = marksArray.length > 0 ? marksArray[marksArray.length - 1] : 0;
        updatedFormData[field.replace(/([A-Z])/g, " $1").toLowerCase()] = lastMark;
      });

      setFormData(updatedFormData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch user profile. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Define categorical options
  const stressLevelOptions = ["Low", "Medium", "High"];
  const cognitivePerformanceOptions = ["Low", "Average", "High", "Very High"];

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate and convert form data
  const validateAndConvertFormData = (data) => {
    const processedData = { ...data };

    // Convert numerical fields to numbers
    const numericalFields = [
      "number sequences marks",
      "perimeter marks",
      "ratio marks",
      "fractions/decimals marks",
      "indices marks",
      "algebra marks",
      "angles marks",
      "volume and capacity marks",
      "area marks",
      "probability marks",
    ];

    for (const field of numericalFields) {
      if (processedData[field] === "" || isNaN(processedData[field])) {
        processedData[field] = 0; // Default to 0 if empty or invalid
      } else {
        processedData[field] = parseFloat(processedData[field]);
      }
    }

    return processedData;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setPrediction(null);
    setLoading(true);

    try {
      // Validate and convert form data
      const processedData = validateAndConvertFormData(formData);

      // Send data to the Flask backend for prediction
      const response = await axios.post("http://127.0.0.1:5003/predict", processedData);
      const predictedLesson = response.data.predicted_lesson;
      setPrediction(predictedLesson);

      // Send prediction and user data to the backend API
      if (userEmail) {
        await axios.post("https://edu-platform-ten.vercel.app/api/content/save", {
          email: userEmail,
          preferences: predictedLesson,
          stressLevel: formData.stress_level,
          cognitive: formData.cognitive_performance,
        });
      } else {
        setError("User email not found. Please log in again.");
      }
    } catch (error) {
      setError("Error making prediction or saving data. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
        Lesson Prediction
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Stress Level (Categorical) */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Stress Level</InputLabel>
                <Select
                  name="stress_level"
                  value={formData.stress_level}
                  onChange={handleChange}
                  label="Stress Level"
                >
                  {stressLevelOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Cognitive Performance (Categorical) */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Cognitive Performance</InputLabel>
                <Select
                  name="cognitive_performance"
                  value={formData.cognitive_performance}
                  onChange={handleChange}
                  label="Cognitive Performance"
                >
                  {cognitivePerformanceOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Numerical Inputs */}
            {[
              "number sequences marks",
              "perimeter marks",
              "ratio marks",
              "fractions/decimals marks",
              "indices marks",
              "algebra marks",
              "angles marks",
              "volume and capacity marks",
              "area marks",
              "probability marks",
            ].map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  name={key}
                  label={key.replace(/_/g, " ")}
                  variant="outlined"
                  fullWidth
                  value={formData[key]}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>
            ))}

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Predicting..." : "Predict Lesson"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Display prediction or error */}
        {prediction && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h6" color="primary">
              Predicted Lesson: {prediction}
            </Typography>
          </Box>
        )}
        {error && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default LessonPrediction;