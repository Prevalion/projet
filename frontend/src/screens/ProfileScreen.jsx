import React, { useEffect, useState } from 'react';
// Removed react-bootstrap imports: Table, Form, Button, Row, Col
import {
  Grid, // Replaces Row, Col
  Box, // Used for layout
  Typography, // Used for text elements
  Button, // Replaces react-bootstrap Button
  TextField, // Replaces Form.Control
  Table, // Replaces react-bootstrap Table
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper, // Used for container styling
  CircularProgress, // Used for loading states
  IconButton, // Can be used for icons like FaTimes
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Renamed Link to avoid conflict
import { useDispatch, useSelector } from 'react-redux';
// import { FaTimes } from 'react-icons/fa'; // Replace with MUI Icon if needed
import CloseIcon from '@mui/icons-material/Close'; // MUI alternative for FaTimes

import { toast } from 'react-toastify';
import Message from '../components/Message'; // Keep or replace with MUI Alert
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Meta from '../components/Meta'; // Import Meta component
// Removed react-router-dom Link import as RouterLink is used

// Add these imports
import {
  useForgotPasswordMutation,
  useResetPasswordMutation
} from '../slices/usersApiSlice';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading: isLoadingOrders, error: errorOrders } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  // Moved hook calls inside the component
  const [forgotPassword, { isLoading: loadingForgotPassword }] = useForgotPasswordMutation(); // Added loading state
  // const [resetPassword] = useResetPasswordMutation(); // Assuming reset happens on a different screen/flow after link click

  // State for showing the reset form elements (if needed within this screen)
  // const [showResetForm, setShowResetForm] = useState(false); // Example state
  // const [newPassword, setNewPassword] = useState(''); // Example state

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
        setPassword(''); // Clear password fields after successful update
        setConfirmPassword('');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    // Replaced Row with Grid container
    <Grid container spacing={4}>
      <Meta title="User Profile" /> {/* Added Meta component */}
      {/* Replaced Col md={3} with Grid item */}
      <Grid item md={3}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          User Profile
        </Typography>

        {/* Replaced Form with Box component="form" */}
        <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
          {/* Replaced Form.Group/Form.Control with TextField */}
          <TextField
            fullWidth
            margin="normal"
            id="name"
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            id="email"
            label="Email Address"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            variant="outlined"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* Replaced react-bootstrap Button with MUI Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 500 }}
            disabled={loadingUpdateProfile}
          >
            Update Profile
            {loadingUpdateProfile && <CircularProgress size={24} sx={{ ml: 1, color: 'white' }} />}
          </Button>

          {/* Password Reset Section */}
          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'grey.300' }}>
            <Typography variant="h6" gutterBottom>Password Reset</Typography>
            <Button
              variant="outlined"
              onClick={async () => {
                if (!userInfo || !userInfo.email) {
                  toast.error('User information not available.');
                  return;
                }
                try {
                  await forgotPassword({ email: userInfo.email }).unwrap();
                  toast.success('If an account with that email exists, a password reset link has been sent.');
                } catch (err) {
                  toast.error(err?.data?.message || err.error || 'Failed to send reset link.');
                }
              }}
              sx={{ mt: 1 }}
              disabled={loadingForgotPassword}
            >
              Send Reset Link
              {loadingForgotPassword && <CircularProgress size={24} sx={{ ml: 1 }} />}
            </Button>
          </Box>
        </Box>
      </Grid>
      {/* Replaced Col md={9} with Grid item */}
      <Grid item md={9}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          My Orders
        </Typography>
        {isLoadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          // Consider using MUI Alert
          <Message variant='danger'>
            {errorOrders?.data?.message || errorOrders.error}
          </Message>
        ) : (
          // Replaced react-bootstrap Table with MUI Table components
          <TableContainer component={Paper} elevation={1}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ bgcolor: 'grey.100' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
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
                    <TableCell>{order.createdAt.substring(0, 10)}</TableCell>
                    <TableCell>${order.totalPrice}</TableCell>
                    <TableCell>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <CloseIcon sx={{ color: 'red' }} />
                      )}
                    </TableCell>
                    <TableCell>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <CloseIcon sx={{ color: 'red' }} />
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
      </Grid>
    </Grid>
  );
};

export default ProfileScreen;
