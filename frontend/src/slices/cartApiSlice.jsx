import { apiSlice } from './apiSlice.jsx';
import { CART_URL } from '../constants.jsx';

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to get the user's cart
    getCart: builder.query({
      query: () => ({
        url: CART_URL,
        method: 'GET',
      }),
      providesTags: ['Cart'], // Provides the 'Cart' tag for caching
      keepUnusedDataFor: 5, // Optional: cache duration
    }),

    // Mutation to add an item or update quantity
    addItem: builder.mutation({
      query: (data) => ({ // Expects { productId, qty }
        url: `${CART_URL}/items`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'], // Invalidates 'Cart' tag on success
    }),

    // Mutation to update an item's quantity
    updateItem: builder.mutation({
      query: ({ productId, qty }) => ({ // Expects { productId, qty }
        url: `${CART_URL}/items/${productId}`,
        method: 'PUT',
        body: { qty },
      }),
      invalidatesTags: ['Cart'], // Invalidates 'Cart' tag on success
    }),

    // Mutation to remove an item from the cart
    removeItem: builder.mutation({
      query: (productId) => ({ // Expects productId
        url: `${CART_URL}/items/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'], // Invalidates 'Cart' tag on success
    }),

    // Mutation to clear all items from the cart
    clearCart: builder.mutation({
      query: () => ({
        url: CART_URL,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'], // Invalidates 'Cart' tag on success
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetCartQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} = cartApiSlice;