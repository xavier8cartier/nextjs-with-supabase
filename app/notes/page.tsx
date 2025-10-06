import { createClient } from "@/lib/supabase/server";
import NotesClient from "./NotesClient";

export default async function Page() {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("notes").select();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Server-side Notes</h1>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(notes, null, 2)}
        </pre>
      </div>
      <div>
        <NotesClient />
      </div>
    </div>
  );
}
