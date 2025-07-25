
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import {
  PanelLeft,
  Search,
  School,
  Briefcase,
  GraduationCap,
  FileText,
  HeartHandshake,
  Warehouse,
  Users,
  Library,
  ShieldCheck,
  Contact,
  BarChart2,
  UserCog,
  Bot,
  Settings,
  LayoutGrid,
  History,
  UploadCloud,
  ClipboardList,
  Gavel,
  BookOpen,
    Building,
    Database,
    FolderArchive,
    UserPlus,
    Wifi,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserNav } from '@/components/layout/user-nav';
import { cn } from '@/lib/utils';

const dashboardLinks = [
  { href: '/dashboard/primary-admin', icon: UserCog, label: 'Primary Admin', description: 'Manage all school operations.', roles: ['primary-admin', 'system-admin'] },
  { href: '/dashboard/head-teacher', icon: Briefcase, label: 'Head Teacher', description: 'Oversee teacher submissions and reports.', roles: ['head-teacher', 'assistant-head-teacher', 'system-admin'] },
  { href: '/dashboard/teacher-panel', icon: GraduationCap, label: 'Teacher Panel', description: 'Access all essential teaching modules.', roles: ['teacher', 'kindergarten'] },
];

const academicLinks = [
  { href: '/dashboard/academics', icon: GraduationCap, label: 'Academics Hub', description: 'Manage lesson plans & inventory.', roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'kindergarten'] },
  { href: '/dashboard/workbook-plan', icon: ClipboardList, label: 'AI Workbook Plan', description: 'Generate lesson plans with AI.', roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'kindergarten'] },
  { href: '/dashboard/lesson-planner', icon: BookOpen, label: 'Lesson Planner', description: 'Manually create detailed lesson plans.', roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'kindergarten'] },
  { href: '/dashboard/academics/exam-results', icon: ClipboardList, label: 'Exam Results', description: 'Record and manage student exam results.', roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'kindergarten'] },
  { href: '/dashboard/academics/exam-summary', icon: BarChart2, label: 'Exam Summary', description: 'View aggregated exam performance.', roles: ['head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin'] },
];

const studentServicesLinks = [
    { href: '/dashboard/counselling', icon: HeartHandshake, label: 'Counselling', description: 'Manage confidential records.', roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'kindergarten'] },
    { href: '/dashboard/disciplinary', icon: Gavel, label: 'Disciplinary', description: 'Manage disciplinary records.', roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'kindergarten'] }
];

const operationsLinks = [
  { href: '/dashboard/inventory', icon: Warehouse, label: 'Primary Inventory', description: 'Track and forecast school assets.', roles: ['head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin'] },
  { href: '/dashboard/academics/classroom-inventory', icon: Warehouse, label: 'Classroom Inventory', description: 'Manage classroom-level stock.', roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'kindergarten'] },
  { href: '/dashboard/staff', icon: Users, label: 'Staff Records', description: 'Manage all staff information.', roles: ['head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin'] },
  { href: '/dashboard/library', icon: Library, label: 'Library Service', description: 'Manage book loans and returns.', roles: ['librarian', 'head-teacher', 'system-admin', 'teacher', 'primary-admin', 'assistant-head-teacher', 'kindergarten'] },
  { href: '/dashboard/health-safety', icon: ShieldCheck, label: 'Health & Safety', description: 'Manage safety protocols.', roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'kindergarten'] },
  { href: '/dashboard/contacts', icon: Contact, label: 'Contacts', description: 'View staff directory.', roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'librarian', 'kindergarten'] },
  { href: '/dashboard/document-vault', icon: FolderArchive, label: 'Document Vault', description: 'Access your saved documents.', roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'librarian', 'kindergarten']},
];

