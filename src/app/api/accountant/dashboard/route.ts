import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all members with their deposit stats
    const members = await db.member.findMany({
      where: {
        isActive: true
      },
      include: {
        deposits: true
      },
      orderBy: {
        joinedAt: 'desc'
      }
    });

    const membersWithStats = members.map(member => {
      const totalDeposits = member.deposits
        .filter(deposit => deposit.isApproved)
        .reduce((sum, deposit) => sum + deposit.amount, 0);

      const pendingDeposits = member.deposits
        .filter(deposit => !deposit.isApproved)
        .reduce((sum, deposit) => sum + deposit.amount, 0);

      return {
        id: member.id,
        name: member.name,
        fatherName: member.fatherName,
        motherName: member.motherName,
        dateOfBirth: member.dateOfBirth,
        nationalId: member.nationalId,
        mobileNumber: member.mobileNumber,
        nomineeName: member.nomineeName,
        isActive: member.isActive,
        joinedAt: member.joinedAt,
        totalDeposits,
        pendingDeposits
      };
    });

    // Get all pending deposits
    const pendingDeposits = await db.deposit.findMany({
      where: {
        isApproved: false
      },
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

    const formattedPendingDeposits = pendingDeposits.map(deposit => ({
      id: deposit.id,
      memberId: deposit.memberId,
      memberName: deposit.member.name,
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
    console.error('Get accountant dashboard error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}