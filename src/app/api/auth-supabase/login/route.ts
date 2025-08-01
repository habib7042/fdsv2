import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { mobileNumber, pin, userType } = await request.json();

    if (!mobileNumber || !pin || !userType) {
      return NextResponse.json(
        { error: 'মোবাইল নম্বর, পিন এবং ব্যবহারকারী ধরন প্রয়োজন' },
        { status: 400 }
      );
    }

    if (userType === 'member') {
      const member = await db.getMember(mobileNumber, pin);

      if (!member) {
        return NextResponse.json(
          { error: 'সদস্য পাওয়া যায়নি বা পিন ভুল' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: member.id,
          name: member.name,
          mobileNumber: member.mobile_number,
          userType: 'member'
        }
      });
    } else if (userType === 'accountant') {
      const accountant = await db.getAccountant(mobileNumber, pin);

      if (!accountant) {
        return NextResponse.json(
          { error: 'হিসাবরক্ষক পাওয়া যায়নি বা পিন ভুল' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: accountant.id,
          name: accountant.name,
          mobileNumber: accountant.mobile_number,
          userType: 'accountant'
        }
      });
    } else {
      return NextResponse.json(
        { error: 'অবৈধ ব্যবহারকারী ধরন' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Supabase Auth error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}