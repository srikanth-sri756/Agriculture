"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";

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

async function fetchPosts(): Promise<Post[]> {
  const r = await fetch("/api/posts");
  if (!r.ok) return [];
  return r.json();
}

export default function PostFeed() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["feed-posts"],
    queryFn: fetchPosts,
  });
  const [active, setActive] = useState<Post | null>(null);

  if (isLoading) return null;
  if (posts.length === 0) return null;

  return (
    <>
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 bg-green-50/80 border-b border-green-100">
          <Megaphone className="w-5 h-5 text-green-700" />
          <h3 className="font-semibold text-green-900">Feed & Success Stories</h3>
        </div>
        <div className="divide-y divide-green-50">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} onOpen={() => setActive(p)} />
          ))}
        </div>
      </div>
      {active && <PostModal post={active} onClose={() => setActive(null)} />}
    </>
  );
}

function PostCard({ post, onOpen }: { post: Post; onOpen: () => void }) {
  let images: string[] = [];
  try { images = JSON.parse(post.images) || []; } catch {}
  const isStory = post.type === "success_story";
  return (
    <button
      onClick={onOpen}
      className="w-full text-left px-5 py-4 hover:bg-green-50/50 transition flex gap-4"
    >
      {images[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={images[0]} alt="" className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
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
          <span className="text-[10px] text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h4 className="font-semibold text-green-900">{post.title}</h4>
        <p className="text-sm text-gray-600 line-clamp-2 whitespace-pre-wrap mt-0.5">{post.body}</p>
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
            <img
              src={images[idx]}
              alt=""
              className="w-full max-h-[55vh] object-contain"
            />
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
