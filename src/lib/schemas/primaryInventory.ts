
import * as z from 'zod';

export const PrimaryInventoryItemSchema = z.object({
  id: z.string(),
  itemName: z.string().min(1, "Item name is required."),
  quantity: z.number().int().nonnegative(),
  value: z.number().nonnegative(), // Monetary value per item
  remarks: z.string().optional(),
  lastUpdatedBy: z.string(), // User ID
  updatedAt: z.string(), // ISO Date String
  createdAt: z.string(), // ISO Date String
});

export const PrimaryInventorySchema = z.object({
  items: z.array(PrimaryInventoryItemSchema),
});

export type PrimaryInventoryItem = z.infer<typeof PrimaryInventoryItemSchema>;
export type PrimaryInventory = z.infer<typeof PrimaryInventorySchema>;

// A more flexible type for local state editing to handle empty inputs
export type EditablePrimaryInventoryItem = Omit<PrimaryInventoryItem, 'quantity' | 'value' | 'lastUpdatedBy' | 'updatedAt' | 'createdAt'> & {
  quantity: string;
  value: string;
};
