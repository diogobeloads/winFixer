'use client';

import React, { useState } from 'react';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <a href="/" className="flex items-center gap-3" aria-label="WinFixer - página inicial">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="M12 3 20 6v5.5c0 4.7-3.1 8-8 9.5-4.9-1.5-8-4.8-8-9.5V6l8-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-xl font-black tracking-tight text-slate-950">WinFixer</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          <a href="/" className="text-sm font-semibold text-slate-600 transition hover:text-blue-600">Início</a>
          <a href="/search" className="text-sm font-semibold text-slate-600 transition hover:text-blue-600">Diagnosticar</a>
          <a href="/search" className="text-sm font-semibold text-slate-600 transition hover:text-blue-600">Erros</a>
          <a href="/admin" className="text-sm font-semibold text-slate-600 transition hover:text-blue-600">Admin</a>
        </nav>

        <div className="hidden md:block">
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            Entrar
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            {menuOpen ? (
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white px-6 py-4 md:hidden" aria-label="Menu mobile">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <a href="/" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">Início</a>
            <a href="/search" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">Diagnosticar</a>
            <a href="/search" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">Erros</a>
            <a href="/admin" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">Admin</a>
            <a href="/login" onClick={() => setMenuOpen(false)} className="mt-2 rounded-xl bg-slate-950 px-4 py-3 text-center font-bold text-white">Entrar</a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
