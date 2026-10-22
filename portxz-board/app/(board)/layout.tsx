import { SignOutButton } from "@clerk/nextjs";
import { ShieldAlert } from "lucide-react";
import { isAdmin } from "@/lib/admin";
import { Sidebar } from "@/components/Sidebar";

// Always read live data — this is an admin tool, not a cached page.
export const dynamic = "force-dynamic";

export default async function BoardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <div className="max-w-sm rounded-2xl border border-border bg-surface p-8 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-warning" />
          <h1 className="mt-4 text-lg font-semibold">No access</h1>
          <p className="mt-2 text-sm text-muted">This account isn&apos;t the Portxz admin. Sign in with the admin account to continue.</p>
          <SignOutButton>
            <button className="mt-6 rounded-lg border border-border-strong px-4 py-2 text-sm hover:bg-surface-2">Sign out</button>
          </SignOutButton>
        </div>
      </main>
    );
  }

  return (
    <div className="lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
