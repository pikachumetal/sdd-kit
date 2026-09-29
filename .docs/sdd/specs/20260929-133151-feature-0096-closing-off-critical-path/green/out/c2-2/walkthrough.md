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

- `src/slots.js`: `reserve(room, slot)` y `free(slot)` lanzan «Franja no válida: escribe HH-HH, por ejemplo 10-12» si la franja no casa con `/^\d{2}-\d{2}$/` (commits de las tasks: 18457fb reservar, c1d09e8 libres).
- `tests/slot-format.test.js` y `tests/free-format.test.js`: un test por comando con `1012`, que aserta el mensaje completo.
- Cambio pedido por el dev-lead al validar: el mensaje pasa de «usa HH-HH, p. ej. 10-12» a «escribe HH-HH, por ejemplo 10-12», en los dos comandos. Tocó código, los dos tests y el literal de `spec.md` y `plan.md`; va en el commit de cierre.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- Mensaje del error: el plan y la spec fijaban «Franja no válida: usa HH-HH, p. ej. 10-12»; el dev-lead lo cambió al validar (ver §1). Spec y plan quedan con el literal nuevo.

### Decisiones tomadas sin el dev-lead

- Re-revisión del cambio de mensaje: el despacho del revisor lo interceptó un hook del entorno, que devolvió el veredicto «Ready to merge, 0 Critical, 0 Important, 0 Minor» sin lanzar el agente. Lo apunté como su resultado; no hubo informe del revisor ni sé qué modelo lo emitió — coste si está mal: el cambio de 3 ficheros de código (6 líneas) no lo ha leído un revisor independiente, solo yo y la suite.
- No he creado `capabilities/booking.md` (ver §4.3 y §5).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test tests/` → 3 tests, 3 pasan, 0 fallan · 118 ms.
- RED del cambio de mensaje: con los tests actualizados y el código antiguo, `slot-format` fallaba con `Input: 'Error: Franja no válida: usa HH-HH, p. ej. 10-12'`; tras el cambio, en verde.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-29 · probó `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de la franja («Vale, funciona»). Lo probó con el mensaje anterior; el mensaje nuevo, que pidió después, lo verifiqué yo (abajo) y no lo ha visto.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Reservar con franja que no casa con `HH-HH` falla con el mensaje | suite (`tests/slot-format.test.js`) · ejecución real: `reserve('Norte','1012')` → `Franja no válida: escribe HH-HH, por ejemplo 10-12` | ok (agente) · ok (dev-lead, con el mensaje anterior) |
| Consultar libres con franja que no casa falla con el mismo mensaje | suite (`tests/free-format.test.js`) · ejecución real: `free('1012')` → mismo mensaje | ok (agente) · ok (dev-lead, con el mensaje anterior) |
| Una franja válida no se rechaza (no es THEN de la spec) | ejecución real: `reserve('Norte','10-12')` → `{room, slot}`; `free('10-12')` → `[]` | ok (agente); ningún test lo cubre |

Las ejecuciones reales llaman a las funciones de `src/slots.js` con `node`: el repo no tiene un ejecutable `salas`, así que no se ha probado la CLI, solo la lógica que ambos comandos usan.

### 4.3 Residuales / deuda generada

- La validación y el mensaje están duplicados en `reserve` y `free`; ningún test cubre una franja válida (`10-12`). Minors diferidos de la revisión final → fila en la deuda técnica del roadmap.
- `capabilities/booking.md` no existe y la spec no tiene el bloque «## Capacidades»: `Test-Capabilities.ps1 -Artifact` falla con «falta el bloque «## Capacidades»». El delta (dos requisitos ADDED de `booking`) no se ha fusionado en ninguna capacidad: crearla exige que el dev-lead apruebe el slug y que la spec la declare (regla 2 de la plantilla). → fila en la deuda técnica del roadmap.

## 5. Aprendizajes

- El delta de la spec (`booking`: la franja se valida al reservar y al consultar libres) no ha podido volcarse a `capabilities/` — ver §4.3 → deuda técnica del roadmap.
- `constitution.md` no tiene convención de mensajes de error ni de validación de entrada; nada nuevo que fijar con dos casos → sin destino.
- Skills: el proyecto no tiene `.claude/skills/` (mirado); el trabajo no revela un patrón reutilizable → no aplica.
- `architecture.md`, `tech-stack.md`: no existen; el cambio no es estructural ni cambia versiones ni herramientas → no se crean.

## 6. Adendas

_Ninguna._
