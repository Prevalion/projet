import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Grid,
  List,
  ListItem,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Alert, // Use Alert for messages
  Divider, // Added for visual separation
} from '@mui/material';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message'; // Keep or replace with MUI Alert
import Loader from '../components/Loader';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation, // Keep this
  // useGetPaypalClientIdQuery, // Removed
  useDeliverOrderMutation,
} from '../slices/ordersApiSlice';
import Meta from '../components/Meta';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation(); // Keep mutation hook



  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);


  // --- New Handler for "Mark as Paid" Button ---
  const markAsPaidHandler = async () => {
    try {
      await payOrder({ orderId, details: { payer: {} } }).unwrap(); // Send minimal details
      refetch(); // Refetch order details to update UI
      toast.success('Order marked as paid');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to mark as paid');
    }
  };
  // --- End New Handler ---


  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order marked as delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    // Use MUI Alert for consistency
    <Alert severity="error">{error?.data?.message || error.error}</Alert>
  ) : (
    <>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
        Order {order._id}
      </Typography>
      <Grid container spacing={4}>
        <Grid item md={8}>
          <List component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 1 }}>
            <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="h6" gutterBottom>Shipping</Typography>
              <Typography><strong>Name:</strong> {order.user.name}</Typography>
              <Typography><strong>Email:</strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></Typography>
              <Typography>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </Typography>
              {order.isDelivered ? (
                <Alert severity="success" sx={{ mt: 1, width: '100%' }}>Delivered on {order.deliveredAt?.substring(0, 10)}</Alert>
              ) : (
                <Alert severity="warning" sx={{ mt: 1, width: '100%' }}>Not Delivered</Alert>
              )}
            </ListItem>
            <Divider />
            <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="h6" gutterBottom>Payment Method</Typography>
              <Typography>
                <strong>Method:</strong> 
                {/* Add check for string type */}
                {typeof order.paymentMethod === 'string' 
                  ? order.paymentMethod 
                  : 'Invalid Payment Method Data' /* Or render nothing, or log an error */}
              </Typography>
              {order.isPaid ? (
                <Alert severity="success" sx={{ mt: 1, width: '100%' }}>Paid on {order.paidAt?.substring(0, 10)}</Alert>
              ) : (
                <Alert severity="warning" sx={{ mt: 1, width: '100%' }}>Not Paid</Alert>
              )}
            </ListItem>
            <Divider />
            <ListItem>
              <List sx={{ width: '100%' }}>
                <Typography variant="h6" gutterBottom>Order Items</Typography>
                {order.orderItems.length === 0 ? (
                  <Alert severity="info">Order is empty</Alert>
                ) : (
                  order.orderItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ py: 1 }}>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item md={1}>
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
                          />
                        </Grid>
                        <Grid item>
                          <Typography component={Link} to={`/product/${item.product}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                            {item.name}
                          </Typography>
                        </Grid>
                        <Grid item md sx={{ textAlign: 'right' }}>
                          <Typography>{item.qty} x ${item.price} = ${item.qty * item.price}</Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))
                )}
              </List>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Order Summary</Typography>
              <List disablePadding>
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Items</Typography>
                  <Typography>${order.itemsPrice}</Typography>
                </ListItem>
                {/* Remove the Shipping ListItem */}
                {/* 
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Shipping</Typography>
                  <Typography>${order.shippingPrice}</Typography>
                </ListItem> 
                */}
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Tax</Typography>
                  <Typography>${order.taxPrice}</Typography>
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">${order.totalPrice}</Typography>
                </ListItem>

                {/* --- Payment Button Logic --- */}
                {!order.isPaid && (
                  <ListItem>
                    {/* Removed PayPal loading state check */}
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={markAsPaidHandler}
                      disabled={loadingPay} // Disable while processing
                      sx={{ mt: 2 }}
                    >
                      {loadingPay ? <CircularProgress size={24} color="inherit" /> : 'Mark as Paid (Test)'}
                    </Button>
                  </ListItem>
                )}
                {/* --- End Payment Button Logic --- */}


                {/* --- Admin Deliver Button --- */}
                {loadingDeliver && <Loader />}
                {userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <ListItem>
                      <Button
                        type='button'
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={deliverHandler}
                        sx={{ mt: 1 }}
                      >
                        Mark As Delivered
                      </Button>
                    </ListItem>
                  )}
                {/* --- End Admin Deliver Button --- */}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default OrderScreen;
