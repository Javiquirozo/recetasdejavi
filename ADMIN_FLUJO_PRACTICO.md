# Admin Panel - Flujo Práctico Paso a Paso

## 🎯 Escenario: Javi quiere editar una receta

### Paso 1: Entrar al Admin
```
Tu navegas a: vlogdejavi.cl/admin
     ↓
Ves un login simple:
┌─────────────────────────┐
│ Email: javi@email.com   │
│ Contraseña: ••••••      │
│        [Entrar]         │
└─────────────────────────┘
     ↓
Entras con tu cuenta (solo tú puedes)
```

### Paso 2: Dashboard Principal
```
Una vez dentro ves:

┌──────────────────────────────────┐
│ 🍽️  ADMIN - VLOG DE JAVI         │
├──────────────────────────────────┤
│ [➕ + Nueva Receta]              │
│ [📝 Nuevo Blog Post]             │
│ [🏷️  Gestionar Categorías]        │
│                                  │
│ Recetas Recientes:               │
│ • Pasta Vegana         [✏️] [🗑️]  │
│ • Brownies            [✏️] [🗑️]  │
│ • Sopa de Lentejas    [✏️] [🗑️]  │
│                                  │
│ Buscar: [_________]              │
└──────────────────────────────────┘
```

### Paso 3: Editar Receta Existente
```
Haces click en ✏️ en "Pasta Vegana":

┌────────────────────────────────────┐
│ ✏️  EDITAR: Pasta Vegana           │
├────────────────────────────────────┤
│ Título:                            │
│ [Pasta Vegana Con Salsa Pesto]     │
│                                    │
│ Descripción:                       │
│ [Una pasta deliciosa...]           │
│                                    │
│ Categoría: [Plato Principal ▼]     │
│ Dificultad: [Fácil ▼]              │
│ Tiempo: [20 minutos]               │
│ Porciones: [4 porciones]           │
│                                    │
│ Ingredientes:                      │
│ □ 400g pasta                       │
│ □ 2 tazas albahaca                 │
│ □ 1/2 taza aceite                  │
│ [+ Agregar ingrediente]            │
│                                    │
│ Preparación:                       │
│ 1. Cocina la pasta 10 minutos      │
│ 2. Prepara el pesto...             │
│ [+ Agregar paso]                   │
│                                    │
│ Fotos:                             │
│ [🖼️ foto1.jpg] [X]                │
│ [🖼️ foto2.jpg] [X]                │
│ [+ Subir nueva foto]               │
│                                    │
│ [Guardar Cambios] [Cancelar]       │
└────────────────────────────────────┘
```

## 📸 Ejemplo Real: Agregar/Cambiar Foto

```
Haces click: [+ Subir nueva foto]
     ↓
Se abre tu carpeta de fotos en la computadora
     ↓
Seleccionas: "pasta-deliciosa.jpg"
     ↓
Se sube automáticamente a Supabase
     ↓
Ves la vista previa en el form
     ↓
Haces click en X para borrar la foto antigua
     ↓
Haces click [Guardar Cambios]
     ↓
¡Hecho! Tu web se actualiza automáticamente
```

## 🗂️ Ejemplo: Cambiar Categoría

```
La receta estaba en "Postre" pero quieres en "Desayuno"

┌─────────────────────────┐
│ Categoría: [Postre ▼]   │
│ Haces click en el ▼     │
│ ↓                       │
│ Postre                  │
│ Desayuno  ← Clicas aquí │
│ Bebida                  │
│ Plato Principal         │
│ Sopa                    │
│ Entrada                 │
│ Salsa                   │
│ Acompañamiento          │
└─────────────────────────┘
     ↓
Seleccionas "Desayuno"
     ↓
[Guardar Cambios]
     ↓
¡Listo! Ya aparece en desayunos en la web
```

## 🗑️ Ejemplo: Borrar una Foto

```
En la sección "Fotos" ves:

[🖼️ foto-pasta.jpg] [X] ← Haces click en X
     ↓
"¿Estás seguro? Esta acción no se puede deshacer"
     ↓
[No, mantener] [Sí, borrar]
     ↓
Seleccionas [Sí, borrar]
     ↓
La foto desaparece del form
     ↓
[Guardar Cambios]
     ↓
¡Listo! La foto se borró de la receta
```

