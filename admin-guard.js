(() => {
  const SUPABASE_URL =
    "https://mhvphjcreqhfnulflgiy.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_CPulXF1pmXf_7RacRrv1ag_MHuGAxXC";

  const ADMIN_ID =
    "a57c6170-7026-43b4-91af-ee7459776109";

  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storage: window.sessionStorage
      }
    }
  );

  window.adminSupabase = supabase;

  window.adminReady = (async () => {
    try {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Please log in.");
      }

      if (session.user.id !== ADMIN_ID) {
        throw new Error("This account is not authorised.");
      }

      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", ADMIN_ID)
        .maybeSingle();

      if (error || !data) {
        throw new Error("Admin verification failed.");
      }

      return true;
    } catch (error) {
      await supabase.auth.signOut();
      window.location.replace("admin-login.html");
      return false;
    }
  })();
})();
