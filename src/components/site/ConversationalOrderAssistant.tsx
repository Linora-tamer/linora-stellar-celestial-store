import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  X,
  MessageCircle,
  ArrowRight,
  Clock,
  DollarSign,
  Palette,
  CheckCircle2,
} from "lucide-react";
import { askGeminiOrderingAssistant } from "@/lib/gemini";
import { useI18n } from "@/lib/i18n";
import { CONTACT } from "@/lib/store";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  structuredOrder?: {
    readyToOrder: boolean;
    packageTitle: string;
    estimatedPrice: string;
    turnaround: string;
    recommendedColors?: string[];
  };
}

export function ConversationalOrderAssistant({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "model",
      text: isAr
        ? "أهلاً بكِ في استوديو لينورا ستيلر! أنا مساعدكِ الذكي لمساعدتكِ في تحديد أفضل تصميم لمشروعكِ أو طلبيتكِ بدون ملء استمارات طويلة. ما الذي تودين تصميمه اليوم؟ ✦"
        : "Welcome to Linora Stellar! I am your AI Design Assistant. Rather than filling out long forms, tell me what you would like designed today (e.g., 'A modern bakery brand identity' or 'Kids school labels') and I'll create your custom package! ✦",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const quickPrompts = isAr
    ? [
        "أحتاج هوية بصرية كاملة لمقهى كلاسيكي فخم",
        "ملصقات أسماء مدرسية مقاومة للماء لأطفالي",
        "دعوة زفاف فلكية فاخرة بالختم الشمعي",
        "مخطط رقمي مخصص لجهاز الآيباد",
      ]
    : [
        "I need a brand identity for a luxury cafe",
        "Personalized waterproof school labels for my kids",
        "Celestial wax-seal wedding invitation suite",
        "Custom GoodNotes digital life planner",
      ];

  async function handleSend(textToSend?: string) {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const history = newMessages.map((m) => ({ role: m.role, text: m.text }));
      const reply = await askGeminiOrderingAssistant(history, lang);

      // Check if there is a JSON order block in response
      let parsedOrder: Message["structuredOrder"] = undefined;
      const jsonMatch = reply.match(/```json\s*([\s\S]*?)\s*```/);
      let cleanText = reply;

      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedOrder = JSON.parse(jsonMatch[1]);
          cleanText = reply.replace(/```json[\s\S]*?```/, "").trim();
        } catch {
          // ignore parsing error
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: cleanText,
          structuredOrder: parsedOrder,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: isAr
            ? "شكراً لتفاصيلكِ! تم تلخيص طلبك وسأقوم بتجهيز مسودة مخصصة لكِ للتواصل المباشر مع المصممة نورا تامر."
            : "Thank you for the details! I have prepared a scoped package summary ready to send to Nora Tamer.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Chat Window */}
      <div className="relative flex flex-col w-full max-w-xl h-[85vh] rounded-2xl border border-accent/40 bg-surface shadow-2xl card-star overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 bg-surface-elevated px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-background shadow-xs">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg text-text-primary font-semibold">
                  {isAr ? "مساعد لينورا لتصميم طلبك الذكي" : "Linora AI Design Ordering Assistant"}
                </h3>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[9px] font-bold text-emerald-400">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-text-secondary">
                {isAr
                  ? "محادثة طبيعية لتحديد طلبك وتوليد مسودة تنفيذ فورية"
                  : "Chat naturally to scope custom designs and get instant quotes"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-accent text-background font-medium rounded-ee-xs shadow-xs"
                    : "bg-surface-elevated border border-border text-text-primary rounded-es-xs"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {/* Structured Order Card */}
                {m.structuredOrder && (
                  <div className="mt-4 pt-3 border-t border-border/60 bg-background/50 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-accent font-bold">
                        ✦ {isAr ? "ملخص الباقة المقترحة" : "Recommended Scoped Package"}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {m.structuredOrder.estimatedPrice}
                      </span>
                    </div>

                    <h4 className="font-display text-base font-semibold text-text-primary">
                      {m.structuredOrder.packageTitle}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-accent" />
                        {m.structuredOrder.turnaround}
                      </span>
                      {m.structuredOrder.recommendedColors && (
                        <div className="flex items-center gap-1">
                          <Palette className="h-3 w-3 text-accent" />
                          <div className="flex gap-1 ms-1">
                            {m.structuredOrder.recommendedColors.map((hex, i) => (
                              <span
                                key={i}
                                className="h-3 w-3 rounded-full border border-white/20"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Direct WhatsApp Confirmation Button */}
                    <a
                      href={`${CONTACT.whatsappLink}?text=${encodeURIComponent(
                        `Hi Nora! Your AI Design Assistant scoped this project for me:\nPackage: ${m.structuredOrder.packageTitle}\nEstimate: ${m.structuredOrder.estimatedPrice}\nTurnaround: ${m.structuredOrder.turnaround}`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-500 transition-colors shadow-xs"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>
                        {isAr ? "إرسال هذا الطلب لواتساب نورا مباشرة" : "Submit Scope to WhatsApp"}
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-text-secondary p-2">
              <Sparkles className="h-4 w-4 text-accent animate-spin" />
              <span>
                {isAr
                  ? "المساعد يفكر ويحلل متطلباتكِ..."
                  : "AI Assistant is crafting your package..."}
              </span>
            </div>
          )}
        </div>

        {/* Quick suggestions */}
        <div className="px-4 py-2 border-t border-border/50 bg-surface/50 flex flex-wrap gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(p)}
              className="rounded-full border border-border/80 bg-surface px-2.5 py-1 text-[11px] text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 border-t border-border/80 bg-surface-elevated flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isAr
                ? "اكتبي ما تحتاجين تصميمه أو اسألي عن الباقات..."
                : "Type what you need or ask for package recommendations..."
            }
            className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-xs sm:text-sm text-text-primary outline-none focus:border-accent transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-background hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0 shadow-xs"
            aria-label="Send"
          >
            <Send className="h-4 w-4 rtl:rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
}
