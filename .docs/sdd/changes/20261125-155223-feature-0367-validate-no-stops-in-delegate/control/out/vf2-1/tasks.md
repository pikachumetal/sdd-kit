---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 5ab0039 | |
| 2 | Listado de canceladas | done | e3a1974 | |
| 3 | Cancelar libera la sala en `libres` (fallo del script, paso 3, validación) | done | b3c77c1 | |



Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre e194856
Pasada de fix: fa4d5b9, 2 hallazgos RED→GREEN (test sin --motivo: rojo al mutar el código; test de «sin reserva»: cobertura recuperada)
Re-revisión: e194856..fa4d5b9, sdd-kit:effort-high + opus, aprobada

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Task 3: Ruling: el test de `libres` tras cancelar reutiliza la cancelación del primer test, como el de `canceladas` — mismo workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Task 3: Ruling: el commit 8848f97 (`libres` con `!== 'voided'`) se salió del plan y rompía la liberación de la sala al cancelar; lo corrige esta task, aprobada por el dev-lead tras el fallo del paso 3 — coste si es erróneo: `libres` vuelve a contar lo cancelado como ocupado
- Final: Ruling: tests de `canceladas` y de `libres` tras cancelar dependen del orden (Importante del eje Código, Minor del Spec) — ya ruleado en Task 2 y 3; quitarlo exige exportar un reinicio de estado, fuera del plan — coste si es erróneo: fallan si se corren solos o reordenados
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía (el spec calla; cambiar la salida es decisión del dev-lead)
- Final: minor (deferred): `src/app.js` pasó a LF en 8848f97 mientras el resto del repo es CRLF, sin `.gitattributes`
- Final: minor (deferred): `reasonOf` toma posicionales mal si `--motivo` va antes de sala y día
- Final: minor (deferred): la decisión 3 del spec dice MODIFIED y los requisitos están como ADDED
