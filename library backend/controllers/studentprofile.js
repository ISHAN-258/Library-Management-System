const StudentProfile = require('../models/StudentProfile');
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Create student profile
exports.createProfile = async (req, res) => {
  const { name, rollno, course, semester, email, phone, address } = req.body;
  const photo = req.file ? req.file.path : '';

  // Validate required fields
  if (!name || !rollno || !course || !semester || !email || !phone || !address ) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
      required_fields: ['userId', 'name', 'rollno', 'course', 'semester', 'email', 'phone', 'address']
    });
  }

  try {

    // Check if profile already exists
    const existingProfile = await StudentProfile.findOne({ email: email });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: 'Profile already exists for this user by email id'
      });
    }

    // Check if rollno is unique
    const existingRollno = await StudentProfile.findOne({ rollno });
    if (existingRollno) {
      return res.status(409).json({
        success: false,
        message: 'Roll number already in use'
      });
    }
    
    const password = String(phone);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, role: "student" });
    const userId = user._id;

    // Create new profile
    const newProfile = new StudentProfile({
      user: userId,
      name,
      rollno,
      course,
      semester,
      email,
      phone,
      address,
      photo,
      password
    });

    const savedProfile = await newProfile.save();

    return res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: savedProfile
    });

  } catch (err) {
    console.error('Create Profile Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating profile',
      error: err.message
    });
  }
};

// Get student profile
exports.getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await StudentProfile.findOne({ user: userId })
      .populate('user', 'email role');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: profile
    });

  } catch (err) {
    console.error('Get Profile Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while getting profile',
      error: err.message
    });
  }
};

exports.allProfile = async (req, res) => {
  // const { userId } = req.params;

  try {
    const profiles = await StudentProfile.find()
      .populate('user', 'email role');

    if (!profiles) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: profiles
    });

  } catch (err) {
    console.error('Get Profiles Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while getting profile',
      error: err.message
    });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, rollno, course, semester, email, phone, address } = req.body;
  const photo = req.file ? req.file.path : undefined;

  try {
    const profile = await StudentProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Update fields
    if (name) profile.name = name;
    if (rollno) profile.rollno = rollno;
    if (course) profile.course = course;
    if (semester) profile.semester = semester;
    if (email) profile.email = email;
    if (phone) profile.phone = phone;
    if (address) profile.address = address;
    if (photo) profile.photo = photo;

    const updatedProfile = await profile.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });

  } catch (err) {
    console.error('Update Profile Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: err.message
    });
  }
};

// Upload profile photo
exports.uploadPhoto = async (req, res) => {
  const { userId } = req.params;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  try {
    const profile = await StudentProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.photo = req.file.path;
    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      photoPath: profile.photo
    });

  } catch (err) {
    console.error('Upload Photo Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while uploading photo',
      error: err.message
    });
  }
};
