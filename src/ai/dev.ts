import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-customer-sentiment.ts';
import '@/ai/flows/suggest-trending-products.ts';
import '@/ai/flows/generate-business-report.ts';
import '@/ai/flows/recommend-products.ts';
import '@/ai/flows/find-product-opportunities.ts';
import '@/ai/flows/summarize-market-data.ts';
