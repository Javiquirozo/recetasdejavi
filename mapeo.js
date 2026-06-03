#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const JSON_INPUT = '/Users/mbc/Desktop/Javi/VLOGDEJAVI.CL/recetas_limpias.json';
const OUTPUT_FILE = '/Users/mbc/.claude/clientes/recetasdejavi/src/data/recetas.json';

console.log('📖 Leyendo JSON original...');
const recipes = JSON.parse(fs.readFileSync(JSON_INPUT, 'utf-8'));

// Función para categorizar
function categorizeRecipe(recipe) {
  const text = `${recipe.titulo.toLowerCase()} ${recipe.descripcion.toLowerCase()} ${recipe.ingredientes.join(' ').toLowerCase()}`;

  const categorias = {
    'postre': ['brownie', 'cheesecake', 'chocolate', 'galleta', 'torta', 'pastel', 'helado', 'mousse', 'flan', 'pudín', 'tarta', 'dulce', 'postres', 'barritas', 'trufas', 'crudivegano'],
    'plato_principal': ['pizza', 'pasta', 'arróz', 'risotto', 'curry', 'dahl', 'lentejas', 'chili', 'moussaka', 'burritos', 'tacos', 'ñoquis', 'enchiladas', 'carbonada', 'chow mein', 'ramen'],
    'entrada': ['tabla', 'dip', 'hummus', 'baba ganoush', 'brocheta', 'ceviche', 'tabla de quesos', 'entrantes', 'tabla compartir', 'albóndigas'],
    'bebida': ['batido', 'jugo', 'smoothie', 'té', 'café', 'bebida', 'agua', 'zumo', 'licuado'],
    'desayuno': ['panqueques', 'avena', 'granola', 'porridge', 'tostadas', 'desayuno', 'breakfast', 'muesli'],
    'sopa': ['sopa', 'caldo', 'consomé', 'crema', 'bisque', 'velouté'],
    'salsa': ['salsa', 'pesto', 'pomodoro', 'nuez', 'espinaca', 'mojo', 'guacamole'],
    'acompañamiento': ['papas', 'verduras', 'ensalada', 'guarnición', 'arroz', 'quinoa', 'puré']
  };

  for (const [cat, keywords] of Object.entries(categorias)) {
    if (keywords.some(kw => text.includes(kw))) {
      return cat;
    }
  }

  return 'otros';
}

console.log(`✅ Procesando ${recipes.length} recetas...`);
const processed = recipes.map(recipe => {
  let fechaPublicacion = null;
  try {
    if (recipe.fecha_excel) {
      const excelDate = new Date((parseInt(recipe.fecha_excel) - 1) * 86400000 + new Date('1900-01-01').getTime());
      if (!isNaN(excelDate.getTime())) {
        fechaPublicacion = excelDate.toISOString().split('T')[0];
      }
    }
  } catch (e) {}

  return {
    id: recipe.slug,
    slug: recipe.slug,
    titulo: recipe.titulo,
    tipo: 'receta',
    categoria: categorizeRecipe(recipe),
    dificultad: recipe.dificultad || 'No especificada',
    tiempo: recipe.tiempo || 'N/A',
    porciones: recipe.porciones || 'N/A',
    descripcion: recipe.descripcion || '',
    ingredientes: recipe.ingredientes || [],
    preparacion: recipe.preparacion || [],
    notas: recipe.notas || [],
    imagenes_originales: recipe.imagenes_en_respaldo || [],
    imagenes_locales: [],
    fechaPublicacion: fechaPublicacion,
    url_original: recipe.url_original
  };
});

// Guardar JSON procesado
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(processed, null, 2), 'utf-8');
console.log(`✅ JSON procesado guardado en: ${OUTPUT_FILE}`);

// Estadísticas
const stats = {};
processed.forEach(r => {
  stats[r.categoria] = (stats[r.categoria] || 0) + 1;
});

console.log('\n📊 Estadísticas por categoría:');
Object.entries(stats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});
