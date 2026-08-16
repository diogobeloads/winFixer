'use client';

import React, { useState } from 'react';
import ErrorSearch from '../components/ErrorSearch';

const popularErrors = [
  {
    code: '0x80070005',
    title: 'Access Denied',
    description: 'Permissões e acesso a arquivos ou recursos do Windows.',
    tone: 'blue',
  },
  {
    code: '0x80070002',
    title: 'File Not Found',
    description: 'Arquivos necessários para um processo não foram encontrados.',
    tone: 'violet',
  },
  {
    code: '0x80070422',
    title: 'Windows Update',
    description: 'Serviços do Windows Update desativados ou indisponíveis.',
    tone: 'amber',
  },
];

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
    <path d="M5 10.5 8.2 14 15 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
    <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <path d="M12 3 20 6v5.5c0 4.7-3.1 8-8 9.5-4.9-1.5-8-4.8-8-9.5V6l8-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
    <path d="M14.7 6.3a4.5 4.5 0 0 0-5.8 5.8L4 17l3 3 4.9-4.9a4.5 4.5 0 0 0 5.8-5.8l-2.8 2.8-2.2-2.2 2-3.6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

const HomePage = () => {
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (searchQuery: string) => {
    const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
    const data = await res.json();
    setResults(data || []);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <section id="top" className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[-280px] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute right-[-180px] top-[240px] h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:px-8 lg:px-10 lg:pb-28 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                <CheckIcon />
              </span>
              Diagnóstico inteligente para Windows
            </div>

            <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Resolva erros do Windows
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                sem complicação.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Digite um código de erro ou descreva o que está acontecendo.
              O WinFixer ajuda você a encontrar a causa e seguir uma solução passo a passo.
            </p>

            <div className="mx-auto mt-10 max-w-3xl">
              <ErrorSearch onSearch={handleSearch} setQuery={() => {}} />
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-slate-500">
              <span className="inline-flex items-center gap-2">
                <CheckIcon /> Passo a passo
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckIcon /> Soluções verificáveis
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckIcon /> Fácil de usar
              </span>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur sm:p-7">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <SearchIcon />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Não sabe o código do erro?</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Descreva o problema com suas próprias palavras. Ex.: “meu Windows Update não instala”.
                    </p>
                  </div>
                </div>
                <a
                  href="/search"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  Explorar erros
                  <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">Como funciona</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Do problema à solução em poucos passos
            </h2>
            <p className="mt-4 text-slate-600">
              O WinFixer transforma uma mensagem de erro em um caminho claro para você tentar resolver o problema.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                number: '01',
                icon: <SearchIcon />,
                title: 'Pesquise',
                text: 'Informe o código do erro ou descreva o comportamento do seu computador.',
              },
              {
                number: '02',
                icon: <SparkIcon />,
                title: 'Diagnostique',
                text: 'Use as informações encontradas para entender melhor a possível causa.',
              },
              {
                number: '03',
                icon: <WrenchIcon />,
                title: 'Resolva',
                text: 'Siga instruções organizadas em etapas para tentar corrigir o problema.',
              },
            ].map((step) => (
              <div
                key={step.number}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    {step.icon}
                  </div>
                  <span className="text-sm font-black tracking-widest text-slate-300">{step.number}</span>
                </div>
                <h3 className="mt-7 text-xl font-extrabold text-slate-950">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">Problemas comuns</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Comece por um erro conhecido
              </h2>
            </div>
            <a href="/search" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700">
              Ver todos os erros <ArrowIcon />
            </a>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {popularErrors.map((error) => (
              <button
                key={error.code}
                type="button"
                onClick={() => handleSearch(error.code)}
                className="group text-left"
              >
                <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-blue-200 group-hover:shadow-xl group-hover:shadow-blue-900/5">
                  <div className="flex items-center justify-between">
                    <span
                      className={[
                        'rounded-lg px-3 py-1.5 font-mono text-sm font-bold',
                        error.tone === 'blue' && 'bg-blue-50 text-blue-700',
                        error.tone === 'violet' && 'bg-violet-50 text-violet-700',
                        error.tone === 'amber' && 'bg-amber-50 text-amber-700',
                      ].filter(Boolean).join(' ')}
                    >
                      {error.code}
                    </span>
                    <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                      <ArrowIcon />
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-slate-950">{error.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{error.description}</p>
                  <p className="mt-6 text-sm font-bold text-blue-600">Pesquisar solução →</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400">
                <ShieldIcon />
              </div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Menos tentativa e erro.
                <span className="block text-blue-400">Mais clareza para resolver.</span>
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">
                O WinFixer foi pensado para transformar problemas frustrantes do Windows em instruções simples de entender e executar.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['01', 'Pesquise rapidamente'],
                ['02', 'Entenda a possível causa'],
                ['03', 'Siga etapas organizadas'],
                ['04', 'Compartilhe o que funcionou'],
              ].map(([number, label]) => (
                <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <span className="text-sm font-black text-blue-400">{number}</span>
                  <p className="mt-3 font-bold text-white">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">
            Seu próximo erro pode ter solução.
          </h2>
          <p className="mt-4 text-slate-600">
            Pesquise agora e descubra o que você pode tentar fazer.
          </p>
          <a
            href="#top"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Diagnosticar um problema
            <ArrowIcon />
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>© {new Date().getFullYear()} WinFixer. Diagnóstico de erros do Windows.</p>
          <div className="flex gap-5">
            <a href="/search" className="hover:text-blue-600">Pesquisar</a>
            <a href="/login" className="hover:text-blue-600">Entrar</a>
          </div>
        </div>
      </footer>

      {results.length > 0 && null}
    </div>
  );
};

export default HomePage;
