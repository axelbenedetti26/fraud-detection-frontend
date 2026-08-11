export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://fraud-detection-api-opiv.onrender.com";

export type TxnType = "TRANSFER" | "CASH_OUT" | "PAYMENT" | "CASH_IN" | "DEBIT";

export interface TransactionInput {
  type: TxnType;
  amount: number;
  oldbalanceOrg: number;
  newbalanceOrig: number;
  oldbalanceDest: number;
  newbalanceDest: number;
  dest_txn_history: number;
  hour_of_day: number;
}

export interface PredictionResult {
  fraud_score: number;
  model_flag: boolean;
  static_rule_flag: boolean;
  flags_agree: boolean;
  decision_threshold: number;
}

export interface ModelInfo {
  model_type: string;
  trained_at: string;
  n_train: number;
  n_test: number;
  fraud_rate_train: number;
  fraud_rate_test: number;
  features: string[];
  decision_threshold: number;
  static_rule: {
    description: string;
    threshold_usd: number;
    recall: number;
    precision: number;
    true_positives: number;
    false_positives: number;
    false_negatives: number;
    true_negatives: number;
  };
  model_metrics: {
    auc: number;
    average_precision: number;
    recall: number;
    precision: number;
    accuracy: number;
    true_positives: number;
    false_positives: number;
    false_negatives: number;
    true_negatives: number;
  };
  model_vs_rule_agreement_rate: number;
  feature_importances: Record<string, number>;
}

export async function predictTransaction(
  input: TransactionInput,
  signal?: AbortSignal
): Promise<PredictionResult> {
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${detail}`);
  }
  return res.json();
}

export async function fetchModelInfo(signal?: AbortSignal): Promise<ModelInfo> {
  const res = await fetch(`${API_URL}/model-info`, { signal });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function pingHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { signal });
    return res.ok;
  } catch {
    return false;
  }
}
