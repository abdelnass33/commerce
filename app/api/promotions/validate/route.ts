import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Promotion from '@/models/Promotion';
import { errorResponse, successResponse } from '@/lib/api-response';

// Validate promo code
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { code, cartTotal, items } = body;

    if (!code) {
      return errorResponse('Promo code is required');
    }

    const promotion = await Promotion.findOne({
      code: code.toUpperCase(),
      active: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    })
      .populate('applicableCategories')
      .populate('applicableProducts');

    if (!promotion) {
      return errorResponse('Invalid or expired promo code', 404);
    }

    // Check usage limit
    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      return errorResponse('Promo code usage limit reached', 400);
    }

    // Check minimum purchase
    if (promotion.minPurchase && cartTotal < promotion.minPurchase) {
      return errorResponse(
        `Minimum purchase of ${promotion.minPurchase} required`,
        400
      );
    }

    // Calculate discount
    let discount = 0;
    if (promotion.discountType === 'percentage') {
      discount = (cartTotal * promotion.discountValue) / 100;
      if (promotion.maxDiscount && discount > promotion.maxDiscount) {
        discount = promotion.maxDiscount;
      }
    } else {
      discount = promotion.discountValue;
    }

    return successResponse({
      code: promotion.code,
      discount,
      description: promotion.description,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to validate promo code', 500);
  }
}
