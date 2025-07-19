
'use client';

import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { usePathname } from 'next/navigation';

// export const metadata: Metadata = { // Metadata needs to be static or generated in a generateMetadata function
//   title: "School Data Insights Dashboard",
//   description: "Your central hub for school data management.",
// };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPlatformManagementPage = pathname.startsWith('/dashboard/platform-management');

  if (isPlatformManagementPage) {
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
