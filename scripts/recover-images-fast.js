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

console.log('🖼️  Iniciando recuperación de imágenes (versión rápida)...\n');

let downloaded = 0;
let failed = 0;
let skipped = 0;
let processed = 0;

// Procesar cada receta (sin awaits, descarga paralela)
const downloadPromises = [];

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

  processed++;
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

    // Agregar descarga a la cola (no await)
    downloadPromises.push(
      downloadImage(imageUrl, localPath)
        .then(() => {
          downloaded++;
          console.log(`✓ ${recipeActual.titulo}: imagen ${i + 1}`);
          localImages.push(`/images/${fileName}`);
        })
        .catch(() => {
          failed++;
          console.log(`✗ ${recipeActual.titulo}: error imagen ${i + 1}`);
        })
    );
  }

  // Actualizar receta con imágenes locales (al final del bucle)
  if (localImages.length > 0) {
    recipeActual.imagenes_locales = localImages;
  }
}

// Esperar a que todas las descargas terminen
await Promise.all(downloadPromises);

// Guardar archivo actualizado
fs.writeFileSync(currentPath, JSON.stringify(current, null, 2));

console.log(`\n✅ Recetas procesadas: ${processed}`);
console.log(`✅ Descargadas: ${downloaded}`);
console.log(`❌ Fallidas: ${failed}`);
console.log(`⏭️  Ya existentes: ${skipped}`);
console.log(`📁 Archivo guardado`);

// Estadísticas
const conImagenes = current.filter(r => r.imagenes_locales?.length > 0).length;
console.log(`\n📊 Recetas con imágenes: ${conImagenes}/167`);

// Funciones helper
function generateFileName(url, index) {
  const urlObj = new URL(url);
  const filename = urlObj.pathname.split('/').pop() || `image-${index}`;
  return filename.split('?')[0] || `image-${index}.jpg`;
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    let timedOut = false;

    const req = protocol.get(url, { timeout: 3000 }, (response) => {
      if (response.statusCode !== 200) {
        fs.unlink(filepath, () => {});
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
    });

    req.on('timeout', () => {
      timedOut = true;
      req.destroy();
      fs.unlink(filepath, () => {});
      reject(new Error('timeout'));
    });

    req.on('error', (err) => {
      if (!timedOut) fs.unlink(filepath, () => {});
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
