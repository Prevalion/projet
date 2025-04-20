import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';
import Meta from '../components/Meta'; // Import Meta component

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <FormContainer>
      <Meta title="Shipping Address" /> {/* Added Meta component */}
      <CheckoutSteps step1 step2 />
      <Typography variant="h4" component="h1" gutterBottom style={{ fontWeight: 600, marginBottom: '1.5rem' }}>
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
          required
          onChange={(e) => setAddress(e.target.value)}
        />

        <TextField
          fullWidth
          margin="normal"
          id="city"
          label="City"
          variant="outlined"
          placeholder="Enter city"
          value={city}
          required
          onChange={(e) => setCity(e.target.value)}
        />

        <TextField
          fullWidth
          margin="normal"
          id="postalCode"
          label="Postal Code"
          variant="outlined"
          placeholder="Enter postal code"
          value={postalCode}
          required
          onChange={(e) => setPostalCode(e.target.value)}
        />

        <TextField
          fullWidth
          margin="normal"
          id="country"
          label="Country"
          variant="outlined"
          placeholder="Enter country"
          value={country}
          required
          onChange={(e) => setCountry(e.target.value)}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5, fontWeight: 500 }}>
          Continue
        </Button>
      </Box>
    </FormContainer>
  );
};

export default ShippingScreen;
