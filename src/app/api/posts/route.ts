import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const MAX_TOTAL_BYTES = 5 * 1024 * 1024; // 5MB total payload (text + images)
const MAX_IMAGE_BYTES = 800 * 1024; // ~800KB per image (post-resize on client)
const MAX_IMAGES = 6;
const ALLOWED_TYPES = new Set(["feed", "success_story"]);

function isValidImage(v: unknown): v is string {
  if (typeof v !== "string") return false;
  if (!v.startsWith("data:image/")) return false;
  if (v.length > MAX_IMAGE_BYTES) return false;
  return true;
}

// GET /api/posts — list posts. Anyone authenticated can read.
// Supports ?type=feed|success_story
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const type = url.searchParams.get("type") || undefined;
  const where: { published: boolean; type?: string } = { published: true };
  if (type && ALLOWED_TYPES.has(type)) where.type = type;

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(posts);
}

// POST /api/posts — admin only.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { userId?: string; role?: string; mobile?: string } | undefined;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const text = await req.text();
  if (text.length > MAX_TOTAL_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }
  let body: {
    title?: string;
    body?: string;
    category?: string;
    type?: string;
    images?: unknown;
    authorName?: string;
  };
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = (body.title || "").trim();
  if (!title || title.length > 200) {
    return NextResponse.json({ error: "Title required (max 200 chars)" }, { status: 400 });
  }
  const postBody = (body.body || "").trim();
  if (postBody.length > 5000) {
    return NextResponse.json({ error: "Body too long (max 5000 chars)" }, { status: 400 });
  }
  const type = ALLOWED_TYPES.has(body.type || "") ? (body.type as string) : "feed";
  const category = (body.category || "").trim().slice(0, 80);

  let images: string[] = [];
  if (Array.isArray(body.images)) {
    images = body.images.filter(isValidImage) as string[];
    if (images.length > MAX_IMAGES) images = images.slice(0, MAX_IMAGES);
  }

  const post = await prisma.post.create({
    data: {
      title,
      body: postBody,
      category,
      type,
      images: JSON.stringify(images),
      authorName: (body.authorName || "Admin").trim().slice(0, 80),
      authorId: user.userId || "",
    },
  });
  return NextResponse.json(post, { status: 201 });
}

// DELETE /api/posts?id=... — admin only.
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string } | undefined;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
