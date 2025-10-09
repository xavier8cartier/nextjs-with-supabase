import { createClient } from "@/lib/supabase/server";
import NotesClient from "./NotesClient";

export default async function Page() {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("notes").select();

  let updatedNotes = notes;
  if (notes && notes.length > 0) {
    await supabase
      .from("notes")
      .update({ title: notes[0].title + "" })
      .eq("id", notes[0].id);
    const { data: newNotes } = await supabase.from("notes").select();
    updatedNotes = newNotes;
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Server-side Notes</h1>
        <pre className="bg-gray-100 text-black p-4 rounded">
          {JSON.stringify(updatedNotes, null, 2)}
        </pre>
      </div>
      <div>
        <NotesClient />
      </div>
    </div>
  );
}
