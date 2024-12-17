import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
  },
});

export const { increment, decrement } = mainSlice.actions;
export default mainSlice.reducer;
