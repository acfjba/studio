import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, BarChart2, ShieldCheck } from "lucide-react";

export default function SchoolManagementPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="School Management"
        description="Oversee all administrative tasks for your school."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Users className="w-5 h-5 text-primary" /> Teachers' Management</CardTitle>
            <CardDescription>Manage teacher roles, including Head and Assistant Head Teachers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Manage Teachers</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><BookOpen className="w-5 h-5 text-primary" /> Academic Oversight</CardTitle>
            <CardDescription>Review workbook plans and lesson submissions from teachers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Review Submissions</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><BarChart2 className="w-5 h-5 text-primary" /> School-wide Reports</CardTitle>
            <CardDescription>Access comprehensive reports on school performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>View Reports</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><ShieldCheck className="w-5 h-5 text-primary" /> Health & Safety</CardTitle>
            <CardDescription>Manage school safety protocols and incident reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Manage H&S</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
