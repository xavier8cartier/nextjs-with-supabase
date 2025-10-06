"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

type Todo = {
  id: number;
  title: string;
};

export default function TodoClient() {
  const supabase = useMemo(() => createClient(), []);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data } = await supabase.from("todos").select();
      setTodos(data || []);
    };
    fetchTodos();
  }, [supabase]);

  const handleAdd = async () => {
    if (!newTodo) return;
    setLoading(true);
    await supabase.from("todos").insert({ title: newTodo });
    setNewTodo("");
    const { data } = await supabase.from("todos").select();
    setTodos(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await supabase.from("todos").delete().eq("id", id);
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Client-side TODOs</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>{todo.title}</span>
            <button
              onClick={() => handleDelete(todo.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
