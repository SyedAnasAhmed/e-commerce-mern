import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied : false,
    
  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      console.log("THIS IS THE GET CART ITEMS RES:", res.data )
      const cartItems = res.data.map((item) => ({
        product: item.product, // Ensure this matches your backend structure
        quantity: item.quantity,
      }));
  
      // Set the cart state
      set({ cart: cartItems });
      console.log("yahantak agaaya" , cartItems)
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.data || "An error occured");
    }
  },

  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      console.log("add to cart store"  ,product, product.image)
      toast.success("Product added to cart");

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, {  product: {
            ...product, // Normalize the product structure
          }, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    let total = subtotal;
    console.log("in the calculatetotals" ,coupon, subtotal ,total)
    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }
    console.log(total , subtotal)
    set({ subtotal, total });
  },

  removeFromCart: async (productId) => {
    await axios.delete(`/cart/`, { data: { productId } });
    set((prevState) => ({
      cart: prevState.cart.filter((item) => item._id !== productId),
    }));
    get().calculateTotals();
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }
    console.log("pre axios" , productId , quantity)
    await axios.put(`cart/${productId}`, { quantity });
    console.log("post axios")
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      ),
    }));
    get().calculateTotals();
  },
}));
