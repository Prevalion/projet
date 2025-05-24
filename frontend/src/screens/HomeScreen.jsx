import { Grid, Button, Typography, Box, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { useMemo } from 'react';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  // Shuffle products using useMemo for performance optimization
  const shuffledProducts = useMemo(() => {
    if (!data?.products) return [];
    
    // Create a copy to avoid mutating the original cache data
    const productsCopy = [...data.products];
    
    // Fisher-Yates (Knuth) Shuffle Algorithm
    for (let i = productsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [productsCopy[i], productsCopy[j]] = [productsCopy[j], productsCopy[i]];
    }
    
    return productsCopy;
  }, [data?.products]);

  // Limit products to 8 for 2x4 grid layout
  const displayProducts = useMemo(() => {
    if (!data?.products) return [];
    return data.products.slice(0, 8);
  }, [data?.products]);

  // Handle loading state
  if (isLoading) {
    return (
      <Container sx={{ py: 4 }}>
        <Meta />
        <Loader />
      </Container>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Meta />
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      </Container>
    );
  }

  // Handle empty products state
  if (!data?.products || data.products.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Meta />
        {keyword && (
          <Button
            component={Link}
            to="/"
            variant="outlined"
            color="primary"
            sx={{ mb: 4 }}
          >
            Go Back
          </Button>
        )}
        <Message variant="info">
          {keyword 
            ? `No products found for "${keyword}"`
            : 'No products available'
          }
        </Message>
      </Container>
    );
  }

  return (
    <>
      <Meta />
      
      {/* Product Carousel Section - Only show on home page (no keyword) */}
      {!keyword && (
        <Box
          sx={{
            mb: 4,
            width: '100vw',
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50.4%)',
            overflow: 'hidden',
          }}
        >
          <ProductCarousel products={shuffledProducts} />
        </Box>
      )}

      {/* Back Button - Only show when searching */}
      {keyword && (
        <Container>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            color="primary"
            sx={{ mb: 4 }}
            startIcon={<span>←</span>}
          >
            Go Back
          </Button>
        </Container>
      )}

      {/* Products Grid Section - 2x4 Layout */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 4 }}>
        <Container>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              mb: 4,
              color: '#2c2c2c',
              fontWeight: 600,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {keyword ? `Search Results for "${keyword}"` : 'Latest Products'}
          </Typography>

          {/* 2x4 Grid Layout */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {displayProducts.map((product) => (
              <Grid 
                item 
                key={product._id} 
                xs={12} 
                sm={6} 
                md={3} 
                lg={3}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Product product={product} />
              </Grid>
            ))}
          </Grid>

          {/* Show "View All Products" button if there are more than 8 products */}
          {data.products.length > 8 && !keyword && (
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  bgcolor: '#333',
                  '&:hover': {
                    bgcolor: '#555',
                  },
                }}
              >
                View All Products
              </Button>
            </Box>
          )}

          {/* Pagination - Always show */}
          <Box 
            sx={{ 
              mt: 5, 
              display: 'flex', 
              justifyContent: 'center',
              borderTop: '1px solid #e0e0e0',
              pt: 4,
            }}
          >
            <Paginate
              pages={data.pages}
              page={data.page}
              keyword={keyword || ''}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HomeScreen;
