import mongoose from 'mongoose';

const cartItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: { // Price at the time it was added
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
});

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true, // Ensure one cart per user
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;