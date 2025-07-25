
import * as z from 'zod';

export const InventoryItemSchema = z.object({
  id: z.string(),
  itemName: z.string().min(1, "Item name is required."),
  quantityStart: z.number().int().nonnegative("Quantity must be a positive number."),
  quantityAdded: z.number().int().nonnegative("Quantity must be a positive number."),
  quantityLost: z.number().int().nonnegative("Quantity must be a positive number."),
  remarks: z.string().optional(),
});

export const ClassroomInventorySchema = z.object({
  // The document ID will be the yearLevel, e.g., "101"
  yearLevel: z.number().int(),
  term: z.string(),
  items: z.array(InventoryItemSchema),
  lastUpdatedBy: z.string(), // Should be a User ID
  updatedAt: z.string(), // ISO Date String
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;
export type ClassroomInventory = z.infer<typeof ClassroomInventorySchema>;

// A more flexible type for local state editing to handle empty string inputs before conversion
export type EditableInventoryItem = Omit<InventoryItem, 'quantityStart' | 'quantityAdded' | 'quantityLost'> & {
  quantityStart: string;
  quantityAdded: string;
  quantityLost: string;
};
