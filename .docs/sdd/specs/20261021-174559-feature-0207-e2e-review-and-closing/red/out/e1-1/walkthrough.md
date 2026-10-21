---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-21
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` (4dbb56c).
- `canceladas` lista las reservas canceladas con su motivo («Norte lun — sala ocupada»). `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs` (e6bff57).
- Capacidad `bookings` creada desde el delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

> `.docs/sdd/estimation.md` no existe: el proyecto no lleva estimación, no hay fila en un estimation-log.

- Tipo: backend
- Esfuerzo real: 0,04 h — reloj de la sesión 0,04 h desde 2026-10-21T17:55Z, sin 0 min de espera al dev-lead (0 esperas)
- Modelo del hilo: Sonnet 5.5 (ejecución y cierre); effort no registrado
- Tokens del hilo: 504.588 — claude-sonnet-5-5 504.588
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no (dos señales: MODIFIED, datos — decisión 3 de la spec)

## 3. Desviaciones del plan

- _Ninguna_ respecto a las tasks. `tasks.md` anotaba el commit e6bff57 para la Task 1; el real es 4dbb56c y está corregido.

### Decisiones tomadas sin el dev-lead

- Gate de la ejecución con `node --test --test-concurrency=1` (Task 2) — esquiva la carrera de los tests sobre el almacén compartido en memoria; es un workaround hasta aislar el almacén por test — si es erróneo, la suite tarda el doble. No está escrito en `operations.md` (allí el gate sigue siendo `node --test test/`); la causa está en la deuda.

## 4. Verificación

### 4.1 Builds

- Build: no aplica.
- Suite completa (gate de cierre de `operations.md`): `node --test test/ && node e2e/run.mjs` → unit 5/5 · e2e 7/7 · unit ~0,2 s + e2e 48,2 s, sobre el código de e6bff57 (lo posterior solo toca documentación).
- El e2e (48 s) pasa del presupuesto declarado de 0,5 min; ya lo dice `operations.md` («~50 s»). No lo ha causado esta feature (+2 pasos de 6 s por test).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-21 · agente: suite 5/5 unit + 7/7 e2e · smoke 4/4 THEN con ejecución real contra el servidor (`env-up`, sesión propia) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre e6bff57; lo posterior solo toca documentación. Nadie ha probado a mano; no hay frase del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | verificado por el agente |
| motivo fuera de la lista (`"me aburro"`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | verificado por el agente |
| sin `--motivo` → el mismo «motivo no válido: …» | ejecución real; **ningún test lo cubre** | verificado por el agente (solo smoke) |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real + suite | verificado por el agente |

### 4.3 Residuales / deuda generada

- Falta un test automático de «cancelar sin `--motivo`»: hoy solo lo cubre el smoke de este cierre. Fila en la deuda.
- Los tests comparten el almacén en memoria y `canceladas` depende de que antes se haya cancelado Norte lun: causa del workaround de `--test-concurrency=1`. Fila en la deuda.

## 5. Aprendizajes

- Cancelar exige motivo de una lista cerrada: comportamiento observable → `capabilities/bookings.md` (creada, `sdd capability merge`).
- Los tests unitarios dependen del orden y del estado compartido → deuda técnica del roadmap (no hay `constitution.md` que lo recoja como convención).
- El proyecto no tiene `architecture.md` ni `.claude/skills/`: no hay aprendizaje estructural. Revisión de skills: miré `.claude/skills/`, no existe; el trabajo no revela un patrón reutilizable. No aplica.

## 6. Adendas

- (ninguna)
