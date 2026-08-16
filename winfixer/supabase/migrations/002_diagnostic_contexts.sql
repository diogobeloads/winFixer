-- ============================================================
-- WinFixer - Etapa 2
-- Contextos de diagnóstico + perguntas iniciais
-- ============================================================

-- ------------------------------------------------------------
-- 1. RLS
-- ------------------------------------------------------------

ALTER TABLE public.error_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_sessions ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 2. Policies de leitura pública
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Public can read error contexts"
ON public.error_contexts;

CREATE POLICY "Public can read error contexts"
ON public.error_contexts
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Public can read diagnostic questions"
ON public.diagnostic_questions;

CREATE POLICY "Public can read diagnostic questions"
ON public.diagnostic_questions
FOR SELECT
TO anon, authenticated
USING (true);

-- ------------------------------------------------------------
-- 3. Policies para sessões
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "Public can create diagnostic sessions"
ON public.diagnostic_sessions;

CREATE POLICY "Public can create diagnostic sessions"
ON public.diagnostic_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read diagnostic sessions"
ON public.diagnostic_sessions;

CREATE POLICY "Public can read diagnostic sessions"
ON public.diagnostic_sessions
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Public can update diagnostic sessions"
ON public.diagnostic_sessions;

CREATE POLICY "Public can update diagnostic sessions"
ON public.diagnostic_sessions
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);


-- ============================================================
-- 4. Contextos para 0x80070005
-- ============================================================

INSERT INTO public.error_contexts (
  error_id,
  name,
  slug,
  description,
  operating_systems,
  symptoms
)
SELECT
  e.id,
  context.name,
  context.slug,
  context.description,
  context.operating_systems,
  context.symptoms
FROM public.errors e
CROSS JOIN (
  VALUES
  (
    'Windows Update',
    'windows-update',
    'O erro aparece quando você tenta atualizar o Windows ou instalar atualizações.',
    ARRAY['Windows 10', 'Windows 11'],
    ARRAY['Windows Update falha', 'Atualização não instala', 'Código 0x80070005']
  ),
  (
    'Instalação de programa',
    'instalacao-programa',
    'O erro aparece ao instalar, atualizar ou executar um programa no Windows.',
    ARRAY['Windows 10', 'Windows 11'],
    ARRAY['Instalação bloqueada', 'Acesso negado', 'Programa não instala']
  ),
  (
    'Arquivos e pastas',
    'arquivos-pastas',
    'O erro aparece ao acessar, modificar, copiar ou excluir arquivos e pastas.',
    ARRAY['Windows 10', 'Windows 11'],
    ARRAY['Acesso negado', 'Não consigo modificar arquivo', 'Permissão insuficiente']
  ),
  (
    'Ativação do Windows',
    'ativacao-windows',
    'O erro aparece durante a ativação ou validação da licença do Windows.',
    ARRAY['Windows 10', 'Windows 11'],
    ARRAY['Ativação falha', 'Windows não ativa', 'Erro de licença']
  ),
  (
    'Outro cenário',
    'outro-cenario',
    'O código aparece em uma situação diferente das opções anteriores.',
    ARRAY['Windows 10', 'Windows 11'],
    ARRAY['Erro inesperado', 'Situação diferente']
  )
) AS context(
  name,
  slug,
  description,
  operating_systems,
  symptoms
)
WHERE e.normalized_code = '80070005'
ON CONFLICT (error_id, slug)
DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  operating_systems = EXCLUDED.operating_systems,
  symptoms = EXCLUDED.symptoms;


-- ============================================================
-- 5. Perguntas iniciais
-- ============================================================

-- Windows Update
INSERT INTO public.diagnostic_questions (
  error_id,
  context_id,
  question,
  question_type,
  options,
  order_index
)
SELECT
  e.id,
  c.id,
  'O erro aparece quando você tenta instalar uma atualização do Windows?',
  'single_choice',
  '[
    {"value":"yes","label":"Sim, durante o Windows Update"},
    {"value":"no","label":"Não"},
    {"value":"unsure","label":"Não tenho certeza"}
  ]'::jsonb,
  1
