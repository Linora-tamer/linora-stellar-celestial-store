// Client-safe AI helpers.
//
// The Gemini API key and the SDK now live on the server only (see gemini.server.ts and
// ai.functions.ts). These wrappers keep the original function names/signatures, call the
// server functions, and fall back to the built-in canned answers when the server has no
// key, is unreachable, or rate-limits the caller.
import { askOrderingAssistant, createAdminSummary, createCreativeBrief } from "./ai.functions";

type Lang = "en" | "ar";

export async function askGeminiOrderingAssistant(
  conversation: Array<{ role: "user" | "model"; text: string }>,
  lang: Lang = "en",
) {
  const lastUserMsg = conversation.filter((m) => m.role === "user").pop()?.text || "";
  try {
    const { text } = await askOrderingAssistant({ data: { conversation, lang } });
    if (text) return text;
  } catch (error) {
    console.warn("AI assistant unavailable, using fallback:", error);
  }
  return getFallbackResponse(lastUserMsg, lang);
}

export async function generateAICreativeBrief(
  businessName: string,
  industry: string,
  vibe: string,
  lang: Lang = "en",
) {
  try {
    const { text } = await createCreativeBrief({
      data: { businessName, industry, vibe, lang },
    });
    if (text) return text;
  } catch (error) {
    console.warn("AI brief unavailable, using fallback:", error);
  }
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
    deliverables: ["Primary & Secondary Logo", "Color Guide", "Social Templates", "Packaging Art"],
  };
}

export async function generateAdminSummaryReport(
  stats: {
    orderCount: number;
    pendingOrders: number;
    totalRevenue: number;
    customRequests: number;
  },
  lang: Lang = "en",
) {
  try {
    const { text } = await createAdminSummary({ data: { stats, lang } });
    if (text) return text;
  } catch (error) {
    console.warn("AI summary unavailable, using fallback:", error);
  }
  // Plain, factual fallback built only from the real numbers — no invented claims.
  return lang === "ar"
    ? `✦ إجمالي الطلبات: ${stats.orderCount} (منها ${stats.pendingOrders} قيد المراجعة).\n✦ إجمالي المبيعات: ${stats.totalRevenue} ج.م.\n✦ طلبات التصميم الخاص: ${stats.customRequests}.`
    : `✦ Total orders: ${stats.orderCount} (${stats.pendingOrders} pending).\n✦ Total revenue: ${stats.totalRevenue} EGP.\n✦ Custom design requests: ${stats.customRequests}.`;
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
