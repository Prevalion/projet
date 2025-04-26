import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  createBrowserRouter,
  createRoutesFromElements,
  Route, 
  RouterProvider 
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.jsx';
import store from './store.jsx';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals.js';
import { HelmetProvider } from 'react-helmet-async';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import ProductScreen from './screens/ProductScreen.jsx';
import CartScreen from './screens/CartScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ShippingScreen from './screens/ShippingScreen.jsx';
import PaymentScreen from './screens/PaymentScreen.jsx';
import PlaceOrderScreen from './screens/PlaceOrderScreen.jsx';
import OrderScreen from './screens/OrderScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import OrderListScreen from './screens/admin/OrderListScreen.jsx';
import ProductListScreen from './screens/admin/ProductListScreen.jsx';
import ProductEditScreen from './screens/admin/ProductEditScreen.jsx';
import UserListScreen from './screens/admin/UserListScreen.jsx';
import UserEditScreen from './screens/admin/UserEditScreen.jsx';
import DashboardScreen from './screens/admin/DashboardScreen.jsx'; // Import the DashboardScreen component
import PasswordRecoveryScreen from './screens/PasswordRecoveryScreen.jsx';
import ResetPasswordScreen from './screens/ResetPasswordScreen'; // Import the new screen
import SearchScreen from './screens/SearchScreen.jsx'; // <-- Import SearchScreen

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      {/* Use SearchScreen for search routes */}
      <Route path='/search/:keyword' element={<SearchScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      {/* Use SearchScreen for search routes with pagination */}
      <Route
        path='/search/:keyword/page/:pageNumber'
        element={<SearchScreen />}
      />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      {/* Add the password recovery route here */}
      <Route path='/password-recovery' element={<PasswordRecoveryScreen />} />
      {/* Add the password reset route */}
      <Route path='/reset-password/:token' element={<ResetPasswordScreen />} />
      {/* Registered users */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>
      {/* Admin users */}
      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/dashboard' element={<DashboardScreen />} /> {/* Add the route for the dashboard */}
        <Route path='/admin/orderlist' element={<OrderListScreen />} />
        <Route path='/admin/productlist' element={<ProductListScreen />} />
        <Route
          path='/admin/productlist/:pageNumber'
          element={<ProductListScreen />}
        />
        <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
        <Route path='/admin/userlist' element={<UserListScreen />} />
        <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
      </Route>
    </Route>
  ),
  // Add the future flags here
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
