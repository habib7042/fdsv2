import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, mobileNumber, pin } = await request.json();

    // Validate required fields
    if (!name || !mobileNumber || !pin) {
      return NextResponse.json(
        { error: 'নাম, মোবাইল নম্বর এবং PIN প্রয়োজন' },
        { status: 400 }
      );
    }

    // Check if accountant already exists by trying to get them
    try {
      const existingAccountant = await db.getAccountant(mobileNumber, pin);
      if (existingAccountant) {
        return NextResponse.json(
          { error: 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একজন হিসাবরক্ষক রয়েছে' },
          { status: 400 }
        );
      }
    } catch (error) {
      // Accountant doesn't exist, which is what we want
      console.log('Accountant does not exist, proceeding with creation');
    }

    // Create new accountant
    const accountant = await db.createAccountant({
      name,
      mobile_number: mobileNumber,
      pin,
      is_active: true
    });

    return NextResponse.json({
      message: 'হিসাবরক্ষক সফলভাবে তৈরি হয়েছে',
      accountant: {
        id: accountant.id,
        name: accountant.name,
        mobileNumber: accountant.mobile_number,
        isActive: accountant.is_active,
        createdAt: accountant.created_at
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