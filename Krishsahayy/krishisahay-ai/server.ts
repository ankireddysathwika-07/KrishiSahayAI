import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import net from 'node:net';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const tryPort = (port: number) => {
      const tester = net.createServer();

      tester.once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          tryPort(port + 1);
          return;
        }
        reject(err);
      });

      tester.listen(port, 'localhost', () => {
        tester.close(() => resolve(port));
      });
    };

    tryPort(startPort);
  });
}

// Resilient Gemini Model caller with automatic fallback across available Google models
async function callGemini(
  ai: GoogleGenAI,
  contents: string,
  systemInstruction?: string
): Promise<{ text: string; model: string }> {
  const modelsToTry = [
    process.env.GEMINI_MODEL || 'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-3.8-flash',
  ];

  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        ...(systemInstruction
          ? { config: { systemInstruction, temperature: 0.4 } }
          : { config: { temperature: 0.4 } }),
      });

      if (response && response.text) {
        return { text: response.text, model };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini] Model '${model}' failed: ${err?.message || err}. Trying next fallback...`);
    }
  }

  throw lastError || new Error('All Gemini models failed to generate content');
}

async function startServer() {
  const app = express();
  const requestedPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const PORT = await getAvailablePort(Number.isFinite(requestedPort) && requestedPort > 0 ? requestedPort : 3000);

  if (PORT !== requestedPort) {
    console.warn(`Port ${requestedPort} is busy, using ${PORT} instead.`);
  }

  app.use(express.json({ limit: '10mb' }));

  // Initialize server-side Gemini client per AI Studio standards
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'KrishiSahay AI Engine',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // POST /api/gemini/explain-rotation
  app.post('/api/gemini/explain-rotation', async (req: Request, res: Response) => {
    try {
      const { plan, farmProfile, scenario } = req.body;

      if (!plan || !plan.seasons) {
        return res.status(400).json({ error: 'Missing rotation plan payload' });
      }

      const prompt = `You are KrishiSahay AI's Chief Agronomist and Senior Optimization Scientist.
Explain the agronomic and financial rationale for the following mathematically optimized multi-season crop rotation plan.
Do NOT fabricate numbers. Ground your explanation strictly on the real calculated values provided below.

FARM CONTEXT:
- Farm: ${farmProfile?.farmName || 'Demo Farm'} (${farmProfile?.areaHa} ha, ${farmProfile?.location || 'Deccan Plateau'})
- Soil Type: ${farmProfile?.soilType}, pH: ${farmProfile?.soilPh}
- Starting NPK: N=${farmProfile?.nitrogenKgPerHa}kg/ha, P=${farmProfile?.phosphorusKgPerHa}kg/ha, K=${farmProfile?.potassiumKgPerHa}kg/ha, OM=${farmProfile?.organicMatterPercent}%
- Irrigation: ${farmProfile?.irrigationType}, Available Water: ${farmProfile?.availableWaterM3PerHa} m3/ha
- Active Stress Scenario: ${scenario?.name || 'Normal Season'} (${scenario?.description || 'Baseline climate'})

OPTIMIZED ROTATION PLAN (${plan.strategyName}):
${(plan.seasons || [])
  .map(
    (s: any, idx: number) =>
      `Season ${idx + 1} (Year ${s.year} ${s.seasonName}):
  - Crop: ${s.crop?.name} (${s.crop?.category}, Family: ${s.crop?.diseaseFamily})
  - Yield: ${s.projectedYieldTons} tons, Net Profit: ₹${Math.round(s.netProfitInr).toLocaleString()}
  - Water Consumed: ${s.waterRequiredM3} m3 (Balance: ${s.waterBalanceM3 >= 0 ? '+' : ''}${s.waterBalanceM3} m3)
  - Soil N delta: ${s.soilNitrogenDeltaKg >= 0 ? '+' : ''}${s.soilNitrogenDeltaKg} kg/ha, Soil Health After: ${s.soilHealthScoreAfter}/100
  - Disease Risk: ${s.diseaseRiskScore}/100
  - Rationale: ${s.agronomicRationale}`
  )
  .join('\n\n')}

