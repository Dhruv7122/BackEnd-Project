// src/controllers/cartController.ts
import { Request, Response } from "express";
import CartItem, { ICartItem } from "../model/cartSchema";
import Product from "../model/productSchema";
import User from "../model/userSchema";

// Add product to cart
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, productId, quantity } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Create a new cart item
    const newCartItem: ICartItem = new CartItem({
      user: userId,
      product: productId,
      quantity,
    });
    await newCartItem.save();

    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Find all cart items for the specified user and populate product details
    const cartItems = await CartItem.find({ user: userId })
      .populate("product")
      .exec();

    // Transform the cart items into the desired format
    const userCart = cartItems.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    res.status(200).json(userCart);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const syncCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const cartItems: ICartItem[] = req.body;

    console.log(cartItems);
    // Validate and save each cart item to the database
    const savedCartItems: ICartItem[] = [];
    for (const item of cartItems) {
      const { user, product, quantity } = item;

      // Check if the user exists
      const existUser = await User.findById(user);
      if (!existUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Check if the product exists
      const existProduct = await Product.findById(product);
      if (!existProduct) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      // Create a new cart item and save to the database
      const newCartItem = new CartItem({
        user: user,
        product: product,
        quantity,
      });
      await newCartItem.save();
      savedCartItems.push(newCartItem);
    }

    res.status(201).json(savedCartItems);
  } catch (error) {
    console.error("Error syncing cart to database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, productId } = req.body; // Assuming userId and productId are sent in the request body

    console.log(userId, productId);

    // Check if the user has the product in the cart
    const cartItem = await CartItem.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (!cartItem) {
      res.status(404).json({ error: "CartItem not found" });
      return;
    }

    res.status(200).json({ message: "Product removed from cart", cartItem });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
