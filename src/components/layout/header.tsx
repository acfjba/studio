
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  PanelLeft,
  Search,
  School,
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
  ClipboardList,
  Gavel,
  BookOpen,
  Wifi,
  LogIn,
  Mail,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserNav } from '@/components/layout/user-nav';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/schemas/user';

const dashboardLinks = [
  { href: '/dashboard/primary-admin', icon: UserCog, label: 'Primary Admin', description: 'Manage all school operations.', roles: ['primary-admin', 'system-admin'] },
  { href: '/dashboard/head-teacher', icon: GraduationCap, label: 'Head Teacher', description: 'Oversee teacher submissions and reports.', roles: ['head-teacher', 'assistant-head-teacher', 'system-admin', 'primary-admin'] },
  { href: '/dashboard/teacher-panel', icon: Users, label: 'Teacher Panel', description: 'Access all essential teaching modules.', roles: ['teacher', 'kindergarten'] },
];

const academicLinks = [
  { href: '/dashboard/academics', icon: GraduationCap, label: 'Academics Hub', description: 'Manage lesson plans & inventory.', roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'kindergarten'] },
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
  { href: '/dashboard/document-vault', icon: FileText, label: 'Document Vault', description: 'Access your saved documents.', roles: ['teacher', 'head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin', 'librarian', 'kindergarten']},
];

const platformLinks = [
    { href: '/dashboard/reporting', icon: BarChart2, label: 'Reporting', description: 'Generate and view reports.', roles: ['head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin'] },
    { href: '/dashboard/invite-teachers', icon: Users, label: 'User Management', description: 'Invite users and manage roles.', roles: ['head-teacher', 'assistant-head-teacher', 'primary-admin', 'system-admin'] },
    { href: '/dashboard/email', icon: Mail, label: 'Bulk Email', description: 'Send an email to all users.', roles: ['system-admin'] },
];

const navMenuConfig = [
  { name: 'Dashboards', links: dashboardLinks },
  { name: 'Academics', links: academicLinks },
  { name: 'Student Services', links: studentServicesLinks },
  { name: 'Operations', links: operationsLinks },
  { name: 'Platform', links: platformLinks },
];

export function Header() {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole') as Role | null;
      setUserRole(role);
    }
  }, [pathname]); // Re-check on path change

  const hasAccess = (allowedRoles?: string[]) => {
    if (!userRole) return false;
    // System Admins should see everything, always.
    if (userRole === 'system-admin') return true; 
    if (!allowedRoles) return true; // If no roles are specified, assume public
    return allowedRoles.includes(userRole);
  };
  
  if (!isClient) {
    return (
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6" />
    );
  }

  // If the user is a system admin, show all links. Otherwise, filter by role.
  const accessibleNavMenus = navMenuConfig
        .map(menu => ({
          ...menu,
          links: menu.links.filter(link => hasAccess(link.roles)),
        }))
        .filter(menu => menu.links.length > 0);

  const allAccessibleLinks = accessibleNavMenus.flatMap(menu => menu.links);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 print:hidden">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href={userRole ? "/dashboard/profile" : "/"} className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <School className="h-6 w-6 text-primary" />
          <span className="sr-only">School Data Insights</span>
        </Link>
        {userRole && (
          <NavigationMenu>
            <NavigationMenuList>
              {accessibleNavMenus.map(menu => (
                  <NavigationMenuItem key={menu.name}>
                      <NavigationMenuTrigger>{menu.name}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                              {menu.links.map((component) => (
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
        )}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href={userRole ? "/dashboard/profile" : "/"} className="flex items-center gap-2 text-lg font-semibold">
              <School className="h-6 w-6 text-primary" />
              <span className="font-bold">School Data Insights</span>
            </Link>
            {userRole && allAccessibleLinks.map((item) => (
                 <Link key={item.label} href={item.href} className="text-muted-foreground hover:text-foreground">
                    {item.label}
                 </Link>
            ))}
            {!userRole && (
                 <Link href="/" className="text-muted-foreground hover:text-foreground">
                    Login
                 </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
        </form>
        {userRole ? (
          <UserNav />
        ) : (
          <div className="ml-auto">
             <Link href="/" passHref>
                <Button>
                    <LogIn className="mr-2 h-4 w-4"/>
                    Login
                </Button>
            </Link>
          </div>
        )}
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
