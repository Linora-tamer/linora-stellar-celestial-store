import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const langSchema = z.enum(["en", "ar"]);

const chatSchema = z.object({
  conversation: z
    .array(z.object({ role: z.enum(["user", "model"]), text: z.string().min(1).max(4000) }))
    .min(1)
    .max(30),
  lang: langSchema,
});

const briefSchema = z.object({
  businessName: z.string().trim().min(1).max(120),
  industry: z.string().trim().min(1).max(120),
  vibe: z.string().trim().min(1).max(300),
  lang: langSchema,
});

const summarySchema = z.object({
  stats: z.object({
    orderCount: z.number().int().min(0),
    pendingOrders: z.number().int().min(0),
    totalRevenue: z.number().min(0),
    customRequests: z.number().int().min(0),
  }),
  lang: langSchema,
});

export type AiTextResult = { text: string | null };

/** Public chat assistant on the custom-orders page. */
export const askOrderingAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => chatSchema.parse(input))
  .handler(async ({ data }): Promise<AiTextResult> => {
    const { allow } = await import("./rate-limit.server");
    if (!allow("ai-chat", 20, 10 * 60_000)) return { text: null };

    const { generateText, orderingAssistantSystemPrompt } = await import("./gemini.server");
    const text = await generateText({
      contents: data.conversation.map((c) => ({ role: c.role, parts: [{ text: c.text }] })),
      systemInstruction: orderingAssistantSystemPrompt(data.lang),
      temperature: 0.7,
    });
    return { text };
  });

/** Public creative-brief generator on the custom-orders page. */
export const createCreativeBrief = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => briefSchema.parse(input))
  .handler(async ({ data }): Promise<AiTextResult> => {
    const { allow } = await import("./rate-limit.server");
    if (!allow("ai-brief", 10, 10 * 60_000)) return { text: null };

    const { generateText, creativeBriefPrompt } = await import("./gemini.server");
    const text = await generateText({
      contents: creativeBriefPrompt(data.businessName, data.industry, data.vibe, data.lang),
    });
    return { text };
  });

/** Owner-only dashboard summary. Requires a signed-in owner so strangers can't burn quota. */
export const createAdminSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => summarySchema.parse(input))
  .handler(async ({ data, context }): Promise<AiTextResult> => {
    const { data: isOwner, error } = await context.supabase.rpc("is_store_owner");
    if (error || !isOwner) throw new Error("Forbidden: owner access required");

    const { generateText, adminSummaryPrompt } = await import("./gemini.server");
    const text = await generateText({ contents: adminSummaryPrompt(data.stats, data.lang) });
    return { text };
  });
