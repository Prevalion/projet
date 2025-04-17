import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const getDashboardStats = asyncHandler(async (req, res) => {
  // Sales Statistics
  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);

  const monthlySales = await Order.aggregate([
    { 
      $match: { 
        isPaid: true,
        paidAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
      }
    },
    {
      $group: {
        _id: { $month: '$paidAt' },
        total: { $sum: '$totalPrice' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  // User Statistics
  const userStats = await User.aggregate([
    {
      $facet: {
        totalUsers: [{ $count: 'count' }],
        activeUsers: [
          { $match: { lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
          { $count: 'count' }
        ]
      }
    }
  ]);

  // Product Statistics
  const productStats = await Product.aggregate([
    {
      $facet: {
        totalProducts: [{ $count: 'count' }],
        lowStock: [
          { $match: { countInStock: { $lte: 10 } } },
          { $count: 'count' }
        ],
        categories: [
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ]
      }
    }
  ]);

  // Recent Activities
  const recentOrders = await Order.find({ isPaid: true })
    .sort({ paidAt: -1 })
    .limit(5)
    .select('totalPrice paidAt')
    .lean();

  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name createdAt')
    .lean();

  const stats = {
    totalRevenue: totalRevenue[0]?.total || 0,
    monthlySales: Array(12).fill(0).map((_, index) => ({
      month: index + 1,
      total: monthlySales.find(s => s._id === index + 1)?.total || 0,
      count: monthlySales.find(s => s._id === index + 1)?.count || 0
    })),
    totalUsers: userStats[0].totalUsers[0]?.count || 0,
    activeUsers: userStats[0].activeUsers[0]?.count || 0,
    totalProducts: productStats[0].totalProducts[0]?.count || 0,
    lowStockProducts: productStats[0].lowStock[0]?.count || 0,
    productCategories: productStats[0].categories,
    recentActivities: [
      ...recentOrders.map(o => ({
        type: 'order',
        message: `New order of $${o.totalPrice}`,
        timestamp: o.paidAt
      })),
      ...recentUsers.map(u => ({
        type: 'user',
        message: `New user: ${u.name}`,
        timestamp: u.createdAt
      }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)
  };

  res.json(stats);
});

export { getDashboardStats };