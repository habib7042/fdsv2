import { db } from '../lib/db'

async function addAccountant() {
  try {
    const mobileNumber = '01893669792'
    const pin = '7042'
    
    // Check if accountant already exists
    const existingAccountant = await db.accountant.findUnique({
      where: { mobileNumber }
    })
    
    if (existingAccountant) {
      console.log('Accountant with this mobile number already exists:', existingAccountant)
      return
    }
    
    // Create new accountant
    const newAccountant = await db.accountant.create({
      data: {
        name: 'Accountant', // Default name since not provided
        mobileNumber,
        pin,
        isActive: true
      }
    })
    
    console.log('Accountant added successfully:', newAccountant)
  } catch (error) {
    console.error('Error adding accountant:', error)
  } finally {
    await db.$disconnect()
  }
}

addAccountant()