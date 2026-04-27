"use client";

/**
 * Full-page decorative background:
 *   • Blurred crops photo
 *   • Soft white wash so foreground UI is readable
 *   • Three slowly drifting colour blobs (`animate-blob`)
 *
 * Drop this directly inside a page-level wrapper that has `relative`
 * positioning. Children should also be `relative` so they stack above.
 */
export default function PageBackground({
  intensity = "soft",
}: {
  intensity?: "soft" | "strong";
}) {
  const overlayOpacity = intensity === "strong" ? "bg-white/55" : "bg-white/75";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Blurred photograph */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: 'url("/images/crops-bg.jpg")',
          filter: "blur(18px) saturate(110%)",
        }}
      />
      {/* Brightening wash */}
      <div className={`absolute inset-0 ${overlayOpacity}`} />
      {/* Aurora colour wash on top of the photo */}
      <div className="absolute inset-0 bg-aurora opacity-40" />

      {/* Floating colour blobs */}
      <div className="absolute -top-24 -left-20 w-[28rem] h-[28rem] rounded-full bg-emerald-300/40 blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-24 w-[26rem] h-[26rem] rounded-full bg-amber-300/40 blur-3xl animate-blob-delay-2" />
      <div className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] rounded-full bg-green-400/35 blur-3xl animate-blob-delay-4" />
    </div>
  );
}
