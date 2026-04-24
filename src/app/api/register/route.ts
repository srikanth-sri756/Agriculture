import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateFarmerId } from "@/lib/utils";
import { registerSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  try {
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

    const hashedPassword = await bcrypt.hash(password, 10);

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