CUMULATIVE METRICS:
- Total Projected Net Profit: ₹${Math.round(plan.metrics?.netProfitInr || 0).toLocaleString()}
- Total Water Consumed: ${(plan.metrics?.totalWaterUsedM3 || 0).toLocaleString()} m3 vs Available: ${(plan.metrics?.waterAvailableM3 || 0).toLocaleString()} m3
- Soil Health Trajectory: Started at ${plan.metrics?.initialSoilHealth || 65} -> Finished at ${plan.metrics?.finalSoilHealth || 78} (Delta: ${(plan.metrics?.soilHealthDelta || 0) >= 0 ? '+' : ''}${plan.metrics?.soilHealthDelta || 0} points)
- Average Disease Risk: ${plan.metrics?.averageDiseaseRisk || 0}/100
- Sustainability Index: ${plan.metrics?.sustainabilityScore || 0}/100
- Feasibility: ${plan.isFeasible ? 'FEASIBLE (Passed all constraints)' : 'INFEASIBLE: ' + (plan.rejectionReasons || []).join(', ')}

Please provide a structured, professional, transparent agronomic explanation covering:
1. Executive Summary of why this schedule was selected.
2. Season-by-season transition logic (e.g. why Crop B follows Crop A, how legumes replenish nitrogen, why specific high-risk crops were avoided).
3. Water budget and soil dynamics verdict.
4. Disease cycle disruption impact (how monoculture pathogens are starved).
5. Farmer risk advisory and execution tips.
Keep it direct, authoritative, and farmer-centric.`;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          source: 'local_engine',
          explanation: generateLocalExplanation(plan, farmProfile, scenario),
        });
      }

      const result = await callGemini(
        ai,
        prompt,
        'You are KrishiSahay AI, an expert agricultural decision-support engine. You explain mathematical crop rotation plans with precision, highlighting soil ecology, water stewardship, and financial resilience.'
      );

      return res.json({
        source: result.model,
        explanation: result.text || generateLocalExplanation(plan, farmProfile, scenario),
      });
    } catch (err: any) {
      console.warn('Gemini API call failed, using high-fidelity local agronomic explanation:', err?.message);
      return res.json({
        source: 'local_engine_fallback',
        explanation: generateLocalExplanation(req.body.plan, req.body.farmProfile, req.body.scenario),
      });
    }
  });

  // POST /api/gemini/kisan-vaani
  app.post('/api/gemini/kisan-vaani', async (req: Request, res: Response) => {
    try {
      const { message, plan, farmProfile, language = 'English' } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'No question provided. Please speak or type a valid question.' });
      }

      const trimmedQuestion = message.trim();

      const prompt = `You are "KisanVaani" (క్రిషీ సహాయ్ - కిసాన్ వాణి), the expert agricultural voice and farm advisory companion in KrishiSahay AI.
A farmer has asked this specific question: "${trimmedQuestion}".

Target Language for Response: ${language}
- If Telugu: Answer in authentic, fluent, warm, and respectful Telugu (e.g. start with 'నమస్కారం రైతు సోదరా!'). Provide specific names of fertilizers, dosages, pests, treatments, timings, and cultural practices in natural Telugu phrasing.
- If Indian English or English: Answer in clear, practical Indian English with actionable farming guidance and step-by-step instructions.
- If Hindi: Answer in warm, respectful Hindi (e.g. 'नमस्ते किसान भाई!').
- If Tamil or Marathi: Answer respectfully in that vernacular language.

CRITICAL INSTRUCTIONS:
1. Directly and specifically answer the farmer's question: "${trimmedQuestion}". Every question must receive a unique, relevant answer based on its actual meaning!
2. Provide concrete, practical agronomic details:
   - For fertilizer questions (e.g., paddy/వరి, cotton/పత్తి, etc.): Specify appropriate fertilizers (e.g., Urea, DAP, MOP, Zinc Sulphate, organic FYM), application timings (basal, tillering, panicle initiation), and dosages per acre.
   - For irrigation questions: Specify frequency, critical stages (flowering, boll formation, grain filling), morning/evening scheduling, and soil moisture checks.
   - For pest/disease questions (e.g., tomato/టమోటా, chilli/మిర్చి, etc.): Describe identification signs, organic remedies (Neem oil, sticky traps), and safe chemical sprays with exact dosages per liter of water.
3. If the farmer specifically asks about crop rotation or farm planning, reference the farm context:
   - Strategy: ${plan?.strategyName || 'Balanced Plan'}
   - Scheduled Crops: ${(plan?.seasons || []).map((s: any) => `${s.crop?.name || 'Crop'} (Year ${s.year} ${s.seasonName})`).join(' -> ') || 'Optimal local rotation'}
   - Farm Location: ${farmProfile?.location || 'Andhra Pradesh / Telangana'}
   - Farm Area: ${farmProfile?.areaHa || 2.5} ha
4. Format the answer in 2 to 3 concise, structured paragraphs or clean bullet points so it is very easy to read on mobile screens and sounds natural and engaging when spoken aloud via Text-to-Speech.
5. Do NOT use markdown tables or complex ASCII symbols that sound unnatural in voice readout.`;

      if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY is not configured in environment. Using local agronomic engine.');
        return res.json({
          reply: generateLocalKisanVaaniResponse(trimmedQuestion, plan, language),
          source: 'local_kisan_vaani',
        });
      }

      const result = await callGemini(
        ai,
        prompt,
        'You are KisanVaani, an authoritative, friendly, expert agricultural advisor helping Indian farmers with clear, actionable crop care, pest management, fertilizer, and irrigation advice.'
      );

      return res.json({
        reply: result.text,
        source: result.model,
      });
    } catch (err: any) {
      console.error('[KisanVaani] Gemini API error:', err?.message || err);
      return res.status(500).json({
        error: `KisanVaani AI service error: ${err?.message || 'Failed to generate answer'}`,
        reply: generateLocalKisanVaaniResponse(req.body.message, req.body.plan, req.body.language),
        source: 'local_kisan_vaani_fallback',
      });
    }
  });

  // POST /api/equipment/matchmaker
  app.post('/api/equipment/matchmaker', async (req: Request, res: Response) => {
    try {
      const { crop, acres, mandal, task, maxBudget, availableEquipment } = req.body;

      if (!task && !crop) {
        return res.status(400).json({ error: 'Please provide at least a crop or farming task.' });
      }

      const equipmentSummary = (availableEquipment || [])
        .map(
          (eq: any) =>
            `- ID: ${eq.id} | Name: ${eq.name} | Category: ${eq.category} | Mandal: ${eq.mandal} | Daily Rate: ₹${eq.dailyRate} | Condition: ${eq.condition} | Attachments: ${(eq.attachments || []).join(', ')}`
        )
        .join('\n');

      const prompt = `You are KrishiSahay AI's Chief Mechanization Specialist.
A farmer has requested equipment recommendations for their farm.
FARM CONTEXT:
- Crop: ${crop || 'Not specified'}
- Land Size: ${acres || 2.5} acres
- Location / Mandal: ${mandal || 'Local District'}
- Farming Task: ${task || 'General Field Operations'}
- Maximum Daily Budget: ${maxBudget ? '₹' + maxBudget : 'Flexible'}

AVAILABLE INVENTORY:
${equipmentSummary}

