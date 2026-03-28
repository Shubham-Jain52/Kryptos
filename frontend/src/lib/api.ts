// ── Kryptos API Service ──
// Connects to the Spring Boot gateway (Default: Render)

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kryptos-4yrt.onrender.com/api/v1";

// ── Types ──

export interface SearchResult {
  id: string;
  matchScore: string;   // e.g. "98% MATCH"
  hospital: string;
  scanType: string;     // e.g. "MRI", "CT Scan", "X-Ray"
  department: string;   // e.g. "Cardiology"
  lastAccessed: string; // e.g. "2h ago"
  isNew?: boolean;      // true for locally-ingested records
  source?: string;      // "ENCLAVE" | "SIMULATED" | "LIVE_INGEST"
}

export interface TrainingStatus {
  id: string;
  state: "PENDING" | "CONNECTING" | "PUSHING" | "TRAINING" | "EXTRACTING" | "COMPLETE" | "FAILED";
  progress: number;     // 0-100
  log?: string;         // latest log line
  accuracy?: number;
  leakage?: number;
}

export interface IngestPayload {
  hospitalName: string;
  condition: string;
  dataType: string;
  notes?: string;
  fileName?: string;
}

export interface IngestResponse {
  success: boolean;
  message: string;
  vectorId?: string;
}

// ── API Functions ──

export async function searchVectors(query: string): Promise<SearchResult[]> {
  const res = await fetch(`${BASE_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`Search failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.results ?? data;
}

export async function startTraining(vectorIds: string[]): Promise<TrainingStatus> {
  const res = await fetch(`${BASE_URL}/train`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vectorIds }),
  });

  if (!res.ok) {
    throw new Error(`Training init failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function pollTrainingStatus(trainingId: string): Promise<TrainingStatus> {
  const res = await fetch(`${BASE_URL}/train/${trainingId}/status`);

  if (!res.ok) {
    throw new Error(`Polling failed: ${res.status}`);
  }

  return res.json();
}

export async function ingestData(payload: IngestPayload): Promise<IngestResponse> {
  const res = await fetch(`${BASE_URL}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Ingestion failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
