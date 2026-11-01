---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261101-220737-patch-0286-sync-additive-conflicts
task: 0286
mode:
date: 2026-11-01
---

# Ticket para el kit — patch 0286: un conflicto que solo suma no para, y `--sync` va en una llamada propia

- Contexto: patch de petición cerrada con un fallo dentro, Opus 5.5, sin subagentes; 10 sujetos sonnet (4,42 $)
- Coste: dentro de las 2 h estimadas (`patch.md` §5 y `sdd session tokens`)
- Iniciativa propia: `sdd-implement` y `sdd-archive` siguen sin decir qué hacer con un recorte de palabras que cae con la campaña ya lanzada; lo apliqué también a la copia del kit y lo anoté en `patch.md` §4

## Menores

- El molde `reservas` distrae antes del paso 6: `m3-2` del RED paró por el THEN de `canceladas`, que falla por CLI real, y no llegó al conflicto (`tests/batteries/sdd-archive/subject.mjs`, `done0010`). Un sujeto de RED sin lectura, ~0,28 $.
- El caso de la 0276 era `commitResolution`: un hook en rojo sobre una resolución completa salía como `base: conflicto en`. El aviso del ticket de la 0276 sí bastaba para encontrarlo; arreglado aquí.
- El criterio de la 0163 §3, un test `.ts` que une dos listas, sigue parando: el alcance acota a Markdown. Ese caso no está cubierto.
- `capabilities/` deja de estar excluida del predicado. Ningún escenario lo mide con un conflicto en una capacidad: se valida en uso.
- Dos filas contiguas de una tabla (0277 §4) no tienen sujeto propio; `m3` mide dos adiciones en una línea.
- Una edición por script de una fila con `\n` dejó saltos de línea reales en un test y en una celda de la batería; lo detectaron el parser y `comprobación mal escrita`. Corregido con `Edit`.
