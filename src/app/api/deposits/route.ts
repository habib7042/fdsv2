import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const pending = searchParams.get('pending');

    const whereClause: any = {};
    
    if (memberId) {
      whereClause.memberId = memberId;
    }
    
    if (pending === 'true') {
      whereClause.isApproved = false;
    }

    const deposits = await db.deposit.findMany({
      where: whereClause,
      include: {
        member: {
          select: {
            name: true,
            mobileNumber: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedDeposits = deposits.map(deposit => ({
      id: deposit.id,
      memberId: deposit.memberId,
      memberName: deposit.member.name,
      month: deposit.month,
      year: deposit.year,
      amount: deposit.amount,
      isApproved: deposit.isApproved,
      approvedAt: deposit.approvedAt,
      createdAt: deposit.createdAt
    }));

    return NextResponse.json(formattedDeposits);
  } catch (error) {
    console.error('Get deposits error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { memberId, month, year, amount = 500 } = await request.json();

    if (!memberId || !month || !year) {
      return NextResponse.json(
        { error: 'সদস্য আইডি, মাস এবং বছর প্রয়োজন' },
        { status: 400 }
      );
    }

    // Check if deposit already exists for this member, month and year
    const existingDeposit = await db.deposit.findUnique({
      where: {
        memberId_month_year: {
          memberId,
          month: parseInt(month),
          year: parseInt(year)
        }
      }
    });

    if (existingDeposit) {
      return NextResponse.json(
        { error: 'এই মাস ও বছরের জন্য ইতিমধ্যে চাঁদা জমা হয়েছে' },
        { status: 400 }
      );
    }

    const deposit = await db.deposit.create({
      data: {
        memberId,
        month: parseInt(month),
        year: parseInt(year),
        amount: parseFloat(amount.toString()),
        isApproved: false
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
        id: deposit.id,
        memberId: deposit.memberId,
        memberName: deposit.member.name,
        month: deposit.month,
        year: deposit.year,
        amount: deposit.amount,
        isApproved: deposit.isApproved,
        createdAt: deposit.createdAt
      }
    });
  } catch (error) {
    console.error('Create deposit error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}