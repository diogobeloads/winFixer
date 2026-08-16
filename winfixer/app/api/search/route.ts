import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { z } from 'zod';

const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, 'Search query is required')
    .max(120, 'Search query is too long'),
});

function sanitizePostgrestSearch(value: string) {
  return value
    .replace(/[(),]/g, ' ')
    .replace(/[%_*]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get('q') || '';

  const validationResult = searchSchema.safeParse({
    query: rawQuery,
  });

  if (!validationResult.success) {
    return NextResponse.json(
      { error: validationResult.error.issues },
      { status: 400 }
    );
  }

  const query = validationResult.data.query;
  const searchTerm = sanitizePostgrestSearch(query);

  if (!searchTerm) {
    return NextResponse.json([]);
  }

  const normalizedCode = query
    .replace(/^0x/i, '')
    .replace(/[^a-fA-F0-9]/g, '')
    .toLowerCase();

  // Busca exata por código
  if (normalizedCode) {
    const { data: exactMatches, error: exactError } = await supabase
      .from('errors')
      .select('*')
      .eq('normalized_code', normalizedCode)
      .eq('status', 'published');

    if (exactError) {
      console.error('Exact error search failed:', exactError);

      return NextResponse.json(
        {
          error: 'Não foi possível consultar a base de erros.',
        },
        { status: 500 }
      );
    }

    if (exactMatches && exactMatches.length > 0) {
      return NextResponse.json(exactMatches);
    }
  }

  // Busca textual por código, título ou descrição
  const { data, error } = await supabase
    .from('errors')
    .select('*')
    .eq('status', 'published')
    .or(
      `code.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    )
    .limit(20);

  if (error) {
    console.error('Text error search failed:', error);

    return NextResponse.json(
      {
        error: 'Não foi possível consultar a base de erros.',
      },
      { status: 500 }
    );
  }

  return NextResponse.json(data || []);
}