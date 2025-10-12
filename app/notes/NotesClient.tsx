"use client";

import { useState, useEffect } from "react";
import * as noteHandlers from "@/utils/noteHandlers";

type Note = {
  id: number;
  title: string;
};

export default function NotesClient() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await noteHandlers.fetchNotes();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  const handleAdd = async () => {
    if (!newNote) return;
    setLoading(true);
    try {
      await noteHandlers.addNote(newNote);
      setNewNote("");
      const updatedNotes = await noteHandlers.fetchNotes();
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await noteHandlers.deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setEditingTitle(note.title);
  };

  const handleUpdate = async (id: number) => {
    if (!editingTitle) return;
    setLoading(true);
    try {
      await noteHandlers.updateNote(id, editingTitle);
      const updatedNotes = await noteHandlers.fetchNotes();
      setNotes(updatedNotes);
      setEditingId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("Error updating note:", error);
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
      <h2 className="text-xl font-bold">Client-side Notes</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {notes.map((note) => (
          <li
            key={note.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            {editingId === note.id ? (
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="border p-1 rounded flex-1"
                />
                <button
                  onClick={() => handleUpdate(note.id)}
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
                <span>{note.title}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
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
