-- Supabase Schema for Friends Development Society (FDS)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create accountants table
CREATE TABLE IF NOT EXISTS accountants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) UNIQUE NOT NULL,
    pin VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    mother_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    national_id VARCHAR(50) UNIQUE NOT NULL,
    mobile_number VARCHAR(20) UNIQUE NOT NULL,
    nominee_name VARCHAR(255) NOT NULL,
    pin VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create deposits table
CREATE TABLE IF NOT EXISTS deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL,
    amount DECIMAL(10,2) DEFAULT 500.00,
    is_approved BOOLEAN DEFAULT false,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES accountants(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, month, year)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accountants_mobile_number ON accountants(mobile_number);
CREATE INDEX IF NOT EXISTS idx_accountants_is_active ON accountants(is_active);

CREATE INDEX IF NOT EXISTS idx_members_mobile_number ON members(mobile_number);
CREATE INDEX IF NOT EXISTS idx_members_national_id ON members(national_id);
CREATE INDEX IF NOT EXISTS idx_members_is_active ON members(is_active);

CREATE INDEX IF NOT EXISTS idx_deposits_member_id ON deposits(member_id);
CREATE INDEX IF NOT EXISTS idx_deposits_month_year ON deposits(month, year);
CREATE INDEX IF NOT EXISTS idx_deposits_is_approved ON deposits(is_approved);
CREATE INDEX IF NOT EXISTS idx_deposits_approved_by ON deposits(approved_by);

-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_accountants_updated_at 
    BEFORE UPDATE ON accountants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deposits_updated_at 
    BEFORE UPDATE ON deposits 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create Row Level Security (RLS) policies
ALTER TABLE accountants ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

-- Policies for accountants
CREATE POLICY "Enable read access for all users" ON accountants
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON accountants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON accountants
    FOR UPDATE USING (true);

-- Policies for members
CREATE POLICY "Enable read access for all users" ON members
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON members
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON members
    FOR UPDATE USING (true);

-- Policies for deposits
CREATE POLICY "Enable read access for all users" ON deposits
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON deposits
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON deposits
    FOR UPDATE USING (true);