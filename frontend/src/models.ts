/** Model catalogue shown in the header dropdown and the Settings dialog. */

export type ModelInfo = {
  id: string;
  name: string;
  tagline: string;
  inputPrice?: string;
  outputPrice?: string;
  reasoning: boolean;
  tier: "frontier" | "other";
};

export const MODELS: ModelInfo[] = [
  {
    id: "gpt-5.6-sol",
    name: "GPT-5.6 Sol",
    tagline: "Frontier model for complex professional work",
    inputPrice: "$5",
    outputPrice: "$30",
    reasoning: true,
    tier: "frontier",
  },
  {
    id: "gpt-5.6-terra",
    name: "GPT-5.6 Terra",
    tagline: "Balances intelligence and cost",
    inputPrice: "$2.50",
    outputPrice: "$15",
    reasoning: true,
    tier: "frontier",
  },
  {
    id: "gpt-5.6-luna",
    name: "GPT-5.6 Luna",
    tagline: "Optimised for cost-sensitive, high-volume workloads",
    inputPrice: "$1",
    outputPrice: "$6",
    reasoning: true,
    tier: "frontier",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o mini",
    tagline: "Fast, low-cost fallback",
    reasoning: false,
    tier: "other",
  },
];

export const REASONING_LEVELS = ["none", "low", "medium", "high", "xhigh", "max"] as const;
export type ReasoningLevel = (typeof REASONING_LEVELS)[number];

export function modelById(id?: string | null): ModelInfo | undefined {
  return MODELS.find((m) => m.id === id);
}

export function modelLabel(id?: string | null): string {
  return modelById(id)?.name ?? id ?? "model";
}

export function supportsReasoning(id?: string | null): boolean {
  return modelById(id)?.reasoning ?? false;
}
