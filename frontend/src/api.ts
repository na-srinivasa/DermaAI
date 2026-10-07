import axios from "axios";
import type { AskResponse, ExplanationResponse, PredictionResult } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: API_URL,
  timeout: 120000,
});

export async function predictImage(file: File): Promise<PredictionResult> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await client.post<PredictionResult>("/predict", form);
  return data;
}

export async function getExplanation(
  prediction: PredictionResult,
  language: string
): Promise<ExplanationResponse> {
  const { data } = await client.post<ExplanationResponse>("/explain", {
    predicted_class: prediction.predicted_class,
    full_name: prediction.full_name,
    confidence: prediction.confidence,
    language,
  });
  return data;
}

export async function askGemini(
  prediction: PredictionResult,
  language: string,
  question: string
): Promise<AskResponse> {
  const { data } = await client.post<AskResponse>("/ask", {
    predicted_class: prediction.predicted_class,
    full_name: prediction.full_name,
    confidence: prediction.confidence,
    language,
    question,
  });
  return data;
}

export async function healthCheck(): Promise<boolean> {
  try {
    await client.get("/health");
    return true;
  } catch {
    return false;
  }
}