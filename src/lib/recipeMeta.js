const PLACEHOLDERS = ['no especificada', 'no especificado', 'n/a', 'sin especificar', 'sin dato', '-'];

export function isRealValue(v) {
  if (!v) return false;
  return !PLACEHOLDERS.includes(String(v).trim().toLowerCase());
}

// "otros" son artículos de blog / talleres / anuncios recuperados del sitio viejo,
// no recetas reales — no deben aparecer en listados ni filtros de recetas.
export function isRealRecipe(r) {
  return Boolean(r.ingredientes && r.ingredientes.length > 0);
}

// Nombres para mostrar por categoría — sobreescriben el simple "reemplazar guion bajo"
// para los casos donde ese nombre no queda bien (ej. plural, o con conector "y").
const CATEGORY_LABELS = {
  plato_principal: 'Plato principal',
  postre: 'Dulces',
  salsa: 'Salsas',
  desayuno: 'Desayunos',
  entrada: 'Entrada',
  acompañamiento: 'Acompañamiento',
  sopa: 'Sopas y cremas',
  otros: 'Otros',
};

export function categoryLabel(cat) {
  if (!cat) return CATEGORY_LABELS.otros;
  return CATEGORY_LABELS[cat] || cat.replace('_', ' ');
}
