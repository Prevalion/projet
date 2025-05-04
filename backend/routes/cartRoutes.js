import express from 'express';
const router = express.Router();
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js'; // Assuming controllers will be in cartController.js
import { protect } from '../middleware/authMiddleware.js';

// All cart routes are protected
router.use(protect);

// GET /api/cart - Fetch user's cart
router.route('/').get(getCart);

// POST /api/cart/items - Add item or update quantity
router.route('/items').post(addItemToCart);

// PUT /api/cart/items/:productId - Update item quantity
router.route('/items/:productId').put(updateCartItem);

// DELETE /api/cart/items/:productId - Remove item
router.route('/items/:productId').delete(removeCartItem);

// DELETE /api/cart - Clear all items from cart
router.route('/').delete(clearCart);

export default router;