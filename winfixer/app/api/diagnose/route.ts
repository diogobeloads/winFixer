import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { z } from 'zod';

const diagnosticSessionSchema = z.object({
  errorId: z.string().uuid(),
  contextId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('DIAGNOSE REQUEST:', body);

    const parsedBody = diagnosticSessionSchema.safeParse(body);

    if (!parsedBody.success) {
      console.error(
        'DIAGNOSE VALIDATION ERROR:',
        parsedBody.error.flatten()
      );

      return NextResponse.json(
        {
          error: 'Dados inválidos para iniciar o diagnóstico.',
          details: parsedBody.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { errorId, contextId } = parsedBody.data;

    console.log('CREATING DIAGNOSTIC SESSION:', {
      errorId,
      contextId,
    });

    // Verifica se o erro existe
    const { data: errorData, error: errorLookup } = await supabase
      .from('errors')
      .select('id, code, status')
      .eq('id', errorId)
      .eq('status', 'published')
      .maybeSingle();

    if (errorLookup) {
      console.error('ERROR LOOKUP FAILED:', errorLookup);

      return NextResponse.json(
        {
          error: 'Não foi possível validar o erro.',
          details: errorLookup.message,
        },
        { status: 500 }
      );
    }

    if (!errorData) {
      return NextResponse.json(
        {
          error: 'Erro não encontrado ou não publicado.',
        },
        { status: 404 }
      );
    }

    // Verifica se o contexto pertence ao erro
    const { data: contextData, error: contextError } = await supabase
      .from('error_contexts')
      .select('id, error_id, name, slug')
      .eq('id', contextId)
      .eq('error_id', errorId)
      .maybeSingle();

    if (contextError) {
      console.error('CONTEXT LOOKUP FAILED:', contextError);

      return NextResponse.json(
        {
          error: 'Não foi possível validar o contexto.',
          details: contextError.message,
        },
        { status: 500 }
      );
    }

    if (!contextData) {
      return NextResponse.json(
        {
          error: 'Contexto não encontrado para este erro.',
        },
        { status: 404 }
      );
    }

    console.log('VALIDATED CONTEXT:', contextData);

    // Cria a sessão
    const { data, error } = await supabase
      .from('diagnostic_sessions')
      .insert({
        error_id: errorId,
        context_id: contextId,
        status: 'started',
        answers: {},
      })
      .select('id, error_id, context_id, status, answers, created_at')
      .single();

    if (error) {
      console.error('CREATE SESSION FAILED:', error);

      return NextResponse.json(
        {
          error: 'Não foi possível iniciar o diagnóstico.',
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    console.log('DIAGNOSTIC SESSION CREATED:', data);

    return NextResponse.json(
      data,
      { status: 201 }
    );

  } catch (error) {
    console.error('DIAGNOSE API UNEXPECTED ERROR:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erro interno ao iniciar diagnóstico.',
      },
      { status: 500 }
    );
  }
}