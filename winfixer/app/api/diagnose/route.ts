import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { z } from 'zod';

const diagnosticSessionSchema = z.object({
  errorId: z.string().uuid(),
  contextId: z.string().uuid(),
  userId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = diagnosticSessionSchema.parse(body);

    const { errorId, contextId, userId } = parsedBody;

    const { data, error } = await supabase
      .from('diagnostic_sessions')
      .insert([
        {
          error_id: errorId,
          context_id: contextId,
          user_id: userId,
          status: 'started',
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}