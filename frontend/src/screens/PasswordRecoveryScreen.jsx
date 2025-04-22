import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import RecoveryContext from '../context/RecoveryContext';
import Login from '../components/recovery/Login';
import OTPInput from '../components/recovery/OTPInput';
import Reset from '../components/recovery/Reset';
import Recovered from '../components/recovery/Recovered';
import Meta from '../components/Meta';

const PasswordRecoveryScreen = () => {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');

  function NavigateComponents() {
    if (page === "login") return <Login />;
    if (page === "otp") return <OTPInput />;
    if (page === "reset") return <Reset />;
    return <Recovered />;
  }

  return (
    <RecoveryContext.Provider
      value={{ page, setPage, otp, setOTP, setEmail, email }}
    >
      <Meta title="Password Recovery" />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh'
          }}
        >
          <NavigateComponents />
        </Box>
      </Container>
    </RecoveryContext.Provider>
  );
};

export default PasswordRecoveryScreen;