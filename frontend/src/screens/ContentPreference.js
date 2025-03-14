import React, { useState } from "react";
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
    "number sequences marks": "",
    "perimeter marks": "",
    "ratio marks": "",
    "fractions/decimals marks": "",
    "indices marks": "",
    "algebra marks": "",
    "angles marks": "",
    "volume and capacity marks": "",
    "area marks": "",
    "probability marks": "",
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // Define categorical options
  const stressLevelOptions = ["Low", "Medium", "High"];
  const cognitivePerformanceOptions = ["Low", "Average", "High", "Very High"];

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setPrediction(null);

    try {
      // Send data to the Flask backend
      const response = await axios.post("http://127.0.0.1:5003/predict", formData);
      setPrediction(response.data.predicted_lesson);
    } catch (error) {
      setError("Error making prediction. Please try again.");
      console.error(error);
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
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Predict Lesson
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