import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormHelperText
} from '@mui/material';
import RecoveryContext from '../../context/RecoveryContext';
// Remove axios import
// import axios from 'axios';
// Import the mutation hook
import { useForgotPasswordMutation } from '../../slices/usersApiSlice'; // Adjust path if necessary

const Login = () => {
  // Remove setOTP from context usage if it's no longer needed here
  const { setPage, setEmail } = useContext(RecoveryContext);
  const [inputEmail, setInputEmail] = useState('');
  // Remove local loading state, use the one from the hook
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Instantiate the mutation hook
  const [forgotPassword, { isLoading, error: apiError }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Remove local loading state management
    // setLoading(true);
    setError(''); // Clear previous local errors

    try {
      // Remove manual OTP generation and setting
      // const generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
      // setOTP(generatedOTP);

      // Call the forgotPassword mutation
      // The endpoint expects an object with an 'email' property
      await forgotPassword({ email: inputEmail }).unwrap();

      // Store email and navigate to OTP input page on success
      setEmail(inputEmail);
      setPage('otp');
    } catch (err) {
      // Use error from the hook or set a generic message
      const errorMessage = err?.data?.message || err.error || 'Failed to send recovery email. Please try again.';
      setError(errorMessage);
      console.error('Recovery email error:', err);
    }
    // Remove local loading state management
    // finally {
    //   setLoading(false);
    // }
  };

  return (
    <Card elevation={3} sx={{ maxWidth: 400, width: '100%', mt: 5 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 4 }}>
          Password Recovery
        </Typography>

        {/* Display local error or error from the hook */}
        {(error || apiError) && (
          <Box sx={{
            bgcolor: '#fdeded',
            color: '#5f2120',
            p: 2,
            borderRadius: 1,
            mb: 3
          }}>
            {/* Prefer local error message if set, otherwise use apiError */}
            <Typography variant="body2">{error || apiError?.data?.message || apiError?.error || 'An error occurred'}</Typography>
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            required
            margin="normal"
            variant="outlined"
          />
          <FormHelperText sx={{ mb: 2 }}>
            We'll send a recovery code to this email.
          </FormHelperText>

          <Button
            variant="contained"
            type="submit"
            fullWidth
            // Use isLoading from the hook
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {/* Use isLoading from the hook */}
            {isLoading ? 'Sending...' : 'Send Recovery Code'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Login;