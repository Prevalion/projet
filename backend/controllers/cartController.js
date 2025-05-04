import asyncHandler from '../middleware/asyncHandler.js';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js'; // Needed to fetch product details

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name image price countInStock' // Populate specific product fields
  );

  if (cart) {
    res.status(200).json(cart);
  } else {
    // If no cart exists, return an empty cart structure
    res.status(200).json({
      user: req.user._id,
      items: [],
    });
  }
});

// @desc    Add item to cart or update quantity
// @route   POST /api/cart/items
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;
  const userId = req.user._id;

  // 1. Find the product to get its current details (especially price)
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // 2. Find the user's cart, or create one if it doesn't exist
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // 3. Check if the item already exists in the cart
  const existItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existItemIndex > -1) {
    // Item exists, update quantity
    cart.items[existItemIndex].qty = Number(qty);
    // Optionally update price if it can change, though typically cart price is fixed when added
    // cart.items[existItemIndex].price = product.price;
  } else {
    // Item does not exist, add new item
    const cartItem = {
      product: productId,
      name: product.name,
      image: product.image,
      price: product.price, // Store the price at the time of adding
      qty: Number(qty),
    };
    cart.items.push(cartItem);
  }

  // 4. Save the cart
  const updatedCart = await cart.save();

  // 5. Populate product details before sending response
  await updatedCart.populate('items.product', 'name image price countInStock');

  res.status(200).json(updatedCart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    const item = cart.items[itemIndex];
    const newQty = Number(qty);

    if (newQty > 0) {
      item.qty = newQty;
    } else {
      // If quantity is 0 or less, remove the item
      cart.items.splice(itemIndex, 1);
    }

    const updatedCart = await cart.save();
    await updatedCart.populate('items.product', 'name image price countInStock');
    res.status(200).json(updatedCart);
  } else {
    res.status(404);
    throw new Error('Item not found in cart');
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter((item) => item.product.toString() !== productId);

  if (cart.items.length === initialLength) {
     res.status(404);
     throw new Error('Item not found in cart');
  }

  const updatedCart = await cart.save();
  await updatedCart.populate('items.product', 'name image price countInStock');
  res.status(200).json(updatedCart);
});

// @desc    Clear all items from cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (cart) {
    cart.items = [];
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } else {
    // If no cart, it's already effectively clear
     res.status(200).json({
      user: req.user._id,
      items: [],
    });
  }
});

export {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};