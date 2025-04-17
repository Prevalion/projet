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
  ListItemText,
  useMediaQuery,
  useTheme,
  InputBase
} from '@mui/material';
import { ShoppingCart, Person, Menu as MenuIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice.jsx';
import { logout } from '../slices/authSlice.jsx';
import SearchBox from './SearchBox.jsx';
import logo from '../assets/logo.png';
import { resetCart } from '../slices/cartSlice.jsx';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElAdmin, setAnchorElAdmin] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
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
            <img src={logo} alt="ProShop" style={{ height: 40, marginRight: 8 }} />
            <Typography variant="h6" noWrap component="div">
              ProShop
            </Typography>
          </Box>
          
          {!isMobile ? (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'white', 
                borderRadius: '4px',
                padding: '0 10px',
                width: '300px'
              }}>
                <InputBase
                  placeholder="Search Products..."
                  sx={{ ml: 1, flex: 1, color: 'black' }}
                  inputProps={{ 'aria-label': 'search products' }}
                />
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="small"
                  sx={{ height: '32px', minWidth: '60px' }}
                >
                  Search
                </Button>
              </Box>
              
              <Box component={Link} to="/cart" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white', ml: 2 }}>
                <Badge badgeContent={cartItems.reduce((a, c) => a + c.qty, 0)} color="error">
                  <ShoppingCart />
                </Badge>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {userInfo ? userInfo.name : 'Cart'} ▼
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
                    Admin
                  </Button>
                  <Menu
                    anchorEl={anchorElAdmin}
                    open={Boolean(anchorElAdmin)}
                    onClose={handleCloseAdminMenu}
                    keepMounted
                  >
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
                  </Menu>
                </>
              )}
            </Box>
          ) : (
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  <ListItem button component={Link} to="/cart">
                    <ShoppingCart sx={{ mr: 2 }} />
                    <ListItemText primary="Cart" />
                    {cartItems.length > 0 && (
                      <Badge 
                        badgeContent={cartItems.reduce((a, c) => a + c.qty, 0)} 
                        color="success" 
                      />
                    )}
                  </ListItem>
                  
                  {userInfo ? (
                    <>
                      <ListItem button component={Link} to="/profile">
                        <ListItemText primary="Profile" />
                      </ListItem>
                      <ListItem button onClick={logoutHandler}>
                        <ListItemText primary="Logout" />
                      </ListItem>
                    </>
                  ) : (
                    <ListItem button component={Link} to="/login">
                      <Person sx={{ mr: 2 }} />
                      <ListItemText primary="Sign In" />
                    </ListItem>
                  )}
                  
                  {userInfo && userInfo.isAdmin && (
                    <>
                      <ListItem>
                        <ListItemText primary="ADMIN" sx={{ fontWeight: 'bold' }} />
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
                    </>
                  )}
                </List>
              </Box>
            </Drawer>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
