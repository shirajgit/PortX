import Link from "next/link";

export default function Landing() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0A0F1E] px-6 text-center text-[#E8EDF7]">
      <span className="mb-6 rounded-full border border-[#1E2C52] px-4 py-1.5 font-mono text-xs text-[#4DA6FF]">
        portx.in/you
      </span>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
        One profile. <span className="text-[#4DA6FF]">Portfolio + resume,</span> always in sync.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-[#8B98B8]">
        Edit a project once — your live portfolio and your ATS-ready PDF resume both update. Built for developers who ship.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/sign-up" className="rounded-lg bg-[#4DA6FF] px-6 py-3 font-semibold text-[#04101F] hover:bg-[#8FC4FF]">
          Claim your username
        </Link>
        <Link href="/sign-in" className="rounded-lg border border-[#1E2C52] px-6 py-3 font-semibold hover:border-[#4DA6FF]">
          Sign in
        </Link>
      </div>
    </main>
  );
}
