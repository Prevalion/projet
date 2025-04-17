import { apiSlice } from './apiSlice.jsx';

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/api/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApiSlice;