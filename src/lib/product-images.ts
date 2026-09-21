import labels from "@/assets/p-labels.jpg";
import planner from "@/assets/p-planner.jpg";
import wallart from "@/assets/p-wallart.jpg";
import stationery from "@/assets/p-stationery.jpg";
import invitation from "@/assets/p-invitation.jpg";
import classroom from "@/assets/p-classroom.jpg";
import branding from "@/assets/p-branding.jpg";
import tshirt from "@/assets/p-tshirt.jpg";
import mug from "@/assets/p-mug.jpg";
import hoodie from "@/assets/p-hoodie.jpg";
import kids from "@/assets/p-kids.jpg";

const bySlug: Record<string, string> = {
  "starlight-product-labels": labels,
  "constellation-digital-planner": planner,
  "celestial-wall-art-set": wallart,
  "stellar-stationery-set": stationery,
  "midnight-invitation-suite": invitation,
  "little-stars-classroom-pack": classroom,
  "stargazer-activity-book": kids,
  "brand-identity-package": branding,
  "social-media-template-pack": branding,
  "stellar-tshirt": tshirt,
  "stellar-mug": mug,
  "stellar-hoodie": hoodie,
  "luxe-gift-tags": stationery,
  "business-card-design": branding,
  "weekly-meal-planner": planner,
  "budget-tracker-printables": planner,
  "birthday-party-kit": kids,
  "custom-portrait-illustration": wallart,
};

export function productImage(slug: string, imageUrl?: string | null) {
  if (imageUrl) return imageUrl;
  return bySlug[slug] ?? stationery;
}
