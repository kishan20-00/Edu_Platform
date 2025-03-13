import React from "react";
import { Typography, Container } from "@mui/material";

const Home = () => {
  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3">Edu Platform</Typography>
      <Typography variant="subtitle1">Welcome to the best online education platform!</Typography>
    </Container>
  );
};

export default Home;
