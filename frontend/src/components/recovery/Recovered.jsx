import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent 
} from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Recovered = () => {
  return (
    <Card elevation={3} sx={{ maxWidth: 400, width: '100%', mt: 5 }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <CheckCircleIcon 
            color="success" 
            sx={{ fontSize: 64 }} 
          />
        </Box>
        
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
          Password Reset Successful!
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          Your password has been successfully reset.
        </Typography>
        
        <Button 
          component={Link} 
          to="/login" 
          variant="contained" 
          fullWidth
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </CardContent>
    </Card>
  );
};

export default Recovered;