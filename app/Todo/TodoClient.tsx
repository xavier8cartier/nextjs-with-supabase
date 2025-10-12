"use client";

import { useState, useEffect } from "react";
import * as todoHandlers from "@/utils/todoHandlers";

type Todo = {
  id: number;
  title: string;
};

export default function TodoClient() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await todoHandlers.fetchTodos();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  const handleAdd = async () => {
    if (!newTodo) return;
    setLoading(true);
    try {
      await todoHandlers.addTodo(newTodo);
      setNewTodo("");
      const updatedTodos = await todoHandlers.fetchTodos();
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await todoHandlers.deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleUpdate = async (id: number) => {
    if (!editingTitle) return;
    setLoading(true);
    try {
      await todoHandlers.updateTodo(id, editingTitle);
      const updatedTodos = await todoHandlers.fetchTodos();
      setTodos(updatedTodos);
      setEditingId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setLoading(false);
    }
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
