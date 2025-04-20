import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Divider,
  Paper
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../slices/productsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../slices/cartSlice';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  // Modify submitHandler to accept review data directly
  const submitHandler = async ({ rating, comment }) => {
    // Remove e.preventDefault(); - This should be handled in ReviewForm
    try {
      await createReview({
        productId,
        rating: Number(rating), // Use the passed rating
        comment,             // Use the passed comment
      }).unwrap();
      refetch(); // Refetch product details to show the new review
      toast.success('Review submitted successfully');
      // Optionally reset local state if it was used by the old inline form
      // setRating(0); 
      // setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to submit review');
    }
  };

  return (
    <>
      <Button 
        component={Link} 
        to='/' 
        variant="outlined" 
        sx={{ my: 3 }}
      >
        Go Back
      </Button>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message severity='error'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />
          <Grid container spacing={4}>
            <Grid item md={6}>
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  background: '#fafafa',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                }}
              />
            </Grid>

            <Grid item md={3}>
              <List sx={{ width: '100%' }}>
                <ListItem>
                  <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '1.6rem' }}>
                    {product.name}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <Typography sx={{ fontWeight: 500 }}>
                    Price: ${product.price}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem>
                  <Typography sx={{ color: '#555' }}>
                    {product.description}
                  </Typography>
                </ListItem>
              </List>
            </Grid>

            <Grid item md={3}>
              <Card sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <CardContent>
                  <List>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>Price:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ fontWeight: 'bold' }}>${product.price}</Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <Divider />

                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>Status:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography>
                            {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <Divider />

                    {product.countInStock > 0 && (
                      <ListItem>
                        <Grid container alignItems="center">
                          <Grid item xs={6}>
                            <Typography>Qty</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              select
                              value={qty}
                              onChange={(e) => setQty(Number(e.target.value))}
                              size="small"
                              sx={{ minWidth: '60px' }}
                            >
                              {[...Array(product.countInStock).keys()].map((x) => (
                                <MenuItem key={x + 1} value={x + 1}>
                                  {x + 1}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                        </Grid>
                      </ListItem>
                    )}
                    <Divider />

                    <ListItem>
                      <Button
                        onClick={addToCartHandler}
                        variant="contained"
                        fullWidth
                        disabled={product.countInStock === 0}
                        sx={{ padding: '10px 0', fontWeight: 500 }}
                      >
                        Add To Cart
                      </Button>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* The entire Grid container below is removed */}
          {/* <Grid container sx={{ mt: 4 }}> ... </Grid> */}
          {/* End of removed section */}
        </>
      )}
      
      {/* Product Reviews Section (This section remains) */}
      {/* Ensure product is defined before accessing reviews */}
      {product && (
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom>
              Reviews
            </Typography>
            
            {userInfo ? (
              <ReviewForm 
                productId={productId}
                onReviewSubmitted={submitHandler} // Pass the updated handler
                isLoading={loadingProductReview}
              />
            ) : (
              <Message severity="info">
                Please <Link to="/login">sign in</Link> to write a review
              </Message>
            )}
            
            {/* Pass reviews safely, defaulting to an empty array */}
            <ReviewList reviews={product?.reviews || []} />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ProductScreen;