import { z } from 'zod';
import { postJson } from '../../services/apiClient';

const analysisSchema = z.object({
  riskLevel: z.enum(['many_signals', 'some_signals', 'insufficient_information', 'no_clear_signals', 'information_concerns']),
  summary: z.string(),
  signals: z.array(z.object({ type: z.string(), evidence: z.string(), explanation: z.string(), alternativeExplanation: z.string(), limitation: z.string() })),
  pausePrompt: z.string(),
  verificationSteps: z.array(z.string()),
  recommendedActions: z.array(z.string()),
  replySuggestion: z.string().nullable(),
  limitations: z.array(z.string()),
});

const responseSchema = z.object({ data: analysisSchema });
export type RageShieldAnalysis = z.infer<typeof analysisSchema>;
export type RageShieldConversationMessage = { role: 'user' | 'assistant'; content: string };

export function analyzeRageShield(
  content: string,
  draftReply: string,
  conversation: RageShieldConversationMessage[],
) {
  return postJson(
    '/rage-shield/analyze',
    { content, ...(draftReply.trim() ? { draftReply } : {}), ...(conversation.length ? { conversation } : {}) },
    responseSchema,
  ).then((response) => response.data);
}
