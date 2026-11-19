"use client";
/* Links tapped inside LinkedIn, Instagram, Facebook & co. open in the app's own browser,
   where Google refuses to sign anyone in (403 disallowed_useragent). Spot those browsers
   on the auth pages and offer a way out before someone taps "Continue with Google". */
import { useState, useSyncExternalStore } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

// App names in the user agent, plus "; wv)", which marks any Android WebView.
const IN_APP_UA = /LinkedInApp|FBAN|FBAV|FB_IAB|Instagram|Twitter|Snapchat|TikTok|musical_ly|BytedanceWebview|MicroMessenger|Line\/|; wv\)/i;
const APP_NAMES: [RegExp, string][] = [
  [/LinkedInApp/i, "LinkedIn"],
  [/Instagram/i, "Instagram"],
  [/FBAN|FBAV|FB_IAB/i, "Facebook"],
  [/Twitter/i, "X"],
];

type Env = { app: string; os: "ios" | "android" | "other" };

function detect(ua: string): Env | null {
  if (!IN_APP_UA.test(ua)) return null;
  const app = APP_NAMES.find(([re]) => re.test(ua))?.[1] ?? "this app";
  const os = /iPhone|iPad|iPod/i.test(ua) ? "ios" : /Android/i.test(ua) ? "android" : "other";
  return { app, os };
}

/* A link that hands the current page to the real browser: Chrome via an intent on Android,
   Safari via its x-safari-https scheme on iOS 17+. Elsewhere there's nothing to tap. */
function openHref(os: Env["os"], url: URL) {
  if (os === "android") {
    const rest = `${url.host}${url.pathname}${url.search}`;
    return `intent://${rest}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url.href)};end`;
  }
  if (os === "ios") return `x-safari-${url.href}`;
  return null;
}

const subscribe = () => () => {};

export function InAppBrowserNotice() {
  // The server has no user agent to go on, so it renders nothing and the browser fills in on hydration.
  const ua = useSyncExternalStore(subscribe, () => navigator.userAgent, () => "");
  const [copied, setCopied] = useState(false);

  const env = detect(ua);
  if (!env) return null;

  const url = new URL(window.location.href);
  const href = openHref(env.os, url);
  const browser = env.os === "ios" ? "Safari" : "Chrome";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the menu hint below still works */
    }
  };

  return (
    <div className="w-full max-w-[400px] rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-50">
      <p className="font-semibold text-amber-200">You&rsquo;re in {env.app}&rsquo;s built-in browser</p>
      <p className="mt-1 text-amber-50/80">
        Google sign-in doesn&rsquo;t work here. Open this page in {browser}, or sign up with your email below.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {href && (
          <a
            href={href}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-300 px-3 py-1.5 font-medium text-[#0A0F1E] hover:bg-amber-200"
          >
            <ExternalLink className="h-4 w-4" /> Open in {browser}
          </a>
        )}
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300/40 px-3 py-1.5 font-medium text-amber-100 hover:bg-amber-300/10"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy link"}
        </button>
      </div>
      <p className="mt-2 text-xs text-amber-50/60">
        Button not working? Tap the {env.os === "ios" ? "•••" : "⋮"} menu and choose &ldquo;Open in browser&rdquo;.
      </p>
    </div>
  );
}
