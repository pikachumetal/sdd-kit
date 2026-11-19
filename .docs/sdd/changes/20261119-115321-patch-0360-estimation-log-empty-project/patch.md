---
id: 20261119-115321-patch-0360-estimation-log-empty-project
task: 0360
title: Patch — sdd estimation log sin changes/ ni specs/ escribe el log con su cabecera y cero filas
type: patch
solution: causa raíz
status: done
created: 2026-11-19
branch: patch/0360-estimation-log-empty-project
commit: <hash>
---

# Patch 0360 — sdd estimation log sin changes/ ni specs/ escribe el log con su cabecera y cero filas

Validación: dev-lead — `validation.mode: field` en `sdd-kit.json`: la valida el paso 5 de `sdd-init` en el próximo proyecto recién iniciado.

## Capacidades

- Modificadas: `estimation` — sin `changes/` ni `specs/`, el log sale con su cabecera y cero filas en vez de fallar

## 1. Síntoma

Fila 0360 del roadmap y [ticket de la feature 0347](../../field-reports/20261119-113925-feature-0347-template-instance-init-first.md) §1: en un proyecto recién iniciado, sin `changes/` (el paso 4 de `sdd-init` no la crea), `sdd estimation log --root <raíz>` sale con 1, así que el paso 5 de `sdd-init` no se puede cumplir.

Reproducido en la base de hoy con un proyecto que solo tiene `.docs/sdd/steering/estimation.md`:

```text
No se encuentra changes/ ni specs/ bajo .docs/sdd ni docs/sdd en '…\scratchpad\repro'.
exit=1
```

## 2. Causa raíz

`resolveDocsPath` (`cli/src/estimation/log.ts:32`) elige la carpeta de docs como la primera de `.docs/sdd` y `docs/sdd` que tiene `changes/` o `specs/` (`changeFolders(path).length > 0`), y si ninguna la tiene lanza el error. La existencia de una carpeta de cambios es la condición para encontrar la carpeta de docs, no para generar filas: con la misma raíz y una `changes/` vacía, el verbo sale con 0 y escribe `.docs/sdd/steering/estimation-log.md` con la cabecera, la tabla sin filas y «Sin datos: ninguna tarea tiene timing.json.» (comprobado en la misma sesión). El resto del pipeline (`readRows`, `calibrationSection`, `phaseSection`) ya trata cero carpetas como cero filas.

## 3. Fix

- **Fichero(s)**: `cli/src/estimation/log.ts` (y su copia construida en `dist/`), `cli/test/cli.test.ts`, `cli/test/estimation/layout.test.ts` (su test «sin changes ni specs dice qué carpetas buscó» codificaba el `AND` que el delta retira: pasa a probar el que queda, sin `.docs/sdd/` ni `docs/sdd/`)
- **Cambio**: sin `changes/` ni `specs/` en ninguna de las dos, `resolveDocsPath` toma la primera de `.docs/sdd` y `docs/sdd` que existe; solo falla, con el mismo mensaje, si no existe ninguna.
- **Decisiones**:
  - Sin `changes/` ni `specs/`, el verbo escribe el log con su cabecera y cero filas y sale con 0 — ticket
  - Sin `.docs/sdd/` ni `docs/sdd/`, sigue fallando con el mensaje de hoy — sin el dev-lead (no cambia nada de lo que se ve: es la salida actual)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | reproducir el síntoma → ahora OK | ✅ RED: `npx vitest run test/cli.test.ts -t 'without changes'` desde `cli/` → `AssertionError: expected 1 to be +0`; GREEN tras el fix: 1/1. A mano, con `dist/` reconstruido: `sdd estimation log --root <repro>` → «Generado …\repro\.docs\sdd\steering\estimation-log.md con 0 filas.», exit 0 |