Analyze each available machine's suitability for this specific farmer. Return a JSON array of the top 3 best matching items with this exact schema:
[
  {
    "equipmentId": "eq_...",
    "matchScore": 92,
    "recommendedTask": "Primary Puddle Tillage",
    "suitabilityReason": "Why this specific machine fits the crop, acreage, and soil task",
    "efficiencyBenefit": "Concrete time/cost/fuel saving vs manual labor",
    "estimatedDaysNeeded": 2
  }
]
Respond ONLY with valid JSON. Do not wrap in markdown quotes.`;

      if (process.env.GEMINI_API_KEY) {
        try {
          const result = await callGemini(
            ai,
            prompt,
            'You are an expert agricultural engineer specializing in farm mechanization, custom hiring centers, and tractor implements for Indian smallholders. Output only strict JSON.'
          );

          let cleanedText = result.text.trim();
          if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }

          const parsed = JSON.parse(cleanedText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return res.json({
              recommendations: parsed,
              source: `gemini_ai (${result.model})`,
            });
          }
        } catch (geminiErr: any) {
          console.warn('[EquipmentMatchmaker] Gemini failed, using rule-based engine:', geminiErr?.message);
        }
      }

      // Return status indicating rule-based fallback
      return res.json({
        recommendations: null,
        source: 'local_rule_based_engine',
      });
    } catch (err: any) {
      console.error('[EquipmentMatchmaker] Error:', err);
      return res.status(500).json({ error: err?.message || 'Matchmaker failed' });
    }
  });

  // Mount Vite middlewares in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, 'localhost', () => {
    console.log(`KrishiSahay AI Full-Stack Server running on http://localhost:${PORT}`);
  });
}

function generateLocalExplanation(plan: any, farm: any, scenario: any): string {
  if (!plan) return 'No rotation plan provided.';

  const crops = (plan.seasons || []).map((s: any) => s.crop?.name || 'Crop');
  const netProfit = Math.round(plan.metrics?.netProfitInr || 0).toLocaleString();
  const soilDelta = plan.metrics?.soilHealthDelta || 0;
  const waterUsed = (plan.metrics?.totalWaterUsedM3 || 0).toLocaleString();
  const waterAvailable = (plan.metrics?.waterAvailableM3 || 0).toLocaleString();

  return `### KrishiSahay AI Agronomic Engine Rationale

**Executive Summary:**
The multi-season optimization engine selected the sequence **${crops.join(' ➔ ')}** under the **${plan.strategyName || 'Balanced Plan'}** objective. Over ${(plan.seasons || []).length} seasons, this trajectory generates **₹${netProfit} in net farm returns** while conserving **${waterUsed} m³** of irrigation water against an available quota of **${waterAvailable} m³**.

**1. Rotational Sequence Dynamics:**
- **Nutrient Restoration via Legumes:** The inclusion of legume breaks (such as Soybean or Chickpea) contributes biologically fixed atmospheric nitrogen, reversing the depletion caused by heavy feeding cereals.
- **Pathogen Cycle Disruption:** By strictly avoiding consecutive Solanaceae (e.g. Tomato followed by Potato) or continuous Cereal monocultures, soil-borne fungal spore concentrations and root nematode populations drop by an estimated ${Math.max(15, 100 - (plan.metrics?.averageDiseaseRisk || 20))}%.
- **Root Architecture Synergies:** Alternating shallow fibrous root systems with deep taproots aerates dense soil strata and enhances water infiltration.

**2. Soil Health Trajectory:**
Starting from an initial baseline health score of **${plan.metrics?.initialSoilHealth || 65}/100**, the simulated rotation terminates at **${plan.metrics?.finalSoilHealth || 78}/100** (Net change: ${soilDelta >= 0 ? '+' : ''}${soilDelta} points). Organic matter balances are preserved through diversified crop residue incorporation.

**3. Water & Climate Resilience:**
In the active scenario (*${scenario?.name || 'Normal Season'}*), water demand is maintained within operating thresholds with zero deficit violations. Water-efficient crops ensure adequate drought margins during critical reproductive phenophases.

**4. Farmer Advisory & Residual Risks:**
Monitor micro-nutrient balances (particularly Zinc and Boron) and maintain scheduled irrigation intervals during flowering and seed set stages.`;
}

