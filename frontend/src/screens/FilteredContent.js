import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FilteredCourses = () => {
  const [courses, setCourses] = useState([]);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user's content preference (subject) and courses by subject
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token
        return;
      }

      try {
        // Fetch user profile to get email
        const profileResponse = await axios.get(
          "https://edu-platform-ten.vercel.app/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const email = profileResponse.data.email;

        // Fetch content preference (subject) using email
        const contentPreferenceResponse = await axios.get(
          `https://edu-platform-ten.vercel.app/api/content?email=${email}`
        );
        const subjectName = contentPreferenceResponse.data.preferences;
        console.log(contentPreferenceResponse.data.preferences);
        setSubject(subjectName);

        // Fetch courses by subject using the backend endpoint
        const coursesResponse = await axios.get(
          `https://edu-platform-ten.vercel.app/api/course/filter/${subjectName}`
        );
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Filtered Courses
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Showing courses for subject: <strong>{subject}</strong>
      </Typography>

      {/* Display Filtered Courses */}
      <Grid container spacing={3}>
        {courses.length > 0 ? (
          courses.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(course._id)}
              >
                <CardMedia
                  component="img"
                  height="120"
                  image={course.image}
                  alt={course.lessonName}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {course.lessonName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {course.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Learning Material:</strong> {course.learningMaterial}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ mt: 4 }}>
            No courses found for this subject.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default FilteredCourses;