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
import { useMemo } from 'react'; // Import useMemo

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  // Shuffle products using useMemo
  const shuffledProducts = useMemo(() => {
    if (!data?.products) {
      return []; // Return empty array if no products
    }
    // Create a copy to avoid mutating the original cache data
    const productsCopy = [...data.products];
    // Fisher-Yates (Knuth) Shuffle Algorithm
    for (let i = productsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [productsCopy[i], productsCopy[j]] = [productsCopy[j], productsCopy[i]]; // Swap elements
    }
    return productsCopy;
  }, [data?.products]); // Re-shuffle only when data.products changes

  return (
    <>
      <Meta />
      {/* Part 2: Horizontal Auto-Advancing Product Carousel */}
      {!keyword ? (
        // Use 100vw for full width, center it, and hide overflow
        <Box sx={{
          mb: 4,
          width: '100vw', // Force full viewport width
          position: 'relative', // Needed for positioning context
          left: '50%', // Position the left edge at the center
          transform: 'translateX(-50.4%)', // Shift the element left by half its own width
          overflow: 'hidden', // Prevent horizontal scrollbar from appearing
        }}>
          {/* Pass SHUFFLED products to ProductCarousel */}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : (
            // Ensure ProductCarousel itself doesn't have excessive margins/padding
            <ProductCarousel products={shuffledProducts} /> // Use shuffledProducts here
          )}
        </Box>
      ) : (
        // Keep the Button within the standard page container
        <Container>
          <Button
            component={Link}
            to='/'
            variant="outlined"
            color="primary"
            sx={{ mb: 4 }}
          >
            Go Back
          </Button>
        </Container>
      )}

      {/* Part 3: Latest Products Grid */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        // Keep error message within standard container if needed, or adjust styling
        <Container>
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        </Container>
      ) : (
        <>
          {/* This section uses a Container for standard width */}
          <Box sx={{ bgcolor: '#f5f5f5', py: 3 }}>
            {/* Ensure this Container uses default max-width */}
            <Container>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  mb: 3,
                  color: '#4a4a4a',
                  fontWeight: 500
                }}
              >
                Latest Products
              </Typography>

              {/* Display original (non-shuffled) products in the grid */}
              <Grid container spacing={3}>
                {data.products.map((product) => (
                  <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                    <Product product={product} />
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Paginate
                  pages={data.pages}
                  page={data.page}
                  keyword={keyword ? keyword : ''}
                />
              </Box>
            </Container>
          </Box>
        </>
      )}
    </>
  );
};

export default HomeScreen;
