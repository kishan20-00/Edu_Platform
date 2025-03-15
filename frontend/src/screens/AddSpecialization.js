// AddSpecialization.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, MenuItem, Select, Typography, FormControl, InputLabel } from '@mui/material';

const AddSpecialization = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [image, setImage] = useState('');
  const [complexity, setComplexity] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState(Array(5).fill(''));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://edu-platform-ten.vercel.app/api/course'); // Adjust endpoint as needed
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty course selections
    const validSelectedCourses = selectedCourses.filter(course => course !== '');

    if (validSelectedCourses.length === 0) {
      alert('Please select at least one course.');
      return;
    }

    try {
      await axios.post('https://edu-platform-ten.vercel.app/api/special/add', { name, subject, image, complexity, courses: validSelectedCourses });
      alert('Specialization added successfully!');
      // Reset the form or show a success message
      setName('');
      setSelectedCourses(Array(5).fill(''));
    } catch (error) {
      console.error('Error adding specialization:', error);
      alert('Error adding specialization.');
    }
  };

  const handleCourseChange = (index, value) => {
    const updatedCourses = [...selectedCourses];
    updatedCourses[index] = value;
    setSelectedCourses(updatedCourses);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Add Specialization</Typography>
      <TextField
        label="Specialization Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth margin="normal" required>
                <InputLabel>Subject</InputLabel>
                <Select
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  label="Subject"
                >
                  <MenuItem value="number sequence">Number Sequence</MenuItem>
                                    <MenuItem value="perimeter">Perimeter</MenuItem>
                                    <MenuItem value="ratio">Ratio</MenuItem>
                                    <MenuItem value="fractions/decimals">Fractions</MenuItem>
                                    <MenuItem value="indices">Indices</MenuItem>
                                    <MenuItem value="algebra">Algebra</MenuItem>
                                    <MenuItem value="angles">Angles</MenuItem>
                                    <MenuItem value="volume and capacity">Volume and capacity</MenuItem>
                                    <MenuItem value="area">Area</MenuItem>
                                    <MenuItem value="probability">Probability</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Complexity</InputLabel>
                <Select
                  name="complexity"
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  label="Complexity"
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
              <TextField
        label="Image"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      {[...Array(5)].map((_, index) => (
        <Select
          key={index}
          value={selectedCourses[index]}
          onChange={(e) => handleCourseChange(index, e.target.value)}
          displayEmpty
          sx={{ mb: 2 }}
        >
          <MenuItem value="" disabled>
            Learning Material {index + 1}
          </MenuItem>
          {courses.map((course) => (
            <MenuItem key={course._id} value={course._id}>
              {course.contentName}
            </MenuItem>
          ))}
        </Select>
      ))}
      <Button type="submit" variant="contained">Add Specialization</Button>
    </Box>
  );
};

export default AddSpecialization;
