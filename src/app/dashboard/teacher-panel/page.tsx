"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ClipboardList,
  ClipboardEdit,
  FileText,
  Gavel,
  HeartHandshake,
  ShieldAlert,
  ClipboardCheck,
  Boxes
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';

interface TeacherLinkItem {
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

const teacherLinks: TeacherLinkItem[] = [
  { label: "AI Workbook Plan", href: "/dashboard/workbook-plan", icon: ClipboardList, description: "Generate and submit your weekly workbook plans using AI." },
  { label: "Individual Work Plan (IWP)", href: "/dashboard/iwp", icon: ClipboardEdit, description: "Set and track your professional development goals." },
  { label: "Lesson Planner", href: "/dashboard/lesson-planner", icon: FileText, description: "Create detailed lesson plans for your subjects." },
  { label: "Disciplinary Records", href: "/dashboard/disciplinary", icon: Gavel, description: "Log and track student disciplinary incidents." },
  { label: "Counselling Records", href: "/dashboard/counselling", icon: HeartHandshake, description: "Maintain confidential counselling session records." },
  { label: "OHS Incident Reporting", href: "/dashboard/health-safety", icon: ShieldAlert, description: "Log OHS incidents for your class." },
  { label: "Exam Results Management", href: "/dashboard/academics/exam-results", icon: ClipboardCheck, description: "Record and manage student exam results." },
  { label: "Classroom Inventory", href: "/dashboard/academics/classroom-inventory", icon: Boxes, description: "Manage stock levels of classroom supplies." },
];

export default function TeacherPanelPage() {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-8">
        <PageHeader 
          title="Teacher Panel"
          description="Your dedicated panel with quick access to all essential teaching modules."
        >
          <Tooltip>
              <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                      <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
              </TooltipTrigger>
              <TooltipContent>
                  <p className="max-w-xs">This is your dedicated panel with quick access to all essential teaching modules.</p>
              </TooltipContent>
          </Tooltip>
        </PageHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacherLinks.map(item => {
            const ItemIcon = item.icon;
            return (
              <Card key={item.href} className="shadow-lg hover:shadow-xl transition-shadow rounded-lg flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary flex items-center">
                    <ItemIcon className="mr-3 h-6 w-6" />
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{item.description}</p>
                  <Link href={item.href} className="mt-auto">
                    <Button className="w-full">
                      Go to {item.label}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
