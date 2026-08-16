'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ErrorCard from '@/components/ErrorCard';

interface WindowsError {
  id: string;
  code: string;
  normalized_code: string;
  name?: string | null;
  title: string;
  description?: string | null;
  category?: string | null;
  severity?: string | null;
  aliases?: string[] | null;
}

interface ErrorContext {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  operating_systems?: string[] | null;
  symptoms?: string[] | null;
}

const severityLabel: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
  baixa: 'Baixa',
  media: 'Média',
  média: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
  crítica: 'Crítica',
};

function normalizeCode(value: string) {
  return value.trim().toLowerCase().replace(/^0x/, '');
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <path d="M12 3 20 6v5.5c0 4.7-3.1 8-8 9.5-4.9-1.5-8-4.8-8-9.5V6l8-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
    <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
    <path d="m7 4 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ContextIcon = ({ slug }: { slug: string }) => {
  const icon = slug.includes('store') ? '▣' : slug.includes('driver') ? '⚙' : slug.includes('boot') ? '↻' : slug.includes('activation') ? '✓' : '⌘';
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl font-black text-blue-600">
      {icon}
    </span>
  );
};

export default function ErrorPage() {
  const params = useParams();
  const router = useRouter();
  const codeParam = params?.code as string | undefined;
  const normalizedCode = useMemo(() => (codeParam ? normalizeCode(codeParam) : ''), [codeParam]);

  const [errorData, setErrorData] = useState<WindowsError | null>(null);
  const [contexts, setContexts] = useState<ErrorContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingContext, setStartingContext] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    const fetchErrorData = async () => {
      if (!normalizedCode) return;

      setLoading(true);
      setPageError(null);

      const { data: error, error: errorFetch } = await supabase
        .from('errors')
        .select('*')
        .eq('normalized_code', normalizedCode)
        .eq('status', 'published')
        .maybeSingle();

      if (errorFetch) {
        setPageError(errorFetch.message);
        setLoading(false);
        return;
      }

      if (!error) {
        setErrorData(null);
        setContexts([]);
        setLoading(false);
        return;
      }

      const { data: contextData, error: contextFetch } = await supabase
        .from('error_contexts')
        .select('id, name, slug, description, operating_systems, symptoms')
        .eq('error_id', error.id)
        .order('name', { ascending: true });

      if (contextFetch) {
        setPageError(contextFetch.message);
      }

      setErrorData(error);
      setContexts(contextData ?? []);
      setLoading(false);
    };

    fetchErrorData();
  }, [normalizedCode]);

  const startDiagnosis = async (contextId: string) => {
    if (!errorData || startingContext) return;

    setStartingContext(contextId);
    setPageError(null);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorId: errorData.id,
          contextId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.[0]?.id) {
        throw new Error(data?.error || 'Não foi possível iniciar o diagnóstico.');
      }

      router.push(`/diagnose/${data[0].id}`);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Não foi possível iniciar o diagnóstico.');
      setStartingContext(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-5 w-32 rounded-full bg-slate-200" />
          <div className="mt-6 h-16 max-w-2xl rounded-2xl bg-slate-200" />
          <div className="mt-4 h-6 max-w-xl rounded bg-slate-200" />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="h-44 rounded-3xl bg-white shadow-sm" />
            <div className="h-44 rounded-3xl bg-white shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  if (pageError && !errorData) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">!</div>
          <h1 className="mt-5 text-2xl font-black text-slate-950">Não foi possível carregar este erro</h1>
          <p className="mt-3 text-slate-600">Tente novamente ou volte para a pesquisa.</p>
          <button onClick={() => router.push('/search')} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800">
            <SearchIcon /> Pesquisar outro erro
          </button>
        </div>
      </main>
    );
  }

  if (!errorData) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><SearchIcon /></div>
          <h1 className="mt-5 text-2xl font-black text-slate-950">Erro não encontrado</h1>
          <p className="mt-3 text-slate-600">Não encontramos um diagnóstico publicado para <strong>{codeParam}</strong>.</p>
          <button onClick={() => router.push('/search')} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">
            Pesquisar novamente <ArrowIcon />
          </button>
        </div>
      </main>
    );
  }

  const severity = severityLabel[(errorData.severity || '').toLowerCase()] || errorData.severity || 'Não informada';

  return (
    <main className="min-h-[calc(100vh-80px)] overflow-hidden bg-slate-50 text-slate-900">
      <section className="relative border-b border-slate-200 bg-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-260px] h-[520px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute right-[-120px] top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-10 sm:px-8 sm:pb-16 lg:px-10 lg:pt-14">
          <button onClick={() => router.push('/search')} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600">
            ← Voltar para pesquisa
          </button>

          <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 font-mono text-sm font-black text-blue-700">
                  {errorData.code}
                </span>
                {errorData.category && (
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600">
                    {errorData.category}
                  </span>
                )}
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                {errorData.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                {errorData.description || 'Entenda este erro e escolha o contexto que mais se aproxima do problema que você está enfrentando.'}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><ShieldIcon /></div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Severidade</p>
                  <p className="mt-0.5 font-extrabold text-slate-900">{severity}</p>
                </div>
              </div>
              <div className="mt-5 h-px bg-slate-100" />
              <p className="mt-4 text-sm leading-6 text-slate-500">O WinFixer usa o contexto do problema para indicar o caminho de diagnóstico correto.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">Primeiro passo</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Onde o problema acontece?</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            O mesmo código pode aparecer em situações diferentes. Escolha a que mais se parece com o seu caso para começarmos um diagnóstico direcionado.
          </p>
        </div>

        {pageError && errorData && (
          <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {pageError}
          </div>
        )}

        {contexts.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {contexts.map((context) => (
              <ErrorCard
                key={context.id}
                context={context}
                loading={startingContext === context.id}
                disabled={Boolean(startingContext)}
                onDiagnose={() => startDiagnosis(context.id)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-7">
            <p className="font-extrabold text-amber-900">Ainda não temos contextos cadastrados para este erro.</p>
            <p className="mt-2 text-sm leading-6 text-amber-800">A informação básica do erro está disponível, mas precisamos cadastrar pelo menos um contexto antes de iniciar o diagnóstico.</p>
          </div>
        )}

        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600"><SearchIcon /></div>
              <div>
                <p className="font-extrabold text-slate-950">Não encontrou seu cenário?</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">Pesquise outro código ou descreva o problema com suas próprias palavras.</p>
              </div>
            </div>
            <button onClick={() => router.push('/search')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
              Nova pesquisa <ChevronIcon />
            </button>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 text-sm text-slate-500 sm:px-8 lg:px-10">
          <p><strong className="text-slate-700">Código pesquisado:</strong> {errorData.code}</p>
          {errorData.aliases && errorData.aliases.length > 0 && (
            <p><strong className="text-slate-700">Também conhecido como:</strong> {errorData.aliases.join(', ')}</p>
          )}
        </div>
      </section>
    </main>
  );
}
