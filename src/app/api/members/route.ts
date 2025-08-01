import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const members = await db.member.findMany({
      include: {
        deposits: {
          where: {
            isApproved: true
          }
        }
      },
      orderBy: {
        joinedAt: 'desc'
      }
    });

    const membersWithStats = members.map(member => ({
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
      totalDeposits: member.deposits.reduce((sum, deposit) => sum + deposit.amount, 0),
      pendingDeposits: 0 // This would be calculated based on expected vs actual deposits
    }));

    return NextResponse.json(membersWithStats);
  } catch (error) {
    console.error('Get members error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      fatherName,
      motherName,
      dateOfBirth,
      nationalId,
      mobileNumber,
      nomineeName,
      pin
    } = await request.json();

    if (!name || !fatherName || !motherName || !dateOfBirth || !nationalId || !mobileNumber || !nomineeName || !pin) {
      return NextResponse.json(
        { error: 'সকল ফিল্ড পূরণ করা আবশ্যক' },
        { status: 400 }
      );
    }

    // Check if member already exists
    const existingMember = await db.member.findUnique({
      where: {
        mobileNumber: mobileNumber
      }
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'এই মোবাইল নম্বরে ইতিমধ্যে একজন সদস্য রয়েছে' },
        { status: 400 }
      );
    }

    const member = await db.member.create({
      data: {
        name,
        fatherName,
        motherName,
        dateOfBirth: new Date(dateOfBirth),
        nationalId,
        mobileNumber,
        nomineeName,
        pin,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      member: {
        id: member.id,
        name: member.name,
        mobileNumber: member.mobileNumber,
        joinedAt: member.joinedAt
      }
    });
  } catch (error) {
    console.error('Create member error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}