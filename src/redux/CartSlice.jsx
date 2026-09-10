import { createSlice } from "@reduxjs/toolkit";

const getInitialItems = () => {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(window.localStorage.getItem("pn_cart") || "{}");
  } catch (_error) {
    return {};
  }
};

const initialState = {
  items: getInitialItems()
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const product = action.payload;
      const itemKey = product.cartKey || product.id;
      const existing = state.items[itemKey];

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items[itemKey] = {
          ...product,
          cartKey: itemKey,
          quantity: 1
        };
      }
    },
    updateQuantity: (state, action) => {
      const { id, change } = action.payload;
      const itemKey = state.items[id] ? id : Object.keys(state.items).find((key) => state.items[key].id === id);
      const item = itemKey ? state.items[itemKey] : null;
      if (!item) {
        return;
      }

      const nextQuantity = item.quantity + change;

      if (nextQuantity > 0) {
        item.quantity = nextQuantity;
      } else {
        delete state.items[itemKey];
      }
    },
    removeItem: (state, action) => {
      const itemKey = state.items[action.payload]
        ? action.payload
        : Object.keys(state.items).find((key) => state.items[key].id === action.payload);
      if (itemKey) delete state.items[itemKey];
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