import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon, // Ensure ListItemIcon is imported if you use it elsewhere, or remove if not needed
  ListItemText,
  useMediaQuery,
  useTheme,
  InputBase,
  CircularProgress // Import CircularProgress
} from '@mui/material';
import { ShoppingCart, Person, Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material'; // Added SearchIcon
// Remove Assessment icon import
// Remove useDispatch and resetCart if only used here for logout
// import { useSelector, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'; // Keep for userInfo
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice.jsx';
import { logout } from '../slices/authSlice.jsx';
import SearchBox from './SearchBox.jsx';
import logo from '../assets/logo.png';
// Remove resetCart import if not needed elsewhere
// import { resetCart } from '../slices/cartSlice.jsx';
// Import the cart query hook
import { useGetCartQuery } from '../slices/cartApiSlice.jsx';
// Import resetCart action if still needed for logout
import { resetCart } from '../slices/cartSlice.jsx';
import { useDispatch } from 'react-redux'; // Import useDispatch if using resetCart

const Header = () => {
  // Remove cartItems selection from Redux state
  // const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch cart data using RTK Query
  // Skip fetching if user is not logged in
  const { data: cartData, isLoading: isLoadingCart } = useGetCartQuery(undefined, {
    skip: !userInfo, // Skip query if no userInfo
  });
  // Calculate cart count from query data, default to 0 if no data/items
  const cartItemCount = userInfo ? (cartData?.items?.reduce((acc, item) => acc + item.qty, 0) || 0) : 0;


  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElAdmin, setAnchorElAdmin] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dispatch = useDispatch(); // Keep dispatch if using resetCart
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout()); // Dispatch logout from authSlice
      // Dispatch resetCart to clear local shipping/payment info on logout
      dispatch(resetCart()); // Dispatch resetCart from cartSlice
      navigate('/login');
      handleCloseUserMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenAdminMenu = (event) => {
    setAnchorElAdmin(event.currentTarget);
  };

  const handleCloseAdminMenu = () => {
    setAnchorElAdmin(null);
  };

  const handleSystemStatsClick = () => {
    const hostIp = window.location.hostname;
    window.open(`http://${hostIp}:4000`, '_blank');
    handleCloseAdminMenu();
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static" color="primary">
      <Container>
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
            <img src={logo} alt="Techzone" style={{ height: 40, marginRight: 8 }} />
            <Typography variant="h6" noWrap component="div">
              Techzone
            </Typography>
          </Box>
          
          {!isMobile ? (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <SearchBox />

              <Box component={Link} to="/cart" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white', ml: 2 }}>
                {/* Show loader or badge based on cart loading state and userInfo */}
                {userInfo && isLoadingCart ? (
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                ) : (
                  <Badge badgeContent={cartItemCount} color="error">
                    <ShoppingCart />
                  </Badge>
                )}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Cart
                </Typography>
              </Box>

              {userInfo ? (
                <>
                  <Button
                    color="inherit"
                    onClick={handleOpenUserMenu}
                    sx={{ ml: 2 }}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    keepMounted
                  >
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleCloseUserMenu}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem onClick={logoutHandler}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  sx={{ ml: 2, display: 'flex', alignItems: 'center' }}
                >
                  <Person sx={{ mr: 0.5 }} />
                  Sign In
                </Button>
              )}

              {userInfo && userInfo.isAdmin && (
                <>
                  <Button
                    color="inherit"
                    onClick={handleOpenAdminMenu}
                    sx={{ ml: 2 }}
                  >
                    Admin Panel
                  </Button>
                  <Menu
                    anchorEl={anchorElAdmin}
                    open={Boolean(anchorElAdmin)}
                    onClose={handleCloseAdminMenu}
                    keepMounted
                  >
                    {/* Add Dashboard Link */}
                    <MenuItem
                      component={Link}
                      to="/admin/dashboard"
                      onClick={handleCloseAdminMenu}
                    >
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/admin/productlist"
                      onClick={handleCloseAdminMenu}
                    >
                      Products
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/admin/orderlist"
                      onClick={handleCloseAdminMenu}
                    >
                      Orders
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/admin/userlist"
                      onClick={handleCloseAdminMenu}
                    >
                      Users
                    </MenuItem>
                    {/* Add System Stats Link */}
                    <MenuItem onClick={handleSystemStatsClick}>
                      System Stats
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          ) : (
             // Mobile view - icons
             <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}> {/* Use ml: 'auto' to push icons to the right */}
               <IconButton
                color="inherit"
                onClick={() => navigate('/search')} // Navigate to /search on click
                aria-label="search products"
               >
                 <SearchIcon />
               </IconButton>
               <IconButton component={Link} to="/cart" color="inherit">
                 {userInfo && isLoadingCart ? (
                   <CircularProgress size={20} color="inherit" />
                 ) : (
                   <Badge badgeContent={cartItemCount} color="error">
                     <ShoppingCart />
                   </Badge>
                 )}
               </IconButton>
             </Box>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {/* Optional: You might want to keep SearchBox in the drawer or remove it based on your preference */}
          <List>
            {userInfo ? (
              <>
                <ListItem button component={Link} to="/profile">
                  <ListItemText primary="Profile" />
                </ListItem>
                {userInfo.isAdmin && (
                  <>
                    <ListItem button component={Link} to="/admin/dashboard">
                      <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/productlist">
                      <ListItemText primary="Products" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/orderlist">
                      <ListItemText primary="Orders" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/userlist">
                      <ListItemText primary="Users" />
                    </ListItem>
                    <ListItem onClick={handleSystemStatsClick}>
                      System Stats
                    </ListItem>
                  </>
                )}
                <ListItem button onClick={logoutHandler}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <ListItem button component={Link} to="/login">
                <ListItemText primary="Sign In" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
