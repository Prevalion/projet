import { useState, useEffect } from 'react';
// Removed react-bootstrap imports: Form, Button, Col
// import { Form, Button, Col } from 'react-bootstrap';
import {
  Box, // Used for layout
  Typography, // Used for text elements
  Button, // Replaces react-bootstrap Button
  FormControl, // Replaces Form.Group
  FormLabel, // Replaces Form.Label
  RadioGroup, // Replaces Form.Group for radio buttons
  FormControlLabel, // Replaces Form.Check
  Radio, // Replaces Form.Check type='radio'
  TextField, // Added for Credit Card fields
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

  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  // Add state for credit card details
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    if (paymentMethod === 'PayPal') {
      dispatch(savePaymentMethod(paymentMethod));
      navigate('/placeorder');
    } else if (paymentMethod === 'CreditCard') {
      // TODO: Implement actual credit card processing logic
      // For now, just save the method and navigate
      // In a real app, you'd validate and process the card details here
      console.log('Credit Card Details:', { cardNumber, expiryDate, cvc });
      dispatch(savePaymentMethod(paymentMethod));
      // Potentially navigate to a different confirmation or processing step
      navigate('/placeorder'); // Or a dedicated credit card processing route
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      {/* Replaced h1 with Typography */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Payment Method
      </Typography>
      {/* Replaced Form with Box component="form" */}
      <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
        {/* Replaced Form.Group with FormControl */}
        <FormControl component="fieldset" margin="normal">
          {/* Replaced Form.Label with FormLabel */}
          <FormLabel component="legend" sx={{ fontWeight: 500, mb: 1 }}>Select Method</FormLabel>
          {/* Replaced Col with RadioGroup */}
          <RadioGroup
            aria-label="payment method"
            name="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {/* Changed label from 'PayPal or Credit Card' to 'PayPal' */}
            <FormControlLabel
              value="PayPal"
              control={<Radio />}
              label="PayPal"
            />
            {/* Added new radio button for Credit Card */}
            <FormControlLabel
              value="CreditCard"
              control={<Radio />}
              label="Credit Card"
            />
            {/* <FormControlLabel value="Stripe" control={<Radio />} label="Stripe" /> */}
          </RadioGroup>
        </FormControl>

        {/* Conditionally render Credit Card fields */}
        {paymentMethod === 'CreditCard' && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              id="cardNumber"
              label="Card Number"
              variant="outlined"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
              // Add input props for formatting/validation if needed
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                margin="normal"
                id="expiryDate"
                label="Expiry Date (MM/YY)"
                variant="outlined"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                sx={{ flexGrow: 1 }}
                // Add input props for formatting/validation if needed
              />
              <TextField
                margin="normal"
                id="cvc"
                label="CVC"
                variant="outlined"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                required
                sx={{ width: '100px' }} // Adjust width as needed
                // Add input props for formatting/validation if needed
              />
            </Box>
          </Box>
        )}

        {/* Button text and behavior might change based on selection, but for now, it submits for both */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontWeight: 500 }}
        >
          {/* Change button text based on method or keep generic */}
          Continue
        </Button>
      </Box>
    </FormContainer>
  );
};

export default PaymentScreen;
