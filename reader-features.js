async function getReaderLibrary() {
  const { data: { user }, error: userError } =
    await supabaseClient.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Please log in.");

  const { data, error } = await supabaseClient
    .from("library")
    .select("*");

  if (error) throw error;
  return data;
}

async function getReaderTransactions() {
  const { data: { user }, error: userError } =
    await supabaseClient.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Please log in.");

  const { data, error } = await supabaseClient
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

async function getReaderNotifications() {
  const { data: { user }, error: userError } =
    await supabaseClient.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Please log in.");

  const { data, error } = await supabaseClient
    .from("notification")
    .select("*");

  if (error) throw error;
  return data;
}

async function getReaderSubscription() {
  const { data: { user }, error: userError } =
    await supabaseClient.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Please log in.");

  const { data, error } = await supabaseClient
    .from("subscription")
    .select("*");

  if (error) throw error;
  return data;
}
