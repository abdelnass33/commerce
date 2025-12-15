import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

console.log('🔐 JWT Configuration:');
console.log('  - JWT_SECRET defined:', !!process.env.JWT_SECRET);
console.log('  - Using default secret:', !process.env.JWT_SECRET);

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'admin' | 'client';
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getUserFromRequest(request: NextRequest): TokenPayload | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

export function requireAuth(request: NextRequest): TokenPayload {
  const user = getUserFromRequest(request);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

export function requireAdmin(request: NextRequest): TokenPayload {
  const user = requireAuth(request);
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return user;
}
