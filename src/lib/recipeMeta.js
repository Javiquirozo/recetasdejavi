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
