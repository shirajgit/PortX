import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0F1E]">
      <SignUp fallbackRedirectUrl="/dashboard" />
    </main>
  );
}
