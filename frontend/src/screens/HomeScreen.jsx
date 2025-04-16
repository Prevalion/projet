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
      {!keyword ? (
        <ProductCarousel />
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
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 3 }}>
            Latest Products
          </Typography>
          <Grid container spacing={2}>
            {data.products.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <Product product={product} />
              </Grid>
            ))}
          </Grid>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
