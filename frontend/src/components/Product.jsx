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
      {/* Product Image */}
      <CardMedia
        component="img"
        sx={{
          height: 200, // Fixed image height
          width: '100%',
          objectFit: 'cover', // Ensures image covers the area properly
          objectPosition: 'center',
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
          p: 2,
        }}
      >
        {/* Product Name */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: 1.3,
            mb: 1,
            height: '2.6em', // Fixed height for 2 lines
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
        <Box sx={{ mb: 1 }}>
          <Rating
            value={product.rating}
            precision={0.5}
            readOnly
            size="small"
            sx={{ mb: 0.5 }}
          />
          <Typography variant="body2" color="text.secondary">
            {product.numReviews} reviews
          </Typography>
        </Box>

        {/* Price */}
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 600,
            color: '#1976d2',
            mt: 'auto', // Pushes price to bottom
          }}
        >
          ${product.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Product;
