/* ── Portxz logo ─────────────────────────────────────────────────────
   The brand icon (public/brand/portxz-mark.png) beside the wordmark.
   The wordmark is live text so it stays readable in both the dark and
   the light theme — "Port" takes the surrounding text colour, "xz"
   carries the logo's blue-to-indigo gradient.                         */

const SIZES = {
  sm: { mark: "h-6 w-6", text: "text-base" },
  md: { mark: "h-8 w-8", text: "text-xl" },
  lg: { mark: "h-11 w-11", text: "text-2xl" },
} as const;

export function Logo({
  size = "md",
  showText = true,
  className,
}: {
  size?: keyof typeof SIZES;
  showText?: boolean;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span className={`inline-flex items-center gap-2 font-bold tracking-tight ${s.text} ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/portxz-mark.png"
        alt={showText ? "" : "Portxz"}
        className={`${s.mark} shrink-0 drop-shadow-[0_4px_14px_rgba(77,120,255,0.45)]`}
      />
      {showText && (
        <span>
          Port
          <span className="bg-gradient-to-r from-[#2F9BFF] to-[#5B5BF6] bg-clip-text text-transparent">xz</span>
        </span>
      )}
    </span>
  );
}
