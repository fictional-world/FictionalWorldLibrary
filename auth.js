async function generateReaderId() {
  try {
    const { data, error } = await supabaseClient
      .from("readers")
      .select("reader_id")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      return "FWM0000001";
    }

    const lastReaderId = data[0]?.reader_id || "FWM0000000";
    const match = lastReaderId.match(/FWM(\d+)/i);

    if (!match) {
      return "FWM0000001";
    }

    const lastNumber = Number(match[1]);
    const nextNumber = Number.isFinite(lastNumber) ? lastNumber + 1 : 1;

    return `FWM${String(nextNumber).padStart(7, "0")}`;
  } catch (error) {
    console.warn("Unable to generate reader ID:", error);
    return "FWM0000001";
  }
}

async function createReaderProfile(authUserId, name, email) {
  if (!authUserId) return null;

  const cleanName = (name || "").trim();
  const cleanEmail = (email || "").trim();

  const readerId = await generateReaderId();

  const { data, error } = await supabaseClient
    .from("readers")
    .upsert(
      [
        {
          auth_user_id: authUserId,
          reader_id: readerId,
          display_name: cleanName || "Reader",
          email: cleanEmail,
          created_at: new Date().toISOString()
        }
      ],
      {
        onConflict: "auth_user_id"
      }
    )
    .select()
    .single();

  if (error) {
    console.warn("Reader profile creation error:", error);
    return null;
  }

  return data;
}

async function registerReader(email, password, name) {
  const cleanEmail = (email || "").trim();
  const cleanName = (name || "").trim();

  if (!cleanEmail || !password || password.length < 6) {
    throw new Error("Please enter a valid email and a password with at least 6 characters.");
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

  if (error) {
    throw error;
  }

  const authUser = data?.user;
  if (!authUser) {
    return data;
  }

  await createReaderProfile(authUser.id, cleanName, cleanEmail);

  return data;
}

async function loginReader(email, password) {
  const cleanEmail = (email || "").trim();

  if (!cleanEmail || !password) {
    throw new Error("Please enter both email and password.");
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: cleanEmail,
    password
  });

  if (error) {
    throw error;
  }

  return data;
}

async function logoutReader() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    throw error;
  }
}

async function getCurrentReader() {
  const { data: authData, error: authError } = await supabaseClient.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!authData?.user) {
    return null;
  }

  const user = authData.user;

  const { data: readerData, error: readerError } = await supabaseClient
    .from("readers")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (readerError) {
    console.warn("Reader lookup failed:", readerError);
  }

  return {
    ...user,
    reader: readerData || null
  };
}

async function sendPasswordReset(email) {
  const cleanEmail = (email || "").trim();

  if (!cleanEmail) {
    throw new Error("Please enter your email.");
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(cleanEmail);
  if (error) {
    throw error;
  }
  }
