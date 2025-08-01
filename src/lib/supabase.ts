import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single supabase client for interacting with your database
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

// Database table types
export interface Accountant {
  id: string;
  name: string;
  mobile_number: string;
  pin: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  national_id: string;
  mobile_number: string;
  nominee_name: string;
  pin: string;
  is_active: boolean;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

export interface Deposit {
  id: string;
  member_id: string;
  month: number;
  year: number;
  amount: number;
  is_approved: boolean;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

// Helper functions for database operations
export const db = {
  // Accountant operations
  async getAccountant(mobileNumber: string, pin: string) {
    const { data, error } = await supabase
      .from('accountants')
      .select('*')
      .eq('mobile_number', mobileNumber)
      .eq('pin', pin)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data as Accountant;
  },

  async createAccountant(accountant: Omit<Accountant, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('accountants')
      .insert([accountant])
      .select()
      .single();
    
    if (error) throw error;
    return data as Accountant;
  },

  async getAllAccountants() {
    const { data, error } = await supabase
      .from('accountants')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data as Accountant[];
  },

  // Member operations
  async getMember(mobileNumber: string, pin: string) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('mobile_number', mobileNumber)
      .eq('pin', pin)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data as Member;
  },

  async createMember(member: Omit<Member, 'id' | 'joined_at' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('members')
      .insert([member])
      .select()
      .single();
    
    if (error) throw error;
    return data as Member;
  },

  async getAllMembers() {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data as Member[];
  },

  // Deposit operations
  async createDeposit(deposit: Omit<Deposit, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('deposits')
      .insert([deposit])
      .select()
      .single();
    
    if (error) throw error;
    return data as Deposit;
  },

  async approveDeposit(depositId: string, accountantId: string) {
    const { data, error } = await supabase
      .from('deposits')
      .update({
        is_approved: true,
        approved_at: new Date().toISOString(),
        approved_by: accountantId
      })
      .eq('id', depositId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Deposit;
  },

  async getPendingDeposits() {
    const { data, error } = await supabase
      .from('deposits')
      .select(`
        *,
        members (
          id,
          name,
          mobile_number
        )
      `)
      .eq('is_approved', false);
    
    if (error) throw error;
    return data as (Deposit & { members: { id: string; name: string; mobile_number: string } })[];
  },

  async getMemberDeposits(memberId: string) {
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('member_id', memberId)
      .order('year', { ascending: false })
      .order('month', { ascending: false });
    
    if (error) throw error;
    return data as Deposit[];
  },

  // Dashboard data
  async getAccountantDashboardData() {
    const members = await this.getAllMembers();
    const pendingDeposits = await this.getPendingDeposits();
    
    // Calculate totals for each member
    const membersWithTotals = await Promise.all(
      members.map(async (member) => {
        const deposits = await this.getMemberDeposits(member.id);
        const totalDeposits = deposits
          .filter(d => d.is_approved)
          .reduce((sum, d) => sum + Number(d.amount), 0);
        const pendingDeposits = deposits
          .filter(d => !d.is_approved)
          .reduce((sum, d) => sum + Number(d.amount), 0);
        
        return {
          ...member,
          totalDeposits,
          pendingDeposits
        };
      })
    );
    
    return {
      members: membersWithTotals,
      pendingDeposits: pendingDeposits.map(d => ({
        id: d.id,
        memberId: d.member_id,
        memberName: d.members.name,
        mobileNumber: d.members.mobile_number,
        month: d.month,
        year: d.year,
        amount: Number(d.amount),
        isApproved: d.is_approved,
        createdAt: d.created_at
      }))
    };
  },

  async getMemberDashboardData(memberId: string) {
    const member = await supabase
      .from('members')
      .select('*')
      .eq('id', memberId)
      .single();
    
    if (member.error) throw member.error;
    
    const deposits = await this.getMemberDeposits(memberId);
    const totalDeposits = deposits
      .filter(d => d.is_approved)
      .reduce((sum, d) => sum + Number(d.amount), 0);
    const pendingDeposits = deposits
      .filter(d => !d.is_approved)
      .reduce((sum, d) => sum + Number(d.amount), 0);
    
    return {
      member: member.data,
      deposits: deposits.map(d => ({
        id: d.id,
        month: d.month,
        year: d.year,
        amount: Number(d.amount),
        isApproved: d.is_approved,
        approvedAt: d.approved_at,
        createdAt: d.created_at
      })),
      totalDeposits,
      pendingDeposits
    };
  }
};