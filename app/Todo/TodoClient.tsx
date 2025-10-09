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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

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

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleUpdate = async (id: number) => {
    if (!editingTitle) return;
    setLoading(true);
    await supabase.from("todos").update({ title: editingTitle }).eq("id", id);
    const { data } = await supabase.from("todos").select();
    setTodos(data || []);
    setEditingId(null);
    setEditingTitle("");
    setLoading(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingTitle("");
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
            {editingId === todo.id ? (
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="border p-1 rounded flex-1"
                />
                <button
                  onClick={() => handleUpdate(todo.id)}
                  disabled={loading}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span>{todo.title}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(todo)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
