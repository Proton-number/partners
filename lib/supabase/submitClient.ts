// This file is used to create a Supabase client for the submit form. It uses the environment variables defined in the .env file to create the client. The client is then used in the submit form to submit data to the Supabase database.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_SUBMIT_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_SUBMIT_KEY!,
  );
}
