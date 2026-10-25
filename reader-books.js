async function getPublishedBooks() {
  const { data, error } = await supabaseClient
    .from("books")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

async function getBookChapters(bookId) {
  const { data, error } = await supabaseClient
    .from("chapters")
    .select("*")
    .eq("book_id", bookId)
    .order("chapter_number", { ascending: true });

  if (error) throw error;

  return data || [];
}

async function getChapterContent(chapterId) {
  const { data, error } = await supabaseClient.rpc(
    "get_chapter_content",
    { p_chapter_id: chapterId }
  );

  if (error) throw error;

  return data;
}

async function unlockChapter(chapterId) {
  const { data, error } = await supabaseClient.rpc(
    "unlock_chapter",
    { p_chapter_id: chapterId }
  );

  if (error) throw error;

  return data;
}