## ➕ Ejemplo: Crear Nueva Receta

```
Haces click: [➕ + Nueva Receta]
     ↓
Ves el mismo form pero vacío
     ↓
Llenas:
- Título: "Brownies Veganos"
- Descripción: "Brownies deliciosos sin huevo"
- Categoría: "Postre"
- Dificultad: "Fácil"
- Tiempo: "30 minutos"
- Ingredientes: (agregas todos)
- Pasos: (agregas todos)
- Fotos: (subes 2-3)
     ↓
[Guardar Nueva Receta]
     ↓
¡Listo! Ya aparece en recetas en la web
Y se agrega automáticamente al JSON
```

## 📝 Ejemplo: Crear Blog Post

```
Haces click: [📝 Nuevo Blog Post]
     ↓
Ves un form más simple:

┌──────────────────────────┐
│ Título:                  │
│ [Mi viaje vegano...]     │
│                          │
│ Categoría: [Salud ▼]     │
│                          │
│ Contenido:               │
│ [Editor de texto grande] │
│ ┌────────────────────┐   │
│ │ Hace 5 años...     │   │
│ │                    │   │
│ │ [Negrita][Cursiva] │   │
│ │ [Título][Lista]    │   │
│ └────────────────────┘   │
│                          │
│ Foto destacada:          │
│ [+ Subir imagen]         │
│                          │
│ [Publicar] [Borrador]    │
└──────────────────────────┘
```

## 🔄 ¿QUÉ PASA DESPUÉS DE GUARDAR?

```
TÚ: [Guardar Cambios]
 ↓
Supabase: Guarda los datos en la BD
 ↓
Mi servidor: "Hey, Supabase cambió algo"
 ↓
Script automático:
   1. Lee todos los datos de Supabase
   2. Convierte a JSON
   3. Actualiza recetas.json
   4. Hace push a GitHub
 ↓
GitHub Actions: "Detectó cambios"
 ↓
Netlify: "Redeploy automático"
 ↓
Tu web se actualiza (2-3 minutos)
 ↓
¡LISTO! Los visitantes ven los cambios
```

## 📱 Interface Responsiva

El admin funciona tanto en:
- ✅ Computadora (lo ideal)
- ✅ Tablet (edición básica)
- ✅ Teléfono (para emergencias)

---

## Resumen del Flujo

```
┌──────────┐
│ Javi     │
│ (Admin)  │
└────┬─────┘
     │ Abre: vlogdejavi.cl/admin
     │ Login con su email
     ↓
┌──────────────────────┐
│  Dashboard Admin     │
│  - Ver recetas       │
│  - Editar recetas    │
│  - Subir fotos       │
│  - Crear blog        │
└─────────┬────────────┘
          │ Click editar
          ↓
┌──────────────────────┐
│  Formulario Receta   │
│  - Cambiar título    │
│  - Cambiar categoría │
│  - Subir fotos       │
│  - Guardar cambios   │
└─────────┬────────────┘
          │ [Guardar]
          ↓
┌──────────────────────┐
│  Supabase (BD)       │
│  Guarda datos        │
└─────────┬────────────┘
          │ Webhook automático
          ↓
┌──────────────────────┐
│  Script Actualiza    │
│  recetas.json        │
└─────────┬────────────┘
          │ Push a GitHub
          ↓
┌──────────────────────┐
│  Netlify (Deploy)    │
│  Redeploy automático │
└─────────┬────────────┘
          │ 2-3 minutos
          ↓
┌──────────────────────┐
│  🎉 Web Actualizada  │
│  Visitantes ven      │
│  los cambios         │
└──────────────────────┘
```

---

## Tiempo Real

- **Subir una foto**: 5 segundos
- **Cambiar categoría**: 3 segundos
- **Editar descripción**: 2 segundos
- **Guardar cambios**: 1 segundo
- **Ver cambios en web**: 2-3 minutos (deploy automático)

---

## Seguridad

✅ Solo tú puedes entrar (login con email/password)
✅ Las fotos se suben a un lugar seguro (Supabase)
✅ No puedes borrar nada sin confirmación
✅ Se guarda un historial de cambios
✅ Puedes deshacer cambios (ver versión anterior)

---

## ¿Qué te parece? ¿Necesitas claridad en algo?
