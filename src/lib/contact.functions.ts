import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(1).max(2000),
});

const customOrderSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  designType: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(5000),
  preferredStyle: z.string().trim().max(200).optional(),
  preferredColors: z.string().trim().max(500).optional(),
  budget: z.string().trim().max(120).optional(),
  deadline: z.string().trim().max(120).optional(),
  referenceUrl: z.string().trim().max(500).optional(),
});

export type ServerSubmitResult = { ok: boolean; emailed: boolean };

/** Contact form: saves the message (so it shows in /admin) and emails the owner. */
export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }): Promise<ServerSubmitResult> => {
    const { allow } = await import("./rate-limit.server");
    if (!allow("contact", 5, 10 * 60_000)) return { ok: false, emailed: false };

    const { isSupabaseServerConfigured, OWNER_EMAIL } = await import("./env.server");
    if (!isSupabaseServerConfigured()) return { ok: false, emailed: false };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject || null,
      message: data.message,
    });
    if (error) {
      console.error("[contact] insert failed:", error);
      return { ok: false, emailed: false };
    }

    const { ownerContactEmail, sendEmail } = await import("./email.server");
    const mail = ownerContactEmail(data);
    const emailed = await sendEmail({
      to: OWNER_EMAIL,
      subject: mail.subject,
      html: mail.html,
      replyTo: data.email,
    });
    return { ok: true, emailed };
  });

/** Custom design request: saves it (visible in /admin) and emails the owner. */
export const submitCustomOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => customOrderSchema.parse(input))
  .handler(async ({ data }): Promise<ServerSubmitResult> => {
    const { allow } = await import("./rate-limit.server");
    if (!allow("custom-order", 5, 10 * 60_000)) return { ok: false, emailed: false };

    const { isSupabaseServerConfigured, OWNER_EMAIL } = await import("./env.server");
    if (!isSupabaseServerConfigured()) return { ok: false, emailed: false };

    const { optionalUserId } = await import("./orders.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const row = {
      user_id: await optionalUserId(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      design_type: data.designType,
      description: data.description,
      preferred_style: data.preferredStyle || null,
      preferred_colors: data.preferredColors || null,
      budget: data.budget || null,
      deadline: data.deadline || null,
      reference_url: data.referenceUrl || null,
      status: "pending",
    };
    const { error } = await supabaseAdmin.from("custom_orders").insert(row);
    if (error) {
      console.error("[custom-order] insert failed:", error);
      return { ok: false, emailed: false };
    }

    const { ownerCustomOrderEmail, sendEmail } = await import("./email.server");
    const mail = ownerCustomOrderEmail(row);
    const emailed = await sendEmail({
      to: OWNER_EMAIL,
      subject: mail.subject,
      html: mail.html,
      replyTo: data.email,
    });
    return { ok: true, emailed };
  });
