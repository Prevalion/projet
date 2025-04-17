import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
// Removed react-bootstrap imports: Row, Col, ListGroup, Image, Card, Button
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
  CircularProgress, // Used for loading states within buttons
  Alert, // Replaces Message component for consistency if needed
} from '@mui/material';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message'; // Keep or replace with MUI Alert
import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

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
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Order is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();
  //   toast.success('Order is paid');
  // }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    // Consider using MUI Alert here for consistency
    <Message variant='danger'>{error?.data?.message || error?.error}</Message>
  ) : (
    <>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Order {order._id}
      </Typography>
      {/* Replaced Row with Grid container */}
      <Grid container spacing={4}>
        {/* Replaced Col md={8} with Grid item */}
        <Grid item md={8}>
          {/* Replaced ListGroup with List */}
          <List sx={{ width: '100%', '& .MuiListItem-root': { p: 0 } }}>
            {/* Shipping Section */}
            <ListItem sx={{ mb: 3 }}>
              <Paper elevation={1} sx={{ p: 3, width: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500 }}>Shipping</Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}><strong>Name:</strong> {order.user.name}</Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Email:</strong> <Link href={`mailto:${order.user.email}`} sx={{ color: 'primary.main', textDecoration: 'none' }}>{order.user.email}</Link>
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Address: </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                  {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.country}
                </Typography>
                {order.isDelivered ? (
                  // Consider using MUI Alert
                  <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                ) : (
                  // Consider using MUI Alert
                  <Message variant='danger'>Not Delivered</Message>
                )}
              </Paper>
            </ListItem>

            {/* Payment Method Section */}
            <ListItem sx={{ mb: 3 }}>
              <Paper elevation={1} sx={{ p: 3, width: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500 }}>Payment Method</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}><strong>Method:</strong> {order.paymentMethod}</Typography>
                {order.isPaid ? (
                  // Consider using MUI Alert
                  <Message variant='success'>Paid on {order.paidAt}</Message>
                ) : (
                  // Consider using MUI Alert
                  <Message variant='danger'>Not Paid</Message>
                )}
              </Paper>
            </ListItem>

            {/* Order Items Section */}
            <ListItem>
              <Paper elevation={1} sx={{ p: 3, width: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500 }}>Order Items</Typography>
                {order.orderItems.length === 0 ? (
                  // Consider using MUI Alert
                  <Message>Order is empty</Message>
                ) : (
                  <List sx={{ width: '100%' }}>
                    {order.orderItems.map((item, index) => (
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
                              component={Link}
                              to={`/product/${item.product}`}
                              variant="body1"
                              sx={{ fontWeight: 500, color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                            >
                              {item.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <Typography variant="body1">
                              {item.qty} x ${item.price} = ${item.qty * item.price}
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
                    <Grid item xs={6}><Typography align="right">${order.itemsPrice}</Typography></Grid>
                  </Grid>
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <Grid container>
                    <Grid item xs={6}><Typography>Shipping</Typography></Grid>
                    <Grid item xs={6}><Typography align="right">${order.shippingPrice}</Typography></Grid>
                  </Grid>
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <Grid container>
                    <Grid item xs={6}><Typography>Tax</Typography></Grid>
                    <Grid item xs={6}><Typography align="right">${order.taxPrice}</Typography></Grid>
                  </Grid>
                </ListItem>
                <ListItem disablePadding sx={{ py: 1, borderTop: '1px solid #eee', mt: 1 }}>
                  <Grid container>
                    <Grid item xs={6}><Typography sx={{ fontWeight: 'bold' }}>Total</Typography></Grid>
                    <Grid item xs={6}><Typography align="right" sx={{ fontWeight: 'bold' }}>${order.totalPrice}</Typography></Grid>
                  </Grid>
                </ListItem>

                {!order.isPaid && (
                  <ListItem disablePadding sx={{ pt: 2 }}>
                    {loadingPay && <Loader />}
                    {isPending ? (
                      <Loader />
                    ) : (
                      <Box sx={{ width: '100%' }}>
                        {/* <Button
                          onClick={onApproveTest}
                          style={{ marginBottom: '10px' }}
                        >
                          Test Pay Order
                        </Button> */}
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </Box>
                    )}
                  </ListItem>
                )}

                {loadingDeliver && <Loader />}

                {userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <ListItem disablePadding sx={{ pt: 2 }}>
                      <Button
                        type='button'
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={deliverHandler}
                        sx={{ padding: '10px 0', fontWeight: 500 }}
                      >
                        Mark As Delivered
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

export default OrderScreen;
