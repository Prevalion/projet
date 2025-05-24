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

  // Handle loading state
  if (isLoading) {
    return <Loader />;
  }

  // Handle error state
  if (error) {
    return (
      <Container>
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
      <Container>
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
            marginLeft: 'calc(-50vw + 50%)',
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
          >
            Go Back
          </Button>
        </Container>
      )}

      {/* Products Grid Section */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 3 }}>
        <Container>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              mb: 3,
              color: '#4a4a4a',
              fontWeight: 500,
            }}
          >
            {keyword ? `Search Results for "${keyword}"` : 'Latest Products'}
          </Typography>

          <Grid container spacing={3}>
            {data.products.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <Product product={product} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {data.pages > 1 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword || ''}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default HomeScreen;
