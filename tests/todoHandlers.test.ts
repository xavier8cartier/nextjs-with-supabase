import { describe, it, expect, vi, beforeEach } from "vitest";
import * as todoHandlers from "@/utils/todoHandlers";
import { createClient } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(() => ({ single: vi.fn() })),
    })),
  })),
}));

describe("Todo Handlers Unit Tests", () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = createClient();
    vi.spyOn(todoHandlers, "fetchTodos").mockImplementation(() =>
      mockSupabase.from("todos").select()
    );
  });

  it("fetchTodos: returns todos successfully", async () => {
    const mockData = [{ id: 1, title: "Test Todo" }];
    mockSupabase
      .from("todos")
      .select.mockResolvedValue({ data: mockData, error: null });

    const result = await todoHandlers.fetchTodos();
    expect(result).toEqual(mockData);
    expect(mockSupabase.from).toHaveBeenCalledWith("todos");
  });

  it("addTodo: adds new todo successfully", async () => {
    const mockData = { id: 1, title: "New Todo" };
    mockSupabase
      .from("todos")
      .insert()
      .select()
      .single.mockResolvedValue({ data: mockData, error: null });

    const result = await todoHandlers.addTodo("New Todo");
    expect(result).toEqual(mockData);
    expect(mockSupabase.from("todos").insert).toHaveBeenCalledWith({
      title: "New Todo",
    });
  });

  it("addTodo: throws error if no title", () => {
    expect(todoHandlers.addTodo("")).rejects.toThrow("Title required");
  });

  it("deleteTodo: deletes todo successfully", async () => {
    mockSupabase.from("todos").delete().eq.mockResolvedValue({ error: null });

    await expect(todoHandlers.deleteTodo(1)).resolves.not.toThrow();
    expect(mockSupabase.from("todos").delete().eq).toHaveBeenCalledWith(
      "id",
      1
    );
  });

  it("updateTodo: updates todo successfully", async () => {
    const mockData = { id: 1, title: "Updated" };
    mockSupabase
      .from("todos")
      .update()
      .eq()
      .select()
      .single.mockResolvedValue({ data: mockData, error: null });

    const result = await todoHandlers.updateTodo(1, "Updated");
    expect(result).toEqual(mockData);
    expect(mockSupabase.from("todos").update).toHaveBeenCalledWith({
      title: "Updated",
    });
  });

  it("updateTodo: throws error if no title", () => {
    expect(todoHandlers.updateTodo(1, "")).rejects.toThrow("Title required");
  });
});
