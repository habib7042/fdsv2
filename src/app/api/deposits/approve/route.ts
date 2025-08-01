import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { depositId, accountantId } = await request.json();

    if (!depositId) {
      return NextResponse.json(
        { error: 'ডিপোজিট আইডি প্রয়োজন' },
        { status: 400 }
      );
    }

    const deposit = await db.deposit.findUnique({
      where: {
        id: depositId
      }
    });

    if (!deposit) {
      return NextResponse.json(
        { error: 'ডিপোজিট পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    if (deposit.isApproved) {
      return NextResponse.json(
        { error: 'এই ডিপোজিট ইতিমধ্যে অনুমোদিত হয়েছে' },
        { status: 400 }
      );
    }

    const updatedDeposit = await db.deposit.update({
      where: {
        id: depositId
      },
      data: {
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: accountantId
      },
      include: {
        member: {
          select: {
            name: true,
            mobileNumber: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      deposit: {
        id: updatedDeposit.id,
        memberId: updatedDeposit.memberId,
        memberName: updatedDeposit.member.name,
        month: updatedDeposit.month,
        year: updatedDeposit.year,
        amount: updatedDeposit.amount,
        isApproved: updatedDeposit.isApproved,
        approvedAt: updatedDeposit.approvedAt,
        createdAt: updatedDeposit.createdAt
      }
    });
  } catch (error) {
    console.error('Approve deposit error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}