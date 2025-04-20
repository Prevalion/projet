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
import Meta from '../components/Meta'; // Import Meta component

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

  const handleNumericInputChange = (setter) => (e) => {
    const value = e.target.value;
    // Allow only digits
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  // Basic MM/YY formatting - you might want a more robust library for full validation
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 2) {
      // Add slash after MM
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setExpiryDate(value);
  };


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
      <Meta title="Payment Method" /> {/* Added Meta component */}
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
            // Use the numeric input handler
            onChange={handleNumericInputChange(setCardNumber)}
            required
            inputProps={{
              inputMode: 'numeric', // Hint for mobile keyboards
              pattern: '[0-9]*',    // Basic pattern validation
              maxLength: 19,        // Max length for card numbers (incl. spaces if formatted)
            }}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Expiry Date (MM/YY)"
                variant="outlined"
                placeholder="MM/YY" // Add placeholder
                value={expiryDate}
                // Use the expiry date handler
                onChange={handleExpiryChange}
                required
                inputProps={{
                  maxLength: 5, // MM/YY format
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="CVC"
                variant="outlined"
                type="password" // Keep as password for masking
                value={cvc}
                // Use the numeric input handler
                onChange={handleNumericInputChange(setCvc)}
                required
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  maxLength: 4, // Max CVC length
                }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            margin="normal"
            label="Cardholder Name"
            variant="outlined"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)} // No change needed here
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
