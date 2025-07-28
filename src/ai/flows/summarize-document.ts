export interface SummarizeDocumentOutput {
  summary: string;
}

/**
 * Summarize a long document into a short summary.
 * TODO: wire up your AI backend here.
 */
export async function summarizeDocument(
  text: string
): Promise<SummarizeDocumentOutput> {
  // placeholder implementation
  return { summary: text.slice(0, 200) + (text.length > 200 ? '…' : '') };
}
