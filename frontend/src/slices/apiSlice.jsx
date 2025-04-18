import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants.jsx';
import { logout } from './authSlice.jsx';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const userInfo = getState().auth.userInfo;
    if (userInfo && userInfo.token) {
      headers.set('authorization', `Bearer ${userInfo.token}`);
    }
    return headers;
  },
});

// Add a wrapper around baseQuery to handle 401 errors globally
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // If we get a 401 Unauthorized response, log the user out
  if (result.error && result.error.status === 401) {
    console.log('401 error detected, logging out user');
    api.dispatch(logout());
  }
  
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth, // Use the wrapper with reauth logic
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
