import { describe, it, expect, vi, beforeEach } from "vitest";
import * as noteHandlers from "@/utils/noteHandlers";
import { createClient } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
        single: vi.fn(),
      })),
    })),
  })),
}));

describe("Note Handlers Unit Tests", () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = createClient();
  });

  it("fetchNotes: returns notes successfully", async () => {
    const mockData = [{ id: 1, title: "Test Note" }];
    mockSupabase
      .from("notes")
      .select.mockResolvedValue({ data: mockData, error: null });

    const result = await noteHandlers.fetchNotes();
    expect(result).toEqual(mockData);
    expect(mockSupabase.from).toHaveBeenCalledWith("notes");
  });

  it("addNote: adds new note successfully", async () => {
    const mockData = { id: 1, title: "New Note" };
    mockSupabase
      .from("notes")
      .insert()
      .select()
      .single.mockResolvedValue({ data: mockData, error: null });

    const result = await noteHandlers.addNote("New Note");
    expect(result).toEqual(mockData);
    expect(mockSupabase.from("notes").insert).toHaveBeenCalledWith({
      title: "New Note",
    });
  });

  it("addNote: throws error if no title", async () => {
    await expect(noteHandlers.addNote("")).rejects.toThrow("Title required");
  });

  it("deleteNote: deletes note successfully", async () => {
    mockSupabase.from("notes").delete().eq.mockResolvedValue({ error: null });

    await expect(noteHandlers.deleteNote(1)).resolves.not.toThrow();
    expect(mockSupabase.from("notes").delete().eq).toHaveBeenCalledWith(
      "id",
      1
    );
  });

  it("updateNote: updates note successfully", async () => {
    const mockData = { id: 1, title: "Updated" };
    mockSupabase
      .from("notes")
      .update()
      .eq()
      .select()
      .single.mockResolvedValue({ data: mockData, error: null });

    const result = await noteHandlers.updateNote(1, "Updated");
    expect(result).toEqual(mockData);
    expect(mockSupabase.from("notes").update).toHaveBeenCalledWith({
      title: "Updated",
    });
  });

  it("updateNote: throws error if no title", async () => {
    await expect(noteHandlers.updateNote(1, "")).rejects.toThrow(
      "Title required"
    );
  });
});
