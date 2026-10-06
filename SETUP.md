# Linora Stellar — going live

Without any keys the site runs on an in-browser mock store (preview only: no emails, no card payments).

## 1. Supabase
1. Create a project. Run the base schema: `drizzle/migrations/0000…0002` **or** `supabase/schema.sql` (not both).
2. Run `supabase/migrations/0003_integrations.sql` (payment columns, product-images bucket, owner check, locked-down order inserts).
3. Sign up on the site with `norafayed06@gmail.com` and **confirm the email** (the owner check requires a confirmed email).
4. Copy URL, publishable key and service-role key into the env vars in `.env.example`.
   The service-role key is server-only.

> Run 0003 and deploy this code together: 0003 removes direct order inserts from the browser; orders now go through the server.

## 2. Email (Resend)
Set `RESEND_API_KEY`, `OWNER_EMAIL`. Verify your domain in Resend and set `EMAIL_FROM` to email customers; before that, mail only reaches the Resend account owner.

## 3. Card payments (Paymob)
1. Create an online-card integration; copy secret key, public key, integration id and HMAC secret.
2. In Paymob set the Transaction Processed callback to `https://YOUR-DOMAIN/api/public/paymob-webhook`.
3. Do a test payment and confirm the order flips to **Paid** (this validates the HMAC field order).
Card works only for catalog products; custom items/bundles must use Vodafone Cash, InstaPay or COD.

## 4. Gemini
Set `GEMINI_API_KEY` (server only). Rotate any key previously stored as `VITE_GEMINI_API_KEY`.

## 5. Run
`npm i && npm run dev`  (build: `npm run build`)
