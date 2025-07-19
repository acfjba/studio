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
