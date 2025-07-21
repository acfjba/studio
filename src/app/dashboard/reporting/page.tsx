
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, FileText, ShieldCheck, Wifi } from "lucide-react";
import Link from "next/link";

export default function ReportingPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Reporting & Analytics"
        description="Generate and view detailed reports on school performance and platform status."
      />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <FileText className="w-5 h-5 text-primary" /> Custom Reports
                </CardTitle>
                <CardDescription>
                    Build and save custom reports based on your needs.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Button disabled>Generate Custom Report</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
