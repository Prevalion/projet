import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
      // Add invalidatesTags here
      invalidatesTags: ['Cart'], // Invalidate Cart tag on successful login
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
       // Also invalidate Cart on register if a new user might get an empty cart
       invalidatesTags: ['Cart'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
      // Optionally, you could invalidate here too, though clearing is handled elsewhere
      // invalidatesTags: ['Cart'],
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
     // Add forgotPassword mutation if not already present
     forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgot-password`,
        method: 'POST',
        body: data, // Expects { email: '...' }
      }),
    }),
    // Add resetPassword mutation if not already present
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        // Ensure the URL matches your backend route, e.g., /reset-password/:token
        url: `${USERS_URL}/reset-password/${token}`,
        method: 'PUT',
        body: { password }, // Expects { password: '...' }
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useForgotPasswordMutation, // Export new mutation
  useResetPasswordMutation, // Export new mutation
} = userApiSlice;