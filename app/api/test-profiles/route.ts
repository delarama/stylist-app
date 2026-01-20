import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const id = "fa13fc86-83f9-4241-a6ec-4618149d8aad";

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, headline")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, idChecked: id, data });
}