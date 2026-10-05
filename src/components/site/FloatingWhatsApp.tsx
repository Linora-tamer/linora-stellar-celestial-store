import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { CONTACT } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export function FloatingWhatsApp() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const [bubbleOpen, setBubbleOpen] = useState(true);

  return (
    <div className="fixed bottom-20 end-4 z-40 lg:bottom-6 lg:end-6 flex flex-col items-end pointer-events-auto">
      {/* Floating greeting bubble */}
      {bubbleOpen && (
        <div className="mb-2 relative flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-surface/95 px-3 py-2 text-xs text-text-primary shadow-xl backdrop-blur-md max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <p className="text-[11px] leading-tight">
            {isAr
              ? "مرحباً! تواصلي مع نورا مباشرة للاستفسارات والطلبات الخاصة 💬"
              : "Hi! Chat directly with Nora for custom design inquiries 💬"}
          </p>
          <button
            type="button"
            onClick={() => setBubbleOpen(false)}
            className="text-text-secondary hover:text-text-primary p-0.5"
            aria-label="Dismiss message"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* WhatsApp Action Button */}
      <a
        href={CONTACT.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[#25D366]/40 active:scale-95"
        title={isAr ? "محادثة واتساب مباشرة مع المصممة" : "Chat on WhatsApp"}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 fill-white text-[#25D366] transition-transform group-hover:rotate-12" />
        <span className="sr-only">WhatsApp</span>
      </a>
    </div>
  );
}
