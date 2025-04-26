import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { toast } from 'react-toastify';
import { useResetPasswordMutation } from '../slices/usersApiSlice'; // Assuming this mutation exists or will be created
import FormContainer from '../components/FormContainer';
import Meta from '../components/Meta';

const ResetPasswordScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await resetPassword({ token, password }).unwrap();
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to reset password');
    }
  };

  return (
    <FormContainer>
      <Meta title="Reset Password" />
      <Card elevation={3} sx={{ mt: 5 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 3 }}>
            Reset Password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error?.data?.message || error.error || 'An error occurred'}
            </Alert>
          )}

          <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              id="password"
              label="New Password"
              type="password"
              variant="outlined"
              placeholder='Enter new password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              variant="outlined"
              placeholder='Confirm new password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 500 }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Reset Password'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </FormContainer>
  );
};

export default ResetPasswordScreen;