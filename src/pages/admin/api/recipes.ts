import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, titulo, slug, descripcion, categoria, dificultad, tiempo, porciones, ingredientes, preparacion, imagenes_locales } = body;

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

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('Recipe save error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
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
