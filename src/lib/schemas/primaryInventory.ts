import * as z from 'zod';

export const PrimaryInventoryItemSchema = z.object({
  id: z.string(),
  itemName: z.string(),
  quantity: z.number(),
  value: z.number(),
  remarks: z.string(),
});

export const PrimaryInventorySchema = z.object({
  items: z.array(PrimaryInventoryItemSchema),
  lastUpdatedBy: z.string(),
  updatedAt: z.string(), // ISO Date String
});

export type PrimaryInventoryItem = z.infer<typeof PrimaryInventoryItemSchema>;
export type PrimaryInventory = z.infer<typeof PrimaryInventorySchema>;

// A more flexible type for local state editing to handle empty inputs
export type EditablePrimaryInventoryItem = Omit<PrimaryInventoryItem, 'quantity' | 'value'> & {
  quantity: number | '';
  value: number | '';
};
