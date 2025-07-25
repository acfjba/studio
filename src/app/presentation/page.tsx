
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
    ArrowRight, BookOpenText, CheckCircle, Home, Library, ShieldCheck, Star, UserCheck, Users, 
    BarChart3, Bell, FileText, UserCog, Settings2, DatabaseZap, GraduationCap, ClipboardList, 
    HeartHandshake, Gavel, Printer, Download, FileSpreadsheet,
    ShieldAlert, Boxes, Building2, Wand2
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
                <h1 className="text-xl font-headline font-bold text-primary-foreground">School Data Insights</h1>
                <Link href="/" passHref>
                    <Button variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90 border-accent">
                        <Home className="mr-2 h-4 w-4" /> Back to App Login
                    </Button>
                </Link>
            </nav>
            <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
                <Slide>
                    <div className="text-center">
                        <h1 className="text-6xl font-headline font-bold text-primary mb-4">School Data Insights</h1>
                        <p className="text-2xl text-foreground">AI-Powered School Management for the Modern Era.</p>
                        <p className="text-muted-foreground mt-4">A Comprehensive, Data-Driven Solution for Fijian Schools</p>
                    </div>
                </Slide>
                
                <Slide>
                    <h2 className="text-4xl font-headline font-bold text-accent mb-6 text-center">Core Features</h2>
                     <p className="text-lg text-foreground mb-8 text-center max-w-3xl mx-auto">An integrated platform that provides tools for every role, from teachers to system administrators, ensuring efficient data management and insightful analytics.</p>
                     <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 text-base">
                        <div className="flex items-start">
                            <Wand2 className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">AI-Powered Tools</p>
                                <p className="text-muted-foreground text-sm">Leverage generative AI to summarize documents, forecast inventory needs, and generate complete, standards-aligned lesson plans, saving valuable time for educators and administrators.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <BarChart3 className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Interactive Dashboards</p>
                                <p className="text-muted-foreground text-sm">Visualize key metrics with role-based dashboards. Monitor academic performance, inventory levels, and KPI reports in an intuitive, easy-to-understand format for data-driven decision making.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Advanced Search & Filtering</p>
                                <p className="text-muted-foreground text-sm">Quickly find the information you need with powerful search and filtering capabilities across all modules, including contacts, staff records, and inventory management.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <ShieldCheck className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Secure Access Control</p>
                                <p className="text-muted-foreground text-sm">Implement a secure, role-based access control system to ensure only authorized users can access sensitive data like API keys, counselling notes, and staff records, maintaining privacy and security.</p>
                            </div>
                        </div>
                    </div>
                </Slide>

                <Slide>
                    <h2 className="text-4xl font-headline font-bold text-accent mb-6 text-center">The Teacher's Toolkit</h2>
                    <p className="text-lg text-foreground mb-8 text-center">A comprehensive digital toolkit designed to streamline daily tasks, enhance planning, and support professional growth by centralizing all core responsibilities.</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-6 text-base">
                        <div className="flex items-start">
                            <ClipboardList className="h-7 w-7 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Comprehensive Planning Suite</p>
                                <p className="text-muted-foreground text-sm">Digitally create, manage, and submit your **Weekly Workbook Plans**, design detailed **Lesson Plans** with objectives and resources, and track your career goals with the **Individual Work Plan (IWP)**. This integrated suite ensures all planning is aligned and easily accessible.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <GraduationCap className="h-7 w-7 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Student Record Management</p>
                                <p className="text-muted-foreground text-sm">Log important student data efficiently and securely. Submit confidential **Counselling Notes**, record **Disciplinary Incidents** with detailed action logs, and enter **Exam Results** directly into the system, ensuring records are always up-to-date and accessible for reporting.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <ShieldAlert className="h-7 w-7 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Health & Safety Reporting</p>
                                <p className="text-muted-foreground text-sm">Conduct and log daily classroom **Health Inspections** and report any **OHS Incidents** immediately using dedicated, easy-to-use forms. This proactive approach helps maintain a safe and healthy school environment for both students and staff.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Users className="h-7 w-7 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Teacher Ratings and Feedback</p>
                                <p className="text-muted-foreground text-sm">Participate in a constructive feedback loop by rating peers and management. The system allows for transparent and fair assessments, fostering a culture of continuous improvement and professional development. View your own rating history at any time.</p>
                            </div>
                        </div>
                    </div>
                </Slide>
                
                <Slide>
                    <h2 className="text-4xl font-headline font-bold text-accent mb-6 text-center">The Head Teacher's Panel</h2>
                     <p className="text-lg text-foreground mb-8 text-center">A powerful command center for school leadership to monitor progress, manage administrative workflows, and assess overall performance with data-driven insights.</p>
                     <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 text-base">
                        <div className="flex items-start">
                            <BarChart3 className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">School Overview & Quick Access</p>
                                <p className="text-muted-foreground text-sm">Get a high-level glance at key school-wide statistics, including workbook submission status, and access shortcuts to all major administrative and record-keeping modules. This central hub streamlines navigation to critical management tasks.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Bell className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Pending Task Management</p>
                                <p className="text-muted-foreground text-sm">Efficiently review, accept, or reject weekly workbook plans submitted by teachers in a centralized, easy-to-manage panel. This ensures timely feedback and keeps academic planning on track across the school.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <FileText className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Generate Detailed Reports</p>
                                <p className="text-muted-foreground text-sm">Analyze teacher submission timeliness with detailed, exportable reports. Identify trends in punctuality and late submissions, and export the data to PDF or Excel (CSV) for record-keeping and staff reviews.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <UserCheck className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Automated Teacher Assessment</p>
                                <p className="text-muted-foreground text-sm">Utilize an automated checklist, populated with live data from across the platform, to track the completion of key administrative tasks for each teacher. Add your own confidential assessment notes to build a comprehensive performance profile.</p>
                            </div>
                        </div>
                    </div>
                </Slide>
                
                 <Slide>
                    <h2 className="text-4xl font-headline font-bold text-accent mb-6 text-center">The Primary Admin's Dashboard</h2>
                    <p className="text-lg text-foreground mb-8 text-center">The central hub for comprehensive school administration, giving you complete control over user management, operational modules, and school-wide data.</p>
                     <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 text-base">
                        <div className="flex items-start">
                            <UserCog className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">User & Staff Management</p>
                                <p className="text-muted-foreground text-sm">A complete interface to manage all staff records. Add, edit, or remove staff members and invite new teachers to the platform with specific role assignments, ensuring your user base is always current.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <GraduationCap className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Total Academic Records Access</p>
                                <p className="text-muted-foreground text-sm">Gain full access to manage all school-wide academic data. This includes overseeing all workbook plans, lesson plans, exam results, and both disciplinary and counselling records from a single, unified interface.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Settings2 className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">School Operations Control</p>
                                <p className="text-muted-foreground text-sm">Oversee all critical operational modules for the school. This includes managing Health & Safety (OHS) incident reports, the full Library Service, and any other day-to-day operational tools configured on the platform.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <DatabaseZap className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Data & Reporting Tools</p>
                                <p className="text-muted-foreground text-sm">Utilize powerful reporting tools to view school-wide Key Performance Indicators (KPIs). Upload bulk data easily using Excel or ZIP files to populate the system efficiently, saving time and reducing manual entry.</p>
                            </div>
                        </div>
                     </div>
                </Slide>

                <Slide>
                     <h2 className="text-4xl font-headline font-bold text-accent mb-6 text-center">Comprehensive Inventory Management</h2>
                     <p className="text-lg text-foreground mb-8 text-center">A dual-system approach to track everything from classroom consumables to high-value school assets, providing a complete financial and operational overview.</p>
                     <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 text-base">
                        <div className="flex items-start">
                            <Boxes className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Classroom Stock Inventory</p>
                                <p className="text-muted-foreground text-sm">Managed by teachers for each year level, this system tracks daily consumables like textbooks, stationery, and supplies. It calculates current stock based on start-of-term quantities, items added, and items lost or damaged, providing a real-time view of classroom resources.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Building2 className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Primary School Inventory</p>
                                <p className="text-muted-foreground text-sm">Overseen by administration, this module manages the school's fixed assets, such as desks, chairs, computers, and projectors. Each item is tracked with its quantity and estimated value, allowing for accurate asset valuation and long-term financial planning.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <BarChart3 className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Aggregated Summary Reports</p>
                                <p className="text-muted-foreground text-sm">Both inventory systems feed into powerful summary reports. View aggregated stock levels across all classrooms to identify school-wide shortages or surpluses. Analyze the total value of all primary assets with detailed charts, providing crucial data for financial reporting and budgeting.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Wand2 className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">AI-Powered Forecasting</p>
                                <p className="text-muted-foreground text-sm">Leverage the power of AI to analyze historical inventory data. The system can forecast future needs for consumables, provide intelligent reorder recommendations, and estimate potential cost savings from proactive management, helping to optimize purchasing and reduce waste.</p>
                            </div>
                        </div>
                    </div>
                </Slide>

                <Slide>
                     <h2 className="text-4xl font-headline font-bold text-accent mb-6 text-center">Specialized Data Modules</h2>
                     <p className="text-lg text-foreground mb-8 text-center">Powerful, dedicated modules for managing critical student and school data with security, detail, and ease of use, ensuring all information is consistent and accessible.</p>
                     <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 text-base">
                        <div className="flex items-start">
                            <Library className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Library Service</p>
                                <p className="text-muted-foreground text-sm">A complete library management system. Catalogue every book, track total vs. available copies in real-time, and manage student and staff loans. The system logs issue dates, due dates, and return status, providing a clear overview of all library activity.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Gavel className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Disciplinary Records</p>
                                <p className="text-muted-foreground text-sm">Log and manage all student disciplinary incidents in a secure, centralized module. Record incident details, specify issues like bullying or vandalism, document actions taken, and track whether parents have been notified, creating a comprehensive and actionable record.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <HeartHandshake className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Counselling Module</p>
                                <p className="text-muted-foreground text-sm">Maintain confidential and detailed records of student counselling sessions. Document session details, create action plans, log follow-ups, and securely record whether parental contact was made, ensuring a complete and private history of student support.</p>
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
                    <h2 className="text-4xl font-headline font-bold text-accent mb-6 text-center">Data Management & Reporting</h2>
                    <p className="text-lg text-foreground mb-8 text-center">Robust, standardized tools for data handling, printing, and exporting are integrated across all modules to ensure your data is always accessible and usable.</p>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 text-base">
                        <div className="flex items-start">
                            <Printer className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Print Forms & Reports</p>
                                <p className="text-muted-foreground text-sm">Generate clean, print-optimized versions of any data entry form or summary report with a single click. This is perfect for physical record-keeping, staff meetings, or offline review where a hard copy is required.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Download className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Save as PDF</p>
                                <p className="text-muted-foreground text-sm">Easily save any form or report as a professional-looking PDF document directly from your browser's print dialog. This ensures universal compatibility for easy sharing and digital archiving.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <FileSpreadsheet className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Export to Excel (CSV)</p>
                                <p className="text-muted-foreground text-sm">Download key data tables, such as exam results, staff lists, or inventory summaries, as CSV files. This allows for advanced analysis and integration with external tools like Excel or Google Sheets.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
                            <div>
                                <p className="font-semibold">Consistent & Reliable Experience</p>
                                <p className="text-muted-foreground text-sm">These standardized export options are available on all major data entry and reporting pages, providing a consistent and reliable user experience. You can always expect to find these tools where you need them most.</p>
                            </div>
                        </div>
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
