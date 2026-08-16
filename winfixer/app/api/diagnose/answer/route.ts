import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { z } from 'zod';

const answerSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  answer: z.any(),
  completed: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = answerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Dados da resposta inválidos.',
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      sessionId,
      questionId,
      answer,
      completed,
    } = parsed.data;

    // Busca a sessão atual
    const {
      data: session,
      error: sessionError,
    } = await supabase
      .from('diagnostic_sessions')
      .select('id, answers, status')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      console.error(
        'DIAGNOSTIC SESSION ERROR:',
        sessionError
      );

      return NextResponse.json(
        {
          error: 'Sessão de diagnóstico não encontrada.',
        },
        { status: 404 }
      );
    }

    // Mantém as respostas anteriores
    const currentAnswers =
      session.answers &&
      typeof session.answers === 'object'
        ? session.answers
        : {};

    const updatedAnswers = {
      ...currentAnswers,
      [questionId]: answer,
    };

    const newStatus = completed
      ? 'completed'
      : 'in_progress';

    const { data, error } = await supabase
      .from('diagnostic_sessions')
      .update({
        answers: updatedAnswers,
        status: newStatus,
        ...(completed
          ? {
              completed_at: new Date().toISOString(),
            }
          : {}),
      })
      .eq('id', sessionId)
      .select('id, answers, status, completed_at')
      .single();

    if (error) {
      console.error(
        'SAVE DIAGNOSTIC ANSWER ERROR:',
        error
      );

      return NextResponse.json(
        {
          error: 'Não foi possível salvar sua resposta.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      session: data,
    });
  } catch (error) {
    console.error(
      'DIAGNOSTIC ANSWER API ERROR:',
      error
    );

    return NextResponse.json(
      {
        error: 'Erro interno ao salvar a resposta.',
      },
      { status: 500 }
    );
  }
}