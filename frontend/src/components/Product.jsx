import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: '0.3s',
      boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
      '&:hover': {
        boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)'
      },
      my: 2
    }}>
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{ 
            height: 200,
            objectFit: 'contain',
            padding: '10px',
            backgroundColor: '#f8f9fa'
          }}
        />
      </Link>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography 
            variant="h6" 
            component="div" 
            className='product-title'
            sx={{ 
              fontWeight: 'bold',
              mb: 1,
              height: '2.5em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
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
