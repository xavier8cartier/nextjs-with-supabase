import { createClient } from "@/lib/supabase/server";
import TodoClient from "./TodoClient";

export default async function Page() {
  const supabase = await createClient();
  const { data: todos } = await supabase.from("todos").select();

  let updatedTodos = todos;
  if (todos && todos.length > 0) {
    await supabase
      .from("todos")
      .update({ title: todos[0].title + "" })
      .eq("id", todos[0].id);
    const { data: newTodos } = await supabase.from("todos").select();
    updatedTodos = newTodos;
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Server-side ToDos</h1>
        <pre className="bg-gray-100 text-black p-4 rounded">
          {JSON.stringify(updatedTodos, null, 2)}
        </pre>
      </div>
      <div>
        <TodoClient />
      </div>
    </div>
  );
}
