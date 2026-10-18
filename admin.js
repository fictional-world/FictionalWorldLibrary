import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://mhvphjcreqhfnulflgiy.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_CPulXF1pmXf_7RacRrv1ag_MHuGAxXC";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const loading = document.getElementById("admin-loading");
const denied = document.getElementById("admin-denied");
const dashboard = document.getElementById("admin-app");
const errorBox = document.getElementById("admin-error");

function showError(message) {
  if (loading) loading.hidden = true;
  if (dashboard) dashboard.hidden = true;
  if (denied) denied.hidden = false;

  if (errorBox) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  } else {
    console.error(message);
  }
}

async function checkAdminAccess() {
  try {
    if (!loading || !denied || !dashboard) {
      throw new Error(
        "The admin.html page is missing required element IDs."
      );
    }

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    if (!data.user) {
      showError(
        "You are not signed in. Sign in with your administrator account first."
      );
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError) {
      console.error("Admin database error:", adminError);

      showError(
        "Could not verify administrator access. The admin_users table or its permissions may need checking."
      );
      return;
    }

    if (!admin) {
      showError(
        "This account has not been authorized as an administrator."
      );
      return;
    }

    loading.hidden = true;
    denied.hidden = true;
    dashboard.hidden = false;

  } catch (error) {
    console.error("Admin initialization error:", error);

    showError(
      "The admin page could not initialize. Check the browser console for the exact error."
    );
  }
}

checkAdminAccess();
