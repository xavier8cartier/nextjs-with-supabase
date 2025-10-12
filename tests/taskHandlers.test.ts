import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as taskHandlers from "@/utils/taskHandlers";
import { createClient } from "@supabase/supabase-js";

describe("Task Handlers Integration Tests (Real DB)", () => {
  let testSupabase: ReturnType<typeof createClient>;

  beforeEach(async () => {
    testSupabase = createClient(
      process.env.TEST_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    await testSupabase.from("tasks").delete().neq("id", 0);
  });

  afterEach(async () => {
    await testSupabase.from("tasks").delete().neq("id", 0);
  });

  it("fetchTasks: returns empty array initially", async () => {
    const result = await taskHandlers.fetchTasks();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it("addTask: adds new task and fetches it", async () => {
    const newTask = await taskHandlers.addTask("Test Task", "high");
    expect(newTask.title).toBe("Test Task");
    expect(newTask.priority).toBe("high");

    const fetched = await taskHandlers.fetchTasks();
    expect(fetched).toContainEqual(
      expect.objectContaining({ title: "Test Task" })
    );
  });

  it("addTask: throws error if no title or priority", async () => {
    await expect(taskHandlers.addTask("", "medium")).rejects.toThrow(
      "Title and priority required"
    );
    await expect(taskHandlers.addTask("Title", "")).rejects.toThrow(
      "Title and priority required"
    );
  });

  it("deleteTask: deletes task successfully", async () => {
    const task = await taskHandlers.addTask("To Delete", "low");
    await taskHandlers.deleteTask(task.id);

    const fetched = await taskHandlers.fetchTasks();
    expect(fetched.length).toBe(0);
  });

  it("updateTask: updates task successfully", async () => {
    const task = await taskHandlers.addTask("Old Title", "low");
    const updated = await taskHandlers.updateTask(task.id, "New Title", "high");
    expect(updated.title).toBe("New Title");
    expect(updated.priority).toBe("high");

    const fetched = await taskHandlers.fetchTasks();
    expect(fetched[0].title).toBe("New Title");
  });

  it("updateTask: throws error if no title or priority", async () => {
    const task = await taskHandlers.addTask("Test", "medium");
    await expect(taskHandlers.updateTask(task.id, "", "high")).rejects.toThrow(
      "Title and priority required"
    );
    await expect(taskHandlers.updateTask(task.id, "Title", "")).rejects.toThrow(
      "Title and priority required"
    );
  });
});
