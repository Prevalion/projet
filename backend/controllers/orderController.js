import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { sendOrderConfirmation } from '../utils/emailService.js'; // Add this import

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
    paymentMethod, // Destructured from req.body
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  }

  try {
    // Get the ordered items from our database
    const itemsFromDB = await Product.find({
      // Correctly map product IDs from the nested structure
      _id: { $in: orderItems.map((x) => x.product._id) },
    });

    // Check if the number of items found matches the number requested
    if (!itemsFromDB || itemsFromDB.length !== orderItems.length) {
      res.status(400);
      throw new Error('Some products were not found');
      // No need for return here as throw exits the function
    }

    // Map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        // Ensure comparison uses the correct ID field
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient.product._id
      );

      if (!matchingItemFromDB) {
        // This case should ideally not be reached if the previous check passed,
        // but it's good practice to handle it.
        throw new Error(`Product details not found for ID: ${itemFromClient.product._id}`);
      }

      // Construct the order item using DB price and client quantity/details
      // Note: The original code was using itemFromClient._id which doesn't exist in the provided body structure.
      // It should use itemFromClient.product._id for the product reference.
      return {
        name: itemFromClient.name, // Assuming name is sent directly in the item object
        qty: itemFromClient.qty,   // Assuming qty is sent directly
        image: itemFromClient.image, // Assuming image is sent directly
        price: matchingItemFromDB.price, // Use price from DB
        product: itemFromClient.product._id, // Reference the actual product ID
        // Remove the incorrect _id: undefined line if it was present
      };
    });

    // Calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod, // Directly uses the object from req.body
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Send order confirmation email
    try {
      await sendOrderConfirmation(createdOrder, req.user);
      console.log('Order confirmation email sent');
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    // Log the specific error for better debugging
    console.error('Error creating order:', error);
    // Ensure a proper status code is set based on the error type if possible
    res.status(res.statusCode === 200 ? 400 : res.statusCode); // Keep existing status if already set, else 400
    throw error; // Re-throw the error for the global error handler
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
    // Ensure paymentMethod and paymentMethod.type exist before saving
    if (!order.paymentMethod) {
      order.paymentMethod = { type: 'Manual Payment' }; // Provide a default object
    } else if (!order.paymentMethod.type) {
      order.paymentMethod.type = 'Manual Payment'; // Provide a default type if object exists but type is missing
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    // Optionally store generic payment result if needed, e.g., from a test button
    order.paymentResult = {
      id: req.body.id || 'test-payment-id', // Use provided ID or a placeholder
      status: req.body.status || 'COMPLETED', // Use provided status or a placeholder
      update_time: req.body.update_time || Date.now().toString(),
      email_address: req.body.payer?.email_address || req.user.email, // Use payer email or user email
    };

    const updatedOrder = await order.save(); // Validation should now pass

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
  const order = await Order.findById(req.params.id);

  if (order) {
    // Add this check: Ensure the order is paid first
    if (!order.isPaid) {
      res.status(400); // Bad Request
      throw new Error('Order must be paid before it can be marked as delivered');
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
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