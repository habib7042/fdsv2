import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mobileNumber = searchParams.get('mobileNumber');

    if (!mobileNumber) {
      return NextResponse.json(
        { error: 'মোবাইল নম্বর প্রয়োজন' },
        { status: 400 }
      );
    }

    const member = await db.member.findUnique({
      where: {
        mobileNumber: mobileNumber,
        isActive: true
      },
      include: {
        deposits: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!member) {
      return NextResponse.json(
        { error: 'সদস্য পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    const totalDeposits = member.deposits
      .filter(deposit => deposit.isApproved)
      .reduce((sum, deposit) => sum + deposit.amount, 0);

    const pendingDeposits = member.deposits
      .filter(deposit => !deposit.isApproved)
      .reduce((sum, deposit) => sum + deposit.amount, 0);

    // Calculate society total (sum of all approved deposits from all members)
    const allMembers = await db.member.findMany({
      where: {
        isActive: true
      },
      include: {
        deposits: {
          where: {
            isApproved: true
          }
        }
      }
    });

    const societyTotal = allMembers.reduce((sum, member) => {
      const memberTotal = member.deposits.reduce((depositSum, deposit) => depositSum + deposit.amount, 0);
      return sum + memberTotal;
    }, 0);

    return NextResponse.json({
      id: member.id,
      name: member.name,
      mobileNumber: member.mobileNumber,
      totalDeposits,
      pendingDeposits,
      societyTotal,
      deposits: member.deposits.map(deposit => ({
        id: deposit.id,
        month: deposit.month,
        year: deposit.year,
        amount: deposit.amount,
        isApproved: deposit.isApproved,
        approvedAt: deposit.approvedAt,
        createdAt: deposit.createdAt
      }))
    });
  } catch (error) {
    console.error('Get member dashboard error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}