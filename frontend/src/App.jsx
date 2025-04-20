import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { logout } from './slices/authSlice.jsx';
import ResponsiveContainer from './components/ResponsiveContainer.jsx';

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
    <>
      <ToastContainer />
      <Header />
      <main style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <ResponsiveContainer>
          <Outlet />
        </ResponsiveContainer>
      </main>
      <Footer />
    </>
  );
};

export default App;
