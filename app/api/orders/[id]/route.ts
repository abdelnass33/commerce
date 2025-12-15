import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAuth, requireAdmin } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/api-response';

// Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request);
    await dbConnect();

    const order = await Order.findById(params.id)
      .populate('user', 'name email phone')
      .lean();

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    // Check if user owns this order or is admin
    if (user.role !== 'admin' && order.user._id.toString() !== user.userId) {
      return errorResponse('Access denied', 403);
    }

    return successResponse(order);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to fetch order', 500);
  }
}

// Update order status (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);
    await dbConnect();

    const body = await request.json();
    const { status, paymentStatus } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    return successResponse(order);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to update order', 500);
  }
}
