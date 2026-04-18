import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {}
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items[product.id];

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items[product.id] = {
          ...product,
          quantity: 1
        };
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.items[action.payload];
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items[action.payload];
      if (!item) {
        return;
      }

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        delete state.items[action.payload];
      }
    },
    removeItem: (state, action) => {
      delete state.items[action.payload];
    },
    clearCart: (state) => {
      state.items = {};
    }
  }
});

export const selectCartItems = (state) => Object.values(state.cart.items);

export const selectCartItemCount = (state) =>
  Object.values(state.cart.items).reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotal = (state) =>
  Object.values(state.cart.items).reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;