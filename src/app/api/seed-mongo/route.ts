import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { Member, Accountant, Deposit } from '@/models';

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB();

    // Clear existing data
    await Member.deleteMany({});
    await Accountant.deleteMany({});
    await Deposit.deleteMany({});

    // Create the specific accountant
    const accountant = await Accountant.create({
      name: "হিসাবরক্ষক",
      mobileNumber: "01893669791",
      pin: "7042"
    });

    // Create sample members
    const member1 = await Member.create({
      name: "মোঃ আব্দুল করিম",
      fatherName: "মোঃ ইউসুফ আলী",
      motherName: "রহিমা খাতুন",
      dateOfBirth: new Date("1990-05-15"),
      nationalId: "1990567890123",
      mobileNumber: "01712-345678",
      nomineeName: "মোঃ সাকিব",
      pin: "1234"
    });

    const member2 = await Member.create({
      name: "মোঃ রহিম উদ্দিন",
      fatherName: "মোঃ করিম উদ্দিন",
      motherName: "ফাতেমা বেগম",
      dateOfBirth: new Date("1985-08-20"),
      nationalId: "1985876543210",
      mobileNumber: "01823-456789",
      nomineeName: "মোঃ রাফি",
      pin: "1234"
    });

    const member3 = await Member.create({
      name: "মোসাম্মৎ আয়েশা খাতুন",
      fatherName: "মোঃ আব্দুল মালেক",
      motherName: "জাহানারা বেগম",
      dateOfBirth: new Date("1992-12-03"),
      nationalId: "1992123456789",
      mobileNumber: "01934-567890",
      nomineeName: "মোঃ ইমরান",
      pin: "1234"
    });

    // Create some approved deposits
    await Deposit.create({
      memberId: member1._id.toString(),
      month: 1,
      year: 2025,
      amount: 500,
      isApproved: true,
      approvedAt: new Date("2025-01-15"),
      approvedBy: accountant._id.toString()
    });

    await Deposit.create({
      memberId: member1._id.toString(),
      month: 2,
      year: 2025,
      amount: 500,
      isApproved: true,
      approvedAt: new Date("2025-02-10"),
      approvedBy: accountant._id.toString()
    });

    await Deposit.create({
      memberId: member1._id.toString(),
      month: 3,
      year: 2025,
      amount: 500,
      isApproved: true,
      approvedAt: new Date("2025-03-12"),
      approvedBy: accountant._id.toString()
    });

    await Deposit.create({
      memberId: member2._id.toString(),
      month: 1,
      year: 2025,
      amount: 500,
      isApproved: true,
      approvedAt: new Date("2025-01-20"),
      approvedBy: accountant._id.toString()
    });

    await Deposit.create({
      memberId: member2._id.toString(),
      month: 2,
      year: 2025,
      amount: 500,
      isApproved: true,
      approvedAt: new Date("2025-02-15"),
      approvedBy: accountant._id.toString()
    });

    await Deposit.create({
      memberId: member3._id.toString(),
      month: 1,
      year: 2025,
      amount: 500,
      isApproved: true,
      approvedAt: new Date("2025-01-25"),
      approvedBy: accountant._id.toString()
    });

    // Create some pending deposits
    await Deposit.create({
      memberId: member1._id.toString(),
      month: 4,
      year: 2025,
      amount: 500,
      isApproved: false
    });

    await Deposit.create({
      memberId: member2._id.toString(),
      month: 3,
      year: 2025,
      amount: 500,
      isApproved: false
    });

    await Deposit.create({
      memberId: member3._id.toString(),
      month: 2,
      year: 2025,
      amount: 500,
      isApproved: false
    });

    return NextResponse.json({
      success: true,
      message: "MongoDB ডাটাবেস সফলভাবে সিড করা হয়েছে",
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
    console.error('MongoDB Seed error:', error);
    return NextResponse.json(
      { error: 'MongoDB ডাটাবেস সিড করা যায়নি' },
      { status: 500 }
    );
  }
}
