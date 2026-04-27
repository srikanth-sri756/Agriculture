# Deploying to Netlify with Neon Postgres

This project uses Prisma + PostgreSQL. SQLite cannot run on Netlify (serverless, ephemeral filesystem), so we use [Neon](https://neon.tech) — free, serverless Postgres that works perfectly with Next.js on Netlify.

## 1. Create a Neon database

1. Go to https://console.neon.tech and sign up (free).
2. Create a new project (any name, any region close to your Netlify region).
3. Copy the **Pooled connection string** (it has `-pooler` in the host). It looks like:
   ```
   postgresql://USER:PASSWORD@ep-xxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

## 2. Set local env vars

Copy `.env.example` to `.env` and paste your connection string:

```bash
DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="<run: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
```

## 3. Generate the initial migration locally

Stop `next dev` first (it locks the old `dev.db`), then:

```powershell
# remove the old SQLite file if it still exists
Remove-Item prisma\dev.db -ErrorAction SilentlyContinue

# create the Postgres schema in Neon + first migration
npx prisma migrate dev --name init

# (optional) seed the admin user
npm run db:seed
```

Commit the new `prisma/migrations/` folder to git.

## 4. Deploy to Netlify

1. Push your repo to GitHub.
2. In Netlify → **Add new site → Import from Git** → select your repo.
3. Netlify auto-detects Next.js. Build settings should be:
   - **Build command:** `npm run build` (already does `prisma generate && prisma migrate deploy && next build`)
   - **Publish directory:** `.next`
4. Add **Environment variables** under Site settings → Environment variables:
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Your Neon pooled connection string |
   | `NEXTAUTH_SECRET` | A long random string (32+ chars) |
   | `NEXTAUTH_URL` | `https://your-site.netlify.app` |
5. Trigger a deploy. The build will:
   - Install deps (`postinstall` runs `prisma generate`)
   - Run `prisma migrate deploy` against Neon
   - Build Next.js
6. Visit your site. Login with `mobile=9999999999, password=admin1234` (if you seeded).

## Troubleshooting

- **"Can't reach database server"** → check `DATABASE_URL` in Netlify env, make sure it's the **pooled** URL.
- **"Engine not found for runtime"** → schema already includes `binaryTargets = ["native", "rhel-openssl-3.0.x"]`; clear the Netlify build cache and redeploy.
- **Prisma migrate fails on Netlify** → run `npx prisma migrate dev` locally first to generate migration files, commit them, then redeploy. `migrate deploy` only applies existing migrations, it doesn't create them.
- **OTP / phone auth not working** → fill in the `NEXT_PUBLIC_FIREBASE_*` vars in Netlify env if you use Firebase phone auth.

## Notes

- The in-process rate limiter (`src/lib/rate-limit.ts`) resets per cold start and is not shared across function instances. For production-grade limits, switch to Upstash Redis later.
- Profile/crop photos are stored as base64 in Postgres `TEXT`. This works but bloats the DB. Migrate to object storage (Cloudinary / Supabase Storage / S3) before scaling.
