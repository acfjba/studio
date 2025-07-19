import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Boxes, FileText, ClipboardCheck } from "lucide-react";
import Link from "next/link";

export default function AcademicsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Academics"
        description="Manage lesson plans, classroom inventory, and academic records."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><BookOpen className="w-5 h-5 text-primary" /> Lesson Planning</CardTitle>
            <CardDescription>Create, view, and manage lesson plans for your classes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled>Manage Lesson Plans</Button>
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
            <CardTitle className="flex items-center gap-2 font-headline"><FileText className="w-5 h-5 text-primary" /> Student Records</CardTitle>
            <CardDescription>Access and update student performance and records.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button disabled>View Student Records</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
