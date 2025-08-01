import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { memberId } = await request.json();

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    const dashboardData = await db.getMemberDashboardData(memberId);
    
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Member dashboard error:', error);
    return NextResponse.json(
      { error: 'ড্যাশবোর্ড ডাটা লোড করা যায়নি' },
      { status: 500 }
    );
  }
}