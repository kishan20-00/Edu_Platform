import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate();

  // Fetch courses and specializations on component mount
  useEffect(() => {
    const fetchCoursesAndSpecializations = async () => {
      try {
        // Fetch courses
        const coursesResponse = await axios.get(
          "https://edu-platform-ten.vercel.app/api/course"
        );
        setCourses(coursesResponse.data);
        console.log("Courses fetched:", coursesResponse.data);

        // Fetch specializations
        const specializationsResponse = await axios.get(
          "https://edu-platform-ten.vercel.app/api/specialize"
        );
        setSpecializations(specializationsResponse.data);
        console.log("Specializations fetched:", specializationsResponse.data);
      } catch (error) {
        console.error("Error fetching courses or specializations:", error);
      }
    };

    fetchCoursesAndSpecializations();
  }, []);

  // Fetch user profile if token exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false); // User is not logged in
        console.log("No token found. User is not logged in.");
        return;
      }

      try {
        // Fetch user profile to verify authentication
        const profileResponse = await axios.get(
          "https://edu-platform-ten.vercel.app/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsLoggedIn(true); // User is logged in
        console.log("User is logged in:", profileResponse.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsLoggedIn(false); // User is not logged in
      }
    };

    fetchUserProfile();
  }, []);

  // Handle card click
  const handleCardClick = (id, isSpecialization) => {
    if (!isLoggedIn) {
      console.log("User is not logged in. Cannot navigate.");
      return; // Do nothing if the user is not logged in
    }
    navigate(isSpecialization ? `/specialization/${id}` : `/lesson/${id}`);
  };

  // Filter courses and specializations based on search query
  const filteredCourses = courses.filter((course) =>
    course.lessonName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSpecializations = specializations.filter((specialization) =>
    specialization.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Edu Platform
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome to the best online education platform!
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search courses or specializations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mt: 4, mb: 4 }}
      />

      {/* Display Courses */}
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Lessons
      </Typography>
      <Grid container spacing={3}>
        {filteredCourses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: isLoggedIn ? "pointer" : "default", // Change cursor based on login status
                opacity: isLoggedIn ? 1 : 0.7, // Reduce opacity if not logged in
              }}
              onClick={() => handleCardClick(course._id, false)} // Make the card clickable only if logged in
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
        ))}
      </Grid>

      {/* Display Specializations */}
      <Typography variant="h4" sx={{ mt: 6, mb: 2 }}>
        Specializations
      </Typography>
      <Grid container spacing={3}>
        {filteredSpecializations.map((specialization) => (
          <Grid item key={specialization._id} xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: isLoggedIn ? "pointer" : "default", // Change cursor based on login status
                opacity: isLoggedIn ? 1 : 0.7, // Reduce opacity if not logged in
              }}
              onClick={() => handleCardClick(specialization._id, true)} // Make the card clickable only if logged in
            >
              <CardMedia
                component="img"
                height="120"
                image={specialization.image}
                alt={specialization.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {specialization.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Subject:</strong> {specialization.subject}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Complexity:</strong> {specialization.complexity}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;