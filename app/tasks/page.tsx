import { createClient } from "@/lib/supabase/server";
import TaskClient from "./TaskClient";

export default async function Page() {
  const supabase = await createClient();
  const { data: tasks } = await supabase.from("tasks").select();

  let updatedTasks = tasks;
  if (tasks && tasks.length > 0) {
    await supabase
      .from("tasks")
      .update({ title: tasks[0].title + " (server updated)" })
      .eq("id", tasks[0].id);
    const { data: newTasks } = await supabase.from("tasks").select();
    updatedTasks = newTasks;
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Server-side Tasks</h1>
        <pre className="bg-gray-100 text-black p-4 rounded">
          {JSON.stringify(updatedTasks, null, 2)}
        </pre>
      </div>
      <div>
        <TaskClient />
      </div>
    </div>
  );
}
