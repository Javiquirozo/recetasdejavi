import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ error: 'Use POST to save recipes' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('Recipe POST request received');
    const body = await request.json();
    console.log('Body parsed:', { titulo: body.titulo, id: body.id });

    const { id, titulo, slug, descripcion, categoria, dificultad, tiempo, porciones, ingredientes, preparacion, imagenes_locales } = body;

    if (!titulo) {
      return new Response(JSON.stringify({ error: 'Título es requerido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (id) {
      console.log('Updating recipe:', id);
      const { data: existing } = await supabase
        .from('recipes')
        .select('id')
        .eq('slug', id)
        .single();

      if (existing?.id) {
        // Recipe exists, update it
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
          .eq('id', existing.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Update successful');
      } else {
        // Recipe doesn't exist, insert it
        console.log('Recipe not found, inserting');
        const { error } = await supabase
          .from('recipes')
          .insert({
            titulo,
            slug: id,
            descripcion,
            categoria,
            dificultad,
            tiempo,
            porciones,
            ingredientes: ingredientes || [],
            preparacion: preparacion || [],
            imagenes_locales: imagenes_locales || []
          });

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Insert successful');
      }
    } else {
      console.log('Inserting new recipe');
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

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      console.log('Insert successful');
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
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
