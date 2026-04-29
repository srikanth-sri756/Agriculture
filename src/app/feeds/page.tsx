"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Megaphone, Sparkles, X, ChevronLeft, ChevronRight, Search, Bell, ArrowLeft,
} from "lucide-react";
import PageBackground from "@/components/page-background";

interface Post {
  id: string;
  title: string;
  body: string;
  category: string;
  type: string;
  images: string;
  authorName: string;
  createdAt: string;
}

type Tab = "all" | "feed" | "success_story";

async function fetchPosts(): Promise<Post[]> {
  const r = await fetch("/api/posts");
  if (!r.ok) throw new Error("Failed");
  return r.json();
}

export default function FeedsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Post | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["feeds-page"],
    queryFn: fetchPosts,
    enabled: status === "authenticated",
  });

  const filtered = useMemo(() => {
    let list = posts;
    if (tab !== "all") list = list.filter((p) => p.type === tab);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [posts, tab, query]);

  // Open post directly if URL has a hash
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (!hash || posts.length === 0) return;
    const p = posts.find((x) => x.id === hash);
    if (p) setActive(p);
  }, [posts]);

  if (status === "loading") {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <PageBackground />
        <div className="text-green-800 animate-pulse">Loading…</div>
      </div>
    );
  }

  const counts = {
    all: posts.length,
    feed: posts.filter((p) => p.type === "feed").length,
    success_story: posts.filter((p) => p.type === "success_story").length,
  };

  return (
    <div className="min-h-screen relative">
      <PageBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 glass-header border-b border-green-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-green-50 text-green-700"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-green-200">
              <Image src="/images/ocf-logo.png" alt="OCF-SPIN" width={40} height={40} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-green-900 leading-none">Feeds &amp; Notifications</h1>
              <p className="text-xs text-green-600 mt-0.5">Updates, announcements &amp; farmer stories</p>
            </div>
          </div>
          <Bell className="w-5 h-5 text-green-700" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "all", label: "All", icon: null },
              { id: "feed", label: "Feed", icon: <Megaphone className="w-3.5 h-3.5" /> },
              { id: "success_story", label: "Success Stories", icon: <Sparkles className="w-3.5 h-3.5" /> },
            ] as { id: Tab; label: string; icon: React.ReactNode }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition ${
                tab === t.id
                  ? "bg-green-800 text-white shadow"
                  : "bg-white text-green-800 border border-green-200 hover:bg-green-50"
              }`}
            >
              {t.icon}
              {t.label}
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                tab === t.id ? "bg-white/20" : "bg-green-100 text-green-700"
              }`}>
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-green-200 bg-white text-green-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          />
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-40" />
            No posts {query ? "match your search" : "yet"}.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <PostCard key={p.id} post={p} onOpen={() => setActive(p)} />
            ))}
          </div>
        )}
      </main>

      {active && <PostModal post={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function PostCard({ post, onOpen }: { post: Post; onOpen: () => void }) {
  let images: string[] = [];
  try { images = JSON.parse(post.images) || []; } catch {}
  const isStory = post.type === "success_story";
  return (
    <button
      id={post.id}
      onClick={onOpen}
      className="text-left bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="aspect-[16/9] bg-green-50 relative">
        {images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-green-300">
            {isStory ? <Sparkles className="w-10 h-10" /> : <Megaphone className="w-10 h-10" />}
          </div>
        )}
        <span className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide inline-flex items-center gap-1 ${
          isStory ? "bg-amber-500 text-white" : "bg-green-700 text-white"
        }`}>
          {isStory ? <><Sparkles className="w-3 h-3" /> Story</> : "Feed"}
        </span>
        {images.length > 1 && (
          <span className="absolute top-3 right-3 text-[10px] font-medium px-2 py-1 rounded-full bg-black/55 text-white">
            +{images.length - 1}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          {post.category && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              {post.category}
            </span>
          )}
          <span className="text-[10px] text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className="font-semibold text-green-900 line-clamp-2">{post.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 whitespace-pre-wrap mt-1">{post.body}</p>
      </div>
    </button>
  );
}

function PostModal({ post, onClose }: { post: Post; onClose: () => void }) {
  let images: string[] = [];
  try { images = JSON.parse(post.images) || []; } catch {}
  const [idx, setIdx] = useState(0);
  const isStory = post.type === "success_story";

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-white/95 backdrop-blur border-b border-green-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide inline-flex items-center gap-1 ${
              isStory ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
            }`}>
              {isStory ? <><Sparkles className="w-3 h-3" /> Success Story</> : "Feed"}
            </span>
            {post.category && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {post.category}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {images.length > 0 && (
          <div className="relative w-full bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[idx]} alt="" className="w-full max-h-[55vh] object-contain" />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setIdx((i) => (i === 0 ? images.length - 1 : i - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIdx((i) => (i + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${i === idx ? "bg-white" : "bg-white/40"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="px-5 py-4">
          <h2 className="text-xl font-bold text-green-900 mb-1">{post.title}</h2>
          <p className="text-xs text-gray-500 mb-3">
            {post.authorName || "Admin"} · {new Date(post.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{post.body}</p>
        </div>
      </div>
    </div>
  );
}
