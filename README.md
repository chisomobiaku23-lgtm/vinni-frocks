# VINNI-FROCKS

## What's in here
This is your whole website: the shop page, the admin page, and the code that
saves products. It's ready to put on GitHub + Vercel.

## Before it works, you need 3 things in Supabase
1. Run `schema.sql` in your Supabase project's SQL Editor (creates the
   products table and the product-images storage bucket).
2. From Supabase → Settings → API, copy the **Project URL** and the
   **service_role key**.
3. Pick a real admin password (not the placeholder one).

## Setting the values
Don't put real values in `.env.example` — it's just a reference.
When you deploy on Vercel, add these three as Environment Variables in the
Vercel project settings:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

Claude will walk you through this step by step when you're ready.
