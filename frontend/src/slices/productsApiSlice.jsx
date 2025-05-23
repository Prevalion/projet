// Let's check how API requests are being made
import { PRODUCTS_URL, UPLOAD_URL } from '../constants.jsx'; // Assuming UPLOAD_URL is defined in constants
import { apiSlice } from './apiSlice.jsx';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      // Update query signature to accept 'sort'
      query: ({ keyword = '', pageNumber = 1, category = '', price = '', rating = '', sort = '' }) => ({
        url: '/api/products',
        params: {
          keyword,
          pageNumber,
          category,
          price,
          rating,
          sort // Include sort parameter
        },
      }),
      // keepUnusedDataFor: 5, // Keep this or adjust as needed
      // Update providesTags to match invalidatesTags used in mutations
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Product', id: _id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      // Add providesTags for individual product fetching
      providesTags: (result, error, id) => [{ type: 'Product', id }], 
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: 'POST',
      }),
      // Invalidate the LIST tag to refetch the entire list on creation
      invalidatesTags: [{ type: 'Product', id: 'LIST' }], 
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      // Invalidate the specific product and the LIST tag on update
      invalidatesTags: (result, error, arg) => [
        { type: 'Product', id: arg.productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        // Use the imported UPLOAD_URL directly
        url: UPLOAD_URL, 
        method: 'POST',
        body: data,
      }),
      // Consider invalidating the specific product tag if image update should refresh details view
      // invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.productId }], 
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      // Invalidate the specific product and the LIST tag on deletion
      // Note: Use invalidatesTags for mutations, not providesTags
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ], 
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      // Invalidate the specific product tag after adding a review
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.productId }], 
    }),
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      // Provide tags if this data could be affected by other mutations
      providesTags: [{ type: 'Product', id: 'TOP_LIST' }], 
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
} = productsApiSlice;
