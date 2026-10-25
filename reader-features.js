async function getAuthenticatedReaderId() {
  const {
    data: { user },
    error
  } = await supabaseClient.auth.getUser();

  if (error) throw error;

  if (!user) {
    throw new Error("Please log in to access this feature.");
  }

  return user.id;
}

async function getReaderLibrary() {
  const userId = await getAuthenticatedReaderId();

  const { data, error } = await supabaseClient
    .from("library")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const entries = data || [];

  if (entries.length === 0) return [];

  const bookIds = [
    ...new Set(
      entries
        .map(item => Number(item.book_id))
        .filter(id => Number.isFinite(id))
    )
  ];

  if (bookIds.length === 0) return entries;

  const { data: books, error: booksError } = await supabaseClient
    .from("books")
    .select("*")
    .in("id", bookIds);

  if (booksError) throw booksError;

  const booksById = new Map(
    (books || []).map(book => [String(book.id), book])
  );

  return entries.map(item => ({
    ...item,
    book: booksById.get(String(item.book_id)) || null
  }));
}

async function addBookToReaderLibrary(bookId, status = "Viewed") {
  const userId = await getAuthenticatedReaderId();

  if (!bookId) {
    throw new Error("A book ID is required.");
  }

  const { data: existing, error: lookupError } = await supabaseClient
    .from("library")
    .select("id")
    .eq("user_id", userId)
    .eq("book_id", String(bookId))
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (existing) {
    const { data, error } = await supabaseClient
      .from("library")
      .update({ status })
      .eq("id", existing.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabaseClient
    .from("library")
    .insert({
      user_id: userId,
      book_id: String(bookId),
      status
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function getReaderTransactions() {
  const userId = await getAuthenticatedReaderId();

  const { data, error } = await supabaseClient
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

async function getReaderNotifications() {
  const userId = await getAuthenticatedReaderId();

  const { data, error } = await supabaseClient
    .from("notification")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

async function markReaderNotificationAsRead(notificationId) {
  const userId = await getAuthenticatedReaderId();

  if (!notificationId) {
    throw new Error("A notification ID is required.");
  }

  const { data, error } = await supabaseClient
    .from("notification")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function getReaderSubscription() {
  const userId = await getAuthenticatedReaderId();

  const { data, error } = await supabaseClient
    .from("subscription")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
            }
