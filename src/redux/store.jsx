import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./CartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer
  }
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    window.localStorage.setItem("pn_cart", JSON.stringify(store.getState().cart.items));
  });
}