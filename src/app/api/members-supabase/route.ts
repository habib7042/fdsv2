import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, fatherName, motherName, dateOfBirth, nationalId, mobileNumber, nomineeName, pin } = await request.json();

    if (!name || !fatherName || !motherName || !dateOfBirth || !nationalId || !mobileNumber || !nomineeName || !pin) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const member = await db.createMember({
      name,
      father_name: fatherName,
      mother_name: motherName,
      date_of_birth: dateOfBirth,
      national_id: nationalId,
      mobile_number: mobileNumber,
      nominee_name: nomineeName,
      pin,
      is_active: true
    });

    return NextResponse.json({
      success: true,
      message: 'সদস্য সফলভাবে তৈরি হয়েছে',
      member: {
        id: member.id,
        name: member.name,
        mobileNumber: member.mobile_number,
        isActive: member.is_active,
        joinedAt: member.joined_at,
        createdAt: member.created_at
      }
    });
  } catch (error) {
    console.error('Create member error:', error);
    return NextResponse.json(
      { error: 'সদস্য তৈরি করা যায়নি' },
      { status: 500 }
    );
  }
}