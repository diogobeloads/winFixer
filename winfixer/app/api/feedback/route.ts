import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { sessionId, fixId, result, notes } = await request.json();

  const { data, error } = await supabase
    .from('fix_feedback')
    .insert([
      {
        session_id: sessionId,
        fix_id: fixId,
        result,
        notes,
      },
    ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}