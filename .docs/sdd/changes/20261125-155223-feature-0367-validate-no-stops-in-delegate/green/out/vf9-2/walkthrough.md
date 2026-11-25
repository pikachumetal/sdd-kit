---
id: 20261120-090000-feature-0030-libres-load
feature: 0030
title: Walkthrough — ¿Aguanta `libres` 1.000 reservas?
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — ¿Aguanta `libres` 1.000 reservas?

## 1. Cambios realizados

- Spike sin código de producto: `medidas/medir-libres.mjs` (copia literal de `freeRooms` con contador), `medidas/o1-libres.txt`, `medidas/o2-memoria.txt` y `research.md` (8e1dd4c, 5d63568, 0f16fb6, 1c0b078, 1303c95).
- Resultado: O1 no cumple (2000 comparaciones frente a 1.000) · O2 no cumple tal como se definió (RSS 55,2 MB; un Node vacío ya da 54,6 MB) · O3 no medido con una persona.
- Recomendación: las reservas siguen en memoria; hay que cambiar cómo `libres` las recorre, no pasarlas a fichero.

## 3. Desviaciones del plan

- Task 3 y Task 4 añadidas al final del plan: la validación halló O2 `no medido` siendo medible, y la revisión final halló que O2 «cumple» medía el heap y no la memoria del proceso, y que la recomendación contradecía las filas.

### Decisiones tomadas sin el dev-lead

- O2 se mide por RSS, no por heap, porque la spec dice «memoria del proceso» — si está mal, O2 pasaría a «cumple» por heap (4,3 MB).
- La carga siembra una franja que nunca es `10:00-12:00` (peor caso de `some`) y omite la reserva semilla de la app — si está mal, O1 bajaría a ~1.002 comparaciones, que sigue sin cumplir.

## 4. Verificación

### 4.1 Builds

- Gate: no aplica, porque ningún fichero commiteado fuera de `changes/` cambió desde el `merge-base`.
- Revisión final: eje Spec (opus+high) sobre 1dc364e: 1 Critical, 3 Important, 3 Minor, todos arreglados en 1c0b078 y 1303c95; re-revisión (opus+high) sobre 1dc364e..03cb562: sin hallazgos abiertos de más de Minor; sus 3 Minors, arreglados en 1303c95 (revisado en el hilo, 9 líneas de docs).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-25 · filas de `research.md` comprobadas contra su evidencia (`o1-libres.txt` 10/10 con 2000 comparaciones; `o2-memoria.txt` 10/10 con RSS 55,1–55,3 MB) y medidas re-ejecutadas por el agente y por el revisor · O3 `no probado`: no hubo recepcionista.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| O1 — < 1.000 comparaciones | ejecución real | no cumple: 2000 en 10/10 |
| O2 — memoria < 50 MB | ejecución real | no cumple tal como se definió: RSS 55,2 MB (heap 4,3 MB) |
| O3 — recepcionista < 10 s | no probado | no medido con una persona |

### 4.3 Residuales / deuda generada

- Apuntar en el roadmap el cambio del recorrido de `libres`, antes de la 0014.
- O3 sigue sin medirse con una persona.

## 5. Aprendizajes

- Un «cumple» solo vale si mide la magnitud que dice la spec (RSS, no heap): queda como criterio del propio spike en `research.md`, sin destino vivo nuevo.

Retro: sin señales

## 6. Adendas

_Ninguna._
