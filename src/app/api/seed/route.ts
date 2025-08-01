import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Create a sample accountant
    const accountant = await db.accountant.create({
      data: {
        name: "এডমিন হিসাবরক্ষক",
        mobileNumber: "01500-000000",
        pin: "1234"
      }
    });

    // Create sample members
    const member1 = await db.member.create({
      data: {
        name: "মোঃ আব্দুল করিম",
        fatherName: "মোঃ ইউসুফ আলী",
        motherName: "রহিমা খাতুন",
        dateOfBirth: new Date("1990-05-15"),
        nationalId: "1990567890123",
        mobileNumber: "01712-345678",
        nomineeName: "মোঃ সাকিব",
        pin: "1234"
      }
    });

    const member2 = await db.member.create({
      data: {
        name: "মোঃ রহিম উদ্দিন",
        fatherName: "মোঃ করিম উদ্দিন",
        motherName: "ফাতেমা বেগম",
        dateOfBirth: new Date("1985-08-20"),
        nationalId: "1985876543210",
        mobileNumber: "01823-456789",
        nomineeName: "মোঃ রাফি",
        pin: "1234"
      }
    });

    const member3 = await db.member.create({
      data: {
        name: "মোসাম্মৎ আয়েশা খাতুন",
        fatherName: "মোঃ আব্দুল মালেক",
        motherName: "জাহানারা বেগম",
        dateOfBirth: new Date("1992-12-03"),
        nationalId: "1992123456789",
        mobileNumber: "01934-567890",
        nomineeName: "মোঃ ইমরান",
        pin: "1234"
      }
    });

    // Create some approved deposits
    await db.deposit.createMany({
      data: [
        {
          memberId: member1.id,
          month: 1,
          year: 2025,
          amount: 500,
          isApproved: true,
          approvedAt: new Date("2025-01-15")
        },
        {
          memberId: member1.id,
          month: 2,
          year: 2025,
          amount: 500,
          isApproved: true,
          approvedAt: new Date("2025-02-10")
        },
        {
          memberId: member1.id,
          month: 3,
          year: 2025,
          amount: 500,
          isApproved: true,
          approvedAt: new Date("2025-03-12")
        },
        {
          memberId: member2.id,
          month: 1,
          year: 2025,
          amount: 500,
          isApproved: true,
          approvedAt: new Date("2025-01-20")
        },
        {
          memberId: member2.id,
          month: 2,
          year: 2025,
          amount: 500,
          isApproved: true,
          approvedAt: new Date("2025-02-15")
        },
        {
          memberId: member3.id,
          month: 1,
          year: 2025,
          amount: 500,
          isApproved: true,
          approvedAt: new Date("2025-01-25")
        }
      ]
    });

    // Create some pending deposits
    await db.deposit.createMany({
      data: [
        {
          memberId: member1.id,
          month: 4,
          year: 2025,
          amount: 500,
          isApproved: false
        },
        {
          memberId: member2.id,
          month: 3,
          year: 2025,
          amount: 500,
          isApproved: false
        },
        {
          memberId: member3.id,
          month: 2,
          year: 2025,
          amount: 500,
          isApproved: false
        }
      ]
    });

    return NextResponse.json({
      success: true,
      message: "ডাটাবেস সফলভাবে সিড করা হয়েছে",
      accountant: {
        mobileNumber: accountant.mobileNumber,
        pin: accountant.pin
      },
      members: [
        { mobileNumber: member1.mobileNumber, pin: member1.pin },
        { mobileNumber: member2.mobileNumber, pin: member2.pin },
        { mobileNumber: member3.mobileNumber, pin: member3.pin }
      ]
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'ডাটাবেস সিড করা যায়নি' },
      { status: 500 }
    );
  }
}