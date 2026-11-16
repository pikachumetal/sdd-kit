---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Task 1, `c56253b`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva; sin motivo o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js`.
- Task 2, `acbb1b4`: comando `canceladas`, que lista «<sala> <día> — <motivo>». `src/app.js`, `test/cancel.test.js`.
- Cierre: test «cancelar sin motivo» (escenario de la spec sin test) y el commit de la Task 1 corregido en `tasks.md`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. El gate del plan sigue siendo `node --test`.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` — para esquivar una carrera entre tests sobre el almacén en memoria — coste si está mal: la suite tarda el doble. **Constatado en el cierre que la causa no se sostiene**: cada fichero corre en su proceso y la suite pasa 6/6 igual con y sin la opción; lo real es una dependencia de orden dentro de `cancel.test.js`. No se aplicó en ningún sitio (`package.json` no tiene scripts): el gate es `node --test`.

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 en verde, sobre el commit de cierre.
- Gate: `node --test` → corrió 6/6 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 6/6 · smoke de 5 THEN: 3 con ejecución real por la CLI (`node src/app.js`), el listado solo en un mismo proceso o por suite · revisión final Spec y Código limpia sobre `acbb1b4`, re-revisión del commit de registro con 3 hallazgos (2 corregidos, 1 constatado)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo xyz` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar | suite · ejecución real solo en un mismo proceso (`run` importado) | `Norte lun — sala ocupada`; **por la CLI, en un proceso aparte, `canceladas` sale vacío**: el almacén es solo memoria y no hay persistencia |
| el listado de canceladas enseña el motivo | suite | `canceladas enseña sala, día y motivo` en verde |

Lo no probado: el listado de canceladas de punta a punta por la CLI, que hoy no puede funcionar sin persistir las reservas.

### 4.3 Residuales / deuda generada

- Las reservas viven solo en memoria: `canceladas` por la CLI no ve lo cancelado por otra invocación → «Por triar» de `debt.md`.
- `test/cancel.test.js`: `canceladas` depende de que `cancelar` haya corrido antes → «Por triar» de `debt.md`.
- «Los motivos no se traducen»: queda la traducción al inglés, solo el castellano se salda.

## 5. Aprendizajes

- Los dos requisitos nuevos son comportamiento observable → `capabilities/bookings.md`, fusionado con `sdd capability merge`.
- Una causa alegada en un ruling se comprueba antes de registrarla como decisión → `debt.md` (orden de tests) y esta sección.

Retro: documento o skill desmentido → corregido en el mismo documento (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`: el ruling de la carrera y el commit de la Task 1)
Retro: error que cazaría un chequeo → un test por caso con estado aislado (`.docs/sdd/steering/debt.md`, fila «`test/cancel.test.js`: … dependencia de orden»)

## 6. Adendas

- (ninguna)
