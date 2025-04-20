import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid, // Changed from Row, Col
  List, // Changed from ListGroup
  ListItem, // Changed from ListGroup.Item
  Box, // Used for layout and Image replacement
  Typography, // Used for text elements
  Button, // Changed from react-bootstrap Button
  Card, // Changed from react-bootstrap Card
  CardContent, // Added for MUI Card structure
  TextField, // Changed from Form.Control
  MenuItem, // Used with TextField select
  IconButton, // Used for delete button
  Paper, // Used to wrap list items for better styling
} from '@mui/material';
import { Delete } from '@mui/icons-material'; // Changed from FaTrash
import Message from '../components/Message'; // Assuming this component is adaptable or you'll replace it with MUI Alert if needed
import { addToCart, removeFromCart } from '../slices/cartSlice';
import Meta from '../components/Meta'; // Import Meta component

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty: Number(qty) })); // Ensure qty is a number
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    // Replaced Row with Grid container
    <Grid container spacing={4}>
      <Meta title="Shopping Cart" /> {/* Added Meta component */}
      {/* Replaced Col md={8} with Grid item */}
      <Grid item md={8}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Shopping Cart
        </Typography>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          // Replaced ListGroup with List
          <List sx={{ width: '100%' }}>
            {cartItems.map((item) => (
              // Replaced ListGroup.Item with ListItem wrapped in Paper for styling
              <Paper key={item._id} elevation={1} sx={{ mb: 2, p: 2 }}>
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
                      to={`/product/${item._id}`}
                      variant="body1"
                      sx={{ fontWeight: 500, color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                    >
                      {item.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sm={2}>
                    <Typography variant="body1">${item.price}</Typography>
                  </Grid>
                  <Grid item xs={4} sm={2}>
                    {/* Replaced Form.Control with TextField select */}
                    <TextField
                      select
                      size="small"
                      value={item.qty}
                      onChange={(e) => addToCartHandler(item, e.target.value)}
                      sx={{ minWidth: '70px' }}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <MenuItem key={x + 1} value={x + 1}>
                          {x + 1}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={4} sm={2} sx={{ textAlign: 'right' }}>
                    {/* Replaced Button with IconButton */}
                    <IconButton
                      aria-label="delete"
                      onClick={() => removeFromCartHandler(item._id)}
                      color="error"
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
      {/* Replaced Col md={4} with Grid item */}
      <Grid item md={4}>
        {/* Replaced react-bootstrap Card with MUI Card */}
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
            </Typography>
            <Typography variant="h6" sx={{ my: 2 }}>
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
