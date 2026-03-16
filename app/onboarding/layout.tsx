import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="cyber-grid-bg min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}