import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';

const PrivateRoute = () => {
  const { userInfo, loading } = useSelector((state) => state.auth);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
