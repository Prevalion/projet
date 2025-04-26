import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import crypto from 'crypto'; // Added crypto import
import { sendPasswordResetEmail } from '../utils/emailService.js'; // Ensure this import is correct

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
 
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Can not delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const bulkUpdateUsers = asyncHandler(async (req, res) => {
  const { ids, role } = req.body;
  
  await User.updateMany(
    { _id: { $in: ids } },
    { $set: { role } }
  );
  
  res.json({ message: `${ids.length} users updated` });
});

// @desc    Request password reset
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  // Extract the email string correctly
  const email = req.body.email; // Assuming email is directly in req.body

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    // It's generally better not to reveal if an email exists or not
    // Send a generic success message even if user not found
    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    return; // Stop execution
  }

  // Generate Token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash Token
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token expiry (e.g., 1 hour)
  const resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour in milliseconds

  // Save Token & Expiry to user
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = resetPasswordExpire;
  await user.save();

  // Send Email
  const frontendResetUrl = process.env.FRONTEND_URL + '/reset-password'; // Adjust path as needed
  try {
    await sendPasswordResetEmail(user.email, resetToken, frontendResetUrl);
    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    // Clear the token if email sending fails to prevent unusable tokens
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500);
    throw new Error('Failed to send password reset email. Please try again later.');
  }
});


// @desc    Reset password
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get token from URL params
  const resetToken = req.params.token;
  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error('Password is required');
  }

  // Hash the token received from the URL
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Find user by hashed token and check expiry
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }, // Check if token is not expired
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Update Password (pre-save hook in userModel will hash it)
  user.password = password;

  // Clear Token fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Save User
  await user.save();

  // Optional: Log the user in automatically after reset or just send success
  // generateToken(res, user._id); // Uncomment if you want to log them in

  res.status(200).json({ message: 'Password reset successfully' });
});


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  bulkUpdateUsers,
  forgotPassword, // Ensure forgotPassword is exported
  resetPassword, // Ensure resetPassword is exported
};
