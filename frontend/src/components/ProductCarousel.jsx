import { Link } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';
import { Carousel } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import { useEffect, useState } from 'react';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const [index, setIndex] = useState(0);
  
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Box sx={{ mb: 4, overflow: 'hidden', width: '100%', display: 'flex' }}>
      <Carousel 
        activeIndex={index}
        onSelect={handleSelect}
        interval={3000}
        controls={true}
        indicators={true}
        pause={false}
        className='bg-primary' 
        style={{ width: '100%' }}
      >
        {products.map((product) => (
          <Carousel.Item key={product._id}>
            <Box sx={{ display: 'flex', height: '300px' }}>
              <Box sx={{ width: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box 
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      padding: '20px'
                    }}
                  />
                </Link>
              </Box>
              <Box sx={{ width: '50%', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ p: 4, width: '100%', textAlign: 'center' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'white', 
                      mb: 2,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    {product.name} (${product.price})
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Carousel.Item>
        ))}
      </Carousel>
    </Box>
  );
};

export default ProductCarousel;
