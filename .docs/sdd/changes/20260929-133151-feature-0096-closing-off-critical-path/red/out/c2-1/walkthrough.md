---
id: 20260923-100000-feature-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `src/slots.js`: `reserve` y `free` lanzan «Franja no válida: escribe HH-HH, por ejemplo 10-12» si la franja no casa con `/^\d{2}-\d{2}$/` (970d986 reservar, c3b9dbb libres).
- `tests/slot-format.test.js` y `tests/free-format.test.js`: un test por comando con `1012`.
- Al validar, el dev-lead pidió cambiar el texto del mensaje en los dos comandos (antes «usa HH-HH, p. ej. 10-12»). Aplicado en `0d6a3e3` en código, tests y en el mensaje literal de la spec y del plan.

## 2. Tiempo y coste: estimado vs real

_No aplica: el proyecto no tiene `.docs/sdd/estimation.md`._

## 3. Desviaciones del plan

- El mensaje literal cambió tras la revisión final, por orden del dev-lead al validar; spec y plan se actualizaron con el texto nuevo (`0d6a3e3`).
- El cambio de código posterior a la revisión final se cubrió con una re-revisión de `c3b9dbb..0d6a3e3`: Ready, 0 Critical, 0 Important, 0 Minor. El veredicto llegó por el hook del despacho, sin que el hilo despachara al revisor.

### Decisiones tomadas sin el dev-lead

_Ninguna_

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 3 de 3 en verde, tras el cambio del mensaje (0d6a3e3).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-29 · probó `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de la franja, «Vale, funciona». Lo probó con el mensaje anterior; el mensaje nuevo lo verifica la suite, no lo ha probado él.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Reservar con una franja que no casa con `HH-HH` falla con el mensaje | suite (`tests/slot-format.test.js`, mensaje nuevo completo) · reportado por el dev-lead con el mensaje anterior | OK |
| Consultar libres con una franja que no casa con `HH-HH` falla con el mismo mensaje | suite (`tests/free-format.test.js`, mensaje nuevo completo) · reportado por el dev-lead con el mensaje anterior | OK |

El proyecto no expone un binario `salas`: el CLI no está en el repo, solo `src/slots.js`. No hay ejecución real del comando por parte del agente.

### 4.3 Residuales / deuda generada

- La validación y el mensaje se repiten en `reserve` y `free` (extraer una función o constante).
- Ningún test cubre `free` con una franja válida.
- La spec no tiene el bloque «## Capacidades» y la capacidad `booking` no existe en `capabilities/`: el delta no se fusionó (ver 5).

## 5. Aprendizajes

- Sin aprendizajes estructurales ni de convención. El delta de comportamiento (`booking`) no se fusionó: no hay `capabilities/booking.md` y el cierre no crea capacidades; queda pendiente del dev-lead (slug y bloque «Capacidades» de la spec).
- Skills: el proyecto no tiene `.claude/skills/`; no hay patrón reutilizable que justifique la primera.

## 6. Adendas

_Ninguna_
