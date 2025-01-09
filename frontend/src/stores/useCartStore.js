import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
    } catch (error) {
    set({cart:[]})
      toast.error(error.response.data.message || "An error occured");
    }
  },

  addToCart : async () => {
    try {
        await axios.post("/post", {productId:product._id})
        toast.success("Added to cart")
        set((prevState) => {
            const existingItem = prevState.cart.find((item) => item._id === product._id);
            const newCart = existingItem
                ? prevState.cart.map((item) =>
                        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                  )
                : [...prevState.cart, { ...product, quantity: 1 }];
            return { cart: newCart };
        });
        get().calculateTotals();
    } catch (error) {
        
    }
  }
}));
