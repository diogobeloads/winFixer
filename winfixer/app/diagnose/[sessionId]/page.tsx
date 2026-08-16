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

const DiagnosePage = () => {
  const params = useParams();

  const sessionId = params?.sessionId as string | undefined;

  const [sessionData, setSessionData] =
    useState<SessionData | null>(null);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [savingAnswer, setSavingAnswer] =
    useState(false);

  const [pageError, setPageError] =
    useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answers, setAnswers] =
    useState<Record<string, any>>({});

  const [feedback, setFeedback] =
    useState<any>(null);

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
         * 1. Busca a sessão
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
         * Se a sessão já tiver respostas salvas,
         * recuperamos essas respostas.
         */

        if (
          session.answers &&
          typeof session.answers === 'object'
        ) {
          setAnswers(session.answers);
        }

        /*
         * 2. Busca as perguntas relacionadas ao contexto
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

    /*
     * Evita múltiplos cliques enquanto
     * estamos salvando a resposta.
     */

    if (savingAnswer) {
      return;
    }

    const isLastQuestion =
      currentQuestionIndex ===
      questions.length - 1;

    /*
     * Atualiza o estado local imediatamente.
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
       * Envia a resposta para nossa API.
       */

      const response = await fetch(
        '/api/diagnose/answer',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            sessionId,
            questionId: currentQuestion.id,
            answer,
            completed: isLastQuestion,
          }),
        }
      );

      /*
       * Nem toda resposta de erro necessariamente
       * contém JSON válido. Por isso fazemos a leitura
       * de forma segura.
       */

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
       * Atualiza a sessão local se a API
       * retornar os dados atualizados.
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
       * Só avançamos depois que o banco
       * confirmou o salvamento.
       */

      setCurrentQuestionIndex(
        (prev) => prev + 1
      );
    } catch (error) {
      console.error(
        'ANSWER SAVE ERROR:',
        error
      );

      /*
       * Como o salvamento falhou, informamos
       * o usuário e NÃO avançamos.
       */

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
   * FEEDBACK
   * ============================================================
   */

  const handleFeedback = (result: any) => {
    setFeedback(result);

    console.log(
      'DIAGNOSTIC FEEDBACK:',
      result
    );
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
   * DIAGNÓSTICO TERMINOU
   * ============================================================
   */

  const diagnosticFinished =
    currentQuestionIndex >=
    questions.length;

  /*
   * ============================================================
   * INTERFACE
   * ============================================================
   */

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">

        {!diagnosticFinished && (
          <>
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
          </>
        )}

        {diagnosticFinished &&
          !feedback && (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
                ✓
              </div>

              <h1 className="text-3xl font-bold text-slate-950">
                Diagnóstico concluído
              </h1>

              <p className="mt-3 text-slate-600">
                Analisamos suas respostas.
              </p>

              <button
                onClick={() =>
                  handleFeedback({
                    answers,
                    sessionId,
                  })
                }
                className="mt-8 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Ver resultado
              </button>
            </div>
          )}

        {feedback && (
          <FixFeedback
            onFeedback={handleFeedback}
          />
        )}
      </div>
    </main>
  );
};

export default DiagnosePage;