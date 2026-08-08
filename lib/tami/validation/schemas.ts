import { z } from 'zod';

// ─── Primitives ──────────────────────────────────────────────

const metricLevel = z.enum(['low', 'medium', 'high', 'not_applicable']);

const cognitiveDistortionType = z.enum([
  'All-or-Nothing Thinking',
  'Catastrophizing',
  'FOMO-Driven Decision',
  'Emotional Reasoning',
  'Sandwich Generation Strain',
  'Overgeneralization',
  'Should Statements',
  'Tidak Ada',
]);

const timeframe = z.enum(['1x24_hours', '30_days', '90_days']);

// ─── Schemas ─────────────────────────────────────────────────

export const mindStateSchema = z.object({
  primaryEmotion: z.string().min(1),
  resilienceScore: z.number().min(1).max(10),
  crisisDetected: z.boolean(),
  coreDilemma: z.string(),
});

export const diagnosisSchema = z.object({
  metrics: z.object({
    financialStress: metricLevel,
    careerBurnout: metricLevel,
    socialPressure: metricLevel,
    futureAnxiety: metricLevel,
  }),
  rootCauseAnalysis: z.string(),
  cognitiveDistortion: cognitiveDistortionType,
  cognitiveDistortionDescription: z.string().optional().default(''),
  cognitiveDistortionReframing: z.string().optional().default(''),
  realityCheckVerdict: z.string(),
});

export const cognitiveAnalysisSchema = z.object({
  mindState: mindStateSchema,
  diagnosis: diagnosisSchema,
});

export const actionStepSchema = z.object({
  timeframe: timeframe,
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  expectedObstacle: z.string().max(500).optional().default(''),
});

export const actionPlanResponseSchema = z.object({
  actionPlan: z.array(actionStepSchema).min(1),
});

export const verifierOutputSchema = z.object({
  analystCritique: z.string().min(1),
  knowledgeIntegration: z.string().min(1),
  actionPlan: z.array(actionStepSchema).min(1),
});

export const rerankResponseSchema = z.object({
  rankedIndices: z.array(z.number().int().min(0)).min(1),
});

// ─── User Input Validation ───────────────────────────────────

export const userInputSchema = z.object({
  query: z.string()
    .min(3, 'Query terlalu pendek (minimum 3 karakter)')
    .max(2000, 'Query terlalu panjang (maksimum 2000 karakter)')
    .refine(q => !/^(\s)\1{10,}/.test(q), 'Query tidak boleh berisi whitespace berlebihan')
    .refine(q => !/(.)\1{20,}/.test(q), 'Query mengandung karakter berulang berlebihan'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(5000),
  })).max(20, 'History terlalu panjang (maksimum 20 pesan)').optional().default([]),
});

// ─── Types ───────────────────────────────────────────────────

export type CognitiveAnalysis = z.infer<typeof cognitiveAnalysisSchema>;
export type ActionPlanResponse = z.infer<typeof actionPlanResponseSchema>;
export type VerifierOutput = z.infer<typeof verifierOutputSchema>;
