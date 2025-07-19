import { PageHeader } from "@/components/layout/page-header";
import { ContactsClient } from "@/components/contacts/contacts-client";
import { Users } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="School Contacts Directory"
        description="A directory of all staff members across the schools."
      />
      <ContactsClient />
    </div>
  );
}
