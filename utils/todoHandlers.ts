import { createClient } from "@/lib/supabase/client";

type Todo = { id: number; title: string };

const supabase = createClient();

export async function fetchTodos(): Promise<Todo[]> {
  const { data, error } = await supabase.from("todos").select();
  if (error) throw error;
  return data || [];
}

export async function addTodo(title: string): Promise<Todo> {
  if (!title) throw new Error("Title required");
  const { data, error } = await supabase
    .from("todos")
    .insert({ title })
    .select()
    .single();
  if (error) throw error;
  return data!;
}

export async function deleteTodo(id: number): Promise<void> {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) throw error;
}

export async function updateTodo(id: number, title: string): Promise<Todo> {
  if (!title) throw new Error("Title required");
  const { data, error } = await supabase
    .from("todos")
    .update({ title })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data!;
}
