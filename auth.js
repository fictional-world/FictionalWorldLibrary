async function registerReader(email, password, name) {
  const { data, error } = await supabaseClient.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { name: name.trim() }
    }
  });

  if (error) throw error;
  return data;
}

async function loginReader(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email.trim(),
    password
  });

  if (error) throw error;
  return data;
}

async function logoutReader() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

async function getCurrentReader() {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) throw error;
  return data.user;
}

async function sendPasswordReset(email) {
  const { error } = await supabaseClient.auth.resetPasswordForEmail(
    email.trim()
  );

  if (error) throw error;
}
