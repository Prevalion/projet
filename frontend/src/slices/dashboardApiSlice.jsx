import { apiSlice } from './apiSlice';

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `/api/dashboard/stats`, // Correct the URL to match the backend route
        method: 'GET',
      }),
      providesTags: ['Dashboard'], // Optionally provide the tag
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApiSlice;