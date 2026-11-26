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

- Spike de medición: no toca `src/` ni `test/`. Mide una copia literal de `freeRooms` de `src/app.js` (la app no deja sembrar reservas) con `medidas/medir-libres.mjs` → `medidas/o1-libres.txt` (856db4f).
- `research.md` con las filas O1-O3, el aguante, la recomendación y lo que sale (4af753d).
- Resultado: O1 **no cumple tal como se definió** (2000 comparaciones en cada una de las 10 repeticiones, el umbral era < 1000); O2 **no medido**; O3 **no medido con una persona**. Recomendación: no seguir con las reservas en memoria, apoyada solo en O1.
- Sin ADR candidata ni capacidades: la spec declara «Ninguna, porque investigación».

## 3. Desviaciones del plan

- La Task 2 prometía `medidas/o2-memoria.txt` (`node medidas/medir-libres.mjs --memoria`) y una persona en la recepción para O3. No se corrió `--memoria` y la persona no llegó a probar: O2 y O3 quedan sin medir, y `research.md` lo dice así. El 4 s de O3 lo simuló el agente y no cuenta como medido con una persona.

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Sin código de la app tocado: no hay build ni suite que correr para este spike. Lo único que corrió es `medir-libres.mjs`, con la salida en `medidas/o1-libres.txt`.

### 4.2 Smoke / tests

Validación en campo: 2026-11-22 · O1 medido en `medidas/o1-libres.txt`; O2 y O3 sin medir, como dice `research.md`. Revisión final de Spec (opus+high) y Código (sonnet+high), limpias.

| Objetivo | Evidencia | Resultado |
| --- | --- | --- |
| O1 — < 1.000 comparaciones con 1.000 reservas | verificado por el agente: ejecución real, 10 repeticiones (`medidas/o1-libres.txt`) | no cumple tal como se definió: 2000 en todas |
| O2 — memoria < 50 MB | no probado | no medido |
| O3 — recepcionista < 10 s | no probado con una persona (4 s simulado por el agente) | no medido con una persona |

### 4.3 Residuales / deuda generada

- Índice de reservas por sala en `libres` → fila 0031.
- Caché de `libres` por día → fila 0032.
- Medir O2 y O3 sigue abierto: la decisión de la 0014 (memoria o fichero) descansa solo en O1.

## 5. Aprendizajes

- Con 1.000 reservas, `freeRooms` hace 2.000 comparaciones por consulta (2 por reserva) → `research.md` §3 y §4; sin destino en docs vivos, porque aún no hay decisión de estructura (la toma la 0014).

Retro: sin señales

## 6. Adendas

_Ninguna_
