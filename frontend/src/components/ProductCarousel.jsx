import React from 'react';
import Carousel from 'react-material-ui-carousel'; // Import the carousel component
import { Paper, Box, Typography, Link as MuiLink } from '@mui/material'; // Import Material UI components
import { Link as RouterLink } from 'react-router-dom'; // Use RouterLink for navigation
import Loader from './Loader.jsx';
import Message from './Message.jsx';

// Assuming products, isLoading, and error are passed as props
const ProductCarousel = ({ products, isLoading, error }) => {

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant='danger'>{error?.data?.message || error.error}</Message>;
  }

  // Select products for the carousel (e.g., first 5 or top-rated)
  const carouselProducts = products ? products.slice(0, 5) : [];

  return (
    <Carousel
      indicators={true} // Show indicators (dots)
      navButtonsAlwaysVisible={false} // Show nav buttons (arrows) only on hover or focus
      animation="slide" // Animation type: "fade" or "slide"
      duration={500} // Animation duration
      interval={4000} // Auto-play interval (4 seconds)
      autoPlay={true} // Enable auto-play
      stopAutoPlayOnHover={true} // Pause on hover
      indicatorIconButtonProps={{ // Style for indicator buttons
          style: {
              padding: '5px', // Adjust padding
              color: 'lightgrey' // Indicator color
          }
      }}
      activeIndicatorIconButtonProps={{ // Style for active indicator button
          style: {
              color: '#494949' // Active indicator color
          }
      }}
      indicatorContainerProps={{ // Style for the container holding indicators
          style: {
              marginTop: '-20px', // Adjust position relative to the carousel items
              textAlign: 'center', // Center indicators
              zIndex: 1 // Ensure indicators are above image overlay if needed
          }
      }}
      navButtonsProps={{ // Style for nav buttons (arrows)
          style: {
              backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
              borderRadius: 0 // Square buttons
          }
      }}
    >
      {carouselProducts.map((product) => (
        <Paper key={product._id} elevation={0} sx={{ position: 'relative', backgroundColor: 'transparent' }}>
          <MuiLink component={RouterLink} to={`/product/${product._id}`} underline="none">
            <Box
              component="img"
              sx={{
                width: '100%',
                height: { xs: 250, sm: 350, md: 450 }, // Responsive height
                objectFit: 'contain', // Changed from 'cover' to 'contain'
                display: 'block',
                backgroundColor: '#f8f9fa' // Optional: Add a background color if images have transparency or don't fill the space
              }}
              src={product.image}
              alt={product.name}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                padding: { xs: '8px 15px', md: '10px 20px' }, // Responsive padding
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                {product.name} (${product.price})
              </Typography>
            </Box>
          </MuiLink>
        </Paper>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
