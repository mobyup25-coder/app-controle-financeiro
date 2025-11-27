import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validação das variáveis de ambiente
const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const hasValidCredentials = isValidUrl(supabaseUrl) && supabaseAnonKey.length > 0;

if (!hasValidCredentials) {
  console.warn('⚠️ Supabase não configurado. Configure nas Integrações do Projeto.');
}

// Criar cliente apenas se as credenciais estiverem válidas
export const supabase = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper para verificar se usuário está autenticado
export async function getUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Helper para fazer logout
export async function signOut() {
  if (!supabase) return { error: new Error('Supabase não configurado') };
  const { error } = await supabase.auth.signOut();
  return { error };
}
