import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";
import { z } from "zod";

const verifyOtpSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile required"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { mobile, otp } = parsed.data;
    const valid = verifyOtp(mobile, otp);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "OTP verified successfully", verified: true });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
