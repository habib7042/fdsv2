import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { Deposit } from '@/models';

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();

    const { depositId, accountantId } = await request.json();

    if (!depositId) {
      return NextResponse.json(
        { error: 'ডিপোজিট আইডি প্রয়োজন' },
        { status: 400 }
      );
    }

    const deposit = await Deposit.findById(depositId);

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

    const updatedDeposit = await Deposit.findByIdAndUpdate(
      depositId,
      {
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: accountantId
      },
      { new: true }
    ).populate({
      path: 'memberId',
      select: 'name mobileNumber'
    });

    return NextResponse.json({
      success: true,
      deposit: {
        id: updatedDeposit._id.toString(),
        memberId: updatedDeposit.memberId._id.toString(),
        memberName: updatedDeposit.memberId.name,
        month: updatedDeposit.month,
        year: updatedDeposit.year,
        amount: updatedDeposit.amount,
        isApproved: updatedDeposit.isApproved,
        approvedAt: updatedDeposit.approvedAt,
        createdAt: updatedDeposit.createdAt
      }
    });
  } catch (error) {
    console.error('Approve MongoDB deposit error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}