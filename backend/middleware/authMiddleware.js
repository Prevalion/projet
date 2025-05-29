import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (!token) {
    // Fallback: Read JWT from Authorization header (Bearer token)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }
  }


  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
<<<<<<< HEAD
      throw new Error('Please log in again');
    }
  } else {
    res.status(401);
    throw new Error('Please log in ');
=======
      throw new Error('Session expired, please login again');
    }
  } else {
    res.status(401);
    throw new Error('Please Login');
>>>>>>> f66eaa7484288c9fac67cd5ddc3248c8fdfc5579
  }
});

// User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
