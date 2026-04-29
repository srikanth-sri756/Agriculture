"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Sparkles, ArrowRight } from "lucide-react";

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

// Compact preview of latest admin posts for the home page.
// Fails silently (renders nothing) if user is not logged in / API returns 401.
export default function HomeFeedSection() {
  const { data: posts = [] } = useQuery({
    queryKey: ["home-feed"],
    queryFn: fetchPosts,
    retry: false,
  });

  if (posts.length === 0) return null;
  const top = posts.slice(0, 4);

  return (
    <section id="feed" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold uppercase tracking-widest mb-3">
              <Megaphone className="w-3.5 h-3.5" /> Latest Updates
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900 tracking-tight">
              Feed &amp; Success Stories
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Announcements, news and farmer success stories from the OCF-SPIN team.
            </p>
          </div>
          <Link
            href="/feeds"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-800 text-white text-sm font-semibold hover:bg-green-700 transition shadow-md hover:shadow-lg"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {top.map((p) => {
            let images: string[] = [];
            try { images = JSON.parse(p.images) || []; } catch {}
            const isStory = p.type === "success_story";
            return (
              <Link
                key={p.id}
                href={`/feeds#${p.id}`}
                className="group rounded-2xl overflow-hidden bg-white border border-green-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="aspect-[4/3] bg-green-50 relative overflow-hidden">
                  {images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={images[0]}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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
                </div>
                <div className="p-4">
                  {p.category && (
                    <span className="inline-block text-[10px] font-medium text-green-700 mb-1">
                      {p.category.toUpperCase()}
                    </span>
                  )}
                  <h3 className="font-semibold text-green-900 line-clamp-2 group-hover:text-green-700 transition">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
