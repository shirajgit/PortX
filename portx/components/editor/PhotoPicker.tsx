"use client";
import { useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";

/* Profile photo picker — shown in the setup wizard and the Profile editor.
   The image is uploaded to the signed-in account (Clerk hosts it), then its
   URL is saved on the profile so every template can show it. Removing the
   photo makes templates fall back to the person's initials.               */

const MAX_BYTES = 5 * 1024 * 1024;

export function PhotoPicker({
  value,
  name,
  onChange,
}: {
  value: string | null;
  name: string;
  onChange: (url: string | null) => void;
}) {
  const { user } = useUser();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials =
    name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "•";

  async function saveUrl(url: string | null): Promise<boolean> {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl: url }),
    });
    if (!res.ok) {
      setError(`Could not save photo (HTTP ${res.status})`);
      return false;
    }
    onChange(url);
    return true;
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > MAX_BYTES) { setError("Image is too large — keep it under 5 MB."); return; }
    if (!user) { setError("Still loading your account — try again in a moment."); return; }

    setBusy(true);
    try {
      await user.setProfileImage({ file });
      await user.reload();
      await saveUrl(user.imageUrl);
    } catch {
      setError("Upload failed. Please try another image.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setError(null);
    setBusy(true);
    await saveUrl(null);
    setBusy(false);
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#1E2C52] bg-gradient-to-br from-[#4DA6FF] to-[#7C5CFF]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Your profile photo" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-2xl font-bold text-white">{initials}</span>
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-black/60 font-mono text-[10px] text-white">
              saving…
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => fileRef.current?.click()}
              className="rounded-lg bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F] transition hover:bg-[#8FC4FF] disabled:opacity-40">
              {value ? "Change photo" : "Upload photo"}
            </button>
            {value && (
              <button type="button" disabled={busy} onClick={remove}
                className="rounded-lg border border-[#1E2C52] px-4 py-2 text-sm text-[#8B98B8] transition hover:border-[#5C2B2B] hover:text-[#FF9B9B] disabled:opacity-40">
                Remove
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-[#8B98B8]">
            A clear, front-facing photo works best. JPG or PNG, up to 5 MB. No photo? We show your initials.
          </p>
        </div>
      </div>
      {error && <p className="mt-2 font-mono text-xs text-[#FF9B9B]">{error}</p>}
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onFile} />
    </div>
  );
}
