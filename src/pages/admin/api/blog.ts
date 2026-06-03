import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, titulo, slug, contenido, imagen_portada, categoria, publicado } = body;

    if (id) {
      // Update
      const { error } = await supabase
        .from('blog_posts')
        .update({
          titulo,
          slug,
          contenido,
          imagen_portada,
          categoria,
          publicado,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } else {
      // Insert
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          titulo,
          slug: slug || titulo.toLowerCase().replace(/\s+/g, '-'),
          contenido,
          imagen_portada,
          categoria,
          publicado: publicado ?? true
        });

      if (error) throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id } = body;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
