import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Info, MapPin, Sparkles, Truck } from "lucide-react";
import { formatPrice } from "@/lib/cart";
import { SHIPPING_ZONES } from "@/lib/egypt-shipping";
import { useI18n } from "@/lib/i18n";

export function ShippingZonesCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const { lang } = useI18n();
  const isAr = lang === "ar";

  return (
    <div className="card-star overflow-hidden rounded-xl border border-border/80 text-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-start font-medium transition-colors hover:text-gold"
      >
        <span className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-gold" />
          <span>
            {isAr ? "دليل مناطق ومواعيد الشحن في مصر" : "Egypt Shipping Zones & Delivery Rates"}
          </span>
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {open && (
        <div className="border-t border-border/60 bg-background/50 p-4 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isAr
              ? "يتم شحن جميع الطلبات المطبوعة والمنتجات بعناية تامة إلى باب منزلك مع شركات شحن موثوقة في جميع محافظات مصر."
              : "All printed stationery, custom items, and merch are carefully packaged and delivered directly to your doorstep across Egypt."}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {SHIPPING_ZONES.map((zone) => (
              <div
                key={zone.id}
                className="rounded-lg border border-border/70 bg-card/60 p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {isAr ? zone.titleAr : zone.titleEn}
                    </span>
                    <span className="font-semibold text-gold">{formatPrice(zone.fee)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 text-gold/70" />
                    <span>{isAr ? zone.timeAr : zone.timeEn}</span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground line-clamp-2">
                  <MapPin className="inline h-2.5 w-2.5 me-1 text-gold/60" />
                  {zone.governorates.join(", ")}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-200/90 leading-relaxed">
              <span className="font-semibold text-emerald-300">
                {isAr ? "التنزيلات الرقمية والهويات البصرية: " : "Digital Downloads & Branding: "}
              </span>
              {isAr
                ? "مجانية 100% بدون أي مصاريف شحن، وتصلك مباشرة وفورياً إلى بريدك الإلكتروني وواتساب."
                : "100% Free with zero shipping fees. Delivered directly and instantly via Email & WhatsApp."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
