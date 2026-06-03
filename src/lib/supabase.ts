import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Recipe = {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  categoria: string;
  dificultad: string;
  tiempo: string;
  porciones: string;
  ingredientes: string[];
  preparacion: string[];
  imagenes_locales: string[];
  created_at?: string;
  updated_at?: string;
};

export type Category = {
  id: string;
  nombre: string;
  slug: string;
  created_at?: string;
};
