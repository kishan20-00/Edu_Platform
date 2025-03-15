// routes/specializations.js
const express = require('express');
const Specialization = require('../models/Special');
const Course = require('../models/Lesson'); // Assuming you have a Course model
const router = express.Router();
const mongoose = require('mongoose');

// Create a new specialization
router.post('/add', async (req, res) => {
  const { name, subject, complexity, image, courses } = req.body;

  // Check if the specialization name is provided
  if (!name) {
    return res.status(400).json({ message: 'Specialization name is required' });
  }

  // Filter out empty or invalid course IDs
  const validCourses = courses.filter(courseId => courseId && mongoose.Types.ObjectId.isValid(courseId));

  // Check if at least one valid course is provided
  if (validCourses.length === 0) {
    return res.status(400).json({ message: 'At least one valid course is required' });
  }

  const newSpecialization = new Specialization({ name, subject, complexity, image, courses: validCourses });
  
  try {
    await newSpecialization.save();
    res.status(201).json(newSpecialization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all specializations
router.get('/', async (req, res) => {
  try {
    const specializations = await Specialization.find().populate('courses');
    res.status(200).json(specializations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single specialization by ID
router.get('/:id', async (req, res) => {
  try {
    const specialization = await Specialization.findById(req.params.id).populate('courses');
    
    if (!specialization) {
      return res.status(404).json({ message: 'Specialization not found' });
    }
    
    res.status(200).json(specialization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all specializations by subject
router.get('/filter/:subject', async (req, res) => {
  const { subject } = req.params; // Access subject directly from req.params
  
  try {
    const specializations = await Specialization.find(subject ? { subject } : {}).populate('courses'); // Filter by subject if provided
    res.status(200).json(specializations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