| 2 | sin `.docs/sdd/` ni `docs/sdd/` sigue fallando con el mensaje de hoy | ✅ `test/estimation/layout.test.ts` y `test/estimation/fixtures.test.ts` («falla con mensaje si no hay specs») |
| 3 | sin regresión en lo que llama a `generateEstimationLog` (`sdd merge` incluido) | ✅ `npx vitest run test/cli.test.ts test/estimation test/merge` → 367/368 con el test viejo de layout en rojo (el del `AND` retirado); reescrito, `test/estimation/layout.test.ts test/cli.test.ts test/estimation/fixtures.test.ts` → 63/63. `moon run cli:typecheck` en verde |

Revisión del fix (un revisor `sonnet`, `sdd-kit:effort-medium`): causa raíz y fix correctos, sin Crítico ni Importante. Sus cuatro Menores:

- El mensaje «No se encuentra changes/ ni specs/…» ya solo sale sin `.docs/sdd/` ni `docs/sdd/`, y nombra un criterio que ya no aplica — rechazado aquí: cambiar el texto que ve el usuario no lo fija el ticket; queda en el ticket del patch.
- Con `.docs/sdd/` sin `estimation.md`, el log va a `.docs/sdd/estimation-log.md` — sin cambio: es `estimationLogPath` de antes, y `sdd-init` escribe `steering/estimation.md` en el paso 4, antes del paso 5.
- El test reescrito de `layout.test.ts` pierde el caso 2.x (`.docs/sdd/estimation.md` sin `changes/`) — rechazado: el fix no depende de dónde esté `estimation.md`; la carpeta del log la siguen probando los tests de `estimationLogPath`.
- `regenerateLog` de `sdd merge` escribe un log vacío donde antes fallaba — aceptado sin cambio: solo corre con conflicto en el log, que exige que exista.

## 5. Tiempo (ligero)

- Estimación: 0,25 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-19T11:53Z
- Esfuerzo real:
- Coste de sujetos: no aplica

## 6. Delta de capacidad

### Capacidad: `estimation`

#### MODIFIED — El estimation-log se genera desde los artefactos de cierre

- GIVEN un proyecto con `estimation.md` en `.docs/sdd/steering/` (3.0.0) o en `.docs/sdd/` (2.x) y al menos un `walkthrough.md` o `patch.md` con bloque de tiempo en `.docs/sdd/changes/` o en `.docs/sdd/specs/`
- WHEN se ejecuta `sdd estimation log --root <proyecto>`
- THEN `estimation-log.md` se regenera entero, en la carpeta de `estimation.md`, con una fila por artefacto (fecha, id, tipo, estimado, real, ratio, tokens del hilo, tokens de subagentes, sujetos ($), sesión ($), carpeta), ordenado por carpeta
- AND un proyecto con `specs/20260920-100000-feature-0079-b/walkthrough.md` y `changes/20261010-090000-feature-0160-c/walkthrough.md` tiene las dos filas, `0079` y `0160`
- AND con `estimation.md` en las dos rutas, el log va a `steering/` y escribe por stderr que también existe `.docs/sdd/estimation.md`
- AND `sdd merge`, cuando regenera el log tras un conflicto, lo escribe en esa misma carpeta
- AND la fecha de la fila es la de cierre: la primera línea `created: AAAA-MM-DD` o `date: AAAA-MM-DD` del artefacto; sin ella, o con el placeholder de la plantilla, la fecha de la carpeta, que es la de apertura
- AND `Sesión ($)` es la cifra de `Coste de la sesión`; «sin precio» y «no medido» aparecen tal cual, y sin la línea la celda es `—`
- AND el fichero lleva cabecera "AUTO-GENERADO — no editar a mano"
- REMOVED AND sin `changes/` ni `specs/` bajo `.docs/sdd/` ni `docs/sdd/`, sale con error y dice qué carpetas buscó
- AND con `.docs/sdd/steering/estimation.md` y sin `changes/` ni `specs/`, sale con 0 y `.docs/sdd/steering/estimation-log.md` tiene la cabecera y ninguna fila
- AND sin `.docs/sdd/` ni `docs/sdd/`, sale con error y dice qué carpetas buscó
