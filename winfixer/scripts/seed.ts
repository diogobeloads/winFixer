import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const errors = [
  {
    code: '0x80070002',
    normalized_code: '80070002',
    name: 'File Not Found',
    title: 'Windows Update Error 0x80070002',
    description: 'This error indicates that a file required for the update is missing.',
    category: 'Windows Update',
    severity: 'high',
    aliases: [],
    seo_title: '0x80070002: Como corrigir erro no Windows | WinFixer',
    seo_description: 'Descubra o que significa o erro 0x80070002 e siga um diagnóstico passo a passo com soluções verificadas para Windows.',
  },
  {
    code: '0x80070003',
    normalized_code: '80070003',
    name: 'Path Not Found',
    title: 'Windows Update Error 0x80070003',
    description: 'This error indicates that the path to the update files is incorrect.',
    category: 'Windows Update',
    severity: 'high',
    aliases: [],
    seo_title: '0x80070003: Como corrigir erro no Windows | WinFixer',
    seo_description: 'Descubra o que significa o erro 0x80070003 e siga um diagnóstico passo a passo com soluções verificadas para Windows.',
  },
  // Add more error entries as needed
];

async function seedErrors() {
  for (const error of errors) {
    const { data, error: insertError } = await supabase
      .from('errors')
      .insert({
        id: uuidv4(),
        code: error.code,
        normalized_code: error.normalized_code,
        name: error.name,
        title: error.title,
        description: error.description,
        category: error.category,
        severity: error.severity,
        aliases: error.aliases,
        seo_title: error.seo_title,
        seo_description: error.seo_description,
      });

    if (insertError) {
      console.error('Error inserting error:', insertError);
    } else {
      console.log('Inserted error:', data);
    }
  }
}

seedErrors();