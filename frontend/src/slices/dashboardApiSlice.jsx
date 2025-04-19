import { apiSlice } from './apiSlice';

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `/api/dashboard`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApiSlice;