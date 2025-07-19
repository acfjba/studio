import { PageHeader } from "@/components/layout/page-header";
import { LibraryClient } from "@/components/library/library-client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Library Management"
        description="Manage your school's library collection and loans."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </PageHeader>
      <LibraryClient />
    </div>
  );
}
