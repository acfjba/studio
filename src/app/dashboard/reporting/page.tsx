
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, FileText, ShieldCheck, Wifi, BookCheck, Users, Warehouse, Settings2 } from "lucide-react";
import Link from "next/link";

export default function ReportingPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Reporting & Analytics"
        description="Generate and view detailed reports on school performance and platform status."
      />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Settings2 className="w-5 h-5 text-primary" /> Custom Report Generator
                </CardTitle>
                <CardDescription>
                    Build your own report by selecting from various data sources across the platform.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/dashboard/reporting/custom-report-generator">
                        <Button>Build Custom Report</Button>
                    </Link>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <BookCheck className="w-5 h-5 text-primary" /> Academic Reports
                </CardTitle>
                <CardDescription>
                    Generate reports on student performance, exam results, and subject analytics.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/dashboard/reporting/academic-reports">
                        <Button>Generate Academic Report</Button>
                    </Link>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Warehouse className="w-5 h-5 text-primary" /> Inventory Reports
                </CardTitle>
                <CardDescription>
                    View reports on stock levels, usage, and value of school inventory.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/dashboard/reporting/inventory-reports">
                        <Button>Generate Inventory Report</Button>
                    </Link>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Users className="w-5 h-5 text-primary" /> Staff Reports
                </CardTitle>
                <CardDescription>
                    Create reports on staff attendance, roles, and performance metrics.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/dashboard/reporting/staff-reports">
                        <Button>Generate Staff Report</Button>
                    </Link>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <TrendingUp className="w-5 h-5 text-primary" /> KPI Reports
                </CardTitle>
                <CardDescription>
                    Visual overview of school Key Performance Indicators.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/dashboard/reporting/kpi" passHref>
                        <Button>View KPI Reports</Button>
                    </Link>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <ShieldCheck className="w-5 h-5 text-primary" /> KPI Self-Assessment
                </CardTitle>
                <CardDescription>
                    Submit your own Key Performance Indicator self-assessment.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/dashboard/reporting/kpi-self-assessment" passHref>
                        <Button>Submit Assessment</Button>
                    </Link>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Wifi className="w-5 h-5 text-primary" /> Platform Status
                </CardTitle>
                <CardDescription>
                    Monitor school connectivity, latency, and data I/O analysis.
                </CardDescription>
                </CardHeader>
                <CardContent>
                 <Link href="/dashboard/reporting/platform-status" passHref>
                    <Button>View Platform Status</Button>
                  </Link>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
