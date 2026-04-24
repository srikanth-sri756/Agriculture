import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      farmerId?: string | null;
      userId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    farmerId?: string | null;
    userId?: string;
  }
}
