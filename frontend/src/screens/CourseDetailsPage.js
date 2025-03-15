import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  TextField,
  Rating,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";

const CourseDetailsPage = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const [course, setCourse] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]); // Store user's quiz answers
  const [correctAnswers, setCorrectAnswers] = useState([]); // Store correct/incorrect results
  const [quizScore, setQuizScore] = useState(0); // Store quiz score
  const [quizSubmitted, setQuizSubmitted] = useState(false); // Track quiz submission
  const navigate = useNavigate();

  // Fetch course details and reviews on component mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Fetch course details
        const courseResponse = await axios.get(
          `https://edu-platform-ten.vercel.app/api/course/${id}`
        );
        setCourse(courseResponse.data);
        console.log(courseResponse.data.subject);

        // Fetch reviews for the course
        const reviewsResponse = await axios.get(
          `https://edu-platform-ten.vercel.app/api/reviews/${id}`
        );
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourse();
  }, [id]);

  // Handle course completion
  const handleComplete = () => {
    setIsCompleted(true);
    alert("Course marked as completed!");
    navigate('/');
  };

  // Handle quiz answer input change
  const handleQuizAnswerChange = (index, answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = answer.toLowerCase(); // Store answer in lowercase
    setUserAnswers(newAnswers);
  };

  // Handle quiz submission
  const handleQuizSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to submit the quiz.");
        return;
      }

      // Check if correct answers are available
      if (!course.quizAnswers || course.quizQuestions.length !== course.quizAnswers.length) {
        alert("Quiz answers are not available. Please contact support.");
        return;
      }

      // Compare user answers with correct answers
      const results = userAnswers.map((answer, index) => 
        answer === course.quizAnswers[index].toLowerCase()
      );
      setCorrectAnswers(results);

      // Calculate quiz score (5 points per correct answer)
      const score = results.reduce((acc, isCorrect) => acc + (isCorrect ? 20 : 0), 0);
      setQuizScore(score);

      // Update user profile with quiz marks
      const updateResponse = await axios.put(
        "https://edu-platform-ten.vercel.app/api/auth/updateProfile",
        {
          [getMarksField(course.subject)]: score, // Update the corresponding marks field
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (updateResponse.data.message === "Profile updated successfully") {
        setQuizSubmitted(true);
        alert(`Quiz submitted successfully! You scored ${score} points.`);
      } else {
        alert("Failed to update quiz marks.");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz.");
    }
  };

  // Helper function to map subject to the corresponding marks field
  const getMarksField = (subject) => {
    const subjectToFieldMap = {
      "number sequence": "numberSequencesMarks",
      "perimeter": "perimeterMarks",
      "ratio": "ratioMarks",
      "fractions/decimals": "fractionsDecimalsMarks",
      "indices": "indicesMarks",
      "algebra": "algebraMarks",
      "angles": "anglesMarks",
      "volume and capacity": "volumeCapacityMarks",
      "area": "areaMarks",
      "probability": "probabilityMarks",
    };
    return subjectToFieldMap[subject] || "";
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to submit a review.");
        return;
      }

      // Submit the review
      await axios.post(
        `https://edu-platform-ten.vercel.app/api/reviews`,
        {
          courseId: id,
          rating,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the reviews state
      setReviews([...reviews, { rating, comment }]);
      setComment("");
      setRating(0);
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  if (!course) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4, marginTop: 4, position: "relative" }}>
        {/* Complete Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleComplete}
          disabled={isCompleted}
          sx={{ position: "absolute", top: 16, right: 16 }}
          startIcon={<CheckCircleIcon />}
        >
          Complete
        </Button>

        {/* Course Content Header */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <DescriptionIcon sx={{ fontSize: 30, color: "primary.main", marginRight: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {course.lessonName}
          </Typography>
        </Box>

        {/* Divider Line */}
        <Divider sx={{ marginBottom: 2 }} />

        {/* Description Section */}
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginRight: 1 }}>
            Description:
          </Typography>
        </Box>
        <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
          {course.description}
        </Typography>
      </Paper>

      {/* Display Course Content Based on Learning Material */}
      {course.learningMaterial === "video" && (
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${course.source.split("/").pop()}`}
          title="Course Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ marginBottom: 24, borderRadius: 8 }}
        />
      )}

      {course.learningMaterial === "audio" && (
        <audio controls style={{ width: "100%", marginBottom: 24 }}>
          <source src={course.source} type="audio/mpeg" />
          <source src={course.source} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      )}

      {course.learningMaterial === "pdf" && (
        <iframe src={course.source} width="100%" height="600px" style={{ marginBottom: 24 }} />
      )}

      {course.learningMaterial === "text" && (
        <>
          <Typography variant="h6">Heading:</Typography>
          <Typography>{course.heading}</Typography>
          <Typography variant="h6">Content:</Typography>
          <Typography>{course.textContent}</Typography>
        </>
      )}

      {course.learningMaterial === "assignment" && (
        <Typography variant="h6">Assignment Content: {course.assignmentContent}</Typography>
      )}

      {course.learningMaterial === "quiz" && course.quizQuestions && (
        <>
          <Typography variant="h6">Quiz Questions:</Typography>
          {course.quizQuestions.map((question, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <Typography>
                {index + 1}. {question}
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Your answer"
                value={userAnswers[index] || ""}
                onChange={(e) => handleQuizAnswerChange(index, e.target.value)}
                sx={{ marginTop: 1 }}
                disabled={quizSubmitted}
              />
              {correctAnswers.length > 0 && (
                <Typography
                  variant="body2"
                  color={correctAnswers[index] ? "green" : "red"}
                  sx={{ display: "inline", marginLeft: "8px" }}
                >
                  {correctAnswers[index] ? "✓ Correct" : "✗ Incorrect"}
                </Typography>
              )}
            </Box>
          ))}
          {!quizSubmitted && (
            <Button variant="contained" color="primary" onClick={handleQuizSubmit}>
              Submit Quiz
            </Button>
          )}
          {quizSubmitted && (
            <Typography variant="body1" sx={{ color: "green", marginTop: 2 }}>
              Quiz submitted successfully! You scored {quizScore} points.
            </Typography>
          )}
        </>
      )}

      <Divider sx={{ margin: "24px 0" }} />

      {/* Reviews Section */}
      <Box>
        <Typography variant="h6">User Reviews:</Typography>
        {reviews.map((review, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Rating name="read-only" value={review.rating} readOnly />
            <Typography variant="body2">{review.comment}</Typography>
          </Box>
        ))}
        <Box component="form" sx={{ marginTop: 2 }} onSubmit={handleReviewSubmit}>
          <Typography variant="h6">Leave a Review:</Typography>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            sx={{ marginBottom: 1 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Your Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" color="primary" type="submit">
            Submit Review
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseDetailsPage;