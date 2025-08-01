# Environment Configuration Guide

This guide explains how to set up the environment variables for your Friends Development Society (FDS) project.

## 📁 Environment Files

### 1. `.env` (Local Development)
This is your main environment file for local development.

```bash
# Database Configuration
DATABASE_URL=file:./dev.db
MONGODB_URI=mongodb://localhost:27017/fds-database

# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Environment Configuration
NODE_ENV=development
```

### 2. `.env.example` (Template)
This file serves as a template for other developers. It should be committed to Git.

### 3. `.env.production` (Production)
This file contains production-specific configuration and should NOT be committed to Git.

## 🔧 Setup Instructions

### Local Development Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the .env file:**
   ```bash
   # For SQLite (simple, file-based database)
   DATABASE_URL=file:./dev.db
   
   # For MongoDB (recommended for production)
   MONGODB_URI=mongodb://localhost:27017/fds-database
   
   # Generate a random secret for NextAuth
   NEXTAUTH_SECRET=your-random-secret-here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Generate a random secret:**
   ```bash
   # You can generate a random secret using:
   openssl rand -base64 32
   # Or use an online generator
   ```

### Production Setup

1. **MongoDB Atlas Setup (Recommended):**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account
   - Create a new cluster
   - Create a database user and password
   - Get your connection string

2. **Configure Production Environment:**
   ```bash
   # MongoDB Atlas Connection String
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/fds-database?retryWrites=true&w=majority
   
   # Production Secret
   NEXTAUTH_SECRET=your-super-secure-production-secret
   NEXTAUTH_URL=https://your-domain.com
   
   # Production Environment
   NODE_ENV=production
   ```

## 🗄️ Database Options

### Option 1: SQLite (Easy Setup)
```bash
DATABASE_URL=file:./dev.db
```
- **Pros:** Simple, file-based, no external database needed
- **Cons:** Not suitable for high traffic, limited scalability

### Option 2: MongoDB Local
```bash
MONGODB_URI=mongodb://localhost:27017/fds-database
```
- **Pros:** Better performance, scalable
- **Cons:** Requires MongoDB installation

### Option 3: MongoDB Atlas (Cloud)
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/fds-database?retryWrites=true&w=majority
```
- **Pros:** Cloud-based, scalable, automatic backups
- **Cons:** Requires internet connection

## 🚀 Deployment Platforms

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

### Self-hosted Deployment
1. Copy `.env.production` to your server
2. Set the correct values
3. Run the application

## 🔒 Security Best Practices

1. **Never commit .env files to Git**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Use strong secrets:**
   ```bash
   # Generate strong secrets
   openssl rand -base64 64
   ```

3. **Rotate secrets regularly**
4. **Use different secrets for development and production**

## 🐛 Troubleshooting

### Database Connection Issues
- **SQLite:** Make sure the directory exists and is writable
- **MongoDB:** Check if MongoDB is running and accessible
- **MongoDB Atlas:** Verify your connection string and credentials

### NextAuth Issues
- Make sure `NEXTAUTH_SECRET` is set correctly
- Verify `NEXTAUTH_URL` matches your domain

### Environment Variables Not Loading
- Check if the file is named correctly (`.env`, not `env.txt`)
- Verify the file is in the root directory
- Check file permissions

## 📝 Example Configuration

### Development Configuration (.env)
```bash
# SQLite Database
DATABASE_URL=file:./dev.db

# MongoDB Local
MONGODB_URI=mongodb://localhost:27017/fds-database

# NextAuth
NEXTAUTH_SECRET=dev-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### Production Configuration (.env.production)
```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://fds_user:your-secure-password@cluster0.mongodb.net/fds-database?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=your-super-secure-production-secret-key
NEXTAUTH_URL=https://fds.yourdomain.com

# Environment
NODE_ENV=production
```

Remember to replace all placeholder values with your actual configuration!