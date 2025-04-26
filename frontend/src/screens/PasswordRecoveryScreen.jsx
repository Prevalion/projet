import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Card, CardContent, Alert } from '@mui/material';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';
import Meta from '../components/Meta';

const PasswordRecoveryScreen = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      setEmailSent(true);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred');
    }
  };

  return (
    <>
      <Meta title="Password Recovery" />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh'
          }}
        >
          <Card elevation={3} sx={{ maxWidth: 400, width: '100%', mt: 5 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 4 }}>
                Password Recovery
              </Typography>
              
              {emailSent ? (
                <Alert severity="success" sx={{ mb: 3 }}>
                  If an account with that email exists, a password reset link has been sent.
                </Alert>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    margin="normal"
                    variant="outlined"
                  />
                  
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                    sx={{ mt: 3 }}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default PasswordRecoveryScreen;