import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material';
// Remove BrowserRouter import
// import { Outlet, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Outlet } from 'react-router-dom'; // Keep Outlet
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { logout } from './slices/authSlice.jsx';
// ResponsiveContainer import seems unused here, consider removing if not needed elsewhere in this file
// import ResponsiveContainer from './components/ResponsiveContainer.jsx';
// PasswordRecoveryScreen import seems unused here, it's defined as a route in index.jsx
// import PasswordRecoveryScreen from './screens/PasswordRecoveryScreen';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    // Remove the redundant Router component
    // <Router>
      <> {/* Use Fragment or a div if needed */}
        <ToastContainer /> {/* Keep ToastContainer */}
        <div className="d-flex flex-column min-vh-100"> {/* Keep existing layout structure */}
          <Header />
          <main className="py-3 flex-grow-1">
            <Container>
              {/* Replace Routes/Route with Outlet to render child routes */}
              <Outlet />
            </Container>
          </main>
          <Footer />
        </div>
      </>
    // </Router>
  );
};

export default App;
