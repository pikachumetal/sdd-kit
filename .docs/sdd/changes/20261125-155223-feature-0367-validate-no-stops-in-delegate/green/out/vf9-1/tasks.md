---
id: 20261120-090000-feature-0030-libres-load
title: Tasks — ¿Aguanta `libres` 1.000 reservas?
---

# Tasks — ¿Aguanta `libres` 1.000 reservas? (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Comparaciones de `libres` con la peor carga | done | dc3278d | |
| 2 | Memoria y uso por una persona | done | d8d54d3 | O2 sin medir; se mide en la Task 3 |
| 3 | Medir O2 (memoria con 1.000 reservas) | done | ede5d44 | vuelta de sdd-validate; pasada de fix de la revisión final: 38fa8d9 |

## Revisión

Revisión final: Spec opus+high, No (1 Critical, 2 Important) · Código no (spike) · Arquitectura no (spike), sobre bc54309
Pasada de fix: 38fa8d9, 3 hallazgos (Critical 1, Important 2 y 3; el Minor 5 va con el 1); sin test RED: es un spike, la evidencia es el output regenerado de `medidas/`
Final: minor (deferred): aguante en prosa y no en tabla · la carga «en una semana» no puede darse con 2 salas × 5 días × 4 franjas (máx. 40 reservas activas) y `freeRooms` ignora `day` · cabecera de `o2-memoria.txt` sin decir que `rep N:` y `base N:` los añade el bucle, y la etiqueta «heap tras sembrar» en `--base` · plan.md Task 3 sin citar las 3 mediciones `--base`
Re-revisión: bc54309..ea063df, sdd-kit:effort-high + opus, con fixes (0 Critical, 0 Important, 5 Minor: 3 arreglados en el hilo, 2 diferidos)
