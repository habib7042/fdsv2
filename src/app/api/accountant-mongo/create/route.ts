import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { Accountant } from '@/models';

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();
    
    const { name, mobileNumber, pin } = await request.json();

    // Validate required fields
    if (!name || !mobileNumber || !pin) {
      return NextResponse.json(
        { error: 'নাম, মোবাইল নম্বর এবং PIN প্রয়োজন' },
        { status: 400 }
      );
    }

    // Check if accountant already exists
    const existingAccountant = await Accountant.findOne({ mobileNumber });

    if (existingAccountant) {
      return NextResponse.json(
        { error: 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একজন হিসাবরক্ষক রয়েছে' },
        { status: 400 }
      );
    }

    // Create new accountant
    const accountant = await Accountant.create({
      name,
      mobileNumber,
      pin
    });

    return NextResponse.json({
      message: 'হিসাবরক্ষক সফলভাবে তৈরি হয়েছে',
      accountant: {
        id: accountant._id.toString(),
        name: accountant.name,
        mobileNumber: accountant.mobileNumber,
        isActive: accountant.isActive,
        createdAt: accountant.createdAt
      }
    });

  } catch (error) {
    console.error('Create accountant error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}