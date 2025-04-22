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

const OTPInput = () => {
  const { setPage, otp, email } = useContext(RecoveryContext);
  const [inputOTP, setInputOTP] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (inputOTP === otp) {
      setPage('reset');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <Card elevation={3} sx={{ maxWidth: 400, width: '100%', mt: 5 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 4 }}>
          Enter Recovery Code
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          We've sent a 4-digit code to <Box component="span" sx={{ fontWeight: 'bold' }}>{email}</Box>
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
            type="text"
            placeholder="Enter 4-digit code"
            value={inputOTP}
            onChange={(e) => setInputOTP(e.target.value)}
            inputProps={{ 
              maxLength: 4,
              style: { textAlign: 'center', fontSize: '1.25rem' }
            }}
            required
            margin="normal"
            variant="outlined"
          />
          
          <Button 
            variant="contained" 
            type="submit" 
            fullWidth
            sx={{ mt: 2 }}
          >
            Verify Code
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Link 
              component="button"
              variant="body2"
              onClick={() => setPage('login')}
              underline="hover"
            >
              Back to Recovery
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OTPInput;