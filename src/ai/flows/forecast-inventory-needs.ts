
'use server';

/**
 * @fileOverview Predicts future inventory needs based on historical data.
 *
 * - forecastInventoryNeeds - A function that forecasts inventory needs.
 * - ForecastInventoryNeedsInput - The input type for the forecastInventoryNeeds function.
 * - ForecastInventoryNeedsOutput - The return type for the forecastInventoryNeeds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InventoryDataSchema = z.array(
  z.object({
    item: z.string().describe('The name of the inventory item.'),
    quantity: z.number().describe('The quantity of the item.'),
    unitCost: z.number().describe('The unit cost of the item.'),
    usageRate: z.number().describe('The average usage rate per month.'),
    reorderPoint: z.number().describe('The reorder point for the item.'),
  })
).describe('Array of inventory items with their quantities, unit costs, usage rates and reorder points.');

const ForecastInventoryNeedsInputSchema = z.object({
  inventoryData: InventoryDataSchema,
  forecastMonths: z.number().describe('The number of months to forecast for.'),
  desiredConfidenceLevel: z.number().describe('The desired confidence level for the forecast (0-1).'),
});
export type ForecastInventoryNeedsInput = z.infer<typeof ForecastInventoryNeedsInputSchema>;

const ForecastInventoryNeedsOutputSchema = z.array(
  z.object({
    item: z.string().describe('The name of the inventory item.'),
    projectedNeed: z.number().describe('The projected need for the item over the forecast period.'),
    reorderRecommendation: z.string().describe('A recommendation on when to reorder the item.'),
    estimatedCostSavings: z.number().describe('The estimated cost savings from proactive management.'),
  })
).describe('Array of projected inventory needs for each item.');
export type ForecastInventoryNeedsOutput = z.infer<typeof ForecastInventoryNeedsOutputSchema>;

export async function forecastInventoryNeeds(input: ForecastInventoryNeedsInput): Promise<ForecastInventoryNeedsOutput> {
  return forecastInventoryNeedsFlow(input);
}

const analyzeInventoryDataTool = ai.defineTool(
  {
    name: 'analyzeInventoryData',
    description:
      'Analyzes inventory data to identify trends and predict future needs.',
    inputSchema: z.object({
      inventoryData: InventoryDataSchema,
      forecastMonths: z.number().describe('The number of months to forecast for.'),
      desiredConfidenceLevel: z
        .number()
        .describe('The desired confidence level for the forecast (0-1).'),
    }),
    outputSchema: z.any(),
  },
  async (input) => {
    // Placeholder implementation for inventory analysis
    // In a real application, this would involve more sophisticated calculations
    return `Detailed analysis of inventory data for ${input.forecastMonths} months with a confidence level of ${input.desiredConfidenceLevel}.`;
  }
);

const prompt = ai.definePrompt({
  name: 'forecastInventoryNeedsPrompt',
  tools: [analyzeInventoryDataTool],
  input: {schema: ForecastInventoryNeedsInputSchema},
  output: {schema: ForecastInventoryNeedsOutputSchema},
  prompt: `You are an AI assistant that analyzes inventory data and predicts future needs for schools.

  Analyze the provided inventory data to forecast needs for the next {{forecastMonths}} months.
  Use the analyzeInventoryData tool to get a detailed analysis.
  Based on the analysis, provide a list of projected inventory needs for each item, reorder recommendations, and estimated cost savings from proactive management.

  Here is the inventory data:
  {{#each inventoryData}}
  - Item: {{this.item}}, Quantity: {{this.quantity}}, Unit Cost: {{this.unitCost}}, Usage Rate: {{this.usageRate}}, Reorder Point: {{this.reorderPoint}}
  {{/each}}
  Confidence Level: {{desiredConfidenceLevel}}

  Make sure to include reorderRecommendation and estimatedCostSavings in the output.
`,
});

const forecastInventoryNeedsFlow = ai.defineFlow(
  {
    name: 'forecastInventoryNeedsFlow',
    inputSchema: ForecastInventoryNeedsInputSchema,
    outputSchema: ForecastInventoryNeedsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
