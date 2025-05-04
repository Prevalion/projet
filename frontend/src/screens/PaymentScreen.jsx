import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Grid,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import Meta from '../components/Meta';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  
  // Card type state
  const [cardType, setCardType] = useState('');
  
  // Error states
  const [cardNumberError, setCardNumberError] = useState('');
  const [expiryDateError, setExpiryDateError] = useState('');
  const [cvcError, setCvcError] = useState('');
  const [cardHolderNameError, setCardHolderNameError] = useState('');

  const dispatch = useDispatch();

  // Detect card type based on BIN (first 6 digits)
  const detectCardType = (number) => {
    // Remove spaces and non-digits
    const cleanNumber = number.replace(/\D/g, '');
    
    // Card type regex patterns
    const cardPatterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
      dinersclub: /^3(?:0[0-5]|[68])/,
      jcb: /^(?:2131|1800|35)/
    };

    for (const [type, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(cleanNumber)) {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }
    }
    
    return cleanNumber.length >= 6 ? 'Unknown' : '';
  };

  // Format card number with spaces (different formats based on card type)
  const formatCardNumber = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    const isAmex = /^3[47]/.test(cleanValue);
    
    // Different formatting for Amex (4-6-5) vs others (4-4-4-4)
    if (isAmex) {
      const parts = [
        cleanValue.substring(0, 4),
        cleanValue.substring(4, 10),
        cleanValue.substring(10, 15)
      ].filter(Boolean);
      return parts.join(' ');
    } else {
      const parts = [
        cleanValue.substring(0, 4),
        cleanValue.substring(4, 8),
        cleanValue.substring(8, 12),
        cleanValue.substring(12, 16)
      ].filter(Boolean);
      return parts.join(' ');
    }
  };

  // Handle card number input with formatting and cursor position management
  const handleCardNumberChange = (e) => {
    const input = e.target.value;
    const cursorPosition = e.target.selectionStart;
    const previousValue = cardNumber;
    
    // Count spaces before the cursor in the previous value
    const previousSpaceCount = (previousValue.substring(0, cursorPosition).match(/ /g) || []).length;
    
    // Remove all spaces
    const cleanInput = input.replace(/\s/g, '');
    
    // Allow only digits
    if (/^\d*$/.test(cleanInput)) {
      // Get max length based on card type
      const isAmex = /^3[47]/.test(cleanInput);
      const maxLength = isAmex ? 15 : 16;
      
      // Apply formatting and update state if within length limit
      if (cleanInput.length <= maxLength) {
        const formattedValue = formatCardNumber(cleanInput);
        setCardNumber(formattedValue);
        setCardType(detectCardType(cleanInput));
        
        // Validate on input
        if (cleanInput.length > 0 && cleanInput.length < (isAmex ? 15 : 16)) {
          setCardNumberError('Please enter a complete card number');
        } else if (cleanInput.length > 0 && !validateLuhn(cleanInput)) {
          setCardNumberError('Invalid card number');
        } else {
          setCardNumberError('');
        }
        
        // Calculate new cursor position
        setTimeout(() => {
          // Only adjust cursor if the field is still focused
          if (document.activeElement === e.target) {
            const newSpaceCount = (formattedValue.substring(0, cursorPosition).match(/ /g) || []).length;
            const spaceDiff = newSpaceCount - previousSpaceCount;
            
            // Determine if a space was added/removed at or before the cursor position
            const newPosition = cursorPosition + spaceDiff;
            
            // Set cursor position
            e.target.setSelectionRange(newPosition, newPosition);
          }
        }, 0);
      }
    }
  };

  // Luhn algorithm for card number validation
  const validateLuhn = (number) => {
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.length < 12) return false;
    
    let sum = 0;
    let shouldDouble = false;
    
    // Loop from right to left
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return (sum % 10) === 0;
  };

  // Format and validate expiry date with cursor position management
  const handleExpiryChange = (e) => {
    const input = e.target.value;
    const cursorPosition = e.target.selectionStart;
    const previousValue = expiryDate;
    
    // Handle backspace at the slash position
    if (
      previousValue.length === 3 && 
      cursorPosition === 2 && 
      input.length === 2 && 
      previousValue.charAt(2) === '/'
    ) {
      setExpiryDate(input);
      return;
    }
    
    // Remove non-digits
    const cleanInput = input.replace(/\D/g, '');
    
    // Format as MM/YY
    if (cleanInput.length > 0) {
      if (cleanInput.length <= 2) {
        setExpiryDate(cleanInput);
      } else {
        const newValue = `${cleanInput.substring(0, 2)}/${cleanInput.substring(2, 4)}`;
        setExpiryDate(newValue);
        
        // Set cursor position after the slash if user is typing the month part
        if (previousValue.length === 2 && cleanInput.length > 2) {
          setTimeout(() => {
            if (document.activeElement === e.target) {
              e.target.setSelectionRange(4, 4);
            }
          }, 0);
        }
      }
      
      // Validate month
      if (cleanInput.length >= 2) {
        const month = parseInt(cleanInput.substring(0, 2));
        if (month < 1 || month > 12) {
          setExpiryDateError('Invalid month');
          return;
        }
      }
      
      // Validate expiry date
      if (cleanInput.length >= 4) {
        const month = parseInt(cleanInput.substring(0, 2));
        const year = parseInt(`20${cleanInput.substring(2, 4)}`);
        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          setExpiryDateError('Card has expired');
        } else {
          setExpiryDateError('');
        }
      } else if (cleanInput.length > 0) {
        setExpiryDateError('Please enter a complete expiry date');
      } else {
        setExpiryDateError('');
      }
    } else {
      setExpiryDate('');
      setExpiryDateError('');
    }
  };

  // Handle CVC input and validation
  const handleCvcChange = (e) => {
    const input = e.target.value;
    
    // Allow only digits
    if (/^\d*$/.test(input)) {
      // Check max length based on card type (Amex: 4, Others: 3)
      const isAmex = cardType.toLowerCase() === 'amex';
      const maxLength = isAmex ? 4 : 3;
      
      if (input.length <= maxLength) {
        setCvc(input);
        
        // Validate length
        if (input.length > 0 && input.length < maxLength) {
          setCvcError(`Please enter ${maxLength} digits`);
        } else {
          setCvcError('');
        }
      }
    }
  };

  // Handle cardholder name input and validation
  const handleCardholderNameChange = (e) => {
    const input = e.target.value;
    
    // Allow only letters, spaces, hyphens, apostrophes, and periods (for names like "St. John" or "O'Neil")
    if (/^[A-Za-z\s\-'.]*$/.test(input)) {
      setCardHolderName(input);
      
      // Validate name format
      if (input.trim() && input.trim().split(/\s+/).length < 2) {
        setCardHolderNameError('Please enter full name (first and last name)');
      } else {
        setCardHolderNameError('');
      }
    }
  };

  // Validate form
  const validateForm = () => {
    // Reset all errors
    let isValid = true;
    
    // Validate card number
    if (!cardNumber.trim()) {
      setCardNumberError('Card number is required');
      isValid = false;
    } else if (!validateLuhn(cardNumber)) {
      setCardNumberError('Invalid card number');
      isValid = false;
    } else {
      setCardNumberError('');
    }
    
    // Validate expiry date
    if (!expiryDate.trim()) {
      setExpiryDateError('Expiry date is required');
      isValid = false;
    } else if (!expiryDate.includes('/') || expiryDate.length !== 5) {
      setExpiryDateError('Invalid expiry date format');
      isValid = false;
    } else {
      const [month, year] = expiryDate.split('/');
      const expiryMonth = parseInt(month);
      const expiryYear = parseInt(`20${year}`);
      
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      
      if (expiryMonth < 1 || expiryMonth > 12) {
        setExpiryDateError('Invalid month');
        isValid = false;
      } else if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        setExpiryDateError('Card has expired');
        isValid = false;
      }
    }
    
    // Validate CVC
    const isAmex = cardType.toLowerCase() === 'amex';
    const requiredCvcLength = isAmex ? 4 : 3;
    
    if (!cvc.trim()) {
      setCvcError('CVC is required');
      isValid = false;
    } else if (cvc.length !== requiredCvcLength) {
      setCvcError(`CVC must be ${requiredCvcLength} digits`);
      isValid = false;
    } else {
      setCvcError('');
    }
    
    // Validate cardholder name
    if (!cardHolderName.trim()) {
      setCardHolderNameError('Cardholder name is required');
      isValid = false;
    } else if (cardHolderName.trim().split(/\s+/).length < 2) {
      setCardHolderNameError('Please enter full name (first and last name)');
      isValid = false;
    } else if (!/^[A-Za-z\s\-'.]+$/.test(cardHolderName)) {
      setCardHolderNameError('Name contains invalid characters');
      isValid = false;
    } else {
      setCardHolderNameError('');
    }
    
    return isValid;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save payment method as Credit Card along with masked card details for order summary
      const last4 = cardNumber.replace(/\D/g, '').slice(-4);
      dispatch(savePaymentMethod({
        type: 'Credit Card',
        cardType: cardType || 'Card',
        lastFour: last4
      }));
      
      navigate('/placeorder');
    }
  };

  return (
    <FormContainer>
      <Meta title="Payment Method" />
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
            onChange={handleCardNumberChange}
            error={!!cardNumberError}
            helperText={cardNumberError || (cardType && `Card type: ${cardType}`)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCardIcon />
                </InputAdornment>
              ),
            }}
            placeholder="1234 5678 9012 3456"
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Expiry Date"
                variant="outlined"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryChange}
                error={!!expiryDateError}
                helperText={expiryDateError}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon />
                    </InputAdornment>
                  ),
                }}
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
                onChange={handleCvcChange}
                error={!!cvcError}
                helperText={cvcError || (cardType.toLowerCase() === 'amex' ? '4 digits' : '3 digits')}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
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
            onChange={handleCardholderNameChange}
            error={!!cardHolderNameError}
            helperText={cardHolderNameError}
            required
            placeholder="John Smith"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          {cardType && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <FormHelperText>
                {`You're paying with a ${cardType} card ending in ${cardNumber.replace(/\D/g, '').slice(-4)}`}
              </FormHelperText>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5, fontWeight: 500 }}
          >
            Continue to Review Order
          </Button>
        </FormControl>
      </Box>
    </FormContainer>
  );
};

export default PaymentScreen;