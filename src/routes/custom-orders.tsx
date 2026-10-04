import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Palette,
  FileText,
  Clock,
  CheckCircle2,
  Download,
  MessageCircle,
  HelpCircle,
  Eye,
  Sliders,
  ShieldCheck,
  Calculator,
  Bot,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { Star } from "@/components/site/Star";
import { DynamicCostEstimator } from "@/components/site/DynamicCostEstimator";
import { generateAICreativeBrief } from "@/lib/gemini";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { CONTACT } from "@/lib/store";

export const Route = createFileRoute("/custom-orders")({
  head: () => ({
    meta: [
      { title: "Custom Orders & Commissions — Linora Stellar" },
      {
        name: "description",
        content:
          "Interactive custom design commission process with Nora Tamer: Choose your theme, send your brief, review concepts, approve proofs, and receive your ready-to-print celestial designs.",
      },
      { property: "og:title", content: "Custom Orders — Linora Stellar" },
      {
        property: "og:description",
        content:
          "Commission bespoke celestial branding, printables, stationery and apparel in Egypt.",
      },
    ],
  }),
  component: CustomOrdersPage,
});

const THEMES = [
  {
    id: "celestial-navy",
    nameEn: "Celestial Midnight",
    nameAr: "الكحلي الفلكي الكلاسيكي",
    descEn: "Deep astronomical navy, metallic gold stars, and ivory typography.",
    descAr: "كحلي فلكي عميق مع نجوم ذهبية وطباعة بلون العاج الفاخر.",
    bg: "#05070E",
    accent: "#E0AD76",
    surface: "#101C34",
  },
  {
    id: "pastel-dawn",
    nameEn: "Dawn Blossom",
    nameAr: "فجر الباستيل الوردي",
    descEn: "Soft mauve, rose gold stars, and warm blush tones.",
    descAr: "درجات الورد والخوخ الهادئ مع نجوم وردية مضيئة.",
    bg: "#181420",
    accent: "#D9A08C",
    surface: "#2D2439",
  },
  {
    id: "royal-arabesque",
    nameEn: "Royal Arabesque",
    nameAr: "الذهب الملكي والأرابيسك",
    descEn: "Intricate geometric constellations, rich brass gold, and obsidian black.",
    descAr: "زخارف هندسية فلكية مع ذهب ملكي براق وخلفيات داكنة.",
    bg: "#101114",
    accent: "#DF9E64",
    surface: "#22232A",
  },
  {
    id: "fresh-daylight",
    nameEn: "Daylight Blue",
    nameAr: "الأزرق السماوي النقي",
    descEn: "Airy daylight blue, silver accents, and minimalist modern lines.",
    descAr: "أزرق سماوي نقي مع لمسات فضية وخطوط عصرية ناعمة.",
    bg: "#121A22",
    accent: "#91A9C7",
    surface: "#223145",
  },
];

const DESIGN_TYPES = [
  { id: "branding", en: "Logo & Brand Identity", ar: "شعار وهوية بصرية كاملة" },
  { id: "invitation", en: "Invitations & Stationery", ar: "دعوات زفاف ومناسبات" },
  { id: "planner", en: "Custom Digital Planner", ar: "مخطط رقمي مخصص" },
  { id: "classroom", en: "School & Classroom Pack", ar: "باقة مدرسية وفصول أطفال" },
  { id: "merch", en: "Apparel / Mug Merchandise", ar: "تصميم تيشيرت أو مج أو منتج" },
  { id: "illustration", en: "Custom Portrait / Digital Art", ar: "رسم بورتريه أو فن رقمي" },
];

