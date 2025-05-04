import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils.jsx';
// Import the cartApiSlice endpoints to use their matchers
import { cartApiSlice } from './cartApiSlice.jsx';

// Initial state remains the same, no localStorage reading
const initialState = {
  cartItems: [], // Will be populated by API calls
  shippingAddress: {}, // Still managed locally
  paymentMethod: 'Credit Card', // Still managed locally
  // Calculated fields will be updated by updateCart or API responses
  itemsPrice: '0.00',
  shippingPrice: '0.00',
  taxPrice: '0.00',
  totalPrice: '0.00',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Keep saveShippingAddress, remove localStorage
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      // No localStorage update needed here, but recalculate prices if shipping affects it
      // return updateCart(state); // Only if shipping address affects prices
    },
    // Keep savePaymentMethod, remove localStorage
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      // No localStorage update needed
    },
    // Keep clearCartItems for local state clearing if needed, remove localStorage
    clearCartItems: (state, action) => {
      state.cartItems = [];
      // Recalculate prices after clearing items locally
      return updateCart(state);
    },
    // Modified resetCart: only clears local non-item state, remove localStorage
    resetCart: (state) => {
      state.shippingAddress = {};
      state.paymentMethod = 'Credit Card'; // Reset to default
      // Do NOT clear cartItems here, as they reflect server state
      // Do NOT save to localStorage
      // Recalculate prices based on existing items and reset shipping/payment
      return updateCart(state);
    },

    // Comment out addToCart and removeFromCart as they are replaced by API calls + extraReducers
    /*
    addToCart: (state, action) => {
      // NOTE: we don't need user, rating, numReviews or reviews
      // in the cart
      const { user, rating, numReviews, reviews, ...item } = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      // Still call updateCart for calculations, but it won't save to localStorage anymore
      return updateCart(state, item);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      // Still call updateCart for calculations, but it won't save to localStorage anymore
      return updateCart(state);
    },
    */
  },
  // Add extraReducers to handle state updates from cartApiSlice
  extraReducers: (builder) => {
    builder
      .addMatcher(cartApiSlice.endpoints.getCart.matchFulfilled, (state, action) => {
        // Replace local cart state with the fetched cart data
        state.cartItems = action.payload.items || []; // Ensure items is an array
        // Recalculate prices based on the fetched cart
        return updateCart(state);
      })
      .addMatcher(cartApiSlice.endpoints.addItem.matchFulfilled, (state, action) => {
        // Update state with the response from adding/updating an item
        state.cartItems = action.payload.items || [];
        return updateCart(state);
      })
      .addMatcher(cartApiSlice.endpoints.updateItem.matchFulfilled, (state, action) => {
        // Update state with the response from updating an item
        state.cartItems = action.payload.items || [];
        return updateCart(state);
      })
      .addMatcher(cartApiSlice.endpoints.removeItem.matchFulfilled, (state, action) => {
        // Update state with the response from removing an item
        state.cartItems = action.payload.items || [];
        return updateCart(state);
      })
      .addMatcher(cartApiSlice.endpoints.clearCart.matchFulfilled, (state, action) => {
        // Update state with the response from clearing the cart (should be empty)
        state.cartItems = action.payload.items || []; // Should be empty array
        return updateCart(state);
      });
  },
});

export const {
  // Keep exported actions for local state management
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
  // addToCart, // Keep commented out or remove
  // removeFromCart, // Keep commented out or remove
} = cartSlice.actions;

export default cartSlice.reducer;
