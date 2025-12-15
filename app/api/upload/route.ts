import { NextRequest } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/api-response';

// Upload image to Cloudinary (Admin only)
export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return errorResponse('No file provided');
    }

    const imageUrl = await uploadImage(file);

    return successResponse({ url: imageUrl });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Admin access required') {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to upload image', 500);
  }
}
