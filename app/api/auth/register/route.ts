import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, comparePassword, generateToken } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/api-response';

// Register new user
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return errorResponse('Name, email and password are required');
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse('User already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'client',
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return successResponse(
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      },
      201
    );
  } catch (error: any) {
    return errorResponse(error.message || 'Registration failed', 500);
  }
}
