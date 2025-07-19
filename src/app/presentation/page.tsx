
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
    ArrowRight, BookOpenText, CheckCircle, Home, Library, ShieldCheck, Star, UserCheck, Users, 
    BarChart3, Bell, FileText, UserCog, Settings2, DatabaseZap, GraduationCap, ClipboardEdit, 
    HeartHandshake, Gavel, HeartPulse, ClipboardList, Printer, Download, FileSpreadsheet,
    ShieldAlert, Boxes
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Slide = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <section className={cn("h-screen w-full flex flex-col items-center justify-center p-8 snap-start", className)}>
        <Card className="w-full max-w-4xl bg-background/95 backdrop-blur-sm shadow-2xl overflow-hidden border-2 border-accent/50">
            <CardContent className="p-8 md:p-12">
                {children}
            </CardContent>
        </Card>
    </section>
);

export default function PresentationPage() {
    return (
        <div className="font-body bg-background">
             <nav className="fixed top-0 left-0 w-full bg-primary/90 backdrop-blur-sm z-10 p-4 flex justify-between items-center shadow-lg">
                <h1 className="text-xl font-headline font-bold text-primary-foreground">App Presentation</h1>
                <Link href="/" passHref>
                    <Button variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90 border-accent">
                        <Home className="mr-2 h-4 w-4" /> Back to Home
                    </Button>
                </Link>
            </nav>
            <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
                <Slide>
                    <div className="text-center">
                        <h1 className="text-6xl font-headline font-bold text-primary mb-4">Digital Platform for Schools</h1>
                        <p className="text-2xl text-foreground">Empowering School Management with Modern, Efficient Tools.</p>
                        <p className="text-muted-foreground mt-4">A Comprehensive Solution for Fijian Schools</p>
                    </div>
                </Slide>

                <Slide>
                    <h2 className="text-4xl font-headline font-bold text-accent mb-6 text-center">The Teacher's Toolkit</h2>
                    <p className="text-lg text-foreground mb-8 text-center">A comprehensive digital toolkit designed to streamline daily tasks, enhance planning, and support professional growth.</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-6 text-base">
                        <div className="flex items-start">
                            <ClipboardList className="h-7 w-7 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Comprehensive Planning Suite</p>
                                <p className="text-muted-foreground text-sm">Digitally create, manage, and submit your **Weekly Workbook Plans**, design detailed **Lesson Plans** with objectives and resources, and track your career goals with the **Individual Work Plan (IWP)**.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <GraduationCap className="h-7 w-7 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Student Record Management</p>
                                <p className="text-muted-foreground text-sm">Log important student data efficiently. Submit confidential **Counselling Notes**, record **Disciplinary Incidents**, and enter **Exam Results** directly into the system, ensuring records are always up-to-date.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <ShieldAlert className="h-7 w-7 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Health &amp; Safety Reporting</p>
                                <p className="text-muted-foreground text-sm">Conduct and log daily classroom **Health Inspections** and report any **OHS Incidents** immediately using dedicated, easy-to-use forms to maintain a safe and healthy school environment.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Boxes className="h-7 w-7 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Resource &amp; Inventory Management</p>
                                <p className="text-muted-foreground text-sm">Manage your **Classroom Inventory** by tracking textbooks, stationery, and other supplies. View the full **Library Catalogue** and manage book check-outs and returns seamlessly.</p>
                            </div>
                        </div>
                    </div>
                </Slide>
                
                <Slide>
                    <h2 className="text-4xl font-headline font-bold text-accent mb-6">The Head Teacher's Panel</h2>
                     <p className="text-lg text-foreground mb-6">A powerful command center for school leadership to monitor progress, manage tasks, and assess performance.</p>
                     <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-lg">
                        <div className="flex items-start"><BarChart3 className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><p><span className="font-semibold">School Overview:</span> Get a quick glance at key statistics for submissions and school activity.</p></div>
                        <div className="flex items-start"><Bell className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><p><span className="font-semibold">Pending Tasks:</span> Review and approve weekly workbook plans submitted by teachers in a centralized panel.</p></div>
                        <div className="flex items-start"><FileText className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><p><span className="font-semibold">Generate Reports:</span> Analyze teacher submission timeliness and export detailed reports.</p></div>
                        <div className="flex items-start"><UserCheck className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><p><span className="font-semibold">Teacher Assessment:</span> Use an automated checklist to track the completion of key administrative tasks for each teacher.</p></div>
                    </div>
                </Slide>
                
                 <Slide>
                    <h2 className="text-4xl font-headline font-bold text-accent mb-6">The Primary Admin's Dashboard</h2>
                    <p className="text-lg text-foreground mb-6">The central hub for comprehensive school administration, from user management to operational oversight.</p>
                     <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-lg">
                        <div className="flex items-start"><UserCog className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><p><span className="font-semibold">User Management:</span> Maintain staff records, manage user accounts, and send invitations to new teachers.</p></div>
                        <div className="flex items-start"><GraduationCap className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><p><span className="font-semibold">Academic Records:</span> Access and manage all academic data, including exam results, disciplinary records, and counselling notes.</p></div>
                        <div className="flex items-start"><Settings2 className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><p><span className="font-semibold">School Operations:</span> Oversee Health Inspections, OHS reports, and the complete Library Service module.</p></div>
                        <div className="flex items-start"><DatabaseZap className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><p><span className="font-semibold">Data &amp; Reports:</span> Upload bulk data via Excel/ZIP, and view platform-wide KPI reports for data-driven decisions.</p></div>
                     </div>
                </Slide>

                <Slide>
                     <h2 className="text-4xl font-headline font-bold text-accent mb-6 text-center">Specialized Data Modules</h2>
                     <p className="text-lg text-foreground mb-8 text-center">Powerful, dedicated modules for managing critical student and school data with security and detail.</p>
                     <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 text-base">
                        <div className="flex items-start">
                            <Library className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Library Service</p>
                                <p className="text-muted-foreground text-sm">A complete library management system. Catalogue every book, track total vs. available copies, and manage student and staff loans. The system logs issue dates, due dates, and return status, providing a clear overview of all library activity.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Gavel className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Disciplinary Records</p>
                                <p className="text-muted-foreground text-sm">Log and manage all student disciplinary incidents in a secure, centralized module. Record incident details, specify issues like bullying or vandalism, document actions taken, and track whether parents have been notified.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <HeartHandshake className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Counselling Module</p>
                                <p className="text-muted-foreground text-sm">Maintain confidential and detailed records of student counselling sessions. Document session details, create action plans, log follow-ups, and securely record whether parental contact was made, ensuring a complete history of student support.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <BookOpenText className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Exam Results Tracking</p>
                                <p className="text-muted-foreground text-sm">A robust system for recording and analyzing student academic performance. Enter scores or grades for various exam types (LANA, Trials, etc.), track results by subject, term, and year, and generate reports to monitor academic progress over time.</p>
                            </div>
                        </div>
                    </div>
                </Slide>

                <Slide>
                    <h2 className="text-4xl font-headline font-bold text-accent mb-6">Data Management &amp; Reporting</h2>
                    <p className="text-lg text-foreground mb-6">Robust tools for data handling, printing, and exporting across all modules.</p>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-lg">
                        <div className="flex items-start"><Printer className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><p><span className="font-semibold">Print Forms:</span> Generate clean, printable versions of any form for physical records or review.</p></div>
                        <div className="flex items-start"><Download className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><p><span className="font-semibold">Save as PDF:</span> Easily save any form or report as a PDF document directly from your browser's print dialog.</p></div>
                        <div className="flex items-start"><FileSpreadsheet className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><p><span className="font-semibold">Export to Excel:</span> Download key data like reports and inventories as CSV files for use in Excel or other spreadsheet software.</p></div>
                        <div className="flex items-start"><CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><p><span className="font-semibold">Consistent &amp; Reliable:</span> Standardized export options are available on all major data entry and reporting pages.</p></div>
                    </div>
                </Slide>

                <Slide>
                    <div className="text-center">
                        <h2 className="text-5xl font-headline font-bold text-primary mb-6">Thank You</h2>
                        <p className="text-xl text-foreground mb-8">Streamlining school operations, one click at a time.</p>
                        <Link href="/" passHref>
                            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                                Proceed to App Login <ArrowRight className="ml-2 h-5 w-5"/>
                            </Button>
                        </Link>
                    </div>
                </Slide>
            </div>
        </div>
    );
}
