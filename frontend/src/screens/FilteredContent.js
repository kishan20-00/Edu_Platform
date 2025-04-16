import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FilteredCourses = () => {
  const [courses, setCourses] = useState([]);
  const [sortedCourses, setSortedCourses] = useState([]);
  const [subject, setSubject] = useState("");
  const [cognitivePerformance, setCognitivePerformance] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Define learning paths
  const learningPaths = {
    "High": ["quiz", "assignment", "video", "audio", "text", "pdf"],
    "Very High": ["quiz", "assignment", "pdf", "video", "audio", "text"],
    "Default": ["video", "audio", "pdf", "assignment", "text", "quiz"]
  };

  // Sort courses based on cognitive performance
  const sortCourses = (courses, performance) => {
    const path = learningPaths[performance] || learningPaths["Default"];
    return [...courses].sort((a, b) => {
      return path.indexOf(a.learningMaterial) - path.indexOf(b.learningMaterial);
    });
  };

  // Get current learning path
  const getCurrentPath = () => {
    if (["High", "Very High"].includes(cognitivePerformance)) {
      return learningPaths["High"];
    }
    return learningPaths["Default"];
  };

  // Fetch data
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
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const email = profileResponse.data.email;

        const contentPreferenceResponse = await axios.get(
          `https://edu-platform-ten.vercel.app/api/content?email=${email}`
        );
        
        const subjectName = contentPreferenceResponse.data.preferences;
        const cognitive = contentPreferenceResponse.data.cognitive || '';
        
        setSubject(subjectName);
        setCognitivePerformance(cognitive);

        const coursesResponse = await axios.get(
          `https://edu-platform-ten.vercel.app/api/course/filter/${encodeURIComponent(subjectName)}`
        );
        
        setCourses(coursesResponse.data);
        setSortedCourses(sortCourses(coursesResponse.data, cognitive));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Re-sort when cognitivePerformance changes
  useEffect(() => {
    if (courses.length > 0 && cognitivePerformance) {
      setSortedCourses(sortCourses(courses, cognitivePerformance));
    }
  }, [cognitivePerformance, courses]);

  // Handle card click
  const handleCardClick = (id) => {
    navigate(`/lesson/${id}`);
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ textAlign: "center", mt: 5, mb: 5 }}>
      <Typography variant="h3" gutterBottom>
        Filtered Courses
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Showing courses for subject: <strong>{subject}</strong>
      </Typography>
      
      {cognitivePerformance && (
        <>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Recommended Learning Path for {cognitivePerformance} Cognitive Performance
          </Typography>
          
          {/* Learning Path Visualization */}
          <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f5f5f5' }}>
            <Stepper alternativeLabel connector={<StepConnector sx={{ height: 2 }} />}>
              {getCurrentPath().map((material) => (
                <Step key={material}>
                  <StepLabel>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                      {material}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              {["High", "Very High"].includes(cognitivePerformance) ? (
                "Start with quizzes to challenge your understanding, then reinforce with assignments and multimedia content."
              ) : (
                "Begin with engaging video content, followed by audio materials, before attempting quizzes."
              )}
            </Typography>
          </Paper>
        </>
      )}

      {/* Course Cards with Material Type Indicators */}
      <Grid container spacing={3}>
        {sortedCourses.length > 0 ? (
          sortedCourses.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  borderLeft: `4px solid ${
                    course.learningMaterial === 'quiz' ? '#ff5722' :
                    course.learningMaterial === 'assignment' ? '#4caf50' :
                    course.learningMaterial === 'video' ? '#2196f3' :
                    course.learningMaterial === 'audio' ? '#9c27b0' : '#607d8b'
                  }`
                }}
                onClick={() => handleCardClick(course._id)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.image}
                    alt={course.lessonName}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      px: 1,
                      borderRadius: 1,
                      textTransform: 'capitalize'
                    }}
                  >
                    {course.learningMaterial}
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {course.lessonName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {course.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ mt: 4, width: '100%' }}>
            No courses found for this subject.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default FilteredCourses;