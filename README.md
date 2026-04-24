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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
