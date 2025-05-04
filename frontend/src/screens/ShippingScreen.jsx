import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { Box, TextField, Button, Typography } from '@mui/material';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  // Add state for validation errors
  const [cityError, setCityError] = useState('');
  const [postalCodeError, setPostalCodeError] = useState('');
  const [countryError, setCountryError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateCity = (value) => {
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(value)) { // Check if city contains special characters or numbers
      setCityError('City cannot contain special characters');
      return false;
    }
    setCityError('');
    return true;
  };
  const validatePostalCode = (value) => {
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(value)) { // Check if postal code contains special characters
      setPostalCodeError('Postal code cannot contain special characters');
      return false;
    }
    // Add more specific postal code format validation here if needed
    setPostalCodeError('');
    return true;
  };
  const validateCountry = (value) => {
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?0-9]/.test(value)) { // Check if country contains any digits
      setCountryError('Country cannot contain special characters or numbers');
      return false;
    }
    setCountryError('');
    return true;
  };


  const submitHandler = (e) => {
    e.preventDefault();
    // Re-validate on submit just in case
    const isCityValid = validateCity(city);
    const isPostalCodeValid = validatePostalCode(postalCode);
    const isCountryValid = validateCountry(country);

    if (isCityValid && isPostalCodeValid && isCountryValid && address && city && postalCode && country) {
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate('/payment');
    } else {
        // Ensure required fields are also checked if empty
        if (!address) console.log("Address is required"); // Or set an error state
        if (!city) setCityError("City is required");
        if (!postalCode) setPostalCodeError("Postal Code is required");
        if (!country) setCountryError("Country is required");
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 />
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
        Shipping
      </Typography>
      <Box component="form" onSubmit={submitHandler} sx={{ maxWidth: 500, mx: 'auto', background: '#fff', p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <TextField
          fullWidth
          margin="normal"
          id="address"
          label="Address"
          variant="outlined"
          placeholder="Enter address"
          value={address}
          required // Keep basic required validation
          onChange={(e) => setAddress(e.target.value)}
          // Add error state if needed for address
        />

        <TextField
          fullWidth
          margin="normal"
          id="city"
          label="City"
          variant="outlined"
          placeholder="Enter city"
          value={city}
          required // Keep basic required validation
          onChange={(e) => {
            setCity(e.target.value);
            validateCity(e.target.value); // Validate on change
          }}
          error={!!cityError} // Show error state
          helperText={cityError} // Show error message
        />

        <TextField
          fullWidth
          margin="normal"
          id="postalCode"
          label="Postal Code"
          variant="outlined"
          placeholder="Enter postal code"
          value={postalCode}
          required // Keep basic required validation
          onChange={(e) => {
            setPostalCode(e.target.value);
            validatePostalCode(e.target.value); // Validate on change
          }}
          error={!!postalCodeError} // Show error state
          helperText={postalCodeError} // Show error message
        />

        <TextField
          fullWidth
          margin="normal"
          id="country"
          label="Country"
          variant="outlined"
          placeholder="Enter country"
          value={country}
          required // Keep basic required validation
          onChange={(e) => {
            setCountry(e.target.value);
            validateCountry(e.target.value); // Validate on change
          }}
          error={!!countryError} // Show error state
          helperText={countryError} // Show error message
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, mb: 2, bgcolor: '#343a40', '&:hover': { bgcolor: '#495057' } }}
        >
          Continue
        </Button>
      </Box>
    </>
  );
};

export default ShippingScreen;
