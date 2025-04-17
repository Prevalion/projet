import { apiSlice } from './apiSlice.jsx';
import { CMS_URL } from '../constants.jsx';

export const cmsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: () => ({
        url: `${CMS_URL}/banners`,
      }),
      providesTags: ['Banners'],
    }),
    updateBanners: builder.mutation({
      query: (data) => ({
        url: `${CMS_URL}/banners`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Banners'],
    }),
    getRecommendations: builder.query({
      query: () => ({
        url: `${CMS_URL}/recommendations`,
      }),
      providesTags: ['Recommendations'],
    }),
    updateRecommendations: builder.mutation({
      query: (data) => ({
        url: `${CMS_URL}/recommendations`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Recommendations'],
    }),
    getPromotions: builder.query({
      query: () => ({
        url: `${CMS_URL}/promotions`,
      }),
      providesTags: ['Promotions'],
    }),
    updatePromotions: builder.mutation({
      query: (data) => ({
        url: `${CMS_URL}/promotions`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Promotions'],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useUpdateBannersMutation,
  useGetRecommendationsQuery,
  useUpdateRecommendationsMutation,
  useGetPromotionsQuery,
  useUpdatePromotionsMutation,
} = cmsApiSlice;