import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { Member, Deposit } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await connectToMongoDB();

    const members = await Member.find({ isActive: true }).sort({ joinedAt: -1 });

    const membersWithStats = await Promise.all(
      members.map(async (member) => {
        const deposits = await Deposit.find({ 
          memberId: member._id.toString(),
          isApproved: true 
        });

        const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
        const pendingDeposits = await Deposit.countDocuments({ 
          memberId: member._id.toString(),
          isApproved: false 
        });

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
          pendingDeposits: pendingDeposits * 500 // Assuming 500 per pending deposit
        };
      })
    );

    return NextResponse.json(membersWithStats);
  } catch (error) {
    console.error('Get MongoDB members error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();

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
    const existingMember = await Member.findOne({
      $or: [
        { mobileNumber: mobileNumber },
        { nationalId: nationalId }
      ]
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'এই মোবাইল নম্বর বা জাতীয় পরিচয়পত্রে ইতিমধ্যে একজন সদস্য রয়েছে' },
        { status: 400 }
      );
    }

    const member = await Member.create({
      name,
      fatherName,
      motherName,
      dateOfBirth: new Date(dateOfBirth),
      nationalId,
      mobileNumber,
      nomineeName,
      pin,
      isActive: true
    });

    return NextResponse.json({
      success: true,
      member: {
        id: member._id.toString(),
        name: member.name,
        mobileNumber: member.mobileNumber,
        joinedAt: member.joinedAt.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('Create MongoDB member error:', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি' },
      { status: 500 }
    );
  }
}