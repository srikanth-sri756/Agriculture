import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { userId?: string; role?: string };

  if (user.role === "admin") {
    const farmers = await prisma.farmer.findMany({
      include: { lands: true, crops: true, economics: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(farmers);
  }

  // Farmer sees only their own data
  const farmer = await prisma.farmer.findFirst({
    where: { userId: user.userId },
    include: { lands: true, crops: true, economics: true },
  });

  return NextResponse.json(farmer ? [farmer] : []);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { userId?: string };
  const body = await req.json();

  // Reject obviously oversized payloads to limit abuse via base64 image fields.
  // ~3MB of JSON is plenty for personal data + several resized photos.
  if (JSON.stringify(body).length > 3 * 1024 * 1024) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  // Helper: photo data URLs must be image/* and <= ~600KB after encoding.
  const MAX_PHOTO_BYTES = 600 * 1024;
  const isValidPhoto = (v: unknown): v is string => {
    if (typeof v !== "string") return false;
    if (v === "") return true;
    if (!v.startsWith("data:image/")) return false;
    return v.length <= MAX_PHOTO_BYTES;
  };
  if (body?.photoUrl !== undefined && !isValidPhoto(body.photoUrl)) {
    return NextResponse.json({ error: "Invalid profile photo" }, { status: 400 });
  }
  if (Array.isArray(body?.crops)) {
    for (const c of body.crops) {
      if (c?.photoUrl !== undefined && !isValidPhoto(c.photoUrl)) {
        return NextResponse.json({ error: "Invalid crop photo" }, { status: 400 });
      }
    }
  }

  const farmer = await prisma.farmer.findFirst({
    where: { userId: user.userId },
  });

  if (!farmer) {
    return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
  }

  // Only allow edits if status is draft or edit_approved
  if (farmer.status !== "draft" && farmer.status !== "edit_approved") {
    return NextResponse.json({ error: "Editing not allowed. Please request edit permission." }, { status: 403 });
  }

  // Update farmer basic data
  const {
    lands, crops, economics,
    // Strip identity / immutable / server-managed fields so they can't be
    // overwritten from the client (prevents P2002 unique constraint errors
    // on `mobile`, etc.).
    id: _id,
    userId: _userId,
    mobile: _mobile,
    status: _status,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...farmerData
  } = body;

  const updated = await prisma.farmer.update({
    where: { id: farmer.id },
    data: {
      ...farmerData,
      weedsData: farmerData.weedsData ? JSON.stringify(farmerData.weedsData) : undefined,
      status: "submitted",
    },
  });

  // Update lands
  if (lands && Array.isArray(lands)) {
    await prisma.land.deleteMany({ where: { farmerId: farmer.id } });
    for (const land of lands) {
      await prisma.land.create({
        data: { ...land, farmerId: farmer.id },
      });
    }
  }

  // Update crops
  if (crops && Array.isArray(crops)) {
    await prisma.crop.deleteMany({ where: { farmerId: farmer.id } });
    for (const crop of crops) {
      await prisma.crop.create({
        data: { ...crop, farmerId: farmer.id },
      });
    }
  }

  // Update economics
  if (economics) {
    await prisma.economics.upsert({
      where: { farmerId: farmer.id },
      update: economics,
      create: { ...economics, farmerId: farmer.id },
    });
  }

  return NextResponse.json({ message: "Updated successfully", farmer: updated });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { userId?: string; role?: string };
  const body = await req.json();
  const { action, farmerId } = body;

  // Farmer requests edit
  if (action === "request_edit") {
    const farmer = await prisma.farmer.findFirst({
      where: { userId: user.userId },
    });
    if (!farmer) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
    }
    if (farmer.status !== "submitted") {
      return NextResponse.json({ error: "Can only request edit for submitted data" }, { status: 400 });
    }
    await prisma.farmer.update({
      where: { id: farmer.id },
      data: { status: "edit_requested" },
    });
    return NextResponse.json({ message: "Edit request submitted" });
  }

  // Admin approves edit
  if (action === "approve_edit" && user.role === "admin") {
    if (!farmerId) {
      return NextResponse.json({ error: "Farmer ID required" }, { status: 400 });
    }
    const farmer = await prisma.farmer.findUnique({ where: { id: farmerId } });
    if (!farmer || farmer.status !== "edit_requested") {
      return NextResponse.json({ error: "No pending edit request" }, { status: 400 });
    }
    await prisma.farmer.update({
      where: { id: farmerId },
      data: { status: "edit_approved" },
    });
    return NextResponse.json({ message: "Edit approved" });
  }

  // Admin rejects edit request
  if (action === "reject_edit" && user.role === "admin") {
    if (!farmerId) {
      return NextResponse.json({ error: "Farmer ID required" }, { status: 400 });
    }
    const farmer = await prisma.farmer.findUnique({ where: { id: farmerId } });
    if (!farmer || farmer.status !== "edit_requested") {
      return NextResponse.json({ error: "No pending edit request" }, { status: 400 });
    }
    await prisma.farmer.update({
      where: { id: farmerId },
      data: { status: "submitted" },
    });
    return NextResponse.json({ message: "Edit request rejected" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
