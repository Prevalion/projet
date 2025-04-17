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
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from '../components/StripePaymentForm';
// Removed unused ThemeProvider/createTheme imports if not used elsewhere in this file specifically
// import { ThemeProvider } from '@mui/material/styles';
// import { createTheme } from '@mui/material/styles';

// Load Stripe conditionally based on key existence
const stripeKey = process.env.REACT_APP_STRIPE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

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
  // Remove state for manual credit card details as Stripe Element handles it
  // const [cardNumber, setCardNumber] = useState('');
  // const [expiryDate, setExpiryDate] = useState('');
  // const [cvc, setCvc] = useState('');

  const dispatch = useDispatch();

  // Handle Stripe submission (needs to be adapted based on StripePaymentForm logic)
  const handleStripeSubmit = async () => {
    // This logic might need to live inside StripePaymentForm or be passed down
    // For now, just save method and navigate
    console.log('Attempting Stripe payment...');
    // Actual Stripe token creation/payment intent confirmation would happen here
    dispatch(savePaymentMethod('Stripe')); // Assuming 'Stripe' is the method name
    navigate('/placeorder');
  };

  // Updated submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    if (paymentMethod === 'PayPal') {
      dispatch(savePaymentMethod(paymentMethod));
      navigate('/placeorder');
    } else if (paymentMethod === 'Stripe') {
      // Trigger Stripe submission logic - Note: StripePaymentForm might handle its own submit
      // If StripePaymentForm handles its own submit, this button might just navigate
      // or be disabled until Stripe form is valid.
      // For simplicity now, let's assume we navigate after selecting Stripe,
      // and the actual payment happens on the PlaceOrder screen or within StripePaymentForm.
      // A better approach involves handling the payment submission within the Stripe form itself.
       dispatch(savePaymentMethod(paymentMethod)); // Save 'Stripe' as method
       navigate('/placeorder'); // Navigate, assuming payment details collected/processed on next screen or within form
      // OR call a function like handleStripeSubmit() if needed here.
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
            {/* Use Stripe if key exists */}
            {stripePromise ? (
              <FormControlLabel
                value="Stripe" // Changed value to 'Stripe'
                control={<Radio />}
                label="Credit Card (Stripe)" // Updated label
              />
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Credit Card payment is currently unavailable.
              </Typography>
            )}
          </RadioGroup>
        </FormControl>

        {/* Conditionally render Stripe Payment Form */}
        {paymentMethod === 'Stripe' && stripePromise && (
          <Box sx={{ my: 3 }}> {/* Added margin top/bottom */}
            <Elements stripe={stripePromise}>
              {/* Pass necessary props or handlers to StripePaymentForm if needed */}
              <StripePaymentForm />
            </Elements>
          </Box>
        )}

        {/* Disable button if Stripe is selected but not ready/valid? */}
        {/* The StripePaymentForm might handle its own submit button */}
        {/* For now, keep the main continue button, but its role changes */}
        <Button
          type="submit" // This might need adjustment if Stripe form has its own submit
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5, fontWeight: 500 }}
          // Disable button if Stripe is selected? Or change text?
          // disabled={paymentMethod === 'Stripe'} // Example: disable if Stripe handles submit internally
        >
          Continue {/* Text might need to be dynamic */}
        </Button>
      </Box>
    </FormContainer>
  );
};

export default PaymentScreen;
