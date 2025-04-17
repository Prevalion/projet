import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice.jsx';
import cartSliceReducer from './slices/cartSlice.jsx';
import authReducer from './slices/authSlice.jsx';
import cmsReducer from './slices/cmsSlice.jsx';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authReducer,
    cms: cmsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
