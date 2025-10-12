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

// GET /api/tasks
export async function GET(req: NextRequest) {
  const supabase = await getSupabaseClient(req);
  const { data, error } = await supabase.from("tasks").select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/tasks
export async function POST(req: NextRequest) {
  const supabase = await getSupabaseClient(req);
  const { title, priority } = await req.json();

  if (!title || !priority)
    return NextResponse.json(
      { error: "Title and priority required" },
      { status: 400 }
    );

  const { data, error } = await supabase
    .from("tasks")
    .insert({ title, priority })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// PUT /api/tasks
export async function PUT(req: NextRequest) {
  const supabase = await getSupabaseClient(req);
  const { id, title, priority } = await req.json();

  if (!id || !title || !priority)
    return NextResponse.json(
      { error: "ID, title and priority required" },
      { status: 400 }
    );

  const { data, error } = await supabase
    .from("tasks")
    .update({ title, priority })
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// DELETE /api/tasks
export async function DELETE(req: NextRequest) {
  const supabase = await getSupabaseClient(req);
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
