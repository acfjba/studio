import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-document.ts';
import '@/ai/flows/forecast-inventory-needs.ts';
import '@/ai/flows/generate-lesson-plan.ts';
