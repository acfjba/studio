import { PageHeader } from "@/components/layout/page-header";
import { InventoryClient } from "@/components/inventory/inventory-client";

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Inventory Management"
        description="Track, manage, and forecast your school's inventory needs."
      />
      <InventoryClient />
    </div>
  );
}
