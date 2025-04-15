import { Link } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import { Carousel } from 'react-bootstrap'; // Keep Carousel from react-bootstrap for now
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}>
      <Carousel pause='hover' className='bg-primary'>
        {products.map((product) => (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
              <Box 
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'contain',
                  backgroundColor: '#1a1a1a'
                }}
              />
              <Carousel.Caption className='carousel-caption'>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'white', 
                    textAlign: 'right',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {product.name} (${product.price})
                </Typography>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    </Paper>
  );
};

export default ProductCarousel;
