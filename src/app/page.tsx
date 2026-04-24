import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SplashClient from "./splash-client";

export default async function SplashPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    const user = session.user as { role?: string } | undefined;
    redirect(user?.role === "admin" ? "/admin" : "/home");
  }
  return <SplashClient />;
}
