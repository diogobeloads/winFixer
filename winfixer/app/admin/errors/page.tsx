'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ErrorType } from '@/types/database';

export default function AdminErrorsPage() {
  const [errors, setErrors] = useState<ErrorType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchErrors = async () => {
      const { data, error } = await supabase
        .from('errors')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching errors:', error);
      } else {
        setErrors(data ?? []);
      }

      setLoading(false);
    };

    fetchErrors();
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-600">Carregando erros...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950">Gerenciar erros</h1>
        <p className="mt-1 text-sm text-slate-500">
          Erros publicados atualmente disponíveis na base do WinFixer.
        </p>
      </div>

      {errors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Nenhum erro publicado encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {errors.map((error) => (
            <article
              key={error.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-extrabold text-blue-700">
                      {error.code}
                    </span>
                    {error.category && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {error.category}
                      </span>
                    )}
                    {error.severity && (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                        Severidade: {error.severity}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-3 text-lg font-extrabold text-slate-950">
                    {error.title}
                  </h2>

                  {error.description && (
                    <p className="mt-2 max-w-3xl leading-6 text-slate-600">
                      {error.description}
                    </p>
                  )}
                </div>

                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Publicado
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
