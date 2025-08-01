import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { Deposit, Member } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await connectToMongoDB();

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const pending = searchParams.get('pending');

    const filter: any = {};
    
    if (memberId) {
      filter.memberId = memberId;
    }
    
    if (pending === 'true') {
      filter.isApproved = false;
    }

    const deposits = await Deposit.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: 'memberId',
        select: 'name mobileNumber'
      });

    const formattedDeposits = deposits.map(deposit => ({
      id: deposit._id.toString(),
      memberId: deposit.memberId._id.toString(),
      memberName: deposit.memberId.name,
      month: deposit.month,
      year: deposit.year,
      amount: deposit.amount,
      isApproved: deposit.isApproved,
      approvedAt: deposit.approvedAt,
      createdAt: deposit.createdAt
    }));

    return NextResponse.json(formattedDeposits);
  } catch (error) {
    console.error('Get MongoDB deposits error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();

    const { memberId, month, year, amount = 500 } = await request.json();

    if (!memberId || !month || !year) {
      return NextResponse.json(
        { error: 'সদস্য আইডি, মাস এবং বছর প্রয়োজন' },
        { status: 400 }
      );
    }

    // Check if deposit already exists for this member, month and year
    const existingDeposit = await Deposit.findOne({
      memberId,
      month: parseInt(month),
      year: parseInt(year)
    });

    if (existingDeposit) {
      return NextResponse.json(
        { error: 'এই মাস ও বছরের জন্য ইতিমধ্যে চাঁদা জমা হয়েছে' },
        { status: 400 }
      );
    }

    const deposit = await Deposit.create({
      memberId,
      month: parseInt(month),
      year: parseInt(year),
      amount: parseFloat(amount.toString()),
      isApproved: false
    });

    // Populate member info
    await deposit.populate({
      path: 'memberId',
      select: 'name mobileNumber'
    });

    return NextResponse.json({
      success: true,
      deposit: {
        id: deposit._id.toString(),
        memberId: deposit.memberId._id.toString(),
        memberName: deposit.memberId.name,
        month: deposit.month,
        year: deposit.year,
        amount: deposit.amount,
        isApproved: deposit.isApproved,
        createdAt: deposit.createdAt
      }
    });
  } catch (error) {
    console.error('Create MongoDB deposit error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}