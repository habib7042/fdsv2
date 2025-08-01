import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { memberId, month, year, amount = 500 } = await request.json();

    if (!memberId || !month || !year) {
      return NextResponse.json(
        { error: 'Member ID, month, and year are required' },
        { status: 400 }
      );
    }

    const deposit = await db.createDeposit({
      member_id: memberId,
      month,
      year,
      amount,
      is_approved: false
    });

    return NextResponse.json({
      success: true,
      message: 'চাঁদা সফলভাবে জমা হয়েছে',
      deposit: {
        id: deposit.id,
        memberId: deposit.member_id,
        month: deposit.month,
        year: deposit.year,
        amount: Number(deposit.amount),
        isApproved: deposit.is_approved,
        createdAt: deposit.created_at
      }
    });
  } catch (error) {
    console.error('Create deposit error:', error);
    return NextResponse.json(
      { error: 'চাঁদা জমা করা যায়নি' },
      { status: 500 }
    );
  }
}