const platformLinks = [
    { href: '/dashboard/reporting', icon: BarChart2, label: 'Reporting', description: 'Generate and view reports.', roles: ['head-teacher', 'primary-admin', 'system-admin'] },
    { href: '/dashboard/summarization', icon: FileText, label: 'AI Summarization', description: 'Use AI to summarize documents.', roles: ['head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin'] },
    { href: '/dashboard/upload-data', icon: UploadCloud, label: 'Upload Data', description: 'Upload Excel/ZIP files for processing.', roles: ['primary-admin', 'system-admin'] },
    { href: '/dashboard/platform-management', icon: UserCog, label: 'Platform Management', description: 'Manage schools, users, and settings.', roles: ['system-admin'] },
    { href: '/dashboard/user-management', icon: UserPlus, label: 'Invite & Manage Users', description: 'Invite new users to the platform.', roles: ['system-admin'] },
    { href: '/dashboard/platform-management/platform-status', icon: Wifi, label: 'Platform Status', description: 'Monitor school connectivity and latency.', roles: ['system-admin'] },
    { href: '/dashboard/platform-management/ai-assistant', icon: Bot, label: 'AI Assistant', description: 'Develop the app with AI.', roles: ['system-admin'] },
    { href: '/dashboard/history', icon: History, label: 'My Rating History', description: 'Review your submitted ratings.', roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'librarian', 'kindergarten'] },
];

const allLinks = [
    ...dashboardLinks.map(l => ({...l, category: "Dashboards"})),
    ...academicLinks.map(l => ({...l, category: "Academics"})),
    ...studentServicesLinks.map(l => ({...l, category: "Student Services"})),
    ...operationsLinks.map(l => ({...l, category: "Operations"})),
    ...platformLinks.map(l => ({...l, category: "Platform"})),
];

const navMenuConfig = [
  { name: 'Dashboards', links: dashboardLinks, roles: ['primary-admin', 'system-admin', 'head-teacher', 'assistant-head-teacher', 'teacher', 'kindergarten'] },
  { name: 'Academics', links: academicLinks, roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'kindergarten'] },
  { name: 'Student Services', links: studentServicesLinks, roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'kindergarten'] },
  { name: 'Operations', links: operationsLinks, roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'librarian', 'kindergarten'] },
  { name: 'Platform', links: platformLinks, roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'librarian', 'kindergarten'] },
];

export function Header() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    }
  }, []);

  const hasAccess = (allowedRoles: string[]) => {
    if (!userRole) return false;
    if (userRole === 'system-admin') return true; // System admin has access to everything
    return allowedRoles.includes(userRole);
  };
  
  if (!isClient) {
    return (
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <School className="h-6 w-6 text-primary" />
          <span className="sr-only">School Data Insights</span>
        </div>
      </header>
    );
  }

  const accessibleNavMenus = navMenuConfig.filter(menu => {
    const hasLinksWithAccess = menu.links.some(link => hasAccess(link.roles));
    return hasLinksWithAccess;
  });
  const accessibleMobileLinks = allLinks.filter(link => hasAccess(link.roles));

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/dashboard/profile" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <School className="h-6 w-6 text-primary" />
          <span className="sr-only">School Data Insights</span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            {accessibleNavMenus.map(menu => (
                <NavigationMenuItem key={menu.name}>
                    <NavigationMenuTrigger>{menu.name}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {menu.links.filter(link => hasAccess(link.roles)).map((component) => (
                                <ListItem key={component.label} title={component.label} href={component.href} icon={component.icon}>
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
           <SheetHeader>
            <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">A list of links to navigate the application.</SheetDescription>
          </SheetHeader>
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/dashboard/profile" className="flex items-center gap-2 text-lg font-semibold">
              <School className="h-6 w-6 text-primary" />
              <span className="sr-only">School Data Insights</span>
            </Link>
            {accessibleMobileLinks.map((item) => (
                 <Link key={item.label} href={item.href} className="text-muted-foreground hover:text-foreground">
                    {item.label}
                 </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <UserNav />
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'> & { icon?: React.ElementType }>(
  ({ className, title, children, icon: Icon, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={href!}
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="flex items-center gap-2 text-sm font-medium leading-none">
                {Icon && <Icon className="h-4 w-4"/>}
                {title}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';
