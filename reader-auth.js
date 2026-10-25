async function handleReaderLogin(email, password) {
  try {
    const cleanEmail = (email || "").trim();

    if (!cleanEmail || !password) {
      throw new Error("Please enter your email and password.");
    }

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

    if (error) throw error;

    if (data?.user) {
      window.location.href = "index.html";
    }

    return data;
  } catch (error) {
    alert(error.message || "Login failed.");
    return null;
  }
}

async function handleReaderRegistration(email, password, name) {
  try {
    const cleanEmail = (email || "").trim();
    const cleanName = (name || "").trim();

    if (!cleanName || !cleanEmail || !password) {
      throw new Error("Please complete all required fields.");
    }

    if (password.length < 6) {
      throw new Error("Your password must contain at least 6 characters.");
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: cleanName,
          is_reader: true
        }
      }
    });

    if (error) throw error;

    if (data?.user) {
      const { error: profileError } = await supabaseClient
        .from("users")
        .upsert(
          {
            auth_user_id: data.user.id,
            name: cleanName,
            email: cleanEmail
          },
          { onConflict: "auth_user_id" }
        );

      if (profileError) {
        console.error("Reader profile error:", profileError);
        alert(
          "Your account was created, but your profile could not be saved. Please contact support."
        );
        return data;
      }
    }

    alert(
      data?.session
        ? "Registration successful."
        : "Registration submitted. Check your email if confirmation is required."
    );

    return data;
  } catch (error) {
    alert(error.message || "Registration failed.");
    return null;
  }
}

async function handleReaderLogout() {
  try {
    const { error } = await supabaseClient.auth.signOut();

    if (error) throw error;

    window.location.href = "index.html";
  } catch (error) {
    alert(error.message || "Logout failed.");
  }
}

async function getCurrentReader() {
  const {
    data: { user },
    error: authError
  } = await supabaseClient.auth.getUser();

  if (authError) throw authError;
  if (!user) return null;

  const { data: profile, error: profileError } = await supabaseClient
    .from("users")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError) throw profileError;

  return {
    ...user,
    profile
  };
}

async function sendReaderPasswordReset(email) {
  const cleanEmail = (email || "").trim();

  if (!cleanEmail) {
    throw new Error("Please enter your email address.");
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(
    cleanEmail,
    {
      redirectTo: `${window.location.origin}/index.html`
    }
  );

  if (error) throw error;

  alert("Password reset instructions have been sent if the email exists.");
}
