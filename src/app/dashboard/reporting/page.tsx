import { PageHeader } from "@/components/layout/page-header";
import { ReportingClient } from "@/components/reporting/reporting-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, FileText } from "lucide-react";
import Link from "next/link";


export default function ReportingPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Reporting & Analytics"
        description="Generate and view detailed reports on school performance."
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
      <ReportingClient />
    </div>
  );
}
