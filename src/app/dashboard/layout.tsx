import type { Metadata } from "next";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "School Data Insights Dashboard",
  description: "Your central hub for school data management.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isPrimaryAdminPage = false; // This logic would be dynamic based on route

  if (isPrimaryAdminPage) {
     return <div className="flex min-h-screen w-full flex-col">{children}</div>;
  }
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background dark:bg-zinc-900">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
