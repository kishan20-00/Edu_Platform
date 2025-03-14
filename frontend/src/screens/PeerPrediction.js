import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Grid, Paper } from "@mui/material";

function PeerPrediction() {
  const [formData, setFormData] = useState({
    "Age": "",
    "number sequences marks": "",
    "number sequences time(s)": "",
    "ratio marks": "",
    "ratio time(s)": "",
    "perimeter marks": "",
    "perimeter time(s)": "",
    "fractions/decimals marks": "",
    "fractions/decimals time(s)": "",
    "indices marks": "",
    "indices time(s)": "",
    "algebra marks": "",
    "algebra time(s)": "",
    "angles marks": "",
    "angles time(s)": "",
    "volume and capacity marks": "",
    "volume and capacity time(s)": "",
    "area marks": "",
    "area time(s)": "",
    "probability marks": "",
    "probability time(s)": "",
    "Male/Female": "",
    "Preferred Study Method": ""
  });

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

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setResult(null);
    
    try {
      const response = await axios.post("http://localhost:5002/predict", {
        ...formData,
        "Age": parseInt(formData["Age"]),
        "number sequences marks": parseInt(formData["number sequences marks"]),
        "number sequences time(s)": parseInt(formData["number sequences time(s)"]),
        "ratio marks": parseInt(formData["ratio marks"]),
        "ratio time(s)": parseInt(formData["ratio time(s)"]),
        "perimeter marks": parseInt(formData["perimeter marks"]),
        "perimeter time(s)": parseInt(formData["perimeter time(s)"]),
        "fractions/decimals marks": parseInt(formData["fractions/decimals marks"]),
        "fractions/decimals time(s)": parseInt(formData["fractions/decimals time(s)"]),
        "indices marks": parseInt(formData["indices marks"]),
        "indices time(s)": parseInt(formData["indices time(s)"]),
        "algebra marks": parseInt(formData["algebra marks"]),
        "algebra time(s)": parseInt(formData["algebra time(s)"]),
        "angles marks": parseInt(formData["angles marks"]),
        "angles time(s)": parseInt(formData["angles time(s)"]),
        "volume and capacity marks": parseInt(formData["volume and capacity marks"]),
        "volume and capacity time(s)": parseInt(formData["volume and capacity time(s)"]),
        "area marks": parseInt(formData["area marks"]),
        "area time(s)": parseInt(formData["area time(s)"]),
        "probability marks": parseInt(formData["probability marks"]),
        "probability time(s)": parseInt(formData["probability time(s)"])
      });

      setResult(response.data["Predicted Class"]);
      setError(null);
      if (userEmail) {
        await axios.post("https://edu-platform-ten.vercel.app/api/peer/save", {
          email: userEmail,
          preferences: response.data["Predicted Class"],
        });
      } else {
        setError("Unexpected response format from the server.");
      }
    } catch (error) {
      setError("Error sending request. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Student Performance Prediction
      </Typography>
      <Grid container spacing={2} component={Paper} style={{ padding: 20 }}>
        {Object.keys(formData).map((key) => (
          <Grid item xs={12} sm={6} key={key}>
            <TextField
              name={key}
              label={key}
              variant="outlined"
              margin="normal"
              fullWidth
              type={typeof formData[key] === "number" ? "number" : "text"}
              value={formData[key]}
              onChange={handleChange}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
            Predict
          </Button>
        </Grid>
        {result && (
          <Grid item xs={12}>
            <Paper style={{ marginTop: 20, padding: 20 }}>
              <Typography variant="h6">Predicted Class: {result}</Typography>
            </Paper>
          </Grid>
        )}
        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
            </Grid>
        )}
        </Grid>
    </Container>
  );
}

export default PeerPrediction;
