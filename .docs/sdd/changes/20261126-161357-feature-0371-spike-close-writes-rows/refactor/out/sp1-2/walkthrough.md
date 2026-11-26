---
id: 20261120-090000-feature-0030-libres-load
feature: 0030
title: Walkthrough — ¿Aguanta `libres` 1.000 reservas?
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-26
---

# Walkthrough — ¿Aguanta `libres` 1.000 reservas?

## 1. Cambios realizados

- Spike sin cambios en `src/` ni capacidades: deja `research.md` con la recomendación y `medidas/` con lo medido.
- Task 1 (fabf555): `medidas/medir-libres.mjs` y `medidas/o1-libres.txt` — comparaciones de una copia literal de `freeRooms` con 1.000 reservas en una semana (la peor carga que confirmó Laura).
- Task 2 (6ac6b2d): `research.md` con O2 y O3 tal como quedaron.
- Salidas del spike (`research.md` §5): índice de reservas por sala en `libres` → fila 0031; caché de `libres` por día → fila 0032.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- La Task 2 pedía `medidas/o2-memoria.txt` (`node medidas/medir-libres.mjs --memoria`) y no existe: O2 quedó sin medir. La fila de `research.md` lo dice como `no medido`.
- O3 no se midió con una persona en la recepción: el agente simuló 4 s, y eso no es una medida (la spec ya prevé `no medido con una persona` como resultado).

### Decisiones tomadas sin el dev-lead

- _Ninguna_ (`sdd ledger rulings` → «Sin rulings»).

## 4. Verificación

### 4.1 Builds

- Spike: no toca código de `src/` ni de `test/`; no hay gate que correr.

### 4.2 Smoke / tests

Validación en campo: 2026-11-22 · O1 medido en `medidas/o1-libres.txt`; O2 y O3 sin medir, como dice `research.md`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| O1 — `libres` con 1.000 reservas en < 1.000 comparaciones | ejecución real (`medidas/o1-libres.txt`, 10 repeticiones) | no cumple tal como se definió: 2000 comparaciones en todas |
| O2 — memoria < 50 MB con 1.000 reservas | no probado | no medido: no se corrió `--memoria` |
| O3 — un recepcionista encuentra la sala libre en < 10 s | no probado | no medido con una persona (el agente simuló 4 s) |

### 4.3 Residuales / deuda generada

- Las dos mejoras que salen del spike pasan a las filas 0031 y 0032 del roadmap.
- O2 y O3 siguen sin medir; la recomendación de `research.md` descansa solo en O1.

## 5. Aprendizajes

- Ninguno para los docs vivos: el resultado del spike (2.000 comparaciones con 1.000 reservas) vive en `research.md` y no cambia convenciones, estructura ni comportamiento.

Retro: sin señales

## 6. Adendas

_Ninguna._
