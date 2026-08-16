import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { z } from 'zod';

const completeSchema = z.object({
  sessionId: z.string().uuid(),
});

type DiagnosticAnswers = Record<string, unknown>;

function normalizeAnswer(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim().toLowerCase();
}

function extractAnswers(
  rawAnswers: unknown
): DiagnosticAnswers {
  if (
    rawAnswers &&
    typeof rawAnswers === 'object' &&
    !Array.isArray(rawAnswers)
  ) {
    return rawAnswers as DiagnosticAnswers;
  }

  if (Array.isArray(rawAnswers)) {
    const result: DiagnosticAnswers = {};

    for (const item of rawAnswers) {
      if (!item || typeof item !== 'object') {
        continue;
      }

      const entry = item as Record<string, unknown>;

      const questionId =
        entry.question_id ??
        entry.questionId ??
        entry.id;

      const answer =
        entry.answer ??
        entry.answer_value ??
        entry.answerValue ??
        entry.value;

      if (
        questionId !== undefined &&
        answer !== undefined
      ) {
        result[String(questionId)] = answer;
      }
    }

    return result;
  }

  return {};
}

export async function POST(request: Request) {
  try {
    /*
     * ============================================================
     * 1. VALIDAR REQUEST
     * ============================================================
     */

    const body = await request.json();

    const validationResult =
      completeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Sessão de diagnóstico inválida.',
        },
        { status: 400 }
      );
    }

    const { sessionId } =
      validationResult.data;

    console.log(
      'COMPLETE DIAGNOSIS:',
      sessionId
    );

    /*
     * ============================================================
     * 2. BUSCAR SESSÃO
     * ============================================================
     */

    const {
      data: session,
      error: sessionError,
    } = await supabase
      .from('diagnostic_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      console.error(
        'SESSION FETCH ERROR:',
        sessionError
      );

      return NextResponse.json(
        {
          error:
            'Não foi possível carregar a sessão de diagnóstico.',
        },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          error:
            'Sessão de diagnóstico não encontrada.',
        },
        { status: 404 }
      );
    }

    /*
     * ============================================================
     * 3. NORMALIZAR RESPOSTAS
     * ============================================================
     */

    const answers =
      extractAnswers(session.answers);

    console.log(
      'DIAGNOSTIC ANSWERS:',
      answers
    );

    console.log(
      'ANSWER KEYS:',
      Object.keys(answers)
    );

    console.log(
      'ANSWER VALUES:',
      Object.values(answers)
    );

    console.log(
      'SESSION CONTEXT:',
      session.context_id
    );

    if (
      Object.keys(answers).length === 0
    ) {
      return NextResponse.json(
        {
          error:
            'Nenhuma resposta foi registrada para esta sessão.',
        },
        { status: 400 }
      );
    }

    /*
     * ============================================================
     * 4. BUSCAR REGRAS DO CONTEXTO
     * ============================================================
     */

    const {
      data: rules,
      error: rulesError,
    } = await supabase
      .from('diagnostic_rules')
      .select('*')
      .eq(
        'context_id',
        session.context_id
      )
      .eq(
        'status',
        'published'
      )
      .order('priority', {
        ascending: true,
      });

    if (rulesError) {
      console.error(
        'RULES FETCH ERROR:',
        rulesError
      );

      return NextResponse.json(
        {
          error:
            'Não foi possível consultar as regras de diagnóstico.',
        },
        { status: 500 }
      );
    }

    console.log(
      'DIAGNOSTIC RULES:',
      rules
    );

    /*
     * ============================================================
     * 5. ENCONTRAR REGRA COMPATÍVEL
     * ============================================================
     */

    let matchedRule: any = null;

    for (const rule of rules || []) {
      const questionId =
        String(rule.question_id);

      const answer =
        answers[questionId];

      console.log(
        'RULE CHECK:',
        {
          questionId,
          answer,
          expected:
            rule.answer_value,
          normalizedAnswer:
            normalizeAnswer(answer),
          normalizedExpected:
            normalizeAnswer(
              rule.answer_value
            ),
        }
      );

      if (
        answer !== undefined &&
        normalizeAnswer(answer) ===
          normalizeAnswer(
            rule.answer_value
          )
      ) {
        matchedRule = rule;
        break;
      }
    }

    console.log(
      'MATCHED RULE:',
      matchedRule
    );

    /*
     * ============================================================
     * 6. NENHUMA REGRA ENCONTRADA
     * ============================================================
     */

    if (!matchedRule) {
      return NextResponse.json({
        success: true,

        diagnosis: null,

        fix: null,

        message:
          'Ainda não encontramos uma solução específica para suas respostas.',
      });
    }

    /*
     * ============================================================
     * 7. BUSCAR FIX
     * ============================================================
     */

    const {
      data: fix,
      error: fixError,
    } = await supabase
      .from('fixes')
      .select('*')
      .eq(
        'id',
        matchedRule.fix_id
      )
      .eq(
        'status',
        'published'
      )
      .single();

    if (fixError) {
      console.error(
        'FIX FETCH ERROR:',
        fixError
      );

      return NextResponse.json(
        {
          error:
            'Não foi possível carregar a solução recomendada.',
        },
        { status: 500 }
      );
    }

    if (!fix) {
      return NextResponse.json(
        {
          error:
            'A solução recomendada não foi encontrada.',
        },
        { status: 404 }
      );
    }

    /*
     * ============================================================
     * 8. FINALIZAR SESSÃO
     * ============================================================
     */

    const {
      data: updatedSession,
      error: updateError,
    } = await supabase
      .from('diagnostic_sessions')
      .update({
        status: 'completed',
      })
      .eq(
        'id',
        sessionId
      )
      .select('*')
      .single();

    if (updateError) {
      console.error(
        'SESSION UPDATE ERROR:',
        updateError
      );

      return NextResponse.json(
        {
          error:
            'Não foi possível finalizar o diagnóstico.',
        },
        { status: 500 }
      );
    }

    /*
     * ============================================================
     * 9. RETORNAR RESULTADO
     * ============================================================
     */

    return NextResponse.json({
      success: true,

      diagnosis: {
        title:
          'Possível causa identificada',

        summary:
          'Suas respostas indicam um caminho provável para resolver o problema.',
      },

      fix,

      rule: matchedRule,

      session: updatedSession,
    });

  } catch (error) {
    console.error(
      'COMPLETE DIAGNOSIS ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erro inesperado ao concluir o diagnóstico.',
      },
      { status: 500 }
    );
  }
}