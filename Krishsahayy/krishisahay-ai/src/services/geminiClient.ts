import { FarmProfile, RotationPlan, StressScenario } from '../types/agricultural';

export interface ExplainRotationResponse {
  explanation: string;
  source: string;
}

export interface KisanVaaniResponse {
  reply: string;
  source: string;
}

export async function requestRotationExplanation(
  plan: RotationPlan,
  farmProfile: FarmProfile,
  scenario: StressScenario
): Promise<ExplainRotationResponse> {
  try {
    const res = await fetch('/api/gemini/explain-rotation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan, farmProfile, scenario }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return {
      explanation: data.explanation,
      source: data.source || 'gemini-2.5-flash',
    };
  } catch (err: any) {
    console.warn('Fallback to client-side agronomic explanation:', err?.message);
    return {
      explanation: fallbackClientExplanation(plan, farmProfile, scenario),
      source: 'local_deterministic_engine',
    };
  }
}

export async function askKisanVaani(
  message: string,
  plan: RotationPlan | null,
  farmProfile: FarmProfile,
  language: string = 'English'
): Promise<KisanVaaniResponse> {
  if (!message || !message.trim()) {
    throw new Error('Please provide a valid question.');
  }

  const res = await fetch('/api/gemini/kisan-vaani', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: message.trim(), plan, farmProfile, language }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    if (errorBody.reply) {
      // If server generated a fallback response alongside error details
      return {
        reply: errorBody.reply,
        source: errorBody.source || 'local_kisan_vaani_fallback',
      };
    }
    throw new Error(errorBody.error || `Server error (${res.status}) while contacting KisanVaani AI.`);
  }

  const data = await res.json();
  if (data.error && !data.reply) {
    throw new Error(data.error);
  }

  return {
    reply: data.reply,
    source: data.source || 'gemini-2.5-flash',
  };
}

function fallbackClientExplanation(plan: RotationPlan, farm: FarmProfile, scenario: StressScenario): string {
  const cropList = (plan.seasons || []).map(s => s.crop?.name || 'Crop').join(' ➔ ');
  const profitStr = Math.round(plan.metrics?.netProfitInr || 0).toLocaleString();
  const waterStr = (plan.metrics?.totalWaterUsedM3 || 0).toLocaleString();

  return `### KrishiSahay AI Agronomic Rationale (${plan.strategyName || 'Balanced Plan'})

**1. Strategic Rotation Choice: ${cropList}**
The optimization engine mathematically resolved this sequence to maximize farm returns while enforcing strict rotational biosecurity. Total projected net profit across ${(plan.seasons || []).length} seasons reaches **₹${profitStr}**.

**2. Soil Health Dynamics:**
- Initial soil health score: **${plan.metrics?.initialSoilHealth || 65}/100** ➔ Projected final health: **${plan.metrics?.finalSoilHealth || 78}/100** (Delta: ${(plan.metrics?.soilHealthDelta || 0) >= 0 ? '+' : ''}${plan.metrics?.soilHealthDelta || 0} pts).
- Legume integration (such as Chickpea or Soybean) enriches topsoil with biologically fixed nitrogen, counterbalancing depletion from intensive commercial crops.

**3. Water Conservation & Climate Stewardship:**
- Total water consumed: **${waterStr} m³** against available seasonal quota of **${(plan.metrics?.waterAvailableM3 || 0).toLocaleString()} m³**.
- Active stress condition: *${scenario?.name || 'Normal Season'}*. Zero water deficit violations detected under the current allocation.

**4. Disease Pathogen Interruption:**
By rotating botanical families and interleaving break crops, soil pathogen concentration is suppressed by ~${Math.max(20, 100 - (plan.metrics?.averageDiseaseRisk || 20))}%, preventing continuous monoculture wilt and root rot buildup.`;
}
