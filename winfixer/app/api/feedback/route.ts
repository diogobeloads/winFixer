import { NextResponse } from 'next/server';
// Ajuste o import abaixo para apontar para o seu cliente Supabase configurado
import { createClient } from '@supabase/supabase-js'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, fix_id, result, notes } = body;

    // Validação básica para garantir que os campos obrigatórios estão presentes
    if (!session_id || !fix_id || !result) {
      return NextResponse.json(
        { error: 'Os campos session_id, fix_id e result são obrigatórios.' },
        { status: 400 }
      );
    }

    // Inicialização do Supabase (Ajuste conforme o seu projeto: util, route handler client, etc.)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Inserindo os dados na tabela fix_feedback
    const { data, error } = await supabase
      .from('fix_feedback')
      .insert([
        {
          session_id,
          fix_id,
          result,
          notes: notes || null, // notes é opcional
        }
      ])
      .select();

    if (error) {
      console.error('Erro no Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
    
  } catch (error) {
    console.error('Erro na API de feedback:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao processar o feedback.' },
      { status: 500 }
    );
  }
}