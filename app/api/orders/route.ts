import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Promotion from '@/models/Promotion';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/api-response';

// Get user orders
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {};
    
    // If not admin, only show user's orders
    if (user.role !== 'admin') {
      query.user = user.userId;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return successResponse({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to fetch orders', 500);
  }
}

// Create new order
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await dbConnect();

    const body = await request.json();
    const { items, shippingAddress, paymentMethod, discountCode } = body;

    if (!items || items.length === 0) {
      return errorResponse('Order must contain at least one item');
    }

    // Validate products and calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return errorResponse(`Product ${item.product} not found`, 404);
      }
      if (product.stock < item.quantity) {
        return errorResponse(`Insufficient stock for ${product.name}`, 400);
      }
      subtotal += product.price * item.quantity;
    }

    // Apply discount if provided
    let discount = 0;
    if (discountCode) {
      const promotion = await Promotion.findOne({
        code: discountCode.toUpperCase(),
        active: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      });

      if (promotion) {
        if (promotion.discountType === 'percentage') {
          discount = (subtotal * promotion.discountValue) / 100;
          if (promotion.maxDiscount && discount > promotion.maxDiscount) {
            discount = promotion.maxDiscount;
          }
        } else {
          discount = promotion.discountValue;
        }

        // Increment usage count
        promotion.usageCount += 1;
        await promotion.save();
      }
    }

    const total = subtotal - discount;

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

    // Create order
    const order = await Order.create({
      orderNumber,
      user: user.userId,
      items,
      subtotal,
      discount,
      discountCode,
      total,
      paymentMethod,
      shippingAddress,
      status: 'pending',
      paymentStatus: 'pending',
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    await order.populate('user', 'name email phone');

    return successResponse(order, 201);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to create order', 500);
  }
}
