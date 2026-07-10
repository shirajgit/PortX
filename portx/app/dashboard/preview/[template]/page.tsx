import { redirect } from "next/navigation";

/** Previews moved to full-screen /preview/<template> (outside the dashboard layout). */
type Props = { params: Promise<{ template: string }> };

export default async function OldPreviewRedirect({ params }: Props) {
  const { template } = await params;
  redirect(`/preview/${template}`);
}