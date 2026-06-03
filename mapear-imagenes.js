#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const JSON_FILE = '/Users/mbc/.claude/clientes/recetasdejavi/src/data/recetas.json';
const IMAGES_DIR = '/Users/mbc/.claude/clientes/recetasdejavi/public/images';

console.log('📸 Leyendo imágenes disponibles...');
const availableImages = fs.readdirSync(IMAGES_DIR);
const imageMap = new Map();

// Create map of filenames (without extension) to their paths
availableImages.forEach(img => {
  const ext = path.extname(img);
  const base = path.basename(img, ext);
  imageMap.set(base, `/images/${img}`);
});

console.log(`✅ ${availableImages.length} imágenes encontradas`);

console.log('📖 Procesando recetas...');
const recipes = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));

let mappedCount = 0;
const processed = recipes.map(recipe => {
  const imagenes_locales = [];

  // Try to find images for this recipe
  if (recipe.imagenes_originales && recipe.imagenes_originales.length > 0) {
    recipe.imagenes_originales.forEach(originalUrl => {
      // Extract GUID or filename from URL
      const match = originalUrl.match(/\/([a-z0-9-]+)\.(jpg|jpeg|png|webp)$/i);
      if (match) {
        const guid = match[1];
        if (imageMap.has(guid)) {
          imagenes_locales.push(imageMap.get(guid));
          mappedCount++;
        }
      }
    });
  }

  return {
    ...recipe,
    imagenes_locales
  };
});

fs.writeFileSync(JSON_FILE, JSON.stringify(processed, null, 2), 'utf-8');

console.log(`✅ JSON actualizado con mapeo de imágenes`);
console.log(`📊 ${mappedCount} imágenes mapeadas a recetas`);

// Stats
const recetasConImagenes = processed.filter(r => r.imagenes_locales.length > 0).length;
console.log(`✅ ${recetasConImagenes} recetas con imágenes`);
