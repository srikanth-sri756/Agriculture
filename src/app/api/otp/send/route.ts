import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, sendSms } from "@/lib/otp";
import { z } from "zod";

const sendOtpSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = sendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid mobile number" },
        { status: 400 }
      );
    }

    const { mobile } = parsed.data;

    // Check if mobile is already registered
    const existing = await prisma.user.findUnique({ where: { mobile } });
    if (existing) {
      return NextResponse.json(
        { error: "Mobile number already registered" },
        { status: 409 }
      );
    }

    // Generate and send OTP
    const otp = generateOtp(mobile);
    const sent = await sendSms(mobile, otp);

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send OTP. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
