import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { requireAdmin } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/api-response';

// Get dashboard statistics (Admin only)
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Total revenue
    const revenueData = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const revenue = revenueData[0] || { totalRevenue: 0, totalOrders: 0 };

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: daysAgo },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 1,
          name: '$product.name',
          image: { $arrayElemAt: ['$product.images', 0] },
          totalSold: 1,
          revenue: 1,
        },
      },
    ]);

    // Revenue by day
    const revenueByDay = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Total users
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({
      createdAt: { $gte: daysAgo },
    });

    // Total products
    const totalProducts = await Product.countDocuments({ active: true });
    const lowStockProducts = await Product.countDocuments({
      active: true,
      stock: { $lt: 10 },
    });

    return successResponse({
      revenue: {
        total: revenue.totalRevenue,
        orders: revenue.totalOrders,
        average: revenue.totalOrders > 0 ? revenue.totalRevenue / revenue.totalOrders : 0,
      },
      ordersByStatus,
      topProducts,
      revenueByDay,
      users: {
        total: totalUsers,
        new: newUsers,
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to fetch statistics', 500);
  }
}
