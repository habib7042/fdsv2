import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const dashboardData = await db.getAccountantDashboardData();
    
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Accountant dashboard error:', error);
    return NextResponse.json(
      { error: 'ড্যাশবোর্ড ডাটা লোড করা যায়নি' },
      { status: 500 }
    );
  }
}