import { PageHeader } from "@/components/layout/page-header";
import { StaffClient } from "@/components/staff/staff-client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function StaffPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Staff Records"
        description="Manage all staff information in one place."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </PageHeader>
      <StaffClient />
    </div>
  );
}
