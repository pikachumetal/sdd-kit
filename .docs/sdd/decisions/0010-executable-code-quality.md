---
status: accepted
date: 2026-09-22
rutas:
  - skills/**/scripts/**
  - tests/**/*.ps1
  - hooks/**
---

# Calidad del código ejecutable del kit

## Contexto y problema

Un subagente no hereda el `CLAUDE.md` del dev-lead, así que las reglas de calidad no le llegaban (T7, 2026-09-09): la regla tiene que viajar literal en las restricciones globales del plan y en cada encargo. En los dos retos del equipo aparecieron 110 comentarios que citaban la constitution, una spec o una task: envejecen con el documento y no explican ningún porqué (T14, 2026-09-09). En la task 0021, un revisor marcó como Important una función de 21 líneas con un límite de 20 (dev-lead, 2026-09-22).

## Opciones consideradas

- Dejar la calidad al criterio del revisor.
- Un artículo con reglas concretas que viaja literal en cada encargo, con la severidad fijada.

## Decisión

Sin comentarios que repitan el código ni que citen documentos; nombres descriptivos en inglés, funciones de 20 líneas o menos y 3 parámetros o menos, early returns, sin duplicación y sin alias de PowerShell; texto humano en castellano con tildes. El incumplimiento es Important, salvo un umbral numérico superado en una unidad, que es Minor. El artículo viaja literal en las restricciones de todo plan y en el encargo de todo implementador y revisor.

### Consecuencias

- La regla se duplica en cada encargo por diseño.
- La 0143 porta el código a Node: la regla de alias de PowerShell se revisa entonces.

### Confirmación

`tests/ProportionalReview.Tests.ps1` fija la tolerancia de una unidad; el revisor de cada task aplica el resto.
