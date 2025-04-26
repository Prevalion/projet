import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { logout } from './slices/authSlice.jsx';
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
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="py-3 flex-grow-1">
          <Container>
            <Outlet />
          </Container>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;