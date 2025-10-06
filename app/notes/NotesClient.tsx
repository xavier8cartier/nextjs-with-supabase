"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

type Note = {
  id: number;
  title: string;
};

export default function NotesClient() {
  const supabase = useMemo(() => createClient(), []);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await supabase.from("notes").select();
      setNotes(data || []);
    };
    fetchNotes();
  }, [supabase]);

  const handleAdd = async () => {
    if (!newNote) return;
    setLoading(true);
    await supabase.from("notes").insert({ title: newNote });
    setNewNote("");
    const { data } = await supabase.from("notes").select();
    setNotes(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await supabase.from("notes").delete().eq("id", id);
    setNotes(notes.filter((note) => note.id !== id));
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
            <span>{note.title}</span>
            <button
              onClick={() => handleDelete(note.id)}
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
