// Direct script to add accountant to Supabase
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

const accountantData = {
  name: 'Accountant',
  mobile_number: '01893669791',
  pin: '7042',
  is_active: true
};

async function addAccountant() {
  try {
    console.log('Adding accountant to Supabase...');
    console.log('Data:', JSON.stringify(accountantData, null, 2));
    
    // Check if accountant already exists
    const { data: existingAccountant, error: checkError } = await supabase
      .from('accountants')
      .select('*')
      .eq('mobile_number', accountantData.mobile_number)
      .eq('pin', accountantData.pin)
      .single();
    
    if (existingAccountant) {
      console.log('Accountant already exists:', existingAccountant);
      return;
    }
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing accountant:', checkError);
      return;
    }
    
    // Create new accountant
    const { data, error } = await supabase
      .from('accountants')
      .insert([accountantData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating accountant:', error);
      return;
    }
    
    console.log('✅ Accountant created successfully!');
    console.log('Accountant details:');
    console.log('ID:', data.id);
    console.log('Name:', data.name);
    console.log('Mobile Number:', data.mobile_number);
    console.log('PIN:', data.pin);
    console.log('Active:', data.is_active);
    console.log('Created At:', data.created_at);
    
    console.log('\n🔐 Login credentials:');
    console.log('Mobile:', data.mobile_number);
    console.log('PIN:', data.pin);
    console.log('User Type: accountant');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addAccountant();