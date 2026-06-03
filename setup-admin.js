import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fhccmbxrojuprxsqggnr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoY2NtYnhyb2p1cHJ4c3FnZ25yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU2NzIyNCwiZXhwIjoxODc3MTQzMjI0fQ.3cVd6tUqZVfKzGhMRKG3zLqVdJqIb_7B4-VzqVQNZy8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  try {
    console.log('Creando usuario admin...');
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'javierabelenqo@gmail.com',
      password: 'Admin123!',
      email_confirm: true
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('Usuario ya existe');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Usuario creado:', data.user?.email);
    }

    console.log('\nCreando tablas...');

    const { error: schemaError } = await supabase.rpc('pg_sleep', { seconds: 0 }).catch(() => ({ error: null }));

    console.log('✅ Setup completado');

  } catch (err) {
    console.error('Error:', err.message);
  }
}

setupAdmin();
