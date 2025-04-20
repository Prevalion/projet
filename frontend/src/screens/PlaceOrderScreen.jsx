import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Renamed Link
import { toast } from 'react-toastify';
// Removed PayPal imports
// import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
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
// Updated imports for order API slice
import {
  useCreateOrderMutation,
  // Removed unused PayPal hooks
  // usePayOrderMutation,
  // useGetPaypalClientIdQuery,
} from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import Meta from '../components/Meta'; // Import Meta component

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth); // Get user info

  const [createOrder, { isLoading: loadingCreateOrder, error: createOrderError }] = useCreateOrderMutation();
  // Removed PayPal hooks
  // const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  // const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();
  // const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // Removed PayPal useEffect
  // useEffect(() => {
  //   if (!errorPayPal && !loadingPayPal && paypal.clientId) { ... }
  // }, [errorPayPal, loadingPayPal, paypal, paypalDispatch, cart.paymentMethod]);

  useEffect(() => {
    // Redirect to login if not logged in
    if (!userInfo) {
      navigate('/login');
      return; // Stop further checks if redirecting
    }
    // Redirect if shipping address is missing
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    }
    // Redirect if payment method is missing
    else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [userInfo, cart.paymentMethod, cart.shippingAddress.address, navigate]); // Add userInfo to dependency array

  const placeOrderHandler = async () => {
    // Simplified: always try to create the order
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod, // Will be 'Credit Card'
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      // Navigate to the order screen, payment happens there now
      navigate(`/order/${res._id}`);
      toast.success('Order placed successfully! Proceed to payment.'); // Updated toast message
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to place order');
    }
  };

  // Removed PayPal Button Handlers
  // function onApprove(data, actions) { ... }
  // function onError(err) { ... }
  // function createPayPalOrder(data, actions) { ... }

  return (
    <>
      <Meta title="Place Order" /> {/* Added Meta component */}
      <CheckoutSteps step1 step2 step3 step4 />
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item md={8}>
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
                  {cart.paymentMethod} {/* This will now display "Credit Card" */}
                </Typography>
              </Paper>
            </ListItem>

            {/* Order Items Section */}
            <ListItem>
              <Paper elevation={1} sx={{ p: 3, width: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500 }}>Order Items</Typography>
                {cart.cartItems.length === 0 ? (
                  <Message>Your cart is empty</Message>
                ) : (
                  <List sx={{ width: '100%' }}>
                    {cart.cartItems.map((item, index) => (
                      <ListItem key={index} divider sx={{ py: 2 }}>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
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
        <Grid item md={4}>
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

                {/* Display create order error if any */}
                {createOrderError && (
                  <ListItem disablePadding sx={{ pt: 1 }}>
                    <Message variant='danger'>{createOrderError?.data?.message || createOrderError?.error}</Message>
                  </ListItem>
                )}

                {/* Removed conditional rendering for PayPal */}
                {/* Always show the Place Order button */}
                <ListItem disablePadding sx={{ pt: 2 }}>
                  <Button
                    type='button'
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={cart.cartItems === 0 || loadingCreateOrder}
                    onClick={placeOrderHandler}
                    sx={{ mt: 2, py: 1.5, fontWeight: 500 }}
                  >
                    Place Order
                    {loadingCreateOrder && <CircularProgress size={24} sx={{ ml: 1, color: 'white' }} />}
                  </Button>
                </ListItem>
                {/* Removed PayPal Button Section */}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PlaceOrderScreen;
