"use client";

import { useState, useEffect } from "react";
import * as taskHandlers from "@/utils/taskHandlers";

type Task = {
  id: number;
  title: string;
  priority: string;
};

export default function TaskClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingPriority, setEditingPriority] = useState("medium");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskHandlers.fetchTasks();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (!newTitle) return;
    setLoading(true);
    try {
      await taskHandlers.addTask(newTitle, newPriority);
      setNewTitle("");
      setNewPriority("medium");
      const updatedTasks = await taskHandlers.fetchTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await taskHandlers.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setEditingPriority(task.priority);
  };

  const handleUpdate = async (id: number) => {
    if (!editingTitle) return;
    setLoading(true);
    try {
      await taskHandlers.updateTask(id, editingTitle, editingPriority);
      const updatedTasks = await taskHandlers.fetchTasks();
      setTasks(updatedTasks);
      setEditingId(null);
      setEditingTitle("");
      setEditingPriority("medium");
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingPriority("medium");
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Client-side Tasks</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
          className="border p-2 rounded"
          disabled={loading}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            {editingId === task.id ? (
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="border p-1 rounded flex-1"
                />
                <select
                  value={editingPriority}
                  onChange={(e) => setEditingPriority(e.target.value)}
                  className="border p-1 rounded"
                  disabled={loading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={() => handleUpdate(task.id)}
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
                <span>
                  {task.title}{" "}
                  <span className="text-sm text-gray-500">
                    ({task.priority})
                  </span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
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
