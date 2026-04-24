This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## OCF-SPIN - Organic Carbon Farming System

A farmer registration and management system for the Organic Carbon Farming with SPIN program.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="ocf-spin-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Set Up Database

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Seed Admin User

Create the admin user:

```bash
npm run db:seed
```

This creates an admin user with:
- **Mobile**: 9999999999
- **Password**: admin1234

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Portal Access

1. Navigate to [http://localhost:3000/login](http://localhost:3000/login)
2. Click on the "Admin" tab
3. Login with:
   - Mobile: **9999999999**
   - Password: **admin1234**
4. You will be redirected to the admin dashboard at `/admin`

## Farmer Portal Access

Farmers can register at the login page by clicking the "Register" tab and providing:
- Name
- Mobile number (10 digits)
- Password (minimum 4 characters)

After registration, farmers can log in to access their dashboard and complete their registration details.

## Features

- **Admin Dashboard**: View and manage all farmer registrations, approve edit requests, export data to Excel
- **Farmer Registration**: Multi-step wizard for farmers to register their details
- **Edit Request System**: Farmers can request permission to edit submitted data
- **Bilingual Support**: Interface available in English and Telugu
- **Data Export**: Export farmer data to Excel format

## Database Management

- **View database**: `npm run db:studio`
- **Run migrations**: `npm run db:migrate`
- **Seed database**: `npm run db:seed`

## Production Deployment

### Important Notes for Netlify/Vercel Deployment

**⚠️ SQLite is NOT suitable for production serverless deployments!**

The local development setup uses SQLite (`dev.db`), which works great for local development but **will not work** on serverless platforms like Netlify or Vercel because:
- The database file cannot persist across serverless function invocations
- Each function runs in an isolated environment
- File system is read-only or ephemeral

### Setting Up for Production

#### 1. Choose a Production Database

We recommend using a managed PostgreSQL database:
- **[Supabase](https://supabase.com/)** - Free tier available, easy setup
- **[Neon](https://neon.tech/)** - Serverless Postgres with free tier
- **[Railway](https://railway.app/)** - Simple deployment with database
- **[PlanetScale](https://planetscale.com/)** - MySQL alternative

#### 2. Update Prisma Schema for PostgreSQL

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

#### 3. Set Environment Variables

In your deployment platform (Netlify, Vercel, etc.), set these environment variables:

```bash
# Production database connection string
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Generate a secure secret: openssl rand -base64 32
NEXTAUTH_SECRET="your-secure-random-string"

# Your production URL
NEXTAUTH_URL="https://your-app.netlify.app"
```

**For Netlify:**
1. Go to Site Settings → Environment Variables
2. Add each variable with its value
3. Redeploy the site

**For Vercel:**
1. Go to Project Settings → Environment Variables
2. Add each variable for Production environment
3. Redeploy

#### 4. Run Migrations on Production Database

After setting up your production database:

```bash
# Set your production DATABASE_URL temporarily
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# Seed admin user (optional)
npm run db:seed
```

### Troubleshooting Production Errors

If you see errors like:
- `500 Internal Server Error` on `/api/register`
- `401 Unauthorized` on `/api/auth/callback/credentials`

**Common causes:**
1. ❌ `DATABASE_URL` not set in production environment
2. ❌ Using SQLite in production (won't work on serverless)
3. ❌ `NEXTAUTH_SECRET` not set or using default value
4. ❌ Database migrations not run on production database

**Check your logs:**
- Netlify: Functions → Function logs
- Vercel: Deployments → View Function logs

The application now includes detailed error logging to help diagnose issues.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
