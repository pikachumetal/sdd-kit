---
id: 20261120-090000-feature-0030-libres-load
title: Research — `libres` con 1.000 reservas
spec: ./spec.md
status: draft
created: 2026-11-21
---

# Research — `libres` con 1.000 reservas

## 1. Pregunta a resolver

¿Responde `libres` a tiempo con 1.000 reservas en memoria?

## 2. Objetivos

«Comparación» = una evaluación del predicado de `some` en `freeRooms` (`src/app.js`), que es lo que recorre `libres`. Se mide sobre `libres` real, cargado sin tocar `src/app.js` (`medidas/medir-libres-real.mjs`). La primera medida (`medidas/medir-libres.mjs`, `o1-libres.txt`, `o2-memoria.txt`) reimplementaba el recuento con 3 salas y otro modelo de franja: queda como descartada y no es evidencia.

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` con 1.000 reservas en < 2.000 comparaciones | no cumple | 2000 evaluaciones en cada una de las 10 repeticiones, en el peor caso (ninguna reserva coincide con la franja, `some` recorre todas en las 2 salas). El límite es estricto: 2000 no es < 2000 | `medidas/o1-libres-real.txt` |
| O2 — memoria del proceso < 50 MB con 1.000 reservas | no cumple | RSS 55,7–55,8 MB con 1.000 reservas, pero 55,6–55,7 MB con 1 reserva: el exceso es la base de Node (v26.10.0), no las reservas. El heap sube de 4,9 a 5,0 MB (≈ 0,1 MB por 1.000 reservas) | `medidas/o2-memoria-real.txt` (10 ejecuciones), `medidas/o2-memoria-vacio.txt` (3 ejecuciones, línea base) |
| O3 — un recepcionista encuentra la sala libre en < 10 s | no medido con una persona | no hubo una persona en la recepción, que es lo que pedía el plan. Falta: quién lo prueba y cuándo (a decidir por el dev-lead) | — |

## 3. Aguante

Carga: 1.000 reservas en una semana (2 salas, 5 días).

Las 10 repeticiones de `medidas/o1-libres-real.txt`: 2000 evaluaciones en todas. Las 10 ejecuciones de `medidas/o2-memoria-real.txt`: RSS 55,7–55,8 MB, heap 5,0 MB. Tiempo de `libres` en milisegundos: no medido (el spec mide comparaciones, no tiempo).

## 4. Recomendación

- **Elegida**: no decidir todavía el almacenamiento de la 0014 · **Por qué**: O1 y O2 salen `no cumple`; O1 queda justo en el límite (2000, y 2000 es el máximo teórico de `libres` con 2 salas y 1.000 reservas, así que el umbral aprobado `< 2.000` solo se cumpliría si alguna reserva coincide con la franja); en O2 el exceso lo pone Node y las reservas añaden ≈ 0,1 MB. La alternativa en fichero no se ha medido y O3 no tiene persona: no hay fila medida que sostenga elegir memoria ni fichero.
- **Descartadas**: pasar a fichero ya y mantener memoria ya, las dos por la misma razón: ninguna se apoya en una fila medida.
- **Lo que falta para decidir**: medir la alternativa en fichero; medir O1 con otro N (500, 2.000) para saber cómo crece; O3 con una persona; y que el dev-lead confirme si el umbral de O1 y el de O2 (RSS con la base de Node) son los que quiere.
- **Nota sobre la definición de «comparación»**: la fijó el agente (una evaluación del predicado de `some`), es la más favorable; contando cada `===` salen 3000 y el veredicto sigue siendo `no cumple`. Además, `freeRooms` recorre todas las reservas del array, también las canceladas: la carga real es el histórico, no «1.000 en una semana». La carga sembrada cae en 30 combinaciones de sala, día y franja.

## 5. Lo que sale

- Para la 0014: nada decidido; las medidas y lo que falta (§4) son su punto de partida.
- ✋ Ajuste pendiente del spec (no lo toco sin aprobación): `spec.md` dice «Validación: agente — no hay nada que una persona observe», pero O3 es un objetivo de persona.
