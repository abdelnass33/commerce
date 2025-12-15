import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { requireAdmin } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/api-response';

// Update category (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);
    await dbConnect();

    const body = await request.json();

    const category = await Category.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    return successResponse(category);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to update category', 500);
  }
}

// Delete category (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);
    await dbConnect();

    const category = await Category.findByIdAndDelete(params.id);

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    return successResponse({ message: 'Category deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to delete category', 500);
  }
}
