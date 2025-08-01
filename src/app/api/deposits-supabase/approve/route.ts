import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { depositId, accountantId } = await request.json();

    if (!depositId || !accountantId) {
      return NextResponse.json(
        { error: 'Deposit ID and accountant ID are required' },
        { status: 400 }
      );
    }

    const deposit = await db.approveDeposit(depositId, accountantId);

    return NextResponse.json({
      success: true,
      message: 'চাঁদা সফলভাবে অনুমোদিত হয়েছে',
      deposit: {
        id: deposit.id,
        memberId: deposit.member_id,
        month: deposit.month,
        year: deposit.year,
        amount: Number(deposit.amount),
        isApproved: deposit.is_approved,
        approvedAt: deposit.approved_at,
        createdAt: deposit.created_at
      }
    });
  } catch (error) {
    console.error('Approve deposit error:', error);
    return NextResponse.json(
      { error: 'চাঁদা অনুমোদন করা যায়নি' },
      { status: 500 }
    );
  }
}