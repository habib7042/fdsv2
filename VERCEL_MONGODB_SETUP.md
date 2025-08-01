# Vercel MongoDB Atlas Setup Guide

## Problem
Your application is not connecting to MongoDB Atlas on Vercel deployment.

## Solution Steps

### 1. Set Environment Variables on Vercel

Go to your Vercel project dashboard and set the following environment variables:

#### Required Variables:
- **MONGODB_URI**: Your MongoDB Atlas connection string
  ```
  mongodb+srv://habib96:habib7042@cluster0.qir7amr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  ```

#### Optional Variables:
- **NODE_ENV**: `production`
- **DATABASE_URL**: Can be removed if not using SQLite

### 2. How to Set Environment Variables on Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `fdsv2`
3. Go to **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Add the environment variables:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://habib96:habib7042@cluster0.qir7amr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   - **Environment**: `Production`, `Preview`, `Development`
6. Click **Add**
7. **Redeploy** your application

### 3. Test the MongoDB Connection

After setting up the environment variables, test the connection:

#### Test 1: Seed the Database
```bash
curl -X POST https://fdsv2.vercel.app/api/seed-mongo
```

#### Test 2: Add Accountant
```bash
curl -X POST https://fdsv2.vercel.app/api/accountant-mongo/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Accountant",
    "mobileNumber": "01893669792",
    "pin": "7042"
  }'
```

#### Test 3: Login
```bash
curl -X POST https://fdsv2.vercel.app/api/auth-mongo/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobileNumber": "01893669792",
    "pin": "7042",
    "userType": "accountant"
  }'
```

### 4. MongoDB Atlas Configuration

Make sure your MongoDB Atlas cluster is properly configured:

1. **Network Access**: 
   - Go to MongoDB Atlas dashboard
   - Network Access → IP Access List
   - Add `0.0.0.0/0` (allows access from anywhere) OR add Vercel's IP addresses

2. **Database User**:
   - Username: `habib96`
   - Password: `habib7042`
   - Make sure the user has read/write permissions

3. **Cluster Status**:
   - Ensure your cluster is active (not paused)
   - Check if you're within the free tier limits

### 5. Troubleshooting

#### Common Issues:

1. **Connection Timeout**:
   - Check MongoDB Atlas cluster status
   - Verify IP whitelist configuration
   - Check network connectivity

2. **Authentication Failed**:
   - Verify username and password
   - Check user permissions
   - Ensure the database user exists

3. **Environment Variables Not Loading**:
   - Double-check variable names in Vercel
   - Ensure you've redeployed after adding variables
   - Check for typos in the connection string

4. **CORS Issues**:
   - The API should handle CORS properly
   - If you face CORS issues, check the API response headers

### 6. API Endpoints for MongoDB

#### Authentication:
- `POST /api/auth-mongo/login` - User login

#### Accountant Management:
- `POST /api/accountant-mongo/create` - Create new accountant
- `GET /api/accountant-mongo/dashboard` - Get accountant dashboard data

#### Member Management:
- `POST /api/members-mongo` - Create new member
- `GET /api/member-mongo/dashboard` - Get member dashboard data

#### Deposit Management:
- `POST /api/deposits-mongo` - Create deposit
- `POST /api/deposits-mongo/approve` - Approve deposit

#### Database Seeding:
- `POST /api/seed-mongo` - Seed database with sample data

### 7. Sample Data

After seeding, you can use these credentials:

#### Accountant:
- Mobile: `01893669791`
- PIN: `7042`

#### Members:
- Mobile: `01712-345678`, PIN: `1234`
- Mobile: `01823-456789`, PIN: `1234`
- Mobile: `01934-567890`, PIN: `1234`

### 8. Next Steps

1. Set up environment variables on Vercel
2. Redeploy the application
3. Test the MongoDB connection using the seed API
4. Add the new accountant using the create API
5. Test login functionality

### 9. Support

If you still face issues:
1. Check Vercel function logs for detailed error messages
2. Verify MongoDB Atlas logs
3. Ensure all environment variables are correctly set
4. Check if there are any network/firewall restrictions