import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Avatar,
  Rating,
  Grid
} from '@mui/material';
import { format } from 'date-fns';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1">No reviews yet. Be the first to review this product!</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Customer Reviews ({reviews.length})
      </Typography>
      
      {reviews.map((review, index) => (
        <Box key={review._id} sx={{ mb: 2 }}>
          {index > 0 && <Divider sx={{ my: 2 }} />}
          
          <Grid container spacing={2}>
            <Grid item>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {review.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={review.rating} readOnly precision={0.5} size="small" />
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                </Typography>
              </Box>
              
              <Typography variant="body1">
                {review.comment}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Paper>
  );
};

export default ReviewList;