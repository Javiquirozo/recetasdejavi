import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, titulo, slug, descripcion, categoria, dificultad, tiempo, porciones, ingredientes, preparacion, imagenes_locales } = body;

    if (!titulo) {
      return new Response(JSON.stringify({ error: 'Título es requerido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (id) {
      // Update existing recipe
      const { error } = await supabase
        .from('recipes')
        .update({
          titulo,
          descripcion,
          categoria,
          dificultad,
          tiempo,
          porciones,
          ingredientes: ingredientes || [],
          preparacion: preparacion || [],
          imagenes_locales: imagenes_locales || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } else {
      // Insert new recipe
      const { error } = await supabase
        .from('recipes')
        .insert({
          titulo,
          slug: slug || titulo.toLowerCase().replace(/\s+/g, '-'),
          descripcion,
          categoria,
          dificultad,
          tiempo,
          porciones,
          ingredientes: ingredientes || [],
          preparacion: preparacion || [],
          imagenes_locales: imagenes_locales || []
        });

      if (error) throw error;
    }

    const response = JSON.stringify({ success: true });
    return new Response(response, { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    const errorMsg = error?.message || 'Unknown error';
    console.error('Recipe save error:', errorMsg, error);
    return new Response(JSON.stringify({ error: errorMsg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
