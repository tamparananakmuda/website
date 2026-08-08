export interface MindState {
  primaryEmotion: string;
  resilienceScore: number; // 1-10
  crisisDetected: boolean;
  coreDilemma: string;
}

export interface RealityMetrics {
  financialStress: 'low' | 'medium' | 'high' | 'not_applicable';
  careerBurnout: 'low' | 'medium' | 'high' | 'not_applicable';
  socialPressure: 'low' | 'medium' | 'high' | 'not_applicable';
  futureAnxiety: 'low' | 'medium' | 'high' | 'not_applicable';
}

export type CognitiveDistortionType =
  | 'All-or-Nothing Thinking'
  | 'Catastrophizing'
  | 'FOMO-Driven Decision'
  | 'Emotional Reasoning'
  | 'Sandwich Generation Strain'
  | 'Overgeneralization'
  | 'Should Statements'
  | 'Tidak Ada';

export interface DiagnosisResult {
  metrics: RealityMetrics;
  rootCauseAnalysis: string;
  cognitiveDistortion: CognitiveDistortionType; // jebakan logika/bias anak muda
  cognitiveDistortionDescription?: string; // penjelasan bias kognitif
  cognitiveDistortionReframing?: string; // reframe/sudut pandang alternatif yang seimbang
  realityCheckVerdict: string; // tamparan keras realistis
}

export interface ActionStep {
  timeframe: '1x24_hours' | '30_days' | '90_days';
  title: string;
  description: string;
  expectedObstacle: string;
}

export interface CitationRef {
  title: string;
  slug: string;
  type: 'article' | 'series' | 'whitepaper';
  seriesName?: string;
  seriesOrder?: number;
  relevanceExplanation: string;
}

export interface TamiCognitiveResponse {
  mindState: MindState;
  diagnosis: DiagnosisResult;
  actionPlan: ActionStep[];
  citations: CitationRef[];
  conversationalReply: string; // The streamable response
  suggestions?: string[]; // Quick suggestion prompts for user follow-up
  escalationUrl?: string; // WhatsApp or consultation escalation link
}

