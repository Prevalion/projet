import { apiSlice } from './apiSlice.jsx';
import { USERS_URL } from '../constants.jsx';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
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
      providesTags: ['Users'],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
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
      invalidatesTags: ['Users'],
    }),
    bulkUpdateUsers: builder.mutation({
      query: (data) => ({
        url: '/api/users/bulk-update',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['User']
    }),
    // Add these endpoints to the builder
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: `${USERS_URL}/forgot-password`,
        method: 'POST',
        body: { email }
      })
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `${USERS_URL}/reset-password/${token}`,
        method: 'PUT',
        body: { password }
      })
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
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = usersApiSlice;