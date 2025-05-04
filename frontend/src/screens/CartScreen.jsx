import { Link, useNavigate } from 'react-router-dom';
// Remove useDispatch and old actions
// import { useDispatch, useSelector } from 'react-redux';
import { useSelector } from 'react-redux'; // Keep for userInfo check if needed later
import {
  Grid,
  List,
  ListItem,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  IconButton,
  Paper,
  CircularProgress, // Import CircularProgress
  Alert // Import Alert for error/loading messages
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import Message from '../components/Message';
// Remove old action imports
// import { addToCart, removeFromCart } from '../slices/cartSlice';
// Import RTK Query hooks for cart
import {
  useGetCartQuery,
  useUpdateItemMutation,
  useRemoveItemMutation,
} from '../slices/cartApiSlice.jsx';
import Meta from '../components/Meta';
import Loader from '../components/Loader'; // Keep Loader for initial loading
import { toast } from 'react-toastify'; // <-- Add this line

const CartScreen = () => {
  const navigate = useNavigate();
  // Remove useDispatch
  // const dispatch = useDispatch();

  // Fetch cart data using RTK Query
  const { data: cartData, isLoading: isLoadingCart, error: cartError, refetch } = useGetCartQuery();
  const cartItems = cartData?.items || []; // Get items from query data

  // Get mutation hooks
  const [updateItem, { isLoading: isUpdatingItem }] = useUpdateItemMutation();
  const [removeItem, { isLoading: isRemovingItem }] = useRemoveItemMutation();

  // Update handler to use useUpdateItemMutation
  const updateCartHandler = async (item, qty) => {
    try {
      // Pass item.product._id instead of the whole item.product object
      await updateItem({ productId: item.product._id, qty: Number(qty) }).unwrap();
      // No need to dispatch, RTK Query handles cache update via invalidation
      // refetch(); // Optionally refetch if needed, but invalidation should work
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to update cart item');
    }
  };

  // Update handler to use useRemoveItemMutation
  const removeFromCartHandler = async (productId) => { // Keep parameter name as productId
    try {
      await removeItem(productId).unwrap();
      // No need to dispatch
      // refetch(); // Optionally refetch
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to remove cart item');
    }
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  // Handle loading state for the cart query
  if (isLoadingCart) {
    return <Loader />;
  }

  // Handle error state for the cart query
  if (cartError) {
    return (
      <Alert severity="error">
        Error loading cart: {cartError?.data?.message || cartError.error}
      </Alert>
    );
  }

  return (
    <Grid container spacing={4}>
      <Meta title="Shopping Cart" />
      <Grid item md={8}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Shopping Cart
        </Typography>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <List sx={{ width: '100%' }}>
            {cartItems.map((item) => (
              <Paper key={item.product._id} elevation={1} sx={{ mb: 2, p: 2, position: 'relative' }}> {/* Use item.product._id for key */}
                 {/* Add overlay for loading states */}
                 {(isUpdatingItem || isRemovingItem) && (
                   <Box sx={{
                     position: 'absolute',
                     top: 0, left: 0, right: 0, bottom: 0,
                     backgroundColor: 'rgba(255, 255, 255, 0.7)',
                     display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1
                   }}>
                     <CircularProgress size={30} />
                   </Box>
                 )}
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box
                      component="img"
                      // Use item.image directly from populated cart data
                      src={item.image}
                      alt={item.name}
                      sx={{
                        height: 60,
                        width: 'auto',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        background: '#fafafa',
                        border: '1px solid #eee',
                        borderRadius: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography
                      component={Link}
                      // Use item.product._id for the link ID
                      to={`/product/${item.product._id}`} // <--- Corrected line
                      variant="body1"
                      sx={{ fontWeight: 500, color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                    >
                      {/* Use item.name */}
                      {item.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={2}>
                    {/* Use item.price */}
                    <Typography variant="body1">${item.price}</Typography>
                  </Grid>
                  <Grid item xs={4} sm={2}>
                    <TextField
                      select
                      size="small"
                      value={item.qty}
                      // Call updateCartHandler on change
                      onChange={(e) => updateCartHandler(item, e.target.value)}
                      // Disable while updating
                      disabled={isUpdatingItem || isRemovingItem}
                      sx={{ minWidth: '70px' }}
                    >
                      {/* Use item.countInStock or a reasonable max */}
                      {[...Array(item.countInStock || 10).keys()].map((x) => (
                        <MenuItem key={x + 1} value={x + 1}>
                          {x + 1}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={4} sm={2} sx={{ textAlign: 'right' }}>
                    <IconButton
                      aria-label="delete"
                      // Pass item.product._id to the handler
                      onClick={() => removeFromCartHandler(item.product._id)}
                      color="error"
                      disabled={isUpdatingItem || isRemovingItem}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </List>
        )}
      </Grid>
      <Grid item md={4}>
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              {/* Calculate subtotal based on fetched cartItems */}
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
            </Typography>
            <Typography variant="h6" sx={{ my: 2 }}>
              {/* Calculate total price based on fetched cartItems */}
              ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
            </Typography>
            <Button
              type='button'
              variant="contained"
              color="primary"
              fullWidth
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
              sx={{ padding: '10px 0', fontWeight: 500, mt: 1 }}
            >
              Proceed To Checkout
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CartScreen;
