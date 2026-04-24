import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        mobile: { label: "Mobile", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.mobile || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { mobile: credentials.mobile },
          include: { farmer: true },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.farmer?.name ?? "Admin",
          email: user.mobile,
          role: user.role,
          farmerId: user.farmer?.farmerId ?? null,
        } as  { id: string; name: string; email: string; role: string; farmerId: string | null };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role: string }).role;
        token.farmerId = (user as unknown as { farmerId: string | null }).farmerId;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { farmerId?: string | null }).farmerId = token.farmerId as string | null;
        (session.user as { userId?: string }).userId = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "ocf-spin-secret-key-change-in-production",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
