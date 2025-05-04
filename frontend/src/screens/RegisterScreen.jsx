import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'; // Renamed Link
// Removed react-bootstrap imports: Form, Button, Row, Col
// import { Form, Button, Row, Col } from 'react-bootstrap';
import {
  Box, // Used for layout
  Typography, // Used for text elements
  Button, // Replaces react-bootstrap Button
  TextField, // Replaces Form.Control
  Grid, // Replaces Row, Col
  Link, // MUI Link component
  CircularProgress // Used for loading states
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Meta from '../components/Meta'; // Import Meta component

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

    // Password strength validation
    // At least 8 characters, one uppercase, one lowercase, one number, one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <Meta title="Register" /> {/* Added Meta component */}
      {/* Replaced h1 with Typography */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Register
      </Typography>
      {/* Replaced Form with Box component="form" */}
      <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
        {/* Replaced Form.Group/Form.Control with TextField */}
        <TextField
          fullWidth
          margin="normal"
          id="name"
          label="Name"
          type="text" // Changed from 'name'
          variant="outlined"
          placeholder='Enter name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          id="email"
          label="Email Address"
          type="email"
          variant="outlined"
          placeholder='Enter email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          placeholder='Enter password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          variant="outlined"
          placeholder='Confirm password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Replaced react-bootstrap Button with MUI Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 500 }}
        >
          Register
          {isLoading && <CircularProgress size={24} sx={{ ml: 1, color: 'white' }} />}
        </Button>

        {/* Loader can be kept or integrated differently if needed */}
        {/* {isLoading && <Loader />} */}
      </Box>

      {/* Replaced Row/Col with Grid */}
      <Grid container justifyContent="flex-start" sx={{ mt: 3 }}>
        <Grid item>
          <Typography variant="body2">
            Already have an account?{' '}
            {/* Use MUI Link with RouterLink component */}
            <Link component={RouterLink} to={redirect ? `/login?redirect=${redirect}` : '/login'} variant="body2">
              Login
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </FormContainer>
  );
};

export default RegisterScreen;
