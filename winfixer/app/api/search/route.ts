import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';

const supabase = createClient();

const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const validationResult = searchSchema.safeParse({ query });

  if (!validationResult.success) {
    return NextResponse.json(
      { error: validationResult.error.errors },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('errors')
    .select('*')
    .or(`code.ilike.%${query}%, title.ilike.%${query}%, description.ilike.%${query}%`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}