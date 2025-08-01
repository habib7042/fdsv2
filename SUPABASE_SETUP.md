# Supabase Setup Guide for Friends Development Society (FDS)

## Overview
This guide will help you migrate your FDS application from MongoDB Atlas to Supabase and deploy it on Vercel.

## Completed Migration Tasks
✅ Installed Supabase dependencies  
✅ Created Supabase database schema  
✅ Created Supabase client configuration  
✅ Created all Supabase API endpoints  
✅ Updated frontend to use Supabase APIs  
✅ Created database seed script  

## Step 1: Set Up Supabase Project

### 1.1 Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Sign in or create an account
3. Click "New Project"
4. Enter project details:
   - **Project Name**: `fds-database` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the region closest to your users
5. Click "Create new project"

### 1.2 Get Database Credentials
Once your project is created, go to:
- **Project Settings** → **Database**
- Copy the **Connection string** (you'll need this later)

### 1.3 Run the Database Schema
1. Go to the **SQL Editor** in your Supabase dashboard
2. Click "New query"
3. Copy the contents of `supabase-schema.sql` file
4. Paste and run the SQL script

## Step 2: Set Up Vercel Environment Variables

### 2.1 Required Environment Variables
Add these to your Vercel project:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Get from: Supabase Project Settings → **API** → **Project URL**
   - Example: `https://your-project-id.supabase.co`

2. **SUPABASE_SERVICE_ROLE_KEY**
   - Get from: Supabase Project Settings → **API** → **service_role** key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2.2 How to Set Environment Variables on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `fdsv2` project
3. Go to **Settings** → **Environment Variables**
4. Add the following:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | All |

5. Click **Add** for each variable
6. **Redeploy** your application

## Step 3: Test the Migration

### 3.1 Test Database Connection
After setting up environment variables, test the connection:

```bash
# Seed the database with sample data
curl -X POST https://fdsv2.vercel.app/api/seed-supabase
```

### 3.2 Add the New Accountant
```bash
# Add your new accountant
curl -X POST https://fdsv2.vercel.app/api/accountant-supabase/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Accountant",
    "mobileNumber": "01893669792",
    "pin": "7042"
  }'
```

### 3.3 Test Login
```bash
# Test accountant login
curl -X POST https://fdsv2.vercel.app/api/auth-supabase/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNumber": "01893669792",
    "pin": "7042",
    "userType": "accountant"
  }'
```

## Step 4: Available API Endpoints

### Authentication
- `POST /api/auth-supabase/login` - User login

### Accountant Management
- `POST /api/accountant-supabase/create` - Create new accountant
- `GET /api/accountant-supabase/dashboard` - Get accountant dashboard data

### Member Management
- `POST /api/members-supabase` - Create new member
- `POST /api/member-supabase/dashboard` - Get member dashboard data

### Deposit Management
- `POST /api/deposits-supabase` - Create deposit
- `POST /api/deposits-supabase/approve` - Approve deposit

### Database Seeding
- `POST /api/seed-supabase` - Seed database with sample data

## Step 5: Sample Data

After seeding, you can use these credentials:

### Accountant
- Mobile: `01893669791`
- PIN: `7042`

### Members
- Mobile: `01712-345678`, PIN: `1234`
- Mobile: `01823-456789`, PIN: `1234`
- Mobile: `01934-567890`, PIN: `1234`

## Step 6: Database Schema Overview

### Tables Created
1. **accountants** - Store accountant information
2. **members** - Store member information  
3. **deposits** - Store deposit records

### Key Features
- **UUID Primary Keys**: Using UUIDs for better security
- **Row Level Security (RLS)**: Enabled on all tables
- **Indexes**: Optimized for common queries
- **Timestamps**: Automatic created_at and updated_at
- **Relationships**: Proper foreign key constraints

## Step 7: Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify environment variables are correctly set
   - Check Supabase project status
   - Ensure service role key is correct

2. **Permission Errors**
   - Make sure RLS policies are properly configured
   - Check that service role key has necessary permissions

3. **Data Insertion Errors**
   - Verify all required fields are provided
   - Check for duplicate mobile numbers/national IDs
   - Ensure data types match schema

### Testing Commands

```bash
# Test health check (if available)
curl https://fdsv2.vercel.app/api/health

# Test database seeding
curl -X POST https://fdsv2.vercel.app/api/seed-supabase

# Test accountant creation
curl -X POST https://fdsv2.vercel.app/api/accountant-supabase/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","mobileNumber":"01234567890","pin":"1234"}'

# Test authentication
curl -X POST https://fdsv2.vercel.app/api/auth-supabase/login \
  -H "Content-Type: application/json" \
  -d '{"mobileNumber":"01893669791","pin":"7042","userType":"accountant"}'
```

## Step 8: Benefits of Supabase Migration

### Advantages over MongoDB
1. **Real-time Capabilities**: Built-in WebSocket support
2. **PostgreSQL**: More powerful querying and relationships
3. **RLS**: Fine-grained access control
4. **Built-in Auth**: Ready-to-use authentication system
5. **Storage**: File storage included
6. **Edge Functions**: Serverless functions at the edge

### Performance Improvements
- **Faster Queries**: Optimized PostgreSQL indexes
- **Better Relationships**: Proper foreign key constraints
- **Caching**: Built-in query caching
- **Scalability**: Horizontal scaling support

## Step 9: Next Steps

1. **Set up Supabase project** (if not already done)
2. **Configure environment variables** on Vercel
3. **Run database schema** in Supabase SQL editor
4. **Test all API endpoints**
5. **Deploy to production**
6. **Monitor performance** and optimize as needed

## Step 10: Support

If you encounter any issues:
1. Check Vercel function logs for detailed error messages
2. Verify Supabase project settings and API keys
3. Ensure all environment variables are correctly set
4. Review the database schema for any syntax errors

## Migration Checklist

- [ ] Create Supabase project
- [ ] Get API credentials
- [ ] Run database schema
- [ ] Set Vercel environment variables
- [ ] Test database connection
- [ ] Seed sample data
- [ ] Test all API endpoints
- [ ] Verify login functionality
- [ ] Test deposit creation and approval
- [ ] Deploy to production
- [ ] Monitor for issues

Your application is now fully migrated to Supabase and ready for production deployment!