FROM public.errors e
JOIN public.error_contexts c
  ON c.error_id = e.id
WHERE e.normalized_code = '80070005'
  AND c.slug = 'windows-update'
  AND NOT EXISTS (
    SELECT 1
    FROM public.diagnostic_questions q
    WHERE q.context_id = c.id
      AND q.order_index = 1
  );


-- Instalação de programa
INSERT INTO public.diagnostic_questions (
  error_id,
  context_id,
  question,
  question_type,
  options,
  order_index
)
SELECT
  e.id,
  c.id,
  'O erro aparece ao instalar ou atualizar um programa?',
  'single_choice',
  '[
    {"value":"yes","label":"Sim"},
    {"value":"no","label":"Não"},
    {"value":"unsure","label":"Não tenho certeza"}
  ]'::jsonb,
  1
FROM public.errors e
JOIN public.error_contexts c
  ON c.error_id = e.id
WHERE e.normalized_code = '80070005'
  AND c.slug = 'instalacao-programa'
  AND NOT EXISTS (
    SELECT 1
    FROM public.diagnostic_questions q
    WHERE q.context_id = c.id
      AND q.order_index = 1
  );


-- Arquivos e pastas
INSERT INTO public.diagnostic_questions (
  error_id,
  context_id,
  question,
  question_type,
  options,
  order_index
)
SELECT
  e.id,
  c.id,
  'Você consegue abrir o arquivo ou pasta, mas não consegue modificá-lo?',
  'single_choice',
  '[
    {"value":"yes","label":"Sim"},
    {"value":"no","label":"Não, nem consigo abrir"},
    {"value":"unsure","label":"Não tenho certeza"}
  ]'::jsonb,
  1
FROM public.errors e
JOIN public.error_contexts c
  ON c.error_id = e.id
WHERE e.normalized_code = '80070005'
  AND c.slug = 'arquivos-pastas'
  AND NOT EXISTS (
    SELECT 1
    FROM public.diagnostic_questions q
    WHERE q.context_id = c.id
      AND q.order_index = 1
  );


-- Ativação
INSERT INTO public.diagnostic_questions (
  error_id,
  context_id,
  question,
  question_type,
  options,
  order_index
)
SELECT
  e.id,
  c.id,
  'O erro aparece ao tentar ativar o Windows?',
  'single_choice',
  '[
    {"value":"yes","label":"Sim"},
    {"value":"no","label":"Não"},
    {"value":"unsure","label":"Não tenho certeza"}
  ]'::jsonb,
  1
FROM public.errors e
JOIN public.error_contexts c
  ON c.error_id = e.id
WHERE e.normalized_code = '80070005'
  AND c.slug = 'ativacao-windows'
  AND NOT EXISTS (
    SELECT 1
    FROM public.diagnostic_questions q
    WHERE q.context_id = c.id
      AND q.order_index = 1
  );


-- Outro cenário
INSERT INTO public.diagnostic_questions (
  error_id,
  context_id,
  question,
  question_type,
  options,
  order_index
)
SELECT
  e.id,
  c.id,
  'Você consegue descrever quando o erro aparece?',
  'single_choice',
  '[
    {"value":"startup","label":"Ao iniciar o Windows"},
    {"value":"program","label":"Ao abrir um programa"},
    {"value":"system","label":"Durante alguma tarefa do Windows"},
    {"value":"other","label":"Em outra situação"}
  ]'::jsonb,
  1
FROM public.errors e
JOIN public.error_contexts c
  ON c.error_id = e.id
WHERE e.normalized_code = '80070005'
  AND c.slug = 'outro-cenario'
  AND NOT EXISTS (
    SELECT 1
    FROM public.diagnostic_questions q
    WHERE q.context_id = c.id
      AND q.order_index = 1
  );