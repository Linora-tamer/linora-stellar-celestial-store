import { supabase } from "@/integrations/supabase/client";

import { hasBackend } from "./backend";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

/**
 * Uploads a product image to the public `product-images` Supabase bucket and returns its
 * public URL. In preview mode (no Supabase) it returns a data URL so the UI still works.
 * Throws an Error with a user-readable message on invalid files or upload failure.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!ALLOWED.includes(file.type)) throw new Error("Please choose a JPG, PNG, WebP, GIF or AVIF image.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image is too large (max 5 MB).");

  if (!hasBackend) {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read the file."));
      reader.readAsDataURL(file);
    });
  }

  const ext = file.type.split("/")[1] ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message || "Upload failed.");
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}
