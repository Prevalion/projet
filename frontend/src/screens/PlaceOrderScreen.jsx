import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Renamed Link
import { toast } from 'react-toastify';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'; // Added PayPal imports
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
  usePayOrderMutation, // Added payOrder mutation
  useGetPaypalClientIdQuery, // Corrected PayPal client ID query import
} from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading: loadingCreateOrder, error: createOrderError }] = useCreateOrderMutation(); // Renamed isLoading and error
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation(); // Added payOrder hook
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery(); // Corrected PayPal client ID hook call

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer(); // Added PayPal script reducer

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (cart.paymentMethod === 'PayPal' && !window.paypal) {
        loadPaypalScript();
      }
    }
  }, [errorPayPal, loadingPayPal, paypal, paypalDispatch, cart.paymentMethod]);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    // This handler is now primarily for non-PayPal orders or as a fallback
    // PayPal orders are initiated via the PayPalButtons component
    if (cart.paymentMethod !== 'PayPal') {
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
        toast.error(err?.data?.message || err?.error || 'An unexpected error occurred');
      }
    }
  };

  // --- PayPal Button Handlers ---
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        // First, create the order in our backend
        const createdOrder = await createOrder({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        }).unwrap();

        // Then, mark the order as paid using the PayPal details
        await payOrder({ orderId: createdOrder._id, details }).unwrap();
        dispatch(clearCartItems());
        navigate(`/order/${createdOrder._id}`);
        toast.success('Order placed and payment successful!');
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Payment failed');
      }
    });
  }

  function onError(err) {
    toast.error(err?.message || 'PayPal Checkout onError');
  }

  function createPayPalOrder(data, actions) {
    // This function is called when the PayPal button is clicked
    // It should return the order ID created on PayPal's side
    // We create the order details here based on the cart
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              currency_code: 'USD', // Ensure currency matches script options
              value: cart.totalPrice,
            },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }
  // --- End PayPal Button Handlers ---

  return (
    <>
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
                  {cart.paymentMethod}
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

                {/* Conditional rendering for Place Order Button or PayPal Buttons */}
                {cart.paymentMethod === 'PayPal' ? (
                  <ListItem disablePadding sx={{ pt: 2 }}>
                    {loadingPay && <Loader />} {/* Show loader while paying */}
                    {isPending ? (
                      <Loader />
                    ) : errorPayPal ? (
                      <Message variant='danger'>{errorPayPal?.data?.message || errorPayPal.error}</Message>
                    ) : (
                      <Box sx={{ width: '100%' }}>
                        <PayPalButtons
                          style={{ layout: 'vertical' }}
                          createOrder={createPayPalOrder}
                          onApprove={onApprove}
                          onError={onError}
                          disabled={cart.cartItems.length === 0 || loadingCreateOrder || loadingPay}
                        ></PayPalButtons>
                      </Box>
                    )}
                  </ListItem>
                ) : (
                  // Show standard Place Order button for other methods
                  <ListItem disablePadding sx={{ pt: 2 }}>
                    <Button
                      type='button'
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={cart.cartItems.length === 0 || loadingCreateOrder}
                      onClick={placeOrderHandler}
                      sx={{ padding: '10px 0', fontWeight: 500 }}
                    >
                      Place Order
                      {loadingCreateOrder && <CircularProgress size={24} sx={{ ml: 1, color: 'white' }} />}
                    </Button>
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PlaceOrderScreen;
