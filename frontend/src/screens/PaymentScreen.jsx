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

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
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
            {/* Replaced Form.Check with FormControlLabel and Radio */}
            <FormControlLabel
              value="PayPal"
              control={<Radio />}
              label="PayPal or Credit Card"
            />
            {/* Add more payment methods here if needed */}
            {/* <FormControlLabel value="Stripe" control={<Radio />} label="Stripe" /> */}
          </RadioGroup>
        </FormControl>

        {/* Replaced react-bootstrap Button with MUI Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontWeight: 500 }}
        >
          Continue
        </Button>
      </Box>
    </FormContainer>
  );
};

export default PaymentScreen;
