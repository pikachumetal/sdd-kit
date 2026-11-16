---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Plan de implementación — Motivo al cancelar
spec: ./spec.md
status: draft
created: 2026-11-12
---

# Plan de implementación — Motivo al cancelar

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task**: Task 1 y Task 2 con la sesión Native (Sonnet, effort medium): un fichero, cuerpos que firma y tests determinan. La revisión final de rama va con los ejes de `sdd-verify` (Spec y Arquitectura con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: native, fijado en `sdd-kit.json`.
3. **`cancelar` sin `--motivo`** (la spec no lo fija): responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela; un motivo ausente no está en la lista. El test existente `cancelar una reserva activa` (`test/cancel.test.js`) pasa a llevar `--motivo`, porque su comportamiento anterior (cancelar sin motivo) queda retirado por la spec.
4. **Orden de comprobaciones en `cancelar`**: primero la reserva, luego el motivo; sin reserva responde `sin reserva <sala> <día>` también con un motivo inválido, así el test `cancelar sin reserva lo dice` sigue como está.
5. **`canceladas` sin ninguna cancelada** (la spec no lo fija): responde `sin canceladas`, en la línea de `sin reserva …`. Texto visible: valídalo.
6. **`canceladas` lista solo el estado `cancelled`**: las `voided` (anular, 0011) no salen. Varias canceladas, una por línea, en el orden de `bookings`.
7. **Coste estimado**: ~1,5 h; sin subagentes, solo la sesión.
8. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `cancelar` exige un motivo de una lista cerrada y `canceladas` lista las reservas canceladas con su motivo.

**Architecture**: el motivo se guarda como campo `reason` de la reserva al pasarla a `cancelled`; `canceladas` filtra `bookings` por ese estado. Todo en `src/app.js`, sin módulo nuevo.

**Tech Stack**: Node 22 sin dependencias, `node --test`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia `src/app.js`: ni módulo, ni dependencia, ni contrato entre módulos o datos nuevos fuera del campo `reason` interno.

## Restricciones globales

### De código

- La lista de motivos es cerrada: `cambio de planes`, `sala ocupada`, `otro`.
- Mensajes literales de la spec: `cancelada <sala> <día> (<motivo>)`, `motivo no válido: cambio de planes, sala ocupada, otro`, `<sala> <día> — <motivo>`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); código limpio, funciones cortas.
- Texto de la interfaz en castellano.

### De proceso

- Tests antes que código (constitution, art. 2); cada task verifica solo lo suyo, el gate completo va en §3.
- Native: la sesión implementa cada task con `sdd task start` / `sdd task done`.
- Commits con la convención del proyecto; atribución según el sistema.

## Review Focus

- `cancelar Norte lun` sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa · Task 1, `cancelar sin motivo no cancela`
- Motivo fuera de la lista → mismo aviso y la reserva sigue activa (no queda cancelada a medias) · Task 1, `motivo fuera de la lista no cancela`
- `canceladas` sin canceladas → `sin canceladas`, no una línea vacía · Task 2, `canceladas sin ninguna lo dice`
- Una reserva anulada (`voided`) no aparece en `canceladas` · Task 2, `canceladas no lista las anuladas`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un campo y un comando, sin estructura nueva.
- [x] **YAGNI gate**: ninguna abstracción nueva; la lista de motivos es una constante.
- [x] **Brownfield gate**: retrocompatible salvo lo que la spec retira (cancelar sin motivo); respeta el patrón de `app.js`; sin refactor fuera de scope.
- [x] **Constitution check**: tests primero y gate `node --test` entero; texto en castellano.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**: ninguno.

**Modificar**:

- `src/app.js` — `cancelBooking` valida y guarda el motivo; nueva `cancelledList()` y comando `canceladas` en `run`.
- `test/cancel.test.js` — tests de los dos escenarios y del Review Focus; ajusta `cancelar una reserva activa`.

**NO se tocan**:

- `voidBooking` y el comando `anular` — son de la 0011.
- `test/app.test.js` — no toca `libres` ni `reservar`.

### 1.2 Modelo de datos

La reserva cancelada lleva `reason` (cadena de la lista). Estructura en memoria, sin persistencia.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica.

### 1.5 UX

No aplica: salida de consola, texto literal de la spec.

### 1.6 Dependencias

Ninguna. La 0011 (anular) es independiente.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Marcar `cancelled` antes de validar el motivo | Media | Alto | Validar antes de mutar; tests del Review Focus |
| `--motivo` en una posición distinta de `params[3]` | Baja | Medio | Test con el orden de la spec: `<sala> <día> --motivo <motivo>` |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Cancelar pide un motivo de la lista

