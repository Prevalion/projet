import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  // Comprehensive check for user authentication
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('Not authorized, invalid user data');
    return; // Make sure execution stops here
  }

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  }

  try {
    // Get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    if (!itemsFromDB || itemsFromDB.length !== orderItems.length) {
      res.status(400);
      throw new Error('Some products were not found');
      return;
    }

    // Map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      
      if (!matchingItemFromDB) {
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }
      
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // Calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  // Comprehensive check for user authentication
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('Not authorized, invalid user data');
    return; // Make sure execution stops here
  }
  
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // NOTE: This controller is simplified to allow marking as paid
  // without specific payment provider details (like PayPal or Stripe).
  // In a real application, you would verify payment details from req.body here.

  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // Optionally store generic payment result if needed, e.g., from a test button
    order.paymentResult = {
      id: req.body.id || 'test-payment-id', // Use provided ID or a placeholder
      status: req.body.status || 'COMPLETED', // Use provided status or a placeholder
      update_time: req.body.update_time || Date.now().toString(),
      email_address: req.body.payer?.email_address || req.user.email, // Use payer email or user email
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  // Ensure user is authenticated and is admin - This check was missing before the main logic
  // if (!req.user || !req.user.isAdmin) { // Simplified check assuming protect middleware ran
  //   res.status(401);
  //   throw new Error('Not authorized as an admin');
  // }
  // Note: The protect and admin middleware should already handle auth checks if applied correctly in orderRoutes.js

  const order = await Order.findById(req.params.id); // Fetch the order first

  if (order) {
    // Check if the order is already delivered
    if (order.isDelivered) {
      res.status(400);
      throw new Error('Order already delivered');
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder); // Send 200 OK status
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  // Note: The protect and admin middleware should handle auth checks if applied correctly in orderRoutes.js
  // if (!req.user || !req.user.isAdmin) {
  //   res.status(401);
  //   throw new Error('Not authorized as an admin');
  // }

  const orders = await Order.find({}).populate('user', 'id name');
  res.status(200).json(orders); // Send 200 OK status
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid, // Ensure this is exported
  updateOrderToDelivered,
  getOrders,
};