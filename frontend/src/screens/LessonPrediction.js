import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, MenuItem, Grid } from "@mui/material";
import axios from "axios";

const featureColumns = [
  "Male/Female", "number sequences marks", "number sequences time(s)", "perimeter marks", "perimeter time(s)",
  "ratio marks", "ratio time(s)", "fractions/decimals marks", "fractions/decimals time(s)", "indices marks", "indices time(s)",
  "algebra marks", "algebra time(s)", "angles marks", "angles time(s)", "volume and capacity marks", "volume and capacity time(s)",
  "area marks", "area time(s)", "probability marks", "probability time(s)", "Preferred Study Method", "Disliked lesson"
];

const PredictionForm = () => {
  const [formData, setFormData] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  // Simulating getting user email from authentication (adjust based on your setup)
  const getUserEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://edu-platform-ten.vercel.app/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserEmail(res.data.email);
      console.log(res.data.email);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    getUserEmail();
  }, []);


  const handleChange = (event) => {
    const { name, value } = event.target;
    const numericValue = !isNaN(value) && value.trim() !== "" ? Number(value) : value;
    setFormData({ ...formData, [name]: numericValue });
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setPredictions([]);

      // Step 1: Make prediction request
      const response = await axios.post("http://127.0.0.1:5001/predict", formData);
      const data = response.data;

      if (data && Array.isArray(data["Top 5 Predicted Lessons"])) {
        setPredictions(data["Top 5 Predicted Lessons"]);

        // Step 2: Save prediction results to backend
        if (userEmail) {
          await axios.post("https://edu-platform-ten.vercel.app/api/lesson/save", {
            email: userEmail,
            preferences: data["Top 5 Predicted Lessons"],
          });
        }
      } else {
        setError("Unexpected response format from the server.");
      }
    } catch (err) {
      setError("Error making prediction. Please check inputs and try again.");
      console.error("Prediction error:", err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h4">Lesson Preference Prediction</Typography>
      
      {/* Display user email */}
      {userEmail && (
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Logged in as: <strong>{userEmail}</strong>
        </Typography>
      )}

      <Grid container spacing={2} sx={{ mt: 3 }}>
        {featureColumns.map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
            {feature === "Male/Female" ? (
              <TextField select fullWidth label={feature} name={feature} value={formData[feature] || ""} onChange={handleChange}>
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
              </TextField>
            ) : feature === "Preferred Study Method" || feature === "Disliked lesson" ? (
              <TextField fullWidth label={feature} name={feature} value={formData[feature] || ""} onChange={handleChange} />
            ) : (
              <TextField type="number" fullWidth label={feature} name={feature} value={formData[feature] || ""} onChange={handleChange} />
            )}
          </Grid>
        ))}
      </Grid>

      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit}>
        Predict & Save
      </Button>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      {Array.isArray(predictions) && predictions.length > 0 && (
        <Container sx={{ mt: 3, textAlign: "left" }}>
          <Typography variant="h5">Top 5 Predicted Lessons:</Typography>
          {predictions.map((prediction, index) => (
            <Typography key={index}>
              {prediction.lesson} - {Math.round(prediction.probability * 100)}%
            </Typography>
          ))}
        </Container>
      )}
    </Container>
  );
};

export default PredictionForm;
