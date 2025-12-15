import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { requireAdmin } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/api-response';

// Get all categories
export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find().sort({ name: 1 }).lean();

    return successResponse(categories);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch categories', 500);
  }
}

// Create new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    await dbConnect();

    const body = await request.json();

    const category = await Category.create(body);

    return successResponse(category, 201);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to create category', 500);
  }
}
