
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, BookOpen, BarChart2, ShieldCheck, UserCog, MailPlus, Gavel, HeartHandshake,
  Warehouse, Library, FileText, TrendingUp, ShieldAlert
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';

interface AdminActionCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const AdminActionCard: React.FC<AdminActionCardProps> = ({ href, icon: Icon, title, description }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow rounded-lg flex flex-col">
    <CardHeader>
      <CardTitle className="font-headline text-xl text-primary flex items-center">
        <Icon className="mr-3 h-6 w-6" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col flex-grow">
      <p className="text-sm text-muted-foreground mb-4 flex-grow">{description}</p>
      <Link href={href} className="mt-auto">
        <Button className="w-full">Manage {title}</Button>
      </Link>
    </CardContent>
  </Card>
);

export function PrimaryAdminClient() {
  
  const adminLinks: AdminActionCardProps[] = [
    {
      href: "/dashboard/staff",
      icon: Users,
      title: "Staff Records",
      description: "Manage teacher roles, including Head and Assistant Head Teachers."
    },
    {
      href: "/dashboard/invite-teachers",
      icon: MailPlus,
      title: "Invite Users",
      description: "Invite new teachers and administrative staff to the platform."
    },
    {
      href: "/dashboard/head-teacher",
      icon: BookOpen,
      title: "Academic Oversight",
      description: "Review workbook plans and lesson submissions from teachers."
    },
    {
      href: "/dashboard/reporting",
      icon: BarChart2,
      title: "School-wide Reports",
      description: "Access comprehensive reports on school performance."
    },
    {
      href: "/dashboard/health-safety",
      icon: ShieldAlert,
      title: "Health & Safety",
      description: "Manage school safety protocols and incident reports."
    },
    {
      href: "/dashboard/inventory",
      icon: Warehouse,
      title: "School Inventory",
      description: "Oversee the school's primary assets and inventory."
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Primary Admin Dashboard"
        description="Oversee all administrative tasks and school operations from this central hub."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminLinks.map(link => (
          <AdminActionCard key={link.href} {...link} />
        ))}
      </div>
    </div>
  );
}
