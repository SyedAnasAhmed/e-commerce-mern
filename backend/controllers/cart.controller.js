import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === productId
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });

    res.json(cartItems);
  } catch (error) {
    console.log("Error inside the getcartprod controller");
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const thisUser = await User.findById(user._id);
    console.log("errror nh hai", thisUser.cartItems);

    const existingItem = thisUser.cartItems.find((item) => item.product.toString() === productId);
    console.log(existingItem, "console");

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      // thisUser.cartItems.push(productId);
      thisUser.cartItems.push({ product: productId, quantity: 1 })
    }
    await thisUser.save();
    console.log(thisUser);
    res.json(thisUser.cartItems);
  } catch (error) {
    console.log("Error inside the addtocart controller");
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error inside the removecartitem controller");
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error inside the update cartitems controller");
    res.status(500).json({ message: "server error", error: error.message });
  }
};
