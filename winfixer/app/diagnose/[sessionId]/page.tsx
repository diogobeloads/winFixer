'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { supabase } from '@/lib/supabase/client';
import DiagnosticQuestion from '@/components/DiagnosticQuestion';
import DiagnosticProgress from '@/components/DiagnosticProgress';
import FixFeedback from '@/components/FixFeedback';

type Question = {
  id: string;
  question: string;
  options?: any;
  [key: string]: any;
};

type SessionData = {
  id: string;
  error_id: string;
  context_id: string;
  status: string;
  answers?: Record<string, any>;
  [key: string]: any;
};

type DiagnosisResult = {
  success: boolean;
  diagnosis?: {
    title?: string;
    summary?: string;
  } | null;
  fix?: {
    id?: string;
    title?: string;
    summary?: string;
    instructions?: string;
    risk_level?: string;
    difficulty?: string;
    source_type?: string;
    source_url?: string;
    evidence_score?: number;
    confidence_level?: string;
    status?: string;
    [key: string]: any;
  } | null;
  rule?: any;
  session?: SessionData;
  message?: string;
};

const DiagnosePage = () => {
  const params = useParams();

  const sessionId =
    params?.sessionId as string | undefined;

  const [sessionData, setSessionData] =
    useState<SessionData | null>(null);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [savingAnswer, setSavingAnswer] =
    useState(false);

  const [completingDiagnosis, setCompletingDiagnosis] =
    useState(false);

  const [pageError, setPageError] =
    useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answers, setAnswers] =
    useState<Record<string, any>>({});

  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResult | null>(null);

  /*
   * ============================================================
   * CARREGAR SESSÃO E PERGUNTAS
   * ============================================================
   */

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        setPageError(
          'Sessão de diagnóstico não encontrada.'
        );

        setLoading(false);

        return;
      }

      try {
        console.log(
          'DIAGNOSE SESSION:',
          sessionId
        );

        /*
         * 1. Buscar sessão
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

          throw new Error(
            'Não foi possível carregar a sessão de diagnóstico.'
          );
        }

        if (!session) {
          throw new Error(
            'Sessão de diagnóstico não encontrada.'
          );
        }

        console.log(
          'DIAGNOSE SESSION DATA:',
          session
        );

        setSessionData(session);

        /*
         * Recuperar respostas já salvas
         */

        if (
          session.answers &&
          typeof session.answers === 'object' &&
          !Array.isArray(session.answers)
        ) {
          setAnswers(session.answers);
        }

        /*
         * 2. Buscar perguntas
         */

        console.log(
          'LOADING QUESTIONS FOR CONTEXT:',
          session.context_id
        );

        const {
          data: questionData,
          error: questionError,
        } = await supabase
          .from('diagnostic_questions')
          .select('*')
          .eq(
            'context_id',
            session.context_id
          )
          .order('order_index', {
            ascending: true,
          });

        if (questionError) {
          console.error(
            'QUESTIONS FETCH ERROR:',
            questionError
          );

          throw new Error(
            'Não foi possível carregar as perguntas do diagnóstico.'
          );
        }

        console.log(
          'DIAGNOSTIC QUESTIONS:',
          questionData
        );

        setQuestions(questionData || []);
      } catch (error) {
        console.error(
          'DIAGNOSE PAGE ERROR:',
          error
        );

        setPageError(
          error instanceof Error
            ? error.message
            : 'Ocorreu um erro ao carregar o diagnóstico.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  /*
   * ============================================================
   * CONCLUIR DIAGNÓSTICO
   * ============================================================
   */

  const completeDiagnosis = async () => {
    if (!sessionId) {
      setPageError(
        'Sessão de diagnóstico não encontrada.'
      );

      return;
    }

    setCompletingDiagnosis(true);
    setPageError(null);

    console.log(
      'STARTING DIAGNOSIS COMPLETION:',
      sessionId
    );

    try {
      const response = await fetch(
        '/api/diagnose/complete',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },

          body: JSON.stringify({
            sessionId,
          }),
        }
      );

      const responseText =
        await response.text();

      let data: DiagnosisResult | null = null;

      try {
        data = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        data = null;
      }

      console.log(
        'DIAGNOSIS COMPLETION RESPONSE:',
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            (data as any)?.error ||
            'Não foi possível concluir o diagnóstico.'
        );
      }

      if (!data) {
        throw new Error(
          'A API não retornou um resultado válido.'
        );
      }

      setDiagnosisResult(data);

      /*
       * Atualiza a sessão local
       */

      if (data.session) {
        setSessionData((prev) =>
          prev
            ? {
                ...prev,
                ...data.session,
              }
            : prev
        );
      }
    } catch (error) {
      console.error(
        'DIAGNOSIS COMPLETION ERROR:',
        error
      );

      setPageError(
        error instanceof Error
          ? error.message
          : 'Não foi possível concluir o diagnóstico.'
      );
    } finally {
      setCompletingDiagnosis(false);
    }
  };

  /*
   * ============================================================
   * RESPONDER PERGUNTA
   * ============================================================
   */

  const handleAnswer = async (answer: any) => {
    const currentQuestion =
      questions[currentQuestionIndex];

    if (!currentQuestion) {
      console.error(
        'CURRENT QUESTION NOT FOUND'
      );

      return;
    }

    if (!sessionId) {
      setPageError(
        'Sessão de diagnóstico não encontrada.'
      );

      return;
    }

    if (savingAnswer || completingDiagnosis) {
      return;
    }

    const isLastQuestion =
      currentQuestionIndex ===
      questions.length - 1;

    /*
     * Atualiza respostas localmente
     */

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: answer,
    };

    setAnswers(updatedAnswers);

    setSavingAnswer(true);
    setPageError(null);

    console.log(
      'SAVING DIAGNOSTIC ANSWER:',
      {
        sessionId,
        questionId: currentQuestion.id,
        answer,
        completed: isLastQuestion,
      }
    );

    try {
      /*
       * 1. Salvar resposta
       */

      const response = await fetch(
        '/api/diagnose/answer',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },

          body: JSON.stringify({
            sessionId,
            questionId: currentQuestion.id,
            answer,
            completed: isLastQuestion,
          }),
        }
      );

      const responseText =
        await response.text();

      let data: any = null;

      try {
        data = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            'Não foi possível salvar sua resposta.'
        );
      }

      console.log(
        'ANSWER SAVED SUCCESSFULLY:',
        data
      );

      /*
       * Atualizar sessão local
       */

      if (data?.session) {
        setSessionData((prev) =>
          prev
            ? {
                ...prev,
                ...data.session,
              }
            : prev
        );
      }

      /*
       * ========================================================
       * SE FOR A ÚLTIMA PERGUNTA
       * ========================================================
       *
       * Primeiro garantimos que a resposta foi salva.
       * Depois chamamos /api/diagnose/complete.
       */

      if (isLastQuestion) {
        setSavingAnswer(false);

        await completeDiagnosis();

        return;
      }

      /*
       * Caso ainda existam perguntas,
       * avançamos normalmente.
       */

      setCurrentQuestionIndex(
        (prev) => prev + 1
      );
    } catch (error) {
      console.error(
        'ANSWER SAVE ERROR:',
        error
      );

      setPageError(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar sua resposta.'
      );
    } finally {
      setSavingAnswer(false);
    }
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <h1 className="text-xl font-semibold text-slate-900">
            Preparando seu diagnóstico...
          </h1>

          <p className="mt-2 text-slate-500">
            Estamos carregando as perguntas.
          </p>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * ERRO
   * ============================================================
   */

  if (pageError) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
            ⚠️
          </div>

          <h1 className="text-2xl font-bold text-red-600">
            Ocorreu um erro!
          </h1>

          <p className="mt-3 text-slate-600">
            {pageError}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * SESSÃO NÃO ENCONTRADA
   * ============================================================
   */

  if (!sessionData) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">
          Sessão de diagnóstico não encontrada.
        </p>
      </main>
    );
  }

  /*
   * ============================================================
   * SEM PERGUNTAS
   * ============================================================
   */

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl">
            🔎
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Diagnóstico ainda não disponível
          </h1>

          <p className="mt-3 text-slate-600">
            Ainda não existem perguntas
            cadastradas para este contexto.
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Contexto: {sessionData.context_id}
          </p>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * DIAGNÓSTICO EM PROCESSAMENTO
   * ============================================================
   */

  if (
    completingDiagnosis &&
    !diagnosisResult
  ) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <h1 className="text-2xl font-bold text-slate-950">
            Analisando suas respostas...
          </h1>

          <p className="mt-3 text-slate-600">
            Estamos identificando a solução mais adequada
            para o seu problema.
          </p>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * RESULTADO DO DIAGNÓSTICO
   * ============================================================
   */

  if (diagnosisResult) {
    const fix = diagnosisResult.fix;

    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">

          <div className="mb-8 text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Resultado do diagnóstico
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {diagnosisResult.diagnosis?.title ||
                'Diagnóstico concluído'}
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              {diagnosisResult.diagnosis?.summary ||
                diagnosisResult.message ||
                'Analisamos suas respostas.'}
            </p>
          </div>

          {fix ? (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 bg-white p-8">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                    🔧
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
                      Solução recomendada
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-950">
                      {fix.title ||
                        'Correção recomendada'}
                    </h2>
                  </div>

                </div>

                {fix.summary && (
                  <p className="mt-6 leading-7 text-slate-600">
                    {fix.summary}
                  </p>
                )}

              </div>

              {fix.instructions && (
                <div className="border-b border-slate-200 bg-slate-50 p-8">

                  <h3 className="text-lg font-bold text-slate-950">
                    Como tentar corrigir
                  </h3>

                  <div className="mt-4 whitespace-pre-line rounded-2xl border border-slate-200 bg-white p-5 leading-7 text-slate-700">
                    {fix.instructions}
                  </div>

                </div>
              )}

              <div className="p-8">

                <div className="grid gap-4 sm:grid-cols-3">

                  {fix.risk_level && (
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Risco
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {fix.risk_level}
                      </p>
                    </div>
                  )}

                  {fix.difficulty && (
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Dificuldade
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {fix.difficulty}
                      </p>
                    </div>
                  )}

                  {fix.confidence_level && (
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Confiança
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {fix.confidence_level}
                      </p>
                    </div>
                  )}

                </div>

                {fix.source_url && (
                  <div className="mt-6">

                    <a
                      href={fix.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Consultar fonte da solução
                      <span aria-hidden="true">
                        ↗
                      </span>
                    </a>

                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl">
                🔎
              </div>

              <h2 className="text-xl font-bold text-slate-950">
                Nenhuma solução específica encontrada
              </h2>

              <p className="mt-3 text-slate-600">
                {diagnosisResult.message ||
                  'Ainda não encontramos uma solução específica para suas respostas.'}
              </p>

            </div>
          )}

          {/* SÓ MOSTRA O FEEDBACK SE TIVER SESSION E A FIX */}
          {sessionId && fix?.id && (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <FixFeedback
                sessionId={sessionId}
                fixId={fix.id}
              />
            </div>
          )}

        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * INTERFACE DAS PERGUNTAS
   * ============================================================
   */

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Diagnóstico WinFixer
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Vamos descobrir a causa do problema
          </h1>

          <p className="mt-3 text-slate-600">
            Responda algumas perguntas para
            que possamos indicar o caminho
            mais adequado.
          </p>

        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <DiagnosticProgress
            currentQuestionIndex={
              currentQuestionIndex
            }
            totalQuestions={
              questions.length
            }
          />

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <DiagnosticQuestion
            question={
              questions[currentQuestionIndex]
            }
            onAnswer={handleAnswer}
          />

          {savingAnswer && (
            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-slate-500">

              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />

              <span>
                Salvando sua resposta...
              </span>

            </div>
          )}

        </div>

      </div>
    </main>
  );
};

export default DiagnosePage;