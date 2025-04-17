import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  banners: [],
  recommendations: [],
  promotions: []
};

const cmsSlice = createSlice({
  name: 'cms',
  initialState,
  reducers: {
    setBanners: (state, action) => {
      state.banners = action.payload;
    },
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },
    setPromotions: (state, action) => {
      state.promotions = action.payload;
    },
  },
});

export const { setBanners, setRecommendations, setPromotions } = cmsSlice.actions;

export default cmsSlice.reducer;