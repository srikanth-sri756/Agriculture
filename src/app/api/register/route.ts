import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateFarmerId } from "@/lib/utils";
import { registerSchema } from "@/lib/schemas";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 registrations per IP per 10 minutes
    const ip = getClientIp(req);
    const rl = rateLimit(`register:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${rl.resetInSeconds}s.` },
        { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
      );
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const issues = parsed.error.issues ?? [];
      return NextResponse.json({ error: issues[0]?.message ?? "Validation error" }, { status: 400 });
    }

    const { name, mobile, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { mobile } });
    if (existing) {
      return NextResponse.json({ error: "Mobile number already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate unique farmer ID
    let farmerId = generateFarmerId();
    let idExists = await prisma.farmer.findUnique({ where: { farmerId } });
    while (idExists) {
      farmerId = generateFarmerId();
      idExists = await prisma.farmer.findUnique({ where: { farmerId } });
    }

    const user = await prisma.user.create({
      data: {
        mobile,
        password: hashedPassword,
        role: "farmer",
        farmer: {
          create: {
            farmerId,
            name,
            mobile,
          },
        },
      },
      include: { farmer: true },
    });

    return NextResponse.json({
      message: "Registration successful",
      farmerId: user.farmer?.farmerId,
    });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
