import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  const envCheck = {
    mongodb: {
      configured: !!process.env.MONGODB_URI,
      uriFormat: process.env.MONGODB_URI?.startsWith('mongodb') || false,
    },
    cloudinary: {
      cloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: !!process.env.CLOUDINARY_API_KEY,
      apiSecret: !!process.env.CLOUDINARY_API_SECRET,
    },
    jwt: {
      configured: !!process.env.JWT_SECRET,
      usingDefault: !process.env.JWT_SECRET,
    },
  };

  let dbStatus = {
    connected: false,
    error: null as string | null,
    database: null as string | null,
  };

  try {
    await dbConnect();
    dbStatus.connected = mongoose.connection.readyState === 1;
    dbStatus.database = mongoose.connection.db?.databaseName || null;
  } catch (error: any) {
    dbStatus.error = error.message;
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envCheck,
    dbStatus,
  });
}
