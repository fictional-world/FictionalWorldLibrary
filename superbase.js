const SUPABASE_URL = "https://mhvphjcreqhfnulflgiy.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_CPulXF1pmXf_7RacRrv1ag_MHuGAxXC";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.supabaseClient = supabaseClient;
