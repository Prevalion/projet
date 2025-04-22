import React, { useContext, useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Link
} from '@mui/material';
import RecoveryContext from '../../context/RecoveryContext';
import axios from 'axios';

const Reset = () => {
  const { setPage, email } = useContext(RecoveryContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call the reset password API
      await axios.put(`/api/users/reset-password`, {
        email,
        password
      });
      
      // Navigate to success page
      setPage('recovered');
    } catch (error) {
      setError('Failed to reset password. Please try again.');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={3} sx={{ maxWidth: 400, width: '100%', mt: 5 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 4 }}>
          Reset Your Password
        </Typography>
        
        {error && (
          <Box sx={{ 
            bgcolor: '#fdeded', 
            color: '#5f2120', 
            p: 2, 
            borderRadius: 1, 
            mb: 3 
          }}>
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            margin="normal"
            variant="outlined"
          />
          
          <Button 
            variant="contained" 
            type="submit" 
            fullWidth
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Link 
              component="button"
              variant="body2"
              onClick={() => setPage('otp')}
              underline="hover"
            >
              Back to Code Verification
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Reset;