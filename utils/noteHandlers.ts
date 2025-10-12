import { createClient } from "@/lib/supabase/client";

type Note = { id: number; title: string };

const supabase = createClient();

export async function fetchNotes(): Promise<Note[]> {
  const { data, error } = await supabase.from("notes").select();
  if (error) throw error;
  return data || [];
}

export async function addNote(title: string): Promise<Note> {
  if (!title) throw new Error("Title required");
  const { data, error } = await supabase
    .from("notes")
    .insert({ title })
    .select()
    .single();
  if (error) throw error;
  return data!;
}

export async function deleteNote(id: number): Promise<void> {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
}

export async function updateNote(id: number, title: string): Promise<Note> {
  if (!title) throw new Error("Title required");
  const { data, error } = await supabase
    .from("notes")
    .update({ title })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data!;
}
