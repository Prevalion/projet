import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Validate card details
    if (!cardNumber || !expiryDate || !cvc || !cardHolderName) {
      alert('Please fill in all card details');
      return;
    }

    // Save payment method as Credit Card
    dispatch(savePaymentMethod('Credit Card'));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Payment Details
      </Typography>
      <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
        <FormControl component="fieldset" margin="normal" fullWidth>
          <FormLabel component="legend" sx={{ fontWeight: 500, mb: 1 }}>
            Enter Your Credit Card Information
          </FormLabel>
          
          <TextField
            fullWidth
            margin="normal"
            label="Card Number"
            variant="outlined"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Expiry Date (MM/YY)"
                variant="outlined"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="CVC"
                variant="outlined"
                type="password"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                required
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            margin="normal"
            label="Cardholder Name"
            variant="outlined"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5, fontWeight: 500 }}
          >
            Continue
          </Button>
        </FormControl>
      </Box>
    </FormContainer>
  );
};

export default PaymentScreen;
