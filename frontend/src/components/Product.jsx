import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Rating from './Rating.jsx';

const Product = ({ product }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: '0.3s',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
      },
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{ 
            height: 180,
            objectFit: 'contain',
            padding: '10px',
            backgroundColor: '#f8f9fa'
          }}
        />
      </Link>

      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        p: 2 
      }}>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography 
            variant="subtitle1" 
            component="div" 
            className='product-title'
            sx={{ 
              fontWeight: 'bold',
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.2em',
              height: '2.4em'
            }}
          >
            {product.name}
          </Typography>
        </Link>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Box>

        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          ${product.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Product;
