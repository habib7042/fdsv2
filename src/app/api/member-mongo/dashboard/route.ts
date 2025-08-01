import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { Member, Deposit } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await connectToMongoDB();

    const { searchParams } = new URL(request.url);
    const mobileNumber = searchParams.get('mobileNumber');

    if (!mobileNumber) {
      return NextResponse.json(
        { error: 'মোবাইল নম্বর প্রয়োজন' },
        { status: 400 }
      );
    }

    const member = await Member.findOne({
      mobileNumber: mobileNumber,
      isActive: true
    });

    if (!member) {
      return NextResponse.json(
        { error: 'সদস্য পাওয়া যায়নি' },
        { status: 404 }
      );
    }

    const deposits = await Deposit.find({ memberId: member._id.toString() })
      .sort({ createdAt: -1 });

    const totalDeposits = deposits
      .filter(deposit => deposit.isApproved)
      .reduce((sum, deposit) => sum + deposit.amount, 0);

    const pendingDeposits = deposits
      .filter(deposit => !deposit.isApproved)
      .reduce((sum, deposit) => sum + deposit.amount, 0);

    // Calculate society total (sum of all approved deposits from all members)
    const allMembers = await Member.find({ isActive: true });
    const allMemberIds = allMembers.map(m => m._id.toString());
    
    const allApprovedDeposits = await Deposit.find({
      memberId: { $in: allMemberIds },
      isApproved: true
    });

    const societyTotal = allApprovedDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);

    return NextResponse.json({
      id: member._id.toString(),
      name: member.name,
      mobileNumber: member.mobileNumber,
      totalDeposits,
      pendingDeposits,
      societyTotal,
      deposits: deposits.map(deposit => ({
        id: deposit._id.toString(),
        month: deposit.month,
        year: deposit.year,
        amount: deposit.amount,
        isApproved: deposit.isApproved,
        approvedAt: deposit.approvedAt,
        createdAt: deposit.createdAt
      }))
    });
  } catch (error) {
    console.error('Get MongoDB member dashboard error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}