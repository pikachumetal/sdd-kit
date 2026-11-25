---
id: 20261120-090000-feature-0030-libres-load
title: Tasks — ¿Aguanta `libres` 1.000 reservas?
---

# Tasks — ¿Aguanta `libres` 1.000 reservas? (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Comparaciones de `libres` con la peor carga | done | 85f12a7 | |
| 2 | Memoria y uso por una persona | done | 97c7183 | |
| 3 | Medir O2 (vuelta de sdd-validate: la fila estaba `no medido` y se podía medir) | done | 8a5a3a3 | |
| 4 | Medir sobre `libres` real (hallazgos de la revisión final: el script reimplementaba el recuento y O2 medía heap) | done | 771f94d | |

Revisión final: Spec opus+high, No (3 Critical, 4 Important, 2 Minor) · Código no (spike) · Arquitectura no (spike), sobre 21d24c4
Pasada de fix: 771f94d, 9 hallazgos (3 Critical y 4 Important corregidos en research y medidas; Minor 8 status draft y 9 carga: la carga nueva usa 2 salas, status se deja)
Re-revisión: 21d24c4..231c1c0, sdd-kit:effort-high + opus, con correcciones (1 Important nueva, I1, corregida en el hilo)
sin revisar: el commit que corrige I1 (recomendación de research.md §4-5, solo documentación)
Validación en campo: 2026-11-25 · filas de research.md cotejadas con su evidencia (O1: 2000 evaluaciones ×10, ejecución real sobre libres real; O2: RSS 55,7 MB con 1.000 y 55,6 con 1, ejecución real; O3 no probado: sin persona); eje Spec revisado y re-revisado, 1 sin revisar (recomendación §4-5, solo documentación)
