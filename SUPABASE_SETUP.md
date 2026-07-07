# Supabase Integration Guide

This guide will help you connect your backend to Supabase, a PostgreSQL-as-a-service platform.

## Prerequisites
- A Supabase account (free at https://supabase.com)
- Your Supabase project credentials

## Setup Steps

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Enter your project name and database password
4. Select your region and click "Create new project"
5. Wait for the project to be provisioned (2-5 minutes)

### 2. Get Your Credentials
1. In Supabase dashboard, go to **Settings > Database**
2. Copy the following:
   - **Connection string**: `postgresql://...` (under Connection pooling → Session mode)
   - **Project URL**: Find under Settings > API
   - **Anon Key**: Find under Settings > API
   - **Service Role Key**: Find under Settings > API

### 3. Update Your Environment Variables

Add these to your `.env` file:

```env
# Enable Supabase
USE_SUPABASE=true

# Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URL (connection string)
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

### 4. Create Tables

Your existing database schema should be replicated in Supabase. You can:

**Option A: Using Supabase UI**
1. Go to the SQL Editor in Supabase dashboard
2. Paste your existing schema SQL
3. Run the queries

**Option B: Using pgAdmin or psql**
```bash
psql "postgresql://postgres:YOUR_PASSWORD@db.supabase.co:5432/postgres" < your-schema.sql
```

### 5. Test the Connection

Run your development server:
```bash
npm run dev
```

You should see in the logs:
```
Creating PostgreSQL connection pool using Supabase DATABASE_URL
Application running on port 5000
```

## Key Changes Made

1. **`config/env.ts`**: Added Supabase configuration variables
2. **`utils/db.ts`**: Updated database pool to detect and use Supabase connection
3. **`utils/supabase.ts`**: Created Supabase client helper (optional, for future SDK usage)
4. **`.env.example`**: Updated with all required Supabase variables

## Important Notes

- Your existing code continues to work without changes
- Switch between local PostgreSQL and Supabase by toggling `USE_SUPABASE=true/false`
- SSL is automatically enabled for Supabase connections
- Connection pooling limits set to 10 connections (adjust in `db.ts` if needed)

## Troubleshooting

### Connection Refused
- Check your `DATABASE_URL` is correct
- Ensure Supabase password doesn't contain special characters (or URL encode them)
- Verify your IP is whitelisted (Supabase allows all by default)

### Schema Not Found
- Tables must be migrated to Supabase manually
- Use SQL Editor in Supabase or export/import from local database

### SSL/TLS Errors
- Already handled in the updated `db.ts` with `ssl: { rejectUnauthorized: false }`
- This is safe for Supabase since they use valid certificates

## Development Workflow

**To use local PostgreSQL:**
```env
USE_SUPABASE=false
DB_HOST=localhost
DB_PORT=5431
```

**To use Supabase:**
```env
USE_SUPABASE=true
DATABASE_URL=postgresql://...
```

## Production Deployment

When deploying to production, ensure:
1. `USE_SUPABASE=true` in your environment
2. `DATABASE_URL` points to your Supabase database
3. `SUPABASE_SERVICE_ROLE_KEY` is securely stored in your hosting provider's secrets
