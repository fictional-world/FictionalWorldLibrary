async function getPublishedBooks() {
  const { data, error } = await supabaseClient
    .from("books")
    .select("*")
    .in("status", ["Ongoing", "Completed", "Published", "published"])
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

async function getBookById(bookId) {
  if (!bookId) {
    throw new Error("A book ID is required.");
  }

  const { data, error } = await supabaseClient
    .from("books")
    .select("*")
    .eq("id", bookId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function getBookChapters(bookId) {
  if (!bookId) {
    throw new Error("A book ID is required.");
  }

  const { data, error } = await supabaseClient
    .from("chapters")
    .select("*")
    .eq("book_id", String(bookId))
    .eq("pub_status", "Published")
    .order("chapter_number", { ascending: true });

  if (error) throw error;

  return data || [];
}

async function getChapterContent(chapterId) {
  if (!chapterId) {
    throw new Error("A chapter ID is required.");
  }

  const { data, error } = await supabaseClient.rpc(
    "get_chapter_content",
    {
      p_chapter_id: chapterId
    }
  );

  if (error) throw error;

  return data;
}

async function unlockChapter(chapterId) {
  if (!chapterId) {
    throw new Error("A chapter ID is required.");
  }

  const { data: { user }, error: userError } =
    await supabaseClient.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error("Please log in to unlock this chapter.");
  }

  const { data, error } = await supabaseClient.rpc(
    "unlock_chapter",
    {
      p_chapter_id: chapterId
    }
  );

  if (error) throw error;

  return data;
}
