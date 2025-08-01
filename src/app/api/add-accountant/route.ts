import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { mobileNumber, pin, name } = await request.json()
    
    if (!mobileNumber || !pin) {
      return NextResponse.json(
        { error: 'Mobile number and PIN are required' },
        { status: 400 }
      )
    }
    
    // Check if accountant already exists
    const existingAccountant = await db.accountant.findUnique({
      where: { mobileNumber }
    })
    
    if (existingAccountant) {
      return NextResponse.json(
        { error: 'Accountant with this mobile number already exists' },
        { status: 400 }
      )
    }
    
    // Create new accountant
    const newAccountant = await db.accountant.create({
      data: {
        name: name || 'Accountant',
        mobileNumber,
        pin,
        isActive: true
      }
    })
    
    return NextResponse.json({
      message: 'Accountant added successfully',
      accountant: newAccountant
    })
  } catch (error) {
    console.error('Error adding accountant:', error)
    return NextResponse.json(
      { error: 'Failed to add accountant' },
      { status: 500 }
    )
  }
}