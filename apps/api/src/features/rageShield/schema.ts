import { z } from 'zod';

export const rageShieldRequestSchema = z.object({
  content: z.string().trim().min(1).max(6000),
  draftReply: z.string().trim().max(2000).optional(),
  conversation: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(1500),
      }),
    )
    .max(6)
    .optional(),
});

const signalSchema = z.object({
  type: z.string().min(1).max(80),
  evidence: z.string().min(1).max(500),
  explanation: z.string().min(1).max(700),
  alternativeExplanation: z.string().min(1).max(500),
  limitation: z.string().min(1).max(500),
});

export const rageShieldAnalysisSchema = z.object({
  riskLevel: z.enum([
    'many_signals',
    'some_signals',
    'insufficient_information',
    'no_clear_signals',
    'information_concerns',
  ]),
  summary: z.string().min(1).max(1000),
  signals: z.array(signalSchema).max(5),
  pausePrompt: z.string().min(1).max(500),
  verificationSteps: z.array(z.string().min(1).max(400)).min(1).max(4),
  recommendedActions: z.array(z.string().min(1).max(400)).min(1).max(4),
  replySuggestion: z.string().min(1).max(1000).nullable(),
  limitations: z.array(z.string().min(1).max(500)).min(1).max(4),
});

export type RageShieldRequest = z.infer<typeof rageShieldRequestSchema>;
export type RageShieldAnalysis = z.infer<typeof rageShieldAnalysisSchema>;
