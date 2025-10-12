import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

function getSupabaseClient(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  const isServiceRole =
    token && token === process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("[getSupabaseClient] isServiceRole:", isServiceRole);

  return isServiceRole ? createAdminClient() : createClient();
}

// GET /api/todos
export async function GET(req: NextRequest) {
  const supabase = await getSupabaseClient(req);
  const { data, error } = await supabase.from("todos").select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/todos
export async function POST(req: NextRequest) {
  const supabase = await getSupabaseClient(req);
  const { title } = await req.json();

  if (!title)
    return NextResponse.json({ error: "Title required" }, { status: 400 });

  const { data, error } = await supabase
    .from("todos")
    .insert({ title })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// PUT /api/todos
export async function PUT(req: NextRequest) {
  const supabase = await getSupabaseClient(req);
  const { id, title } = await req.json();

  if (!id || !title)
    return NextResponse.json(
      { error: "ID and title required" },
      { status: 400 }
    );

  const { data, error } = await supabase
    .from("todos")
    .update({ title })
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// DELETE /api/todos
export async function DELETE(req: NextRequest) {
  const supabase = await getSupabaseClient(req);
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
