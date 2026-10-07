export interface PredictionResult {
  predicted_class: string;
  full_name: string;
  confidence: number;
  confidence_percent: number;
  probabilities: Record<string, number>;
  low_confidence: boolean;
}

export interface ExplanationResponse { explanation: string; }
export interface AskResponse { answer: string; }

export interface ApiError {
  detail?: string;
}