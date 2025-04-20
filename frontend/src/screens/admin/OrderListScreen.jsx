import React from 'react';
// Removed react-bootstrap imports: Table, Button
// import { Table, Button } from 'react-bootstrap';
import {
  Typography, // Used for text elements
  Button, // Replaces react-bootstrap Button
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper, // Used for container styling
  Link as MuiLink, // MUI Link component
  Box, // Added import for Box
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Renamed Link
// import { FaTimes } from 'react-icons/fa'; // Replace with MUI Icon if needed
import CloseIcon from '@mui/icons-material/Close'; // MUI alternative for FaTimes
import Message from '../../components/Message'; // Keep or replace with MUI Alert
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { useDeliverOrderMutation } from '../../slices/ordersApiSlice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { toast } from 'react-toastify'; // Added import for toast
import Meta from '../../components/Meta'; // Import Meta component

const OrderListScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const deliverHandler = async (orderId) => {
    try {
      await deliverOrder(orderId);
      toast.success('Order marked as delivered');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Removed the misplaced TableCell block from here

  return (
    <>
      <Meta title="Admin: Order List" /> {/* Added Meta component */}
      {/* Replaced h1 with Typography */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Orders
      </Typography>
      {isLoading ? (
        <Loader />
      ) : error ? (
        // Consider using MUI Alert
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        // Replaced react-bootstrap Table with MUI Table components
        <TableContainer component={Paper} elevation={1}>
          <Table sx={{ minWidth: 650 }} aria-label="orders table">
            <TableHead sx={{ bgcolor: 'grey.100' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>USER</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>DATE</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>TOTAL</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>PAID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>DELIVERED</TableCell>
                <TableCell></TableCell> {/* Empty cell for details button */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {order._id}
                  </TableCell>
                  <TableCell>{order.user && order.user.name}</TableCell>
                  <TableCell>{order.createdAt.substring(0, 10)}</TableCell>
                  <TableCell>${order.totalPrice}</TableCell>
                  <TableCell>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <CloseIcon sx={{ color: 'red' }} />
                    )}
                  </TableCell>
                  {/* Updated DELIVERED TableCell */}
                  <TableCell>
                    {order.isDelivered ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon color="success" sx={{ mr: 0.5 }} /> {/* Adjusted margin */}
                        {order.deliveredAt.substring(0, 10)}
                      </Box>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<LocalShippingIcon />}
                        onClick={() => deliverHandler(order._id)}
                        disabled={loadingDeliver}
                        sx={{ minWidth: 'auto', p: '2px 8px' }} // Adjust padding for smaller button
                      >
                        Deliver
                      </Button>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {/* Replaced react-bootstrap Button with MUI Button */}
                    <Button
                      component={RouterLink} // Use RouterLink for navigation
                      to={`/order/${order._id}`}
                      size="small"
                      variant="outlined"
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default OrderListScreen;