function CustomOrdersPage() {
  const { user } = useAuth();
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTheme, setSelectedTheme] = useState<string>("celestial-navy");
  const [designType, setDesignType] = useState<string>("branding");
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    description: "",
    preferredColors: "",
    budget: "1000 - 3000 EGP",
    deadline: "1-2 weeks",
  });
  const [proofApproved, setProofApproved] = useState<boolean>(false);
  const [revisionNotes, setRevisionNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);

  // AI Creative Brief Generator & Cost Estimator states
  const [showEstimator, setShowEstimator] = useState<boolean>(false);
  const [showAiBriefModal, setShowAiBriefModal] = useState<boolean>(false);
  const [briefBizName, setBriefBizName] = useState<string>("");
  const [briefIndustry, setBriefIndustry] = useState<string>("");
  const [briefVibe, setBriefVibe] = useState<string>("");
  const [briefGenerating, setBriefGenerating] = useState<boolean>(false);

  async function handleGenerateBrief(e: React.FormEvent) {
    e.preventDefault();
    if (!briefBizName.trim()) {
      toast.error(isAr ? "يرجى إدخال اسم البراند أو المشروع" : "Please enter your brand name");
      return;
    }
    setBriefGenerating(true);
    try {
      const res = await generateAICreativeBrief(
        briefBizName.trim(),
        briefIndustry.trim() || "Lifestyle & Creative Studio",
        briefVibe.trim() || "Celestial luxury, deep navy and radiant gold",
        lang,
      );
      if (typeof res === "string" && res) {
        setFormData((prev) => ({
          ...prev,
          description: res,
          preferredColors: "Midnight Navy (#080D1A), Radiant Gold (#DFAD71), Ivory (#FFF6ED)",
        }));
      } else if (typeof res === "object" && res) {
        const text = `${res.brandPersona}\n\n• Typography: ${res.typography}\n• Motifs: ${res.motifs}\n• Deliverables: ${res.deliverables?.join(", ")}`;
        const colors = res.palette
          ?.map((p: { name: string; hex: string }) => `${p.name} (${p.hex})`)
          .join(", ");
        setFormData((prev) => ({
          ...prev,
          description: text,
          preferredColors: colors || prev.preferredColors,
        }));
      }
      setShowAiBriefModal(false);
      toast.success(
        isAr
          ? "تم توليد وتعبئة بريف التصميم بنجاح! ✦"
          : "Creative brief generated & auto-filled! ✦",
      );
    } catch {
      toast.error("Failed to generate brief. Please try again.");
    } finally {
      setBriefGenerating(false);
    }
  }

  function handleApplyEstimate(details: {
    totalPrice: number;
    totalDays: number;
    summaryText: string;
  }) {
    setFormData((prev) => ({
      ...prev,
      budget: `${details.totalPrice} EGP`,
      deadline: `${details.totalDays} business days`,
      description: prev.description
        ? `${prev.description}\n\n[Estimated Scope: ${details.summaryText}]`
        : `[Estimated Scope: ${details.summaryText}]`,
    }));
    setShowEstimator(false);
    toast.success(isAr ? "تم تطبيق تفاصيل التكلفة المقدرة!" : "Estimate details applied to form!");
  }

  const STEPS = [
    { num: 1, title: isAr ? "اختيار الطابع" : "Choose your theme" },
    { num: 2, title: isAr ? "تفاصيل الطلب" : "Send your details" },
    { num: 3, title: isAr ? "خطة التصميم" : "We design for you" },
    { num: 4, title: isAr ? "المعاينة والاعتماد" : "You approve" },
    { num: 5, title: isAr ? "استلام التصميم" : "Your design is ready" },
  ];

  async function handleFinalSubmit() {
    setSubmitting(true);
    const chosenThemeObj = THEMES.find((t) => t.id === selectedTheme);

    const fullDesc = `
Theme: ${chosenThemeObj?.nameEn || selectedTheme}
Client Brief: ${formData.description}
Revision Notes: ${revisionNotes || "Approved in simulator"}
Budget: ${formData.budget}
Deadline: ${formData.deadline}
Colors: ${formData.preferredColors}
    `.trim();

    const { error } = await supabase.from("custom_orders").insert({
      user_id: user?.id ?? null,
      name: formData.name.trim() || "Celestial Client",
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      design_type: designType,
      description: fullDesc,
      preferred_style: chosenThemeObj?.nameEn || selectedTheme,
      preferred_colors: formData.preferredColors,
      budget: formData.budget,
      deadline: formData.deadline,
      status: "pending",
    });

    setSubmitting(false);

    if (error) {
      toast.error(
        isAr
          ? "حدث خطأ أثناء الإرسال، يرجى المحاولة ثانية"
          : "Submission failed. Please try again.",
      );
      return;
    }

    setOrderComplete(true);
    toast.success(
      isAr ? "تم إرسال طلب التصميم المخصص بنجاح!" : "Custom design brief sent successfully!",
    );
  }

  // Pre-formatted WhatsApp link for step 5
  const whatsappBriefMsg = `
🌟 *New Custom Design Request — Linora Stellar*
Name: ${formData.name}
Phone: ${formData.phone}
Project: ${designType}
Theme: ${THEMES.find((t) => t.id === selectedTheme)?.nameEn}
Budget: ${formData.budget}
Deadline: ${formData.deadline}
Brief: ${formData.description}
  `.trim();

  const whatsappUrl = `${CONTACT.whatsappLink}?text=${encodeURIComponent(whatsappBriefMsg)}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-accent">
          <Star className="h-3.5 w-3.5 text-accent" />
          <span>{isAr ? "الطلبات والتصميمات الخاصة" : "Custom Made for You"}</span>
        </p>

        <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-text-primary">
          {isAr ? "صممي فكرتك مع نورا تامر" : "Your Vision, Drawn Among the Stars"}
        </h1>

        <p className="mt-3 text-sm sm:text-base leading-relaxed text-text-secondary">
          {isAr
            ? "عملية تفاعلية واضحة من 5 خطوات لتحويل فكرتك إلى هوية فلكية أو مطبوعات مميزة."
            : "An interactive, transparent 5-step journey: choose your aesthetic, share your brief, and receive tailored celestial files."}
        </p>
      </div>

      {/* 5-Step Visual Wizard Navigation */}
      <div className="mt-12 overflow-x-auto pb-4">
        <div className="flex items-center justify-between min-w-[620px] border-b border-border/80 pb-6 px-2">
          {STEPS.map((step, idx) => {
            const isPassed = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div key={step.num} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    // Only allow clicking to current or completed steps
                    if (step.num <= currentStep || isPassed) {
                      setCurrentStep(step.num);
                    }
                  }}
                  className={`flex items-center gap-2.5 transition-colors ${
                    isCurrent
                      ? "text-accent font-semibold"
                      : isPassed
                        ? "text-text-primary hover:text-accent"
                        : "text-text-secondary opacity-60"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-accent text-background shadow-xs ring-4 ring-accent/20"
                        : isPassed
                          ? "bg-accent/20 text-accent border border-accent/40"
                          : "border border-border bg-surface text-text-secondary"
                    }`}
                  >
                    {isPassed ? <Check className="h-4 w-4" /> : step.num}
                  </span>
                  <span className="text-xs uppercase tracking-wider whitespace-nowrap">
                    {step.title}
                  </span>
                </button>

                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-[1px] w-8 sm:w-12 transition-colors ${
                      isPassed ? "bg-accent" : "bg-border/60"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP CONTAINER */}
      <div className="mt-8">
        {/* ================= STEP 1: CHOOSE YOUR THEME ================= */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="font-display text-3xl text-text-primary">
                {isAr
                  ? "الخطوة الأولى: اختاري الطابع الفلكي المفضل"
                  : "Step 1: Choose Your Aesthetic Theme"}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {isAr
                  ? "حددي لوحة الألوان والأسلوب البصري الذي ترغبين بتطبيقه على مشروعك:"
                  : "Select the celestial mood, palette, and style that best embodies your project:"}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {THEMES.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`card-star cursor-pointer rounded-2xl border p-6 transition-all ${
                      isSelected
                        ? "border-accent bg-accent/10 shadow-lg ring-2 ring-accent/30"
                        : "border-border bg-surface hover:border-accent/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-5 w-5 rounded-full border border-black/20"
                          style={{ backgroundColor: theme.accent }}
                        />
                        <span
                          className="h-5 w-5 rounded-full border border-black/20"
                          style={{ backgroundColor: theme.surface }}
                        />
                        <span
                          className="h-5 w-5 rounded-full border border-black/20"
                          style={{ backgroundColor: theme.bg }}
                        />
                      </div>
                      {isSelected && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-background text-xs font-bold">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 font-display text-2xl text-text-primary">
                      {isAr ? theme.nameAr : theme.nameEn}
                    </h3>
                    <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                      {isAr ? theme.descAr : theme.descEn}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 shadow-xs"
              >
                <span>{isAr ? "متابعة لتفاصيل الطلب" : "Continue to Project Details"}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SEND YOUR DETAILS ================= */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="font-display text-3xl text-text-primary">
                {isAr
                  ? "الخطوة الثانية: أرسلي تفاصيل ومتطلبات التصميم"
                  : "Step 2: Share Your Project Brief"}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {isAr
                  ? "أخبرينا عن نوع التصميم، المقاسات، والبيانات التي تريدين إضافتها:"
                  : "Tell us about your brand vision, dimensions, deliverables, and timeline requirements:"}
              </p>
            </div>

            {/* Undecided Clients Helper Tools: AI Creative Brief Generator & Cost Estimator */}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setShowAiBriefModal(true)}
                className="group flex items-center justify-between rounded-xl border border-accent/60 bg-accent/10 p-4 text-start transition-all hover:bg-accent hover:text-background shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent group-hover:bg-background group-hover:text-foreground">
                    <Wand2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">
                      {isAr
                        ? "مساعد صياغة البريف بالذكاء الاصطناعي ✨"
                        : "AI Creative Brief Generator ✨"}
                    </h3>
                    <p className="text-xs opacity-80">
                      {isAr
                        ? "أدخلي كلمات بسيطة وسيقوم الذكاء الاصطناعي بصياغة طلبك واقتراح الألوان"
                        : "Enter basic keywords & AI generates a full design brief & palette"}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 rtl:rotate-180 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setShowEstimator(!showEstimator)}
                className="group flex items-center justify-between rounded-xl border border-border bg-surface p-4 text-start transition-all hover:border-accent hover:shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated text-accent group-hover:bg-accent group-hover:text-background">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      {isAr ? "حاسبة تكلفة ومكونات المشروع 🧮" : "Dynamic Design Cost Estimator 🧮"}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      {isAr
                        ? "حددي نطاق التصاميم واحصلي على السعر ومدة التنفيذ فورياً"
                        : "Pick logo, cards, revisions & calculate exact scope & price"}
                    </p>
                  </div>
                </div>
                <Sliders className="h-4 w-4 text-accent shrink-0" />
              </button>
            </div>

            {/* Embedded Dynamic Cost Estimator if toggled */}
            {showEstimator && (
              <div className="rounded-2xl border border-accent/40 bg-surface/90 p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                  <h4 className="text-xs uppercase tracking-wider text-accent font-semibold flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    <span>
                      {isAr
                        ? "حاسبة تفاصيل التكلفة التقديرية"
                        : "Interactive Project Scope Calculator"}
                    </span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowEstimator(false)}
                    className="text-xs text-text-secondary hover:text-text-primary underline"
                  >
                    {isAr ? "إغلاق الحاسبة" : "Close Estimator"}
                  </button>
                </div>
                <DynamicCostEstimator onApplyEstimate={handleApplyEstimate} />
              </div>
            )}

            <div className="card-star rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
              {/* Design Type Pills */}
              <div>
                <label className="text-xs uppercase tracking-wider text-text-secondary font-semibold block mb-2">
                  {isAr ? "نوع التصميم المطلوب" : "Type of Design"}
                </label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {DESIGN_TYPES.map((dt) => (
                    <button
                      key={dt.id}
                      type="button"
                      onClick={() => setDesignType(dt.id)}
                      className={`rounded-xl border p-3 text-xs text-start transition-all ${
                        designType === dt.id
                          ? "border-accent bg-accent/15 text-text-primary font-semibold"
                          : "border-border/70 hover:border-accent/60 text-text-secondary"
                      }`}
                    >
                      {isAr ? dt.ar : dt.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Inputs */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1">
                    {isAr ? "الاسم الكريم *" : "Your Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Mansour"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1">
                    {isAr ? "البريد الإلكتروني *" : "Email Address *"}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1">
                    {isAr ? "رقم الهاتف / واتساب *" : "Phone or WhatsApp *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="010xxxxxxxx"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Project Brief Description */}
              <div>
                <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1">
                  {isAr
                    ? "وصف المشروع والتفاصيل المطلوبة *"
                    : "Project Description & Specific Requirements *"}
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={
                    isAr
                      ? "اكتبي أسماء العناصر، النصوص المراد تضمينها، المقاس المطلوب، أو أي تفاصيل خاصة..."
                      : "Describe your brand values, names to include, specific wording, dimensions, or references..."
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent leading-relaxed"
                />
              </div>

              {/* Deadline & Budget */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1">
                    {isAr ? "الموعد النهائي المستهدف" : "Target Deadline"}
                  </label>
                  <select
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    <option value="urgent (3-5 days)">Urgent (3–5 business days)</option>
                    <option value="1-2 weeks">Standard (1–2 weeks)</option>
                    <option value="flexible">Flexible / Next Month</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1">
                    {isAr ? "الميزانية التقديرية" : "Estimated Budget"}
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    <option value="under 1000 EGP">Under 1,000 EGP (Single printable/item)</option>
                    <option value="1000 - 3000 EGP">
                      1,000 – 3,000 EGP (Stationery suite / Kit)
                    </option>
                    <option value="3000 - 6000 EGP">3,000 – 6,000 EGP (Full Brand Identity)</option>
                    <option value="6000+ EGP">6,000+ EGP (Bespoke Enterprise Package)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-xs uppercase tracking-wider text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                <span>{isAr ? "السابق" : "Back"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
                    toast.error(
                      isAr
                        ? "يرجى كتابة الاسم ورقم الهاتف والبريد"
                        : "Please provide your name, email and phone.",
                    );
                    return;
                  }
                  setCurrentStep(3);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 shadow-xs"
              >
                <span>{isAr ? "متابعة لخطة التنفيذ" : "Continue to Design Phase"}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: WE DESIGN FOR YOU ================= */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="font-display text-3xl text-text-primary">
                {isAr ? "الخطوة الثالثة: كيف نقوم بتصميم مشروعك" : "Step 3: We Design For You"}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {isAr
                  ? "جدول زمني ومراحل العمل المتبعة من نورا تامر لضمان خروج التصميم بأعلى جودة:"
                  : "Here is the exact studio workflow Nora Tamer executes to bring your bespoke concept to life:"}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="card-star rounded-2xl border border-border bg-surface p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-sm mb-4">
                  01
                </span>
                <h3 className="font-display text-xl text-text-primary">
                  {isAr ? "البحث والمسودات الأولية" : "Concept & Moodboarding"}
                </h3>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {isAr
                    ? "تحليل المتطلبات واختيار الخطوط والأشكال الفلكية المناسبة وتقديم 2-3 خيارات تصميم أولية."
                    : "Exploring letterforms, drafting celestial constellations, and preparing 2–3 initial design avenues within 48 hours."}
                </p>
                <div className="mt-4 pt-3 border-t border-border/50 text-[11px] text-accent font-mono">
                  Timeline: 24–48 Hours
                </div>
              </div>

              <div className="card-star rounded-2xl border border-border bg-surface p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-sm mb-4">
                  02
                </span>
                <h3 className="font-display text-xl text-text-primary">
                  {isAr ? "التنفيذ وضبط التناغم" : "Typography & Refinement"}
                </h3>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {isAr
                    ? "رسم الفيكتور بجودة طباعة فائقة وضبط التوازن البصري وهوامش القص والتلوين الدقيق."
                    : "Refining vector bezier curves, fine-tuning typography kerning, and preparing press-ready bleed specifications."}
                </p>
                <div className="mt-4 pt-3 border-t border-border/50 text-[11px] text-accent font-mono">
                  Timeline: 48–72 Hours
                </div>
              </div>

              <div className="card-star rounded-2xl border border-border bg-surface p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-sm mb-4">
                  03
                </span>
                <h3 className="font-display text-xl text-text-primary">
                  {isAr ? "إرسال بروفة المعاينة" : "Digital Proof Presentation"}
                </h3>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {isAr
                    ? "إرسال بروفة رقمية عالية الدقة مشروحة عبر واتساب وبريدك لاعتمادها أو طلب أي تعديلات."
                    : "Delivering a clear digital proof mock-up for your personal review, feedback notes, and sign-off."}
                </p>
                <div className="mt-4 pt-3 border-t border-border/50 text-[11px] text-accent font-mono">
                  Includes 2 Revision Rounds
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-xs uppercase tracking-wider text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                <span>{isAr ? "السابق" : "Back"}</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 shadow-xs"
              >
                <span>{isAr ? "متابعة لمعاينة البروفة" : "Proceed to Proof Approval"}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: YOU APPROVE ================= */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="font-display text-3xl text-text-primary">
                {isAr
                  ? "الخطوة الرابعة: بروفة المعاينة والاعتماد"
                  : "Step 4: Interactive Proof Sign-Off"}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {isAr
                  ? "معاينة تفاعلية لكيفية ظهور التصميم المخصص ومطابقته لرغبتك قبل التسليم النهائي:"
                  : "Preview how your custom proof will appear, submit revisions, or approve to proceed to final delivery:"}
              </p>
            </div>

            {/* Proof Simulator Box */}
            <div className="card-star rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-2 items-center">
                {/* Proof Visual */}
                <div className="relative aspect-square rounded-xl border border-accent/40 bg-background/90 p-8 flex flex-col items-center justify-center text-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                  <Star className="h-10 w-10 text-accent mb-4" />
                  <p className="font-display text-3xl text-text-primary font-semibold">
                    {formData.name || "Client Name"}
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-accent mt-1">
                    {THEMES.find((t) => t.id === selectedTheme)?.nameEn}
                  </p>
                  <p className="text-[11px] text-text-secondary max-w-xs mt-3 line-clamp-2">
                    {formData.description ||
                      "Custom bespoke celestial design tailored to your vision."}
                  </p>

                  <div className="absolute bottom-3 end-3 rounded-full bg-accent/20 px-2.5 py-0.5 text-[9px] font-mono text-accent">
                    PROOF SAMPLE • 300 DPI
                  </div>
                </div>

                {/* Approval Controls */}
                <div className="space-y-4">
                  <div className="rounded-xl border border-border/80 bg-surface-elevated p-4">
                    <p className="text-xs font-semibold text-text-primary mb-1">
                      {isAr ? "خيارات الاعتماد والمراجعة:" : "Approval & Revision Options:"}
                    </p>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {isAr
                        ? "يمكنك طلب تعديل الألوان أو حجم الخطوط أو اعتماد المسودة مباشرة:"
                        : "You can request tweaks to colors, typography, or sign off directly for print:"}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setProofApproved(!proofApproved);
                          if (!proofApproved) {
                            toast.success(
                              isAr
                                ? "تم اعتماد البروفة المبدئية بنجاح!"
                                : "Proof marked as approved!",
                            );
                          }
                        }}
                        className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                          proofApproved
                            ? "bg-emerald-500 text-white shadow-xs"
                            : "border border-border bg-surface text-text-secondary hover:border-accent"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>{proofApproved ? "Approved ✓" : "Mark as Approved"}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1">
                      {isAr ? "ملاحظات التعديل (اختياري)" : "Specific Revision Notes (Optional)"}
                    </label>
                    <textarea
                      rows={3}
                      value={revisionNotes}
                      onChange={(e) => setRevisionNotes(e.target.value)}
                      placeholder={
                        isAr
                          ? "اكتبي أي تغييرات مرغوبة في الألوان أو الخط أو التفاصيل..."
                          : "Any specific tweaks needed for font size, star placement, or text..."
                      }
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-xs uppercase tracking-wider text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                <span>{isAr ? "السابق" : "Back"}</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 shadow-xs"
              >
                <span>{isAr ? "متابعة لتجهيز ملفاتك" : "Continue to Final Delivery"}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: YOUR DESIGN IS READY ================= */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="font-display text-3xl text-text-primary">
                {isAr ? "الخطوة الخامسة: استلام التصميم النهائي" : "Step 5: Your Design is Ready"}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {isAr
                  ? "تأكيد واستلام ملفاتك النهائية بجميع الصيغ المعتمدة مع الدعم الكامل:"
                  : "Final sign-off, deliverable format confirmation, and direct WhatsApp liaison with Nora Tamer:"}
              </p>
            </div>

            <div className="card-star rounded-2xl border border-accent/40 bg-surface p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="h-5 w-5" />
                <span>
                  {isAr
                    ? "ملخص طلب التصميم المخصص جاهز للإرسال"
                    : "Custom Design Brief Compiled & Ready"}
                </span>
              </div>

              <div className="rounded-xl border border-border/80 bg-background/60 p-5 space-y-3 text-xs">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <span className="text-text-secondary block">Client:</span>
                    <span className="font-semibold text-text-primary">
                      {formData.name || "Valued Client"}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-secondary block">Contact Phone:</span>
                    <span className="font-mono text-text-primary">{formData.phone || "—"}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary block">Design Type:</span>
                    <span className="font-semibold text-accent">{designType}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary block">Theme:</span>
                    <span className="font-semibold text-text-primary">
                      {THEMES.find((t) => t.id === selectedTheme)?.nameEn}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <span className="text-text-secondary block mb-1">Deliverables Included:</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-accent/15 px-3 py-1 text-accent font-mono text-[11px]">
                      ✦ High-Res Print PDF (300 DPI)
                    </span>
                    <span className="rounded-full bg-accent/15 px-3 py-1 text-accent font-mono text-[11px]">
                      ✦ Vector SVG / Illustrator
                    </span>
                    <span className="rounded-full bg-accent/15 px-3 py-1 text-accent font-mono text-[11px]">
                      ✦ Transparent PNGs
                    </span>
                    <span className="rounded-full bg-accent/15 px-3 py-1 text-accent font-mono text-[11px]">
                      ✦ Canva Editable Link
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-text-secondary hover:text-text-primary"
                >
                  <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                  <span>{isAr ? "مراجعة الخطوة السابقة" : "Edit Previous Steps"}</span>
                </button>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-500 shadow-md transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{isAr ? "إرسال الطلب عبر واتساب" : "Send Brief via WhatsApp"}</span>
                  </a>

                  <button
                    type="button"
                    disabled={submitting || orderComplete}
                    onClick={handleFinalSubmit}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 shadow-xs transition-opacity disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {submitting
                        ? isAr
                          ? "جارِ الإرسال..."
                          : "Submitting..."
                        : orderComplete
                          ? isAr
                            ? "تم الإرسال بنجاح ✓"
                            : "Brief Submitted ✓"
                          : isAr
                            ? "تأكيد وحفظ الطلب"
                            : "Submit Custom Brief"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Creative Brief Generator Modal for Undecided Clients */}
      {showAiBriefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
            onClick={() => setShowAiBriefModal(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-xl rounded-2xl border border-accent/60 bg-surface p-6 sm:p-8 shadow-2xl card-star z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 text-accent">
                  <Wand2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-text-primary">
                    {isAr ? "مساعد صياغة البريف الذكي ✦" : "AI Creative Brief Generator ✦"}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {isAr
                      ? "اكتبي كلمات مفتاحية وسيقوم الذكاء الاصطناعي بصياغة طلبك واقتراح الألوان"
                      : "Input simple keywords & Gemini will build your professional brief"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiBriefModal(false)}
                className="rounded-full border border-border p-1.5 text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateBrief} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1 font-semibold">
                  {isAr ? "اسم المشروع أو العلامة التجارية *" : "Brand or Business Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={briefBizName}
                  onChange={(e) => setBriefBizName(e.target.value)}
                  placeholder="e.g. Luna Specialty Cafe, Little Stargazers Academy"
                  className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1 font-semibold">
                  {isAr ? "المجال أو نوع النشاط" : "Industry / Activity"}
                </label>
                <input
                  type="text"
                  value={briefIndustry}
                  onChange={(e) => setBriefIndustry(e.target.value)}
                  placeholder="e.g. Specialty Coffee & Pastry, Kids Montessori, Luxury Wedding"
                  className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-text-secondary block mb-1 font-semibold">
                  {isAr ? "الطابع المرغوب (الفايب)" : "Desired Style & Vibe"}
                </label>
                <input
                  type="text"
                  value={briefVibe}
                  onChange={(e) => setBriefVibe(e.target.value)}
                  placeholder="e.g. Celestial quiet luxury, starry navy and gold foil, warm minimalist"
                  className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAiBriefModal(false)}
                  className="rounded-full border border-border px-5 py-2 text-xs uppercase tracking-wider text-text-secondary hover:text-text-primary"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={briefGenerating}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 disabled:opacity-50 shadow-xs"
                >
                  <Sparkles className={`h-4 w-4 ${briefGenerating ? "animate-spin" : ""}`} />
                  <span>
                    {briefGenerating
                      ? isAr
                        ? "جارِ الصياغة..."
                        : "Generating Brief…"
                      : isAr
                        ? "توليد وتطبيق البريف ✨"
                        : "Generate & Apply Brief ✨"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
