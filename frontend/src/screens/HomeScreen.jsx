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

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      <Meta />
      {/* Part 2: Horizontal Auto-Advancing Product Carousel */}
      {!keyword ? (
        <Box sx={{ mb: 4 }}>
          {/* Pass products to ProductCarousel for auto-sliding */}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <ProductCarousel products={data.products} />
          )}
        </Box>
      ) : (
        <Button 
          component={Link} 
          to='/' 
          variant="outlined" 
          color="primary" 
          sx={{ mb: 4 }}
        >
          Go Back
        </Button>
      )}

      {/* Part 3: Latest Products Grid */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Box sx={{ bgcolor: '#f5f5f5', py: 3 }}>
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
