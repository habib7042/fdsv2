import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Clear existing data (optional - you can comment this out if you want to keep existing data)
    // Note: Supabase doesn't have a direct truncate method, so we'll work with what we have

    // Create the specific accountant
    const accountant = await db.createAccountant({
      name: "হিসাবরক্ষক",
      mobile_number: "01893669791",
      pin: "7042",
      is_active: true
    });

    // Create sample members
    const member1 = await db.createMember({
      name: "মোঃ আব্দুল করিম",
      father_name: "মোঃ ইউসুফ আলী",
      mother_name: "রহিমা খাতুন",
      date_of_birth: "1990-05-15",
      national_id: "1990567890123",
      mobile_number: "01712-345678",
      nominee_name: "মোঃ সাকিব",
      pin: "1234",
      is_active: true
    });

    const member2 = await db.createMember({
      name: "মোঃ রহিম উদ্দিন",
      father_name: "মোঃ করিম উদ্দিন",
      mother_name: "ফাতেমা বেগম",
      date_of_birth: "1985-08-20",
      national_id: "1985876543210",
      mobile_number: "01823-456789",
      nominee_name: "মোঃ রাফি",
      pin: "1234",
      is_active: true
    });

    const member3 = await db.createMember({
      name: "মোসাম্মৎ আয়েশা খাতুন",
      father_name: "মোঃ আব্দুল মালেক",
      mother_name: "জাহানারা বেগম",
      date_of_birth: "1992-12-03",
      national_id: "1992123456789",
      mobile_number: "01934-567890",
      nominee_name: "মোঃ ইমরান",
      pin: "1234",
      is_active: true
    });

    // Create some approved deposits
    await db.createDeposit({
      member_id: member1.id,
      month: 1,
      year: 2025,
      amount: 500,
      is_approved: true,
      approved_at: new Date().toISOString(),
      approved_by: accountant.id
    });

    await db.createDeposit({
      member_id: member1.id,
      month: 2,
      year: 2025,
      amount: 500,
      is_approved: true,
      approved_at: new Date().toISOString(),
      approved_by: accountant.id
    });

    await db.createDeposit({
      member_id: member1.id,
      month: 3,
      year: 2025,
      amount: 500,
      is_approved: true,
      approved_at: new Date().toISOString(),
      approved_by: accountant.id
    });

    await db.createDeposit({
      member_id: member2.id,
      month: 1,
      year: 2025,
      amount: 500,
      is_approved: true,
      approved_at: new Date().toISOString(),
      approved_by: accountant.id
    });

    await db.createDeposit({
      member_id: member2.id,
      month: 2,
      year: 2025,
      amount: 500,
      is_approved: true,
      approved_at: new Date().toISOString(),
      approved_by: accountant.id
    });

    await db.createDeposit({
      member_id: member3.id,
      month: 1,
      year: 2025,
      amount: 500,
      is_approved: true,
      approved_at: new Date().toISOString(),
      approved_by: accountant.id
    });

    // Create some pending deposits
    await db.createDeposit({
      member_id: member1.id,
      month: 4,
      year: 2025,
      amount: 500,
      is_approved: false
    });

    await db.createDeposit({
      member_id: member2.id,
      month: 3,
      year: 2025,
      amount: 500,
      is_approved: false
    });

    await db.createDeposit({
      member_id: member3.id,
      month: 2,
      year: 2025,
      amount: 500,
      is_approved: false
    });

    return NextResponse.json({
      success: true,
      message: "Supabase ডাটাবেস সফলভাবে সিড করা হয়েছে",
      accountant: {
        mobileNumber: accountant.mobile_number,
        pin: accountant.pin
      },
      members: [
        { mobileNumber: member1.mobile_number, pin: member1.pin },
        { mobileNumber: member2.mobile_number, pin: member2.pin },
        { mobileNumber: member3.mobile_number, pin: member3.pin }
      ]
    });
  } catch (error) {
    console.error('Supabase Seed error:', error);
    return NextResponse.json(
      { error: 'Supabase ডাটাবেস সিড করা যায়নি' },
      { status: 500 }
    );
  }
}