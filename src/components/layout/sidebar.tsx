'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, FileText, Warehouse, Users, Settings, School, Briefcase, UserCog, GraduationCap, Library, ShieldCheck, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';


const managementLinks = [
  { href: '/dashboard/school-management', icon: Briefcase, label: 'School Management' },
];

const academicLinks = [
  { href: '/dashboard/summarization', icon: FileText, label: 'Summarization' },
  { href: '/dashboard/academics', icon: GraduationCap, label: 'Academics' },
];

const operationsLinks = [
    { href: '/dashboard/inventory', icon: Warehouse, label: 'Inventory' },
    { href: '/dashboard/staff', icon: Users, label: 'Staff Records' },
    { href: '/dashboard/library', icon: Library, label: 'Library' },
    { href: '/dashboard/health-safety', icon: ShieldCheck, label: 'Health & Safety' },
];

const analyticsLinks = [
    { href: '/dashboard/reporting', icon: BarChart2, label: 'Reporting' },
]

const platformLinks = [
  { href: '/dashboard/platform-management', icon: UserCog, label: 'Platform Admin' },
];

export function Sidebar() {
  const pathname = usePathname();

  const navSections = [
    { links: managementLinks },
    { links: academicLinks },
    { links: operationsLinks },
    { links: analyticsLinks },
    { links: platformLinks, isLast: true },
  ];

  return (
    <aside className="hidden w-16 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/dashboard"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <School className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">School Data Insights</span>
        </Link>
        <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    { 'bg-accent text-accent-foreground': pathname === '/dashboard' }
                  )}
                >
                  <LayoutGrid className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>

          {navSections.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              <Separator className="my-1" />
              {section.links.map((item) => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                        { 'bg-accent text-accent-foreground': pathname.startsWith(item.href) }
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ))}
            </React.Fragment>
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
           <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/settings"
                className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    { 'bg-accent text-accent-foreground': pathname === '/dashboard/settings' }
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
