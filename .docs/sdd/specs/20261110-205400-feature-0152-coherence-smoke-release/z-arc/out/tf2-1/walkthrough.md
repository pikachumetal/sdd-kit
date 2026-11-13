---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (88c62d7).
- `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>»: `src/app.js`, `test/cancel.test.js` (5d5f7fc).
- Capacidad nueva `capabilities/bookings.md`, mezclada desde el delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,69 h — reloj de 2 sesiones 5,02 h desde 2026-10-08T09:00Z, sin 200 min de espera al dev-lead (2 esperas)
- Desviación: -2,31h (-58%)
- Causa de la desviación (obligatoria si |desviación| > 30%): dos tasks cortas en el mismo fichero; el reloj, sin las esperas, es 1,69 h. Esperas y huecos: 09:40Z 140 min; 12:40Z 60 min
- Compactación: no
- Modelo del hilo: Sonnet 5.5, effort no registrado
- Tokens del hilo: 408.616 — claude-sonnet-5-5 408.608; claude-sonnet-5 8
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Pasa a la deuda («Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde sobre el commit de cierre, 0,1 s, salida guardada en el scratchpad de la sesión.
- Gate: `node --test` → suite única: corrió 5/5 · 0,1 s · configuración: la del gate · sobre el commit de cierre (el cierre no toca código: `HEAD` no mueve nada de `src/` ni de `test/`)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real en un mismo proceso (`run` de `src/app.js`) · revisión final Spec y Código limpias sobre 5d5f7fc; los commits posteriores solo tocan `.docs/`. No probado: `canceladas` entre dos invocaciones de la CLI (ver 4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real + suite | `cancelar Sur mar --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real (la suite no lo cubre) | `cancelar Sur mar` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real + suite | tras cancelar en el mismo proceso: `Norte lun — sala ocupada` |

Verificado por el agente todo lo anterior; nada reportado por el usuario.

### 4.3 Residuales / deuda generada

- Por la CLI (`node src/app.js …`), `canceladas` sale vacío en una invocación posterior a la de `cancelar`: las reservas viven en memoria y se pierden al acabar el proceso. Ya lo cubre la fila 0014 «Motivo guardado» del roadmap; no se abre deuda aparte.
- El THEN «sin `--motivo`» no tiene test: solo lo cubre la ejecución real de arriba.
- El test de `canceladas` depende del orden de los tests (ruling de la Task 2): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Cambio de comportamiento observable (motivo de cancelación y su listado) → `capabilities/bookings.md`, vía `sdd capability merge`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
