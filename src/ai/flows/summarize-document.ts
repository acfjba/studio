'use server';

/**
 * @fileOverview AI-powered document summarization flow.
 *
 * - summarizeDocument - A function that summarizes documents, extracting key insights.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the document to be summarized.'),
  documentType: z
    .string()
    .describe(
      'The type of document, such as counselling session notes or staff records.'
    ),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe('A summary of the document.'),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

const decideInformationToIncludeTool = ai.defineTool(
  {
    name: 'decideInformationToInclude',
    description: 'Decides what information to include in the summary.',
    inputSchema: z.object({
      documentContent: z
        .string()
        .describe('The content of the document to be summarized.'),
      documentType: z
        .string()
        .describe(
          'The type of document, such as counselling session notes or staff records.'
        ),
    }),
    outputSchema: z
      .string()
      .describe('A list of specific key information to include'),
  },
  async (input) => {
    // Placeholder: Replace with actual implementation to decide what information to include.
    return `List of key information based on document type ${input.documentType} and content: ${input.documentContent}`;
  }
);

const summarizeDocumentPrompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: {schema: SummarizeDocumentInputSchema},
  output: {schema: SummarizeDocumentOutputSchema},
  tools: [decideInformationToIncludeTool],
  prompt: `You are an AI assistant that summarizes documents. The document type is {{{documentType}}}.

  First, use the decideInformationToInclude tool to determine the important information to include in the summary.

  Then, summarize the following document content, focusing on the key information identified by the tool:

  Document Content: {{{documentContent}}}

  Summary:`, // Use Handlebars syntax to reference input fields
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async input => {
    const {output} = await summarizeDocumentPrompt(input);
    return output!;
  }
);

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}