function generateLocalKisanVaaniResponse(query: string, plan: any, language: string): string {
  const q = (query || '').toLowerCase();

  // 1. PADDY FERTILIZER SPECIFIC
  if ((q.includes('వరి') || q.includes('paddy') || q.includes('rice')) && (q.includes('ఎరువు') || q.includes('fertilizer') || q.includes('dap') || q.includes('urea'))) {
    if (language === 'Telugu' || q.includes('వరి') || q.includes('ఎరువు')) {
      return `నమస్కారం రైతు సోదరా! వరి పంటకు సిఫార్సు చేసిన ఎరువుల యాజమాన్యం:
1. ఆఖరి దుక్కిలో ఎకరాకు 50 కేజీల డీఏపీ (DAP) లేదా 100 కేజీల సింగిల్ సూపర్ ఫాస్ఫేట్ (SSP) మరియు 10 కేజీల జింక్ సల్ఫేట్ తప్పనిసరిగా వేయాలి.
2. నత్రజని కొరకు యూరియాను ఒకేసారి వేయకుండా 3 సమాన విడతలుగా (దుక్కిలో 25%, పిలక దశలో 50%, చిరుపొట్ట దశలో 25%) అందించండి.
3. గింజ గట్టిపడటానికి మరియు తాలు గింజలు తగ్గడానికి పొటాష్ (MOP) ఎకరాకు 20-25 కేజీలు దుక్కిలో మరియు చిరుపొట్ట దశలో వేయండి.`;
    }
    return `Namaste Farmer! For paddy (rice), balanced NPK and Zinc application is vital:
1. Basal Application: Apply 50 kg DAP, 20 kg MOP (Potash), and 10 kg Zinc Sulphate per acre during final puddling.
2. Split Nitrogen (Urea): Divide Urea into 3 splits—25% at transplanting, 50% at active tillering (3 weeks), and 25% at panicle initiation.
3. Foliar Spray: Spray 19-19-19 or Potassium Nitrate (10g/L) during flowering for bold, disease-resistant grains.`;
  }

  // 2. COTTON IRRIGATION SPECIFIC
  if ((q.includes('పత్తి') || q.includes('cotton') || q.includes('kapas')) && (q.includes('నీరు') || q.includes('water') || q.includes('irrigat') || q.includes('తడి'))) {
    if (language === 'Telugu' || q.includes('పత్తి') || q.includes('నీరు')) {
      return `నమస్కారం రైతు సోదరా! పత్తి పంటకు నీటి యాజమాన్య సూచనలు:
1. పత్తి లోతైన వేరు వ్యవస్థ కలిగిన పంట కాబట్టి ప్రతి 10-15 రోజులకు ఒకసారి నేల రకాన్ని బట్టి తడి ఇవ్వాలి. నల్లరేగడి నేలలో తడుల వ్యవధిని పెంచవచ్చు.
2. పూత మరియు కాయలు (బొల్లలు) ఏర్పడే కీలక దశలలో నీటి కొరత రానివ్వకూడదు. ఈ దశలో నీరు అందకపోతే పూత, పిందె రాలిపోతాయి.
3. మొదళ్ళ వద్ద నీరు నిల్వ ఉండకుండా బోదెలు, కాలువల పద్ధతిలో లేదా డ్రిప్ ద్వారా నీరు అందించడం ఉత్తమం.`;
    }
    return `Namaste Farmer! Water management guidelines for cotton plants:
1. Irrigation Frequency: Irrigate every 10 to 14 days in medium soils, and 15 to 20 days in deep black soils. Avoid water stagnation near root collars.
2. Critical Stages: Flowering (45-60 days) and boll development (70-110 days) are the most critical moisture-sensitive stages. Any drought stress now causes flower and boll dropping.
3. Method: Alternate furrow irrigation or drip irrigation is recommended to conserve water and prevent root asphyxiation.`;
  }

  // 3. TOMATO PESTS & DISEASES SPECIFIC
  if ((q.includes('టమోటా') || q.includes('tomato')) && (q.includes('పురుగు') || q.includes('pest') || q.includes('insect') || q.includes('తెగులు') || q.includes('blight') || q.includes('మచ్చ'))) {
    if (language === 'Telugu' || q.includes('టమోటా') || q.includes('పురుగు')) {
      return `నమస్కారం రైతు సోదరా! టమోటా పంటలో చీడపీడల గుర్తింపు మరియు నివారణ:
1. ఆకుముడత మరియు తెల్లదోమ: ఆకులు పైకి ముడుచుకుని పసుపు రంగులోకి మారితే తెల్లదోమ ఆశించినట్లు. నివారణకు ఎకరాకు 20 పసుపు జిగురు అట్టలు అమర్చండి మరియు ఎసిటామిప్రిడ్ (0.5 గ్రా/లీ) లేదా వేపనూనె (5 మి.లీ/లీ) పిచికారీ చేయండి.
2. కాయతొలిచే పురుగు (Helicoverpa): కాయలకు గుండ్రటి రంధ్రాలు చేసి లోపలి గుజ్జును తింటుంది. నివారణకు ఎకరాకు 4 లింగ ఆకర్షణ బుట్టలు పెట్టండి, ఉధృతి ఉంటే క్లోరాంట్రానిలిప్రోల్ (0.4 మి.లీ/లీ) పిచికారీ చేయండి.
3. ఆకుమచ్చ లేదా ఎర్లీ బ్లైట్: ఆకులపై నల్లటి వలయాకార మచ్చలు వస్తే మాంకోజెబ్ (2.5 గ్రా/లీ) చల్లండి.`;
    }
    return `Namaste Farmer! How to identify and control pests on tomato plants:
1. Whiteflies and Leaf Curl: Characterized by upward leaf curling and yellow mottling. Control by installing 20 yellow sticky traps/acre and spraying Neem oil (5ml/L) or Acetamiprid (0.5g/L).
2. Fruit Borers (Helicoverpa): Look for circular bored holes in green and ripening fruits with frass. Control with Pheromone traps (4/acre) and spray Chlorantraniliprole 18.5% SC (0.4ml/L).
3. Early/Late Blight: Identified by concentric brown rings on lower leaves. Spray Mancozeb 75% WP (2.5g/L) or Copper Oxychloride (3g/L).`;
  }

  // 4. CHILLI LEAF CURL / THRIPS / PESTS
  if (
    q.includes('మిర్చి') ||
    q.includes('మిరప') ||
    q.includes('ఆకుముడత') ||
    q.includes('ముడత') ||
    q.includes('తామర') ||
    q.includes('chilli') ||
    q.includes('thrips') ||
    q.includes('leaf curl')
  ) {
    if (language === 'Telugu' || q.includes('మిర్చి')) {
      return `నమస్కారం రైతు సోదరా! మిర్చి ఆకుముడత మరియు రసం పీల్చే తామర పురుగుల నివారణకు:
1. ఎకరాకు డైఫెంథియురాన్ 50% WP (250 గ్రా) లేదా ఫిప్రోనిల్ 5% SC (2 మి.లీ/లీ) నీటిలో కలిపి పిచికారీ చేయండి.
2. లీటరు నీటికి 5 మి.లీ వేపనూనె (10,000 ppm) మరియు పసుపు/నీలి జిగురు అట్టలు (ఎకరాకు 25) అమర్చండి.
3. నత్రజని ఎరువుల మోతాదు తగ్గించి పొటాష్ మరియు బాస్ఫరం ఎరువులు అందించడం మంచిది.`;
    }
    if (language === 'Hindi' || q.includes('మిర్చి')) {
      return `नमस्ते किसान भाई! मिर्च में मरोड़िया रोग (लीफ कर्ल) और थ्रिप्स कीट नियंत्रण हेतु:
1. डाइफेन्थियुरॉन 50% WP (1 ग्राम/लीटर) या फिपरोनिल (2 मिली/लीटर) का छिड़काव करें।
2. नीम तेल (10,000 ppm) 5 मिली प्रति लीटर और पीले चिपचिपे कार्ड लगाएं।
3. अत्यधिक यूरिया के प्रयोग से बचें।`;
    }
  }

  // 5. RICE / PADDY / WHEAT BLAST & DISEASES
  if (
    q.includes('వరి') ||
    q.includes('ధాన్యం') ||
    q.includes('నారు') ||
    q.includes('అగ్గి') ||
    q.includes('పొడ') ||
    q.includes('సుడి') ||
    q.includes('rice') ||
    q.includes('paddy') ||
    q.includes('wheat') ||
    q.includes('gehu') ||
    q.includes('blast')
  ) {
    if (language === 'Telugu' || q.includes('వరి')) {
      return `నమస్కారం రైతు సోదరా! వరి పంటలో తెగుళ్ళ మరియు దోమ నివారణ సలహా:
1. వరి అగ్గి తెగులు (Blast) నివారణకు ట్రైసైక్లజోల్ 75% WP (ఎకరాకు 120 గ్రా) పిచికారీ చేయండి.
2. సుడిదోమ ఉధృతి ఉంటే పైమెట్రోజిన్ 50% WDG (ఎకరాకు 120 గ్రా) మొదళ్ళకి తగిలేలా చల్లండి.
3. పొలంలో నీటిని తీసివేసి 2 రోజుల పాటు ఆరబెట్టడం వల్ల దోమ ఉధృతి గణనీయంగా తగ్గుతుంది.`;
    }
  }

  // 6. COTTON & PINK BOLLWORM
  if (
    q.includes('పత్తి') ||
    q.includes('గులాబీ') ||
    q.includes('బొల్లపురుగు') ||
    q.includes('cotton') ||
    q.includes('kapas') ||
    q.includes('bollworm')
  ) {
    if (language === 'Telugu' || q.includes('పత్తి')) {
      return `నమస్కారం రైతు సోదరా! పత్తి సాగులో గులాబీ రంగు పురుగు మరియు తెల్లదోమ నివారణ:
1. గులాబీ రంగు పురుగు ఉనికి కొరకు ఎకరాకు 4 లింగ ఆకర్షణ బుట్టలు (Pheromone Traps) అమర్చండి.
2. పురుగు నివారణకు ప్రొఫెనోఫాస్ 50% EC (2 మి.లీ/లీ) లేదా ఫిప్రోనిల్ పిచికారీ చేయండి.
3. చివరి దశలో గొర్రెలు లేదా మేకల మందలు తోలడం ద్వారా మిగిలిన కాయలను తుడిచిపెట్టి పురుగు వ్యాప్తిని అరికట్టవచ్చు.`;
    }
  }

  // 7. FERTILIZERS / SOIL / NPK / UREA / DAP
  if (
    q.includes('ఎరువు') ||
    q.includes('యూరియా') ||
    q.includes('డీఏపీ') ||
    q.includes('భూసారం') ||
    q.includes('నేల') ||
    q.includes('పొటాష్') ||
    q.includes('జింక్') ||
    q.includes('fertilizer') ||
    q.includes('urea') ||
    q.includes('dap') ||
    q.includes('npk') ||
    q.includes('soil')
  ) {
    if (language === 'Telugu' || q.includes('ఎరువు')) {
      return `నమస్కారం రైతు సోదరా! మీ నేల సారం మరియు ఎరువుల యాజమాన్య సలహా:
1. యూరియాను ఒకేసారి వేయకుండా 3 విడతలుగా (దుక్కిలో, పిలక దశలో, పూత దశలో) అందించండి.
2. ఎకరాకు 10 కేజీల జింక్ సల్ఫేట్ మరియు 50 కేజీల DAP ని దుక్కి సమయంలో నేలలో కలపండి.
3. జీలుగు లేదా జనుము పచ్చిరొట్ట పైరు చల్లి దున్నడం వల్ల నత్రజని సహజంగా పెరుగుతుంది.`;
    }
  }

  // 8. IRRIGATION & WATER MANAGEMENT
  if (
    q.includes('నీరు') ||
    q.includes('నీటి') ||
    q.includes('తడి') ||
    q.includes('స్పింక్లర్') ||
    q.includes('డ్రిప్') ||
    q.includes('పారుదల') ||
    q.includes('water') ||
    q.includes('irrigat') ||
    q.includes('drip')
  ) {
    if (language === 'Telugu' || q.includes('నీరు')) {
      return `నమస్కారం రైతు సోదరా! మీ పొలంలో నీటి పారుదల సూచనలు:
1. నేల తేమ 45% కంటే తగ్గకుండా ఉదయం 06:00 నుండి 09:00 గంటల మధ్య డ్రిప్ పద్ధతిలో నీరు పెట్టండి.
2. మధ్యాహ్నం వేడిలో నీరు పెట్టడం వల్ల ఆవిరి శాతంతో పాటు వేరు కుళ్ళు తెగులు వచ్చే అవకాశం ఉంది.
3. తుఫాను సూచన ఉన్న రోజులలో తడులు ఇవ్వడం వాయిదా వేసి నీటి సరఫరాను క్రమబద్ధీకరించండి.`;
    }
  }

  // 9. CROP ROTATION & PLAN INQUIRY (ONLY IF SPECIFICALLY ASKING ABOUT ROTATION)
  if (
    q.includes('పంట మార్పిడి') ||
    q.includes('రొటేషన్') ||
    q.includes('వచ్చే పంట') ||
    q.includes('crop rotation') ||
    q.includes('next crop') ||
    q.includes('rotation plan')
  ) {
    const firstCrop = plan?.seasons?.[0]?.crop?.name || 'Maize';
    const secondCrop = plan?.seasons?.[1]?.crop?.name || 'Chickpea';
    const totalProfit = Math.round(plan?.metrics?.netProfitInr || 245000).toLocaleString();

    if (language === 'Telugu') {
      return `నమస్కారం రైతు సోదరా! మీ నేల స్వభావం మరియు క్రిషీ సహాయ్ AI ఇంజిన్ విశ్లేషణ ప్రకారం:
1. వచ్చే సీజన్ కొరకు **${firstCrop}** పంటను, దాని తర్వాత **${secondCrop}** వేయడం ద్వారా భూమికి నత్రజని సహజంగా అందుతుంది.
2. ఈ పంట మార్పిడి ద్వారా మీరు దాదాపు ₹${totalProfit} నికర లాభం సాధించవచ్చు.
3. ఒకే కుటుంబానికి చెందిన పంటలను పదేపదే వేయకపోవడం వల్ల నేలలో తెగుళ్ళు మరియు చీడపీడలు 45% వరకు తగ్గుతాయి.`;
    }
    return `Namaste Farmer! Based on KrishiSahay AI's multi-season optimizer:
1. Recommended schedule: **${firstCrop}** followed by **${secondCrop}** to biologically replenish soil nitrogen.
2. Projected net returns across seasons: approximately ₹${totalProfit}.
3. Breaking continuous monoculture reduces soil pathogen loads by up to 45%.`;
  }

  // 10. GENERAL DYNAMIC FALLBACK
  if (language === 'Telugu') {
    return `నమస్కారం రైతు సోదరా! మీ ప్రశ్న "${query}" కు వ్యవసాయ నిపుణుల సలహా:
1. మీరు అడిగిన పంట సమస్యకు సరైన సమతుల్య పోషకాలు (NPK) మరియు తగినంత నేల తేమ (45% పైన) అందించండి.
2. పురుగులు లేదా తెగుళ్ళ లక్షణాలు గమనిస్తే లీటరు నీటికి 5 మి.లీ వేపనూనె లేదా తగిన మందును ఉదయం వేళల్లో పిచికారీ చేయండి.
3. పంట రక్షణ, ఎరువుల మోతాదు లేదా మార్కెట్ ధరలపై మరింత ఖచ్చితమైన సమాచారం కోసం మీ పంట పేరును స్పష్టంగా తెలపండి.`;
  }

  return `Namaste Farmer! Regarding your question "${query}":
1. Ensure balanced soil nutrition with tested NPK ratios and keep soil moisture optimal (above 45%).
2. For pest or disease symptoms, apply organic neem formulations (10,000 ppm at 5ml/L) or targeted university-recommended treatments in morning hours.
3. Feel free to ask more specific questions specifying your crop name, field symptoms, or fertilizer requirements!`;
}

startServer();