import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Renamed Link
import { toast } from 'react-toastify';
// Removed react-bootstrap imports: Button, Row, Col, ListGroup, Image, Card
// import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import {
  Grid, // Replaces Row, Col
  List, // Replaces ListGroup
  ListItem, // Replaces ListGroup.Item
  Box, // Used for layout and Image replacement
  Typography, // Used for text elements
  Button, // Replaces react-bootstrap Button
  Card, // Replaces react-bootstrap Card
  CardContent, // Added for MUI Card structure
  Paper, // Used to wrap list items for better styling
  Divider, // Used for visual separation
  Link, // MUI Link component
  CircularProgress // Used for loading states
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message'; // Keep or replace with MUI Alert
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      // Use optional chaining for safer error access
      toast.error(err?.data?.message || err?.error || 'An unexpected error occurred');
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      {/* Replaced Row with Grid container */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Replaced Col md={8} with Grid item */}
        <Grid item md={8}>
          {/* Replaced ListGroup with List */}
          <List sx={{ width: '100%', '& .MuiListItem-root': { p: 0 } }}>
            {/* Shipping Section */}
            <ListItem sx={{ mb: 3 }}>
              <Paper elevation={1} sx={{ p: 3, width: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500 }}>Shipping</Typography>
                <Typography variant="body1">
                  <strong>Address: </strong>
                  {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                  {cart.shippingAddress.postalCode},{' '}
                  {cart.shippingAddress.country}
                </Typography>
              </Paper>
            </ListItem>

            {/* Payment Method Section */}
            <ListItem sx={{ mb: 3 }}>
              <Paper elevation={1} sx={{ p: 3, width: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500 }}>Payment Method</Typography>
                <Typography variant="body1">
                  <strong>Method: </strong>
                  {cart.paymentMethod}
                </Typography>
              </Paper>
            </ListItem>

            {/* Order Items Section */}
            <ListItem>
              <Paper elevation={1} sx={{ p: 3, width: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500 }}>Order Items</Typography>
                {cart.cartItems.length === 0 ? (
                  // Consider using MUI Alert
                  <Message>Your cart is empty</Message>
                ) : (
                  <List sx={{ width: '100%' }}>
                    {cart.cartItems.map((item, index) => (
                      <ListItem key={index} divider sx={{ py: 2 }}>
                        {/* Replaced inner Row with Grid container */}
                        <Grid container alignItems="center" spacing={2}>
                          {/* Replaced Col with Grid item */}
                          <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                            {/* Replaced Image with Box component="img" */}
                            <Box
                              component="img"
                              src={item.image}
                              alt={item.name}
                              sx={{
                                height: 50,
                                width: 'auto',
                                maxWidth: '100%',
                                objectFit: 'contain',
                                background: '#fafafa',
                                border: '1px solid #eee',
                                borderRadius: 1,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <Typography
                              component={RouterLink} // Use RouterLink
                              to={`/product/${item.product}`}
                              variant="body1"
                              sx={{ fontWeight: 500, color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                            >
                              {item.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <Typography variant="body1">
                              {item.qty} x ${item.price} = $
                              {(item.qty * item.price).toFixed(2)} {/* Corrected calculation */}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </ListItem>
          </List>
        </Grid>
        {/* Replaced Col md={4} with Grid item */}
        <Grid item md={4}>
          {/* Replaced react-bootstrap Card with MUI Card */}
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>Order Summary</Typography>
              <List>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <Grid container>
                    <Grid item xs={6}><Typography>Items</Typography></Grid>
                    <Grid item xs={6}><Typography align="right">${cart.itemsPrice}</Typography></Grid>
                  </Grid>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1 }}>
                  <Grid container>
                    <Grid item xs={6}><Typography>Shipping</Typography></Grid>
                    <Grid item xs={6}><Typography align="right">${cart.shippingPrice}</Typography></Grid>
                  </Grid>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1 }}>
                  <Grid container>
                    <Grid item xs={6}><Typography>Tax</Typography></Grid>
                    <Grid item xs={6}><Typography align="right">${cart.taxPrice}</Typography></Grid>
                  </Grid>
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1, borderTop: '1px solid #eee', mt: 1 }}>
                  <Grid container>
                    <Grid item xs={6}><Typography sx={{ fontWeight: 'bold' }}>Total</Typography></Grid>
                    <Grid item xs={6}><Typography align="right" sx={{ fontWeight: 'bold' }}>${cart.totalPrice}</Typography></Grid>
                  </Grid>
                </ListItem>

                {error && (
                  <ListItem disablePadding sx={{ pt: 1 }}>
                    {/* Consider using MUI Alert */}
                    <Message variant='danger'>{error?.data?.message || error?.error}</Message>
                  </ListItem>
                )}

                <ListItem disablePadding sx={{ pt: 2 }}>
                  {/* Replaced react-bootstrap Button with MUI Button */}
                  <Button
                    type='button'
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={cart.cartItems.length === 0 || isLoading}
                    onClick={placeOrderHandler}
                    sx={{ padding: '10px 0', fontWeight: 500 }}
                  >
                    Place Order
                    {isLoading && <CircularProgress size={24} sx={{ ml: 1, color: 'white' }} />}
                  </Button>
                </ListItem>
                {/* Loader can be kept or integrated differently if needed */}
                {/* {isLoading && <Loader />} */}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PlaceOrderScreen;
