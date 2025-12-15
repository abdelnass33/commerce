import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Promotion from '@/models/Promotion';
import { requireAdmin } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/api-response';

// Get all promotions (Admin only for all, public for active)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const query: any = {};
    
    if (activeOnly) {
      query.active = true;
      query.startDate = { $lte: new Date() };
      query.endDate = { $gte: new Date() };
    }

    const promotions = await Promotion.find(query)
      .populate('applicableCategories', 'name slug')
      .populate('applicableProducts', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    return successResponse(promotions);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch promotions', 500);
  }
}

// Create new promotion (Admin only)
export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    await dbConnect();

    const body = await request.json();

    const promotion = await Promotion.create(body);
    await promotion.populate([
      { path: 'applicableCategories', select: 'name slug' },
      { path: 'applicableProducts', select: 'name slug' },
    ]);

    return successResponse(promotion, 201);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to create promotion', 500);
  }
}
