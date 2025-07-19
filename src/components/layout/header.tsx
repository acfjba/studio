
'use client';

import React from 'react';
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserNav } from '@/components/layout/user-nav';
import { cn } from '@/lib/utils';

const managementLinks = [{ href: '/dashboard/head-teacher', icon: Briefcase, label: 'Head Teacher', description: 'Oversee all school-level tasks.' }];
const academicLinks = [
  { href: '/dashboard/summarization', icon: FileText, label: 'Summarization', description: 'Use AI to summarize documents.' },
  { href: '/dashboard/academics', icon: GraduationCap, label: 'Academics', description: 'Manage lesson plans & inventory.' },
  { href: '/dashboard/workbook-plan', icon: ClipboardList, label: 'AI Workbook Plan', description: 'Generate lesson plans with AI.' },
  { href: '/dashboard/lesson-planner', icon: BookOpen, label: 'Lesson Planner', description: 'Manually create detailed lesson plans.' },
  { href: '/dashboard/academics/exam-results', icon: ClipboardList, label: 'Exam Results', description: 'Record and manage student exam results.' },

];
const studentServicesLinks = [
    { href: '/dashboard/counselling', icon: HeartHandshake, label: 'Counselling', description: 'Manage confidential records.' },
    { href: '/dashboard/disciplinary', icon: Gavel, label: 'Disciplinary', description: 'Manage disciplinary records.' }
];
const operationsLinks = [
  { href: '/dashboard/inventory', icon: Warehouse, label: 'Inventory', description: 'Track and forecast inventory.' },
  { href: '/dashboard/staff', icon: Users, label: 'Staff Records', description: 'Manage all staff information.' },
  { href: '/dashboard/library', icon: Library, label: 'Library', description: 'Manage the library collection.' },
  { href: '/dashboard/health-safety', icon: ShieldCheck, label: 'Health & Safety', description: 'Manage safety protocols.' },
  { href: '/dashboard/contacts', icon: Contact, label: 'Contacts', description: 'View staff directory.' },
  { href: '/dashboard/upload-data', icon: UploadCloud, label: 'Upload Data', description: 'Upload Excel sheets for processing.' },
];
const analyticsLinks = [
    { href: '/dashboard/reporting', icon: BarChart2, label: 'Reporting', description: 'Generate and view reports.' },
];
const platformLinks = [
  { href: '/dashboard/platform-management', icon: UserCog, label: 'Platform Admin', description: 'Manage the entire platform.' },
  { href: '/dashboard/platform-management/ai-assistant', icon: Bot, label: 'AI Assistant', description: 'Develop the app with AI.' },
  { href: '/dashboard/history', icon: History, label: 'Rating History', description: 'Review your submitted ratings.' },
];

const allLinks = [
    {category: "Dashboard", href: "/dashboard", icon: LayoutGrid, label: "Dashboard"},
    ...managementLinks.map(l => ({...l, category: "Management"})),
    ...academicLinks.map(l => ({...l, category: "Academics"})),
    ...studentServicesLinks.map(l => ({...l, category: "Student Services"})),
    ...operationsLinks.map(l => ({...l, category: "Operations"})),
    ...analyticsLinks.map(l => ({...l, category: "Analytics"})),
    ...platformLinks.map(l => ({...l, category: "Platform"})),
    {category: "Settings", href: "/dashboard/settings", icon: Settings, label: "Settings"},
]

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <School className="h-6 w-6 text-primary" />
          <span className="sr-only">School Data Insights</span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
             <NavigationMenuItem>
              <Link href="/dashboard" passHref>
                <NavigationMenuLink active={pathname === '/dashboard'} className={navigationMenuTriggerStyle()}>
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Management</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {managementLinks.map((component) => (
                    <ListItem key={component.label} title={component.label} href={component.href} icon={component.icon}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Academics</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {academicLinks.map((component) => (
                    <ListItem key={component.label} title={component.label} href={component.href} icon={component.icon}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
             <NavigationMenuItem>
              <NavigationMenuTrigger>Student Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {studentServicesLinks.map((component) => (
                    <ListItem key={component.label} title={component.label} href={component.href} icon={component.icon}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Operations</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {operationsLinks.map((component) => (
                    <ListItem key={component.label} title={component.label} href={component.href} icon={component.icon}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
             <NavigationMenuItem>
              <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                   {analyticsLinks.map((component) => (
                    <ListItem key={component.label} title={component.label} href={component.href} icon={component.icon}>
                      {component.description}
                    </ListItem>
                  ))}
                  {platformLinks.map((component) => (
                    <ListItem key={component.label} title={component.label} href={component.href} icon={component.icon}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
             <NavigationMenuItem>
               <Link href="/dashboard/settings" passHref>
                <NavigationMenuLink active={pathname === '/dashboard/settings'} className={navigationMenuTriggerStyle()}>
                  Settings
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
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
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
              <School className="h-6 w-6 text-primary" />
              <span className="sr-only">School Data Insights</span>
            </Link>
            {allLinks.map((item) => (
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
  ({ className, title, children, icon: Icon, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={props.href || '/'}
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
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
