import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  TextField, 
  Button, 
  Paper,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';

const ReviewForm = ({ productId, onReviewSubmitted, isLoading }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(-1);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (comment.trim() === '') {
      toast.error('Please enter a comment');
      return;
    }
    
    onReviewSubmitted({ productId, rating, comment });
    
    // Reset form
    setRating(0);
    setComment('');
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Write a Customer Review
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            name="product-rating"
            value={rating}
            precision={1}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            size="large"
          />
          {rating !== null && (
            <Box sx={{ ml: 2 }}>{hover !== -1 ? hover : rating} stars</Box>
          )}
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Review Comment"
          placeholder="Share your experience with this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={isLoading}
        >
          Submit Review
          {isLoading && <CircularProgress size={24} sx={{ ml: 1, color: 'white' }} />}
        </Button>
      </Box>
    </Paper>
  );
};

export default ReviewForm;