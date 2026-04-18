import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {}
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
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
    updateQuantity: (state, action) => {
      const { id, change } = action.payload;
      const item = state.items[id];
      if (!item) {
        return;
      }

      const nextQuantity = item.quantity + change;

      if (nextQuantity > 0) {
        item.quantity = nextQuantity;
      } else {
        delete state.items[id];
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
  addItem,
  updateQuantity,
  removeItem,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;