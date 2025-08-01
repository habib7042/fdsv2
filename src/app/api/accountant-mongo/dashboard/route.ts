import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { Member, Deposit } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await connectToMongoDB();

    // Get all members with their deposit stats
    const members = await Member.find({ isActive: true }).sort({ joinedAt: -1 });

    const membersWithStats = await Promise.all(
      members.map(async (member) => {
        const deposits = await Deposit.find({ memberId: member._id.toString() });
        
        const totalDeposits = deposits
          .filter(deposit => deposit.isApproved)
          .reduce((sum, deposit) => sum + deposit.amount, 0);

        const pendingDeposits = deposits
          .filter(deposit => !deposit.isApproved)
          .reduce((sum, deposit) => sum + deposit.amount, 0);

        return {
          id: member._id.toString(),
          name: member.name,
          fatherName: member.fatherName,
          motherName: member.motherName,
          dateOfBirth: member.dateOfBirth.toISOString().split('T')[0],
          nationalId: member.nationalId,
          mobileNumber: member.mobileNumber,
          nomineeName: member.nomineeName,
          isActive: member.isActive,
          joinedAt: member.joinedAt.toISOString().split('T')[0],
          totalDeposits,
          pendingDeposits
        };
      })
    );

    // Get all pending deposits
    const pendingDeposits = await Deposit.find({ isApproved: false })
      .sort({ createdAt: -1 })
      .populate({
        path: 'memberId',
        select: 'name mobileNumber'
      });

    const formattedPendingDeposits = pendingDeposits.map(deposit => ({
      id: deposit._id.toString(),
      memberId: deposit.memberId._id.toString(),
      memberName: deposit.memberId.name,
      month: deposit.month,
      year: deposit.year,
      amount: deposit.amount,
      isApproved: deposit.isApproved,
      createdAt: deposit.createdAt
    }));

    // Calculate totals
    const totalSocietyFund = membersWithStats.reduce((sum, member) => sum + member.totalDeposits, 0);
    const totalPendingAmount = membersWithStats.reduce((sum, member) => sum + member.pendingDeposits, 0);

    return NextResponse.json({
      members: membersWithStats,
      pendingDeposits: formattedPendingDeposits,
      stats: {
        totalMembers: membersWithStats.length,
        totalSocietyFund,
        pendingDepositsCount: pendingDeposits.length,
        totalPendingAmount
      }
    });
  } catch (error) {
    console.error('Get MongoDB accountant dashboard error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}