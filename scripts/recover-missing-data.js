#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Rutas
const respaldoPath = '/Users/mbc/Desktop/Javi/VLOGDEJAVI.CL/recetas_limpias.json';
const currentPath = path.join(__dirname, '../src/data/recetas.json');

// Leer archivos
const respaldo = JSON.parse(fs.readFileSync(respaldoPath, 'utf8'));
const current = JSON.parse(fs.readFileSync(currentPath, 'utf8'));

console.log('🔄 Recuperando datos faltantes...\n');

let updated = 0;

// Procesar cada receta actual
current.forEach(recipeActual => {
  // Si ya tiene ingredientes y preparación, skip
  if (recipeActual.ingredientes?.length > 0 && recipeActual.preparacion?.length > 0) {
    return;
  }

  // Buscar en respaldo
  const recipeRespaldo = respaldo.find(r => r.slug === recipeActual.slug);
  if (!recipeRespaldo) return;

  // Si el respaldo tampoco tiene datos, intentar extraer del HTML
  if ((!recipeActual.ingredientes || recipeActual.ingredientes.length === 0) && recipeRespaldo.html_original) {
    const extracted = extractFromHTML(recipeRespaldo.html_original);

    if (extracted.ingredientes?.length > 0) {
      recipeActual.ingredientes = extracted.ingredientes;
      updated++;
      console.log(`✓ ${recipeActual.titulo}: ${extracted.ingredientes.length} ingredientes recuperados`);
    }

    if (extracted.preparacion?.length > 0) {
      recipeActual.preparacion = extracted.preparacion;
      console.log(`✓ ${recipeActual.titulo}: ${extracted.preparacion.length} pasos recuperados`);
    }
  }
});

// Guardar archivo actualizado
fs.writeFileSync(currentPath, JSON.stringify(current, null, 2));

console.log(`\n✅ ${updated} recetas actualizadas`);
console.log('📁 Archivo guardado:', currentPath);

// Estadísticas finales
const conIng = current.filter(r => r.ingredientes?.length > 0).length;
const conPrep = current.filter(r => r.preparacion?.length > 0).length;
console.log(`\n📊 Resumen:`);
console.log(`   Recetas con ingredientes: ${conIng}/167`);
console.log(`   Recetas con preparación: ${conPrep}/167`);

// Función para extraer datos del HTML
function extractFromHTML(html) {
  const result = { ingredientes: [], preparacion: [] };

  // Buscar ingredientes
  const ingMatch = html.match(/<div[^>]*class="[^"]*wprm-fallback-recipe-ingredients[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  if (ingMatch) {
    const ingHTML = ingMatch[1];
    const items = ingHTML.match(/<li[^>]*>(.*?)<\/li>/g) || [];
    result.ingredientes = items.map(item =>
      item.replace(/<li[^>]*>/g, '').replace(/<\/li>/g, '').replace(/<[^>]+>/g, '').trim()
    ).filter(i => i.length > 0);
  }

  // Buscar preparación (pasos)
  const prepMatch = html.match(/<div[^>]*class="[^"]*wprm-fallback-recipe-instructions[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  if (prepMatch) {
    const prepHTML = prepMatch[1];
    const items = prepHTML.match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];
    result.preparacion = items.map(item => {
      const cleaned = item.replace(/<li[^>]*>/g, '').replace(/<\/li>/g, '').replace(/<[^>]+>/g, '').trim();
      return cleaned.replace(/^\d+\.\s*/, ''); // Remover numeración
    }).filter(p => p.length > 0);
  }

  return result;
}
