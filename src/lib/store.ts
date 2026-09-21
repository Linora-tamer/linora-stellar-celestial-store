import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  customizable: boolean;
  details: unknown;
  sort_order: number;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type PaymentMethod = {
  id: string;
  code: string;
  label: string;
  instructions: string | null;
  account_number: string | null;
  is_active: boolean;
  sort_order: number;
};

export const productsQuery = {
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as Product[];
  },
};

export const categoriesQuery = {
  queryKey: ["categories"],
  queryFn: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as Category[];
  },
};

export const paymentMethodsQuery = {
  queryKey: ["payment_methods"],
  queryFn: async (): Promise<PaymentMethod[]> => {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as PaymentMethod[];
  },
};

export const settingsQuery = {
  queryKey: ["site_settings"],
  queryFn: async (): Promise<Record<string, string>> => {
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error) throw error;
    const out: Record<string, string> = {};
    for (const row of data ?? []) out[row.key] = row.value ?? "";
    return out;
  },
};

export function productDetails(details: unknown): string[] {
  if (Array.isArray(details)) return details.filter((d): d is string => typeof d === "string");
  return [];
}

export const CONTACT = {
  whatsapp: "+201040277935",
  whatsappLink: "https://wa.me/201040277935",
  email: "norafayed06@gmail.com",
  instagram: "https://instagram.com/linora.stellar",
  behance: "https://behance.net/norafayed1",
  linkedin: "https://linkedin.com/in/nora-tamer-b80704391",
};
