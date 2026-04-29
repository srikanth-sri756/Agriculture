"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, X, ImagePlus, Trash2, Megaphone, Sparkles, Loader2,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  body: string;
  category: string;
  type: string;
  images: string; // JSON array of data URLs
  authorName: string;
  createdAt: string;
}

const MAX_IMAGES = 6;
// Resize uploaded images client-side to keep payload small.
async function resizeImage(file: File, maxDim = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Image load failed"));
      img.onload = () => {
        const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unsupported"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

async function fetchPosts(): Promise<Post[]> {
  const r = await fetch("/api/posts");
  if (!r.ok) throw new Error("Failed");
  return r.json();
}

export default function AdminPosts() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: fetchPosts,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
      qc.invalidateQueries({ queryKey: ["feed-posts"] });
      qc.invalidateQueries({ queryKey: ["home-feed"] });
      qc.invalidateQueries({ queryKey: ["feeds-page"] });
    },
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
      <div className="p-4 border-b border-green-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-green-700" />
          <h2 className="font-semibold text-green-900">Feed & Success Stories</h2>
          <span className="text-xs text-gray-500">({posts.length})</span>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-600 transition"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {showForm && <PostForm onClose={() => setShowForm(false)} />}

      <div className="divide-y divide-green-50">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No posts yet. Create the first one.</div>
        ) : (
          posts.map((p) => (
            <PostRow key={p.id} post={p} onDelete={() => remove.mutate(p.id)} />
          ))
        )}
      </div>
    </div>
  );
}

function PostRow({ post, onDelete }: { post: Post; onDelete: () => void }) {
  let images: string[] = [];
  try { images = JSON.parse(post.images) || []; } catch {}
  const isStory = post.type === "success_story";
  return (
    <div className="px-4 py-4 flex gap-4">
      {images[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={images[0]} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
            isStory ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
          }`}>
            {isStory ? <span className="inline-flex items-center gap-1"><Sparkles className="w-3 h-3" /> Success Story</span> : "Feed"}
          </span>
          {post.category && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {post.category}
            </span>
          )}
          <span className="text-[10px] text-gray-400">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
        <h3 className="font-semibold text-green-900 truncate">{post.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 whitespace-pre-wrap">{post.body}</p>
        {images.length > 1 && (
          <span className="text-[10px] text-gray-400">+{images.length - 1} more image(s)</span>
        )}
      </div>
      <button
        onClick={() => {
          if (confirm("Delete this post?")) onDelete();
        }}
        className="self-start p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
        aria-label="Delete post"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function PostForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"feed" | "success_story">("feed");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const create = useMutation({
    mutationFn: async () => {
      const r = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, category, type, images }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || "Failed to create post");
      }
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
      qc.invalidateQueries({ queryKey: ["feed-posts"] });
      qc.invalidateQueries({ queryKey: ["home-feed"] });
      qc.invalidateQueries({ queryKey: ["feeds-page"] });
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setError("");
    const remaining = MAX_IMAGES - images.length;
    const arr = Array.from(files).slice(0, remaining);
    try {
      const dataUrls = await Promise.all(arr.map((f) => resizeImage(f)));
      setImages((prev) => [...prev, ...dataUrls]);
    } catch {
      setError("Could not load one or more images");
    }
  };

  return (
    <div className="p-4 border-b border-green-100 bg-green-50/40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-green-900">New Post</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-green-100">
          <X className="w-4 h-4 text-green-700" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-green-700 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "feed" | "success_story")}
            className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm bg-white"
          >
            <option value="feed">Feed / Announcement</option>
            <option value="success_story">Success Story</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-green-700 mb-1">Category (optional)</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Wheat, Subsidy, Training"
            maxLength={80}
            className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-green-700 mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder="e.g. Ramaiah doubled his yield with organic compost"
          className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-green-700 mb-1">Description</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={5000}
          rows={5}
          placeholder="Write the announcement or success story…"
          className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm resize-y"
        />
        <p className="text-[10px] text-gray-400 mt-0.5">{body.length}/5000</p>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-green-700 mb-1">
          Images ({images.length}/{MAX_IMAGES})
        </label>
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-green-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-lg border-2 border-dashed border-green-300 text-green-600 flex flex-col items-center justify-center hover:bg-green-50 transition text-[10px] gap-1"
            >
              <ImagePlus className="w-5 h-5" />
              Add
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 mb-2">{error}</p>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (!title.trim()) {
              setError("Title is required");
              return;
            }
            create.mutate();
          }}
          disabled={create.isPending}
          className="px-4 py-2 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-600 transition disabled:opacity-50 inline-flex items-center gap-1.5"
        >
          {create.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Publish
        </button>
      </div>
    </div>
  );
}
