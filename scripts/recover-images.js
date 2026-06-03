#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Rutas
const respaldoPath = '/Users/mbc/Desktop/Javi/VLOGDEJAVI.CL/recetas_limpias.json';
const currentPath = path.join(__dirname, '../src/data/recetas.json');
const imagesDir = path.join(__dirname, '../public/images');

// Crear directorio si no existe
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Leer archivos
const respaldo = JSON.parse(fs.readFileSync(respaldoPath, 'utf8'));
const current = JSON.parse(fs.readFileSync(currentPath, 'utf8'));

console.log('🖼️  Iniciando recuperación de imágenes...\n');

let downloaded = 0;
let failed = 0;
let skipped = 0;

// Procesar cada receta
for (const recipeActual of current) {
  // Si ya tiene imágenes locales, skip
  if (recipeActual.imagenes_locales?.length > 0) {
    skipped++;
    continue;
  }

  // Buscar en respaldo
  const recipeRespaldo = respaldo.find(r => r.slug === recipeActual.slug);
  if (!recipeRespaldo || !recipeRespaldo.imagenes_en_respaldo?.length) {
    continue;
  }

  // Descargar cada imagen
  const localImages = [];

  for (let i = 0; i < recipeRespaldo.imagenes_en_respaldo.length; i++) {
    const imageUrl = recipeRespaldo.imagenes_en_respaldo[i];
    const fileName = generateFileName(imageUrl, i);
    const localPath = path.join(imagesDir, fileName);

    // Si ya existe, saltar descarga
    if (fs.existsSync(localPath)) {
      localImages.push(`/images/${fileName}`);
      continue;
    }

    try {
      await downloadImage(imageUrl, localPath);
      localImages.push(`/images/${fileName}`);
      downloaded++;
      console.log(`✓ ${recipeActual.titulo}: descargó imagen ${i + 1}/${recipeRespaldo.imagenes_en_respaldo.length}`);
    } catch (err) {
      failed++;
      console.log(`✗ ${recipeActual.titulo}: error descargando imagen ${i + 1}`);
    }
  }

  // Actualizar receta con imágenes locales
  if (localImages.length > 0) {
    recipeActual.imagenes_locales = localImages;
  }
}

// Guardar archivo actualizado
fs.writeFileSync(currentPath, JSON.stringify(current, null, 2));

console.log(`\n✅ Descargadas: ${downloaded}`);
console.log(`❌ Fallidas: ${failed}`);
console.log(`⏭️  Ya existentes: ${skipped}`);
console.log(`📁 Archivo guardado: ${currentPath}`);

// Estadísticas
const conImagenes = current.filter(r => r.imagenes_locales?.length > 0).length;
console.log(`\n📊 Recetas con imágenes: ${conImagenes}/167`);

// Funciones helper
function generateFileName(url, index) {
  const urlObj = new URL(url);
  const filename = urlObj.pathname.split('/').pop() || `image-${index}`;
  // Remover parámetros de caché
  return filename.split('?')[0] || `image-${index}.jpg`;
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);

    protocol.get(url, { timeout: 5000 }, (response) => {
      if (response.statusCode !== 200) {
        fs.unlink(filepath, () => {}); // Eliminar archivo fallido
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
    })
    .on('error', (err) => {
      fs.unlink(filepath, () => {}); // Eliminar archivo fallido
      reject(err);
    });

    file.on('finish', () => {
      file.close();
      resolve();
    });

    file.on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}
