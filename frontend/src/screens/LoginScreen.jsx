import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'; // Renamed Link
// Removed react-bootstrap imports: Form, Button, Row, Col
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

import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Meta from '../components/Meta'; // Import Meta component

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <Meta title="Login" /> {/* Added Meta component */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Sign In
      </Typography>

      {/* Replaced Form with Box component="form" */}
      <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
        {/* Replaced Form.Group/Form.Control with TextField */}
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

        {/* Replaced react-bootstrap Button with MUI Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 500 }}
        >
          Sign In
          {isLoading && <CircularProgress size={24} sx={{ ml: 1, color: 'white' }} />}
        </Button>

        {/* Loader can be kept or integrated differently if needed */}
        {/* {isLoading && <Loader />} */}
      </Box>

      {/* Replaced Row/Col with Grid */}
      <Grid container justifyContent="flex-start" sx={{ mt: 3 }}>
        <Grid item>
          <Typography variant="body2">
            New Customer?{' '}
            {/* Use MUI Link with RouterLink component */}
            <Link component={RouterLink} to={redirect ? `/register?redirect=${redirect}` : '/register'} variant="body2">
              Register
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </FormContainer>
  );
};

export default LoginScreen;
