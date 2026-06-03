import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    const { id, titulo, slug, descripcion, categoria, dificultad, tiempo, porciones, ingredientes, preparacion } = body;

    if (id) {
      // Update
      const { error } = await supabase
        .from('recipes')
        .update({
          titulo,
          descripcion,
          categoria,
          dificultad,
          tiempo,
          porciones,
          ingredientes,
          preparacion,
          updated_at: new Date()
        })
        .eq('id', id);

      if (error) throw error;
    } else {
      // Insert
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
          ingredientes,
          preparacion,
          created_by: session.user.id
        });

      if (error) throw error;
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { id } = await request.json();

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('created_by', session.user.id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
