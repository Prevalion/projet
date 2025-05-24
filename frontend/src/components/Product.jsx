import { Card, CardMedia, CardContent, Typography, Box, Rating } from '@mui/material';
import { Link } from 'react-router-dom';

const Product = ({ product, sx }) => {
  return (
    <Card
      component={Link}
      to={`/product/${product._id}`}
      sx={{
        textDecoration: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
        ...sx,
      }}
    >
      {/* Product Image - Responsive height */}
      <CardMedia
        component="img"
        sx={{
          height: { xs: 140, sm: 160, md: 200 }, // Responsive image height
          width: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          backgroundColor: '#f5f5f5',
          p: { xs: 0.5, md: 1 }, // Less padding on mobile
        }}
        image={product.image}
        alt={product.name}
      />
      
      {/* Product Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { xs: 1, md: 2 }, // Less padding on mobile
        }}
      >
        {/* Product Name */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 500,
            fontSize: { xs: '0.875rem', md: '1rem' }, // Smaller font on mobile
            lineHeight: 1.3,
            mb: { xs: 0.5, md: 1 },
            height: { xs: '2.4em', md: '2.6em' }, // Responsive height
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: '#333',
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        <Box sx={{ mb: { xs: 0.5, md: 1 } }}>
          <Rating
            value={product.rating}
            precision={0.5}
            readOnly
            size="small"
            sx={{ mb: 0.25 }}
          />
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.75rem', md: '0.875rem' }, // Smaller text on mobile
            }}
          >
            {product.numReviews} reviews
          </Typography>
        </Box>

        {/* Price */}
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 600,
            color: '#000',
            mt: 'auto',
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, // Responsive price font
          }}
        >
          ${product.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Product;
