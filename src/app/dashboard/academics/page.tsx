
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Boxes, FileText, ClipboardCheck, ArrowLeft, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function AcademicsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Academics"
        description="Manage lesson plans, classroom inventory, and academic records."
      >
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><BookOpen className="w-5 h-5 text-primary" /> AI Workbook Plan</CardTitle>
            <CardDescription>Generate, view, and manage lesson plans for your classes using AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/workbook-plan">
              <Button>Generate with AI</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Boxes className="w-5 h-5 text-primary" /> Classroom Inventory</CardTitle>
            <CardDescription>Track and manage stock levels for classroom supplies.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/academics/classroom-inventory">
              <Button>Manage Inventory</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><ClipboardCheck className="w-5 h-5 text-primary" /> Exam Results</CardTitle>
            <CardDescription>Record and manage student exam results and grades.</CardDescription>
          </CardHeader>
          <CardContent>
             <Link href="/dashboard/academics/exam-results">
              <Button>Manage Exam Results</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><BarChart2 className="w-5 h-5 text-primary" /> Exam Summary</CardTitle>
            <CardDescription>View aggregated school-wide exam performance reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/academics/exam-summary">
              <Button>View Summary</Button>
            </Link>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><FileText className="w-5 h-5 text-primary" /> Student Records</CardTitle>
            <CardDescription>Access and update student performance and records.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/academics/student-records">
              <Button>View Student Records</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
