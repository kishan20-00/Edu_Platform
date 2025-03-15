import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import axios from "axios";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  // Fetch courses and specializations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesResponse = await axios.get(
          "https://edu-platform-ten.vercel.app/api/course"
        );
        setCourses(coursesResponse.data);

        // Fetch specializations
        const specializationsResponse = await axios.get(
          "https://edu-platform-ten.vercel.app/api/special"
        );
        setSpecializations(specializationsResponse.data);
        console.log(specializationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Edu Platform
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome to the best online education platform!
      </Typography>

      {/* Display Courses */}
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={course.image}
                alt={course.lessonName}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {course.lessonName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    // Add navigation or action for viewing course details
                    console.log("View Course:", course._id);
                  }}
                >
                  View Course
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Display Specializations */}
      <Typography variant="h4" sx={{ mt: 6, mb: 2 }}>
        Specializations
      </Typography>
      <Grid container spacing={3}>
        {specializations.map((specialization) => (
          <Grid item key={specialization._id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={specialization.image}
                alt={specialization.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {specialization.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Subject: {specialization.subject}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complexity: {specialization.complexity}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    // Add navigation or action for viewing specialization details
                    console.log("View Specialization:", specialization._id);
                  }}
                >
                  View Specialization
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;