import * as z from 'zod';

export const InventoryItemSchema = z.object({
  id: z.string(),
  itemName: z.string(),
  quantityStart: z.number(),
  quantityAdded: z.number(),
  quantityLost: z.number(),
  remarks: z.string(),
});

export const ClassroomInventorySchema = z.object({
  yearLevel: z.number(),
  term: z.string(),
  items: z.array(InventoryItemSchema),
  lastUpdatedBy: z.string(),
  updatedAt: z.string(), // ISO Date String
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;
export type ClassroomInventory = z.infer<typeof ClassroomInventorySchema>;

// A more flexible type for local state editing to handle empty inputs
export type EditableInventoryItem = Omit<InventoryItem, 'quantityStart' | 'quantityAdded' | 'quantityLost'> & {
  quantityStart: number | '';
  quantityAdded: number | '';
  quantityLost: number | '';
};
