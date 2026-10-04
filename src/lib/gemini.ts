import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (typeof process === "undefined") return null;
  const apiKey =
    process.env["GEMINI_API_KEY"] ||
    process.env["VITE_GEMINI_API_KEY"] ||
    (typeof import.meta !== "undefined" && import.meta.env?.["VITE_GEMINI_API_KEY"]);

  if (!apiKey) {
    // If running in AI Studio environment without explicit key, SDK default can still resolve
    try {
      if (!aiClient) aiClient = new GoogleGenAI();
      return aiClient;
    } catch {
      return null;
    }
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function askGeminiOrderingAssistant(
  conversation: Array<{ role: "user" | "model"; text: string }>,
  lang: "en" | "ar" = "en",
) {
  const ai = getAIClient();

  const systemInstruction = `
You are the AI Design Ordering Assistant for "Linora Stellar" (founded by art director Nora Tamer in Egypt).
Linora Stellar specializes in celestial navy-and-gold custom branding, bespoke stationery, luxury wedding invitations, digital planners, and school packs.
Your task:
1. Warmly chat with clients seeking design services.
2. Ask 2-3 concise clarifying questions if needed (business name, vibe/style, required assets like Logo vs Full Identity vs Packaging, target audience, deadline, budget).
3. Recommend one of Linora Stellar's 4 packages:
   - "Celestial Logo Suite" (1,500 – 2,500 EGP / ~$50)
   - "Full Brand Identity & Guidelines" (4,000 – 7,500 EGP / ~$150)
   - "Bespoke Stationery & Wedding Suite" (2,000 – 4,000 EGP / ~$80)
   - "Custom Digital Planner & Canva Kit" (1,200 – 2,500 EGP / ~$45)
4. When sufficient details are given, output a structured JSON block at the end of your response inside \`\`\`json { ... } \`\`\` with:
   {
     "readyToOrder": true,
     "packageTitle": "...",
     "estimatedPrice": "...",
     "turnaround": "...",
     "clientName": "...",
     "briefSummary": "...",
     "recommendedColors": ["#...", "#..."]
   }
Language: Respond in ${lang === "ar" ? "fluent, elegant, friendly Egyptian/Modern Arabic" : "warm, poetic, and professional English"}.
Always keep responses concise, inspiring, and easy to read.
`;

  if (!ai) {
    // Elegant client-side fallback if Gemini key is not populated
    const lastUserMsg = conversation.filter((m) => m.role === "user").pop()?.text || "";
    return getFallbackResponse(lastUserMsg, lang);
  }

  try {
    const formattedContents = conversation.map((c) => ({
      role: c.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: c.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return (
      response.text ||
      (lang === "ar"
        ? "أهلاً بكِ في لينورا ستيلر! كيف يمكنني مساعدتكِ في طلبك اليوم؟"
        : "Welcome to Linora Stellar! How can I help you design your next project?")
    );
  } catch (error) {
    console.warn("Gemini API call returned fallback:", error);
    const lastUserMsg = conversation.filter((m) => m.role === "user").pop()?.text || "";
    return getFallbackResponse(lastUserMsg, lang);
  }
}

export async function generateAICreativeBrief(
  businessName: string,
  industry: string,
  vibe: string,
  lang: "en" | "ar" = "en",
) {
  const ai = getAIClient();

  const prompt = `
Create a celestial-inspired, luxury creative design brief for:
- Brand Name: ${businessName}
- Industry: ${industry}
- Desired Style / Vibe: ${vibe}

Provide:
1. Brand Persona & Core Mood
2. Color Palette with 4 Hex Codes and poetic names
3. Typography pairing suggestions (Display serif + Clean modern sans)
4. Key visual symbols & motifs (e.g. constellations, botanical, gold foil)
5. Recommended deliverables for launch

Language: ${lang === "ar" ? "Arabic" : "English"}.
`;

  if (!ai) {
    return {
      brandPersona: `${businessName} embodies refined, timeless elegance with celestial quiet luxury.`,
      palette: [
        { name: "Celestial Navy", hex: "#080D1A" },
        { name: "Radiant Gold", hex: "#DFAD71" },
        { name: "Ivory Parchment", hex: "#FFF6ED" },
        { name: "Starlight Slate", hex: "#28344E" },
      ],
      typography: "Cormorant Garamond (Serif Display) paired with Jost (Clean Sans)",
      motifs: "Four-pointed radiant star, orbital ring, celestial dust, minimal luxury borders",
      deliverables: [
        "Primary & Secondary Logo",
        "Color Guide",
        "Social Templates",
        "Packaging Art",
      ],
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });
    return response.text || "";
  } catch (err) {
    console.warn("AI Brief error:", err);
    return "";
  }
}

export async function generateAdminSummaryReport(
  stats: {
    orderCount: number;
    pendingOrders: number;
    totalRevenue: number;
    customRequests: number;
  },
  lang: "en" | "ar" = "en",
) {
  const ai = getAIClient();
  const prompt = `
Generate a quick 3-bullet executive smart summary for the store owner Nora Tamer (Linora Stellar, Cairo Egypt).
Current metrics:
- Total Orders: ${stats.orderCount}
- Pending Orders: ${stats.pendingOrders}
- Total Revenue: ${stats.totalRevenue} EGP
- Custom Design Inquiries: ${stats.customRequests}

Provide:
1. Warm greeting to Nora with current store pulse.
2. What to focus on today (e.g., verifying pending Vodafone Cash/InstaPay transfers, packing orders).
3. 1 actionable strategic growth idea for Linora Stellar (e.g., feature personalized school name stickers or launch a bridal stationery kit).

Language: ${lang === "ar" ? "Arabic" : "English"}. Keep it friendly, encouraging, and under 120 words.
`;

  if (!ai) {
    return lang === "ar"
      ? `✦ مرحباً نورا! متجركِ يسجل نشاطاً رائعاً مع ${stats.pendingOrders} طلبات قيد المراجعة وإجمالي مبيعات ${stats.totalRevenue} ج.م.\n✦ الأولوية اليوم: مراجعة إيصالات فودافون كاش وإنستاباي لتأكيد شحن طلبات القاهرة والجيزة.\n✦ فكرة مقترحة: تسليط الضوء على ملصقات الأسماء المخصصة للأطفال ومخططات ستيلر الرقمية على واجهة المتجر.`
      : `✦ Hello Nora! Your studio is active with ${stats.pendingOrders} pending orders and ${stats.totalRevenue} EGP in revenue.\n✦ Priority today: Verify incoming payment receipts for Cairo & Giza courier dispatch.\n✦ Strategic tip: Highlight custom name labels and digital planners on the homepage banner this week.`;
  }

  try {
    const res = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });
    return res.text || "";
  } catch {
    return "";
  }
}

function getFallbackResponse(userInput: string, lang: "en" | "ar"): string {
  const input = userInput.toLowerCase();

  if (lang === "ar") {
    if (input.includes("لوجو") || input.includes("شعار") || input.includes("هوية")) {
      return `أهلاً بكِ! يسعدني مساعدتك في تصميم هوية بصرية ساحرة لعلامتكِ التجارية. ✦

ننصحك بـ **باقة الهوية البصرية المتكاملة من لينورا ستيلر**:
- تصميم الشعار الأساسي والفرعي وأيقونة السوشيال ميديا
- لوحة ألوان فلكية مخصصة ودليل الخطوط
- 15 قالب كانفا قابل للتعديل لمنشورات وقصص إنستجرام
- ملفات فيكتور عالية الدقة جاهزة للطباعة

💰 التكلفة التقديرية: 3,500 – 5,000 ج.م
⏱️ مدة التنفيذ: 7–10 أيام عمل

ما هو اسم مشروعكِ وما هو الطابع الذي تفضلينه (كلاسيكي فخم، عصري ناعم، أم فلكي ذهبي)؟

\`\`\`json
{
  "readyToOrder": true,
  "packageTitle": "باقة الهوية البصرية المتكاملة",
  "estimatedPrice": "3,500 – 5,000 EGP",
  "turnaround": "7–10 أيام عمل",
  "recommendedColors": ["#080D1A", "#DFAD71", "#FFF6ED", "#293754"]
}
\`\`\``;
    }

    if (
      input.includes("مدرسة") ||
      input.includes("اسم") ||
      input.includes("ستيكر") ||
      input.includes("أطفال")
    ) {
      return `مرحباً بكِ! ملصقات الأسماء المخصصة للأطفال من لينورا ستيلر مصممة لتكون مميزة ومقاومة للماء والتمزق. ✦

**باقة ملصقات الأسماء المدرسية**:
- 48 إلى 96 ملصق مقاوم للماء للكتب وزجاجات المياه واللانش بوكس
- تصاميم فلكية وزهرية وسيارات ورسوم محببة للأطفال
- كتابة الاسم بالعربية والإنجليزية مع اسم الفصل أو رقم الهاتف

💰 السعر: 120 – 180 ج.م
⏱️ التسليم: 24–48 ساعة للقاهرة والجيزة

ما هو اسم الطفل الكريم والتصميم المفضل لديه؟

\`\`\`json
{
  "readyToOrder": true,
  "packageTitle": "باقة ملصقات الأسماء المقاومة للماء",
  "estimatedPrice": "120 – 180 EGP",
  "turnaround": "24–48 ساعة",
  "recommendedColors": ["#0F1626", "#E0AD76", "#F7F3E9"]
}
\`\`\``;
    }

    return `أهلاً بكِ في استوديو لينورا ستيلر مع المصممة نورا تامر! ✦
أنا مساعدكِ الذكي لمساعدتكِ في تحديد أفضل تصميم لمشروعكِ:

1. **تصميم شعار وهوية بصرية كاملة** لمشروعك التجاري.
2. **دعوات زفاف ومناسبات راقية** مع أختام شمعية وتطريز ذهبي.
3. **ملصقات أسماء مدرسية وأدوات مكتبية مخصصة**.
4. **مخططات رقمية وتطبيقات كانفا**.

أخبريني، ما هي فكرة مشروعكِ أو القطعة التي تحلمين بتصميمها؟`;
  }

  // English fallback
  if (input.includes("logo") || input.includes("brand") || input.includes("identity")) {
    return `Welcome to Linora Stellar! I would love to guide you through creating a bespoke identity with art director Nora Tamer. ✦

We recommend the **Full Brand Identity Suite**:
- Primary Logo, Secondary Wordmark & Submark Emblem
- Bespoke Celestial Color System & Typography Pairing Guide
- 15 Editable Canva Social Templates (Posts & Stories)
- Print-Ready Vector Files (AI, SVG, PDF, PNG)

💰 Estimated Investment: 3,500 – 5,000 EGP (~$80 – $120)
⏱️ Turnaround: 7–10 business days

What is your business name and target audience?

\`\`\`json
{
  "readyToOrder": true,
  "packageTitle": "Full Brand Identity & Guidelines Suite",
  "estimatedPrice": "3,500 – 5,000 EGP",
  "turnaround": "7–10 business days",
  "recommendedColors": ["#080D1A", "#DFAD71", "#FFF6ED", "#293754"]
}
\`\`\``;
  }

  return `Welcome to Linora Stellar! ✦
I am your AI design ordering assistant. I can help you scope:
1. **Bespoke Logo & Brand Identity** for your company or boutique.
2. **Luxury Stationery & Wax-Seal Event Suites**.
3. **Personalized Waterproof School Name Labels**.
4. **Custom Digital Life Planners & Canva Templates**.

Tell me about your idea or project, and I will recommend the perfect package!`;
}
