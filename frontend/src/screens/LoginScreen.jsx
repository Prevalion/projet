import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'; // Ensure RouterLink is imported
import { useDispatch, useSelector } from 'react-redux';
// Import Grid, Typography, and Link from MUI if not already imported
import {
  Button,
  TextField,
  Typography,
  Link,
  Grid, // Add Grid import
  CircularProgress,
  Alert
} from '@mui/material';
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Meta from '../components/Meta';
import { toast } from 'react-toastify'; // Import toast

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Destructure error from the mutation result
  const [login, { isLoading, error }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Password strength validation (same as RegisterScreen)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      // Use toast for displaying errors
      toast.error(err?.data?.message || err.error || 'Login Failed');
    }
  };

  return (
    <FormContainer>
      <Meta title='Login' />
      <Typography variant="h4" component="h1" gutterBottom>
        Sign In
      </Typography>

      {/* Display error message using the destructured error state */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error?.data?.message || error.error || 'An error occurred'}</Alert>}

      <form onSubmit={submitHandler}>
        {/* Email Input */}
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign In'} {/* Show loader */}
        </Button>
      </form>

      {/* Replaced Row/Col with Grid */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 3, py: 3 }}>
        <Grid item>
          <Typography variant="body2">
            New Customer?{' '}
            <Link component={RouterLink} to={redirect ? `/register?redirect=${redirect}` : '/register'} variant="body2">
              Register
            </Link>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">
            <Link component={RouterLink} to="/password-recovery" variant="body2">
              Forgot Password?
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </FormContainer>
  );
};

export default LoginScreen;
