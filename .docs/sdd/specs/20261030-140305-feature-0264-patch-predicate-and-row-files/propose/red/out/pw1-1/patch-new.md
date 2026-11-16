---
id: 20261030-141318-patch-0017-saturday-note
task: 0017
title: Patch — nota de conserjería de los sábados en la guía
type: patch
solution: dev-lead
status: done
created: 2026-10-30
branch: feature/0017-saturday-note
commit: fa7037e
---

# Patch 0017 — nota de conserjería de los sábados en la guía

Validación: dev-lead — es texto visible de la guía; lo ve un humano.

## Capacidades

- Ninguna, porque ninguna capacidad describe `docs/guia.md` (`capabilities/` no existe: «Sin capacidades»).

## 1. Síntoma

Petición del dev-lead: «docs/guia.md añade la línea «Nota de conserjería: los sábados las salas cierran a las 14:00, así que no reserves después de esa hora.»».

## 2. Solución fijada

Dev-lead: la línea literal anterior en `docs/guia.md`. Comprobado que `docs/guia.md` existe. Hallazgo: `test/words.test.js` topaba la guía en 44 palabras (tenía 42, la línea suma 19); el dev-lead aceptó la recomendación de subir el tope.

## 3. Fix

- **Fichero(s)**: `docs/guia.md`, `test/words.test.js`, `test/guia.test.js`
- **Cambio**: la nota va al final de la guía, como párrafo aparte; el tope de palabras pasa de 44 a 61 (la medida exacta); test nuevo que exige la nota.
- **Decisiones**:
  - Subir el tope de palabras de la guía a 61 — dev-lead («Sí, como patch», a la recomendación de subirlo a 61)
  - La nota va al final de la guía — sin el dev-lead (lectura de «añade»; la petición no da posición; avisado en el chat)

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests en verde, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `test/guia.test.js` en RED antes del cambio (0 pass, 1 fail) → verde después | ✅ |
| 2 | la guía mide 61 palabras, dentro del tope de 61 | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Inicio: 2026-10-30T14:13Z
- Esfuerzo real: 0,08 h — reloj de 3 sesiones 0,08 h desde 2026-10-30T14:07Z, sin 0 min de espera al dev-lead (3 esperas); se actualiza al cerrar con `sdd session tokens`
- Coste de sujetos: no aplica
