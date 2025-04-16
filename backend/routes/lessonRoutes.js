const express = require('express');
const Course = require('../models/Lesson');
const ContentPreference = require('../models/Content'); 
const router = express.Router();

// Create a new course content
router.post('/add', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all course content
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get course content by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update course content by ID
router.put('/update/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete course content by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all course content by subject
router.get('/filter/:subject', async (req, res) => {
  const subject = decodeURIComponent(req.params.subject);
  const { email } = req.query;

  try {
    // Fetch user's cognitive performance
    const contentPreference = await ContentPreference.findOne({ email });
    const cognitivePerformance = contentPreference ? contentPreference.cognitive : null;

    // Fetch courses by subject
    const courses = await Course.find({ subject });

    // Define sorting order based on cognitive performance
    const sortedCourses = courses.sort((a, b) => {
      const isHighCognitive = ['Very High', 'High'].includes(cognitivePerformance);
      
      // Define priority orders
      const highCognitiveOrder = ['quiz', 'assignment', 'video', 'audio', 'text', 'pdf'];
      const normalCognitiveOrder = ['video', 'audio', 'pdf', 'assignment', 'text', 'quiz'];
      
      const order = isHighCognitive ? highCognitiveOrder : normalCognitiveOrder;
      
      return order.indexOf(a.learningMaterial) - order.indexOf(b.learningMaterial);
    });

    res.json(sortedCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all course content by complexity and learningMaterial
router.get('/filter/:complexity/:learningMaterial', async (req, res) => {
  const { complexity, learningMaterial } = req.params;
  try {
    const courses = await Course.find({ complexity, learningMaterial });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all course content by subject, complexity, and learningMaterial
router.get('/filter/:subject/:complexity/:learningMaterial', async (req, res) => {
  const { subject, complexity, learningMaterial } = req.params;
  try {
    const courses = await Course.find({ subject, complexity, learningMaterial });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;