**Tras**: —
**Modelo**: Native, la sesión (Sonnet, effort medium): cuerpo determinado por firma y tests.
**Tests RED**: hilo principal · `test/cancel.test.js`, escritos antes y sin commitear: van en el commit de la task.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: el usuario ejecuta `cancelar Norte lun --motivo "sala ocupada"` y ve «cancelada Norte lun (sala ocupada)»; con un motivo fuera de la lista, el aviso con los tres válidos.

**Interfaces**:
- Consume: `findBooking(room, day)` y `bookings` de `src/app.js`; `run(cmd, params)` con `params = [sala, día, '--motivo', motivo]`.
- Produce: `reason` en la reserva cancelada (cadena de `REASONS`); `const REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED** en `test/cancel.test.js` (reinicia el estado de `bookings` no es posible: cada test usa una sala/día propios o el orden fija el estado; el de la spec va primero sobre Norte lun):
  - `cancelar con motivo de la lista` → `run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])` igual a `'cancelada Norte lun (sala ocupada)'`.
  - `motivo fuera de la lista no cancela` → con una reserva activa distinta, `run('cancelar', [sala, día, '--motivo', 'porque sí'])` igual a `'motivo no válido: cambio de planes, sala ocupada, otro'` y una segunda llamada válida sobre la misma reserva responde `cancelada … (…)`.
  - `cancelar sin motivo no cancela` → igual mensaje de motivo no válido, y una llamada válida posterior cancela.
  - Se retira `cancelar una reserva activa` (cubierto por el primero); `cancelar sin reserva lo dice` queda igual.
  Para sembrar reservas, `src/app.js` exporta `bookings`; los tests añaden con `bookings.push({ room, day, slot, status: 'active' })`.
- [ ] **Step 2: Implementación** — `cancelBooking(room, day, reason)`: sin reserva → `sin reserva ${room} ${day}`; motivo fuera de `REASONS` (o `undefined`) → `motivo no válido: ${REASONS.join(', ')}` sin mutar; si no, `status = 'cancelled'`, `reason`, y `cancelada ${room} ${day} (${reason})`. En `run`: `reason = params[params.indexOf('--motivo') + 1]` solo si el flag está, si no `undefined`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo al quedar limpia su revisión.

### Task 2 — El listado de canceladas enseña el motivo

**Tras**: Task 1
**Modelo**: Native, la sesión (Sonnet, effort medium).
**Tests RED**: hilo principal · `test/cancel.test.js`, sin commitear.
**Superficies**: backend
**Verificación**: `node --test test/cancel.test.js` → `ℹ fail 0`
**Se prueba en la aplicación**: tras cancelar Norte lun con «sala ocupada», el usuario ejecuta `canceladas` y ve «Norte lun — sala ocupada».

**Interfaces**:
- Consume: `reason` y el estado `cancelled` de la Task 1; `bookings`.
- Produce: `cancelledList()` → cadena; comando `canceladas` en `run`.

**Ficheros**: modificar `src/app.js`, `test/cancel.test.js`

- [ ] **Step 1: Tests RED**:
  - `canceladas enseña el motivo` → con Norte lun cancelada con «sala ocupada», `run('canceladas', [])` contiene `'Norte lun — sala ocupada'`.
  - `canceladas no lista las anuladas` → una reserva `voided` sembrada no aparece en la salida.
  - `canceladas sin ninguna lo dice` → con `bookings` sin canceladas (se vacía el array en ese test y se restaura), `run('canceladas', [])` igual a `'sin canceladas'`.
- [ ] **Step 2: Implementación** — `cancelledList()`: filtra `status === 'cancelled'`, mapea `` `${b.room} ${b.day} — ${b.reason}` ``, une con `\n`; vacío → `sin canceladas`. `run`: `if (cmd === 'canceladas') return cancelledList();`.
- [ ] **Step 3: Verificación** — `node --test test/cancel.test.js` → `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 1h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks en un fichero, sin migración; sin notas de calibración todavía
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test` entero en verde (constitution, art. 2; el proyecto no tiene `operations.md`)
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «cancelada Norte lun (sala ocupada)» → Task 1, `cancelar con motivo de la lista`. ✓
- AND motivo fuera de la lista responde «motivo no válido: …» → Task 1, `motivo fuera de la lista no cancela`. ✓
- THEN `canceladas` responde «Norte lun — sala ocupada» → Task 2, `canceladas enseña el motivo`. ✓
- Review Focus: sin motivo → Task 1, `cancelar sin motivo no cancela`; fuera de la lista → Task 1, `motivo fuera de la lista no cancela`; sin canceladas → Task 2, `canceladas sin ninguna lo dice`; anuladas fuera → Task 2, `canceladas no lista las anuladas`. ✓
