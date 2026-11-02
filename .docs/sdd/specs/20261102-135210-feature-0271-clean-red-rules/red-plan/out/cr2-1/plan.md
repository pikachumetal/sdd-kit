---
id: 20261008-130000-feature-0028-close-notice-pending
feature: 0028
title: Plan de implementación — El aviso de cierre dice qué queda pendiente
spec: ./spec.md
status: draft
created: 2026-11-02
---

# Plan de implementación — El aviso de cierre dice qué queda pendiente

## Decisiones que he tomado yo — valida estas

1. **El molde `mold-c` no cumple lo que la spec da por cierto.** La spec dice que `mold-c` no tiene `pendientes.md`, pero el repo lo trae (`tests/batteries/aviso-cierre/mold-c/pendientes.md`, con «0011: responsables de sala») y no trae roadmap. Con el fichero, el sujeto lo lee en vez de sacar lo pendiente del roadmap, y el RED no distingue nada. La Task 1 borra `pendientes.md` y añade `mold-c/.docs/sdd/roadmap.md` con una fila cerrada y la fila pendiente 0011 (`⏳`). Es una decisión que la spec no fija y no cambia su comportamiento esperado; si prefieres que quede como enmienda de la spec, dilo antes de la Task 1.
2. **Los sujetos van con `sdd-kit:effort-medium` + `sonnet`**, el modelo que fija `tech-stack.md` («Sujetos: Sonnet»). La sesión que ejecuta va en Sonnet con effort medium: el diseño ya está en el plan.
3. **Ejecución native**, fijada en `sdd-kit.json`.
4. **El RED de `c2` corre con n = 3** aunque `battery.md` dice n = 2 para `c2`: lo pide la spec («RED con n = 3»). No se edita `battery.md`; el n lo da este plan al despachar. El GREEN de `c2` vuelve a n = 2, como en la previsión.
5. **El paso 2 es condicional.** Se reescribe solo si el RED de `c2` muestra que el sujeto no repite lo pendiente antes del gate. Si el RED de `c2` ya pasa, la Task 3 se cierra sin tocar la skill y el paso 2 queda como está. Es lo que dice el Scope («si el RED lo exhibe»).
6. **Coste**: 9 sujetos, 6,30 $ en total (RED 3,50 + GREEN 2,80), a ~0,70 $ por sujeto según `tech-stack.md`. Según la constitution (Art. 5), si se supera, una tanda de REFACTOR incluida, se para y decide el dev-lead. Tiempo estimado: ~1,5 h.
7. **La battery no define el texto de los escenarios**: solo `Id`, `Paso`, `n` y `Modelo`. Tomo `c1` como el cierre que ejercita el paso 1 y `c2` como el que ejercita el paso 2, tal como dice la spec. Si el sujeto necesita un prompt, lo escribe la Task 1 en `battery.md` sin cambiar `Id`, `Paso`, `n` ni `Modelo`.
8. **Review Focus**: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que el aviso de cierre de `aviso-cierre` nombre lo que queda pendiente del roadmap, y que lo repita antes del gate si el RED lo exige.

**Architecture**: la skill es un texto de dos pasos. El paso 1 pasa de «di qué se cierra» a «di qué se cierra y qué queda pendiente en el roadmap». La prueba son sujetos Sonnet que ejecutan la skill sobre un molde con roadmap y sin `pendientes.md`, primero en RED y luego en GREEN.

**Tech Stack**: Node 22 sin dependencias; Markdown para la skill y la batería. Gate: `node --test && node scripts/lint.mjs`.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y los ficheros del molde de pruebas; no hay módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la skill, de la batería y del molde en castellano (constitution, art. 4).
- Ninguna edición de una skill sin su prueba con sujetos, RED → GREEN (constitution, art. 5).
- La previsión de coste es la de la spec: RED `c1` × 2 y `c2` × 3 (3,50 $), GREEN `c1` × 2 y `c2` × 2 (2,80 $), 9 sujetos, 6,30 $. Si se supera, se para y decide el dev-lead.
- El roadmap del proyecto (`.docs/sdd/roadmap.md`) no se toca (Scope de la spec).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.

### De proceso

- Sujetos: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`.
- Atribución de commits: la que fija el harness. Un commit por task, al quedar limpia su revisión.
- Perfil `delegate`: no hay parada entre tasks; la validación es la del agente (spec: «Validación: agente»).

## Review Focus

- Roadmap sin filas pendientes → el aviso no inventa pendientes ni falla; la spec no lo fija y la previsión no deja sujetos para probarlo · verificación: la lectura del paso 1 en la revisión final del eje Spec, que comprueba que el texto no obliga a nombrar algo cuando no hay filas `⏳`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos pasos de texto y un molde; no hay forma más simple.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Brownfield gate**: se respeta el formato de la skill (lista numerada de pasos) y no se toca nada fuera del Scope.
- [x] **Constitution check**: arts. 2, 4 y 5 respetados; el art. 5 lo cumplen las tasks 1–3.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/aviso-cierre/mold-c/.docs/sdd/roadmap.md` — roadmap del molde, con una fila cerrada y la fila `0011 · Anular reservas de otros · ⏳`, para que el sujeto saque lo pendiente de aquí.
- `.docs/sdd/specs/20261008-130000-feature-0028-close-notice-pending/evidencia/` — salida en bruto de cada sujeto (`red-c1-1.md`, `red-c1-2.md`, `red-c2-1..3.md`, `green-c1-1.md`, `green-c1-2.md`, `green-c2-1.md`, `green-c2-2.md`).

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 nombra lo pendiente del roadmap; paso 2 repite lo pendiente antes del gate, solo si el RED de `c2` lo exhibe.
- `tests/batteries/aviso-cierre/battery.md` — solo si los sujetos necesitan un prompt por escenario (decisión 7); sin tocar `Id`, `Paso`, `n` ni `Modelo`.

**Borrar**:

- `tests/batteries/aviso-cierre/mold-c/pendientes.md` — con él el sujeto no saca lo pendiente del roadmap.

**NO se tocan**:

- `.docs/sdd/roadmap.md` — el Scope lo excluye.
- `src/`, `test/`, `scripts/` — la feature no cambia código de la aplicación.
- `.docs/sdd/capabilities/` — no existe; la spec declara «Capacidades: ninguna».

### 1.6 Dependencias

Ninguna. Los sujetos usan el harness del kit.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un sujeto de `aviso-cierre` cierra una feature entera y cuesta más de 0,70 $ | Media | Medio | Se anota el coste real tras cada tanda; si la suma supera 6,30 $, se para (art. 5) |
| El RED de `c1` pasa sin cambiar la skill, porque el sujeto ya nombra lo pendiente | Baja | Alto | Se registra tal cual; el RED vacío no prueba nada y se para a decidir con el dev-lead antes de escribir el paso 1 |
| El RED de `c2` pasa (el sujeto ya repite lo pendiente) | Media | Bajo | Es el caso previsto: el paso 2 no se toca (decisión 5) |

### 1.8 Rollout

Directo: es una skill del propio repo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Molde de pruebas y RED

**Tras**: —
**Modelo**: sesión en Sonnet con effort medium; sujetos con `subagent_type: sdd-kit:effort-medium` + `model: sonnet`.
**Tests RED**: hilo principal · escenarios `c1` (n = 2) y `c2` (n = 3) de `tests/batteries/aviso-cierre/battery.md`, ejecutados contra la skill sin cambios y con el molde corregido. La salida de cada sujeto va en `evidencia/`.

**Superficies**: tooling · docs
**Verificación**: los 5 sujetos RED (`c1` × 2, `c2` × 3) corren sobre el molde nuevo y su salida queda en `evidencia/`. Resultado esperado de `c1`: el aviso no nombra la fila 0011 como pendiente en ninguno de los 2 (RED). Resultado de `c2`: se registra por sujeto si repite lo pendiente antes del gate. Se anota el coste real.
**Se prueba en la aplicación**: no, porque es una skill y su molde de pruebas, sin aplicación.

**Interfaces**:
- Consume: nada.
- Produce: el molde `mold-c` con `.docs/sdd/roadmap.md` (fila pendiente `0011`) y sin `pendientes.md`; el veredicto del RED de `c2` (exhibe / no exhibe), que decide la Task 3.

**Ficheros**: borrar `tests/batteries/aviso-cierre/mold-c/pendientes.md`; crear `tests/batteries/aviso-cierre/mold-c/.docs/sdd/roadmap.md`.

- [ ] **Step 1: Molde** — borrar `pendientes.md` y crear `mold-c/.docs/sdd/roadmap.md`, en castellano, con una fila cerrada y `| 0011 | **Anular reservas de otros**: solo el responsable de cada sala anula reservas de otras personas | ⏳ |`.
- [ ] **Step 2: RED** — despachar los 5 sujetos contra la skill actual; guardar cada salida en `evidencia/red-<id>-<n>.md` y apuntar el coste real.
- [ ] **Step 3: Verificación** — confirmar que el RED de `c1` falla en los 2 sujetos. Si pasa, parar y decidir con el dev-lead. Apuntar el veredicto de `c2`.
- [ ] **Step 4: Commit de la task** — mensaje con el ticket 0028.

### Task 2 — Paso 1 nombra lo pendiente (GREEN de c1)

**Tras**: Task 1
**Modelo**: sesión en Sonnet con effort medium; sujetos con `subagent_type: sdd-kit:effort-medium` + `model: sonnet`.
**Tests RED**: los de la Task 1 (`c1` × 2), ya en rojo.

**Superficies**: docs
**Verificación**: los 2 sujetos GREEN de `c1` corren sobre el molde de la Task 1 con la skill editada. Resultado esperado: en los 2 el aviso nombra la fila 0011 (Anular reservas de otros) como pendiente, sacada del roadmap del molde. Se anota el coste real.
**Se prueba en la aplicación**: no, porque es una skill, sin aplicación.

**Interfaces**:
- Consume: el molde `mold-c` de la Task 1.
- Produce: el paso 1 de `skills/aviso-cierre/SKILL.md` con el texto final.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`

- [ ] **Step 1: Implementación** — el paso 1 pasa a: `1. Di qué se cierra y qué queda pendiente en el roadmap.` El paso 2 queda igual.
- [ ] **Step 2: GREEN** — despachar los 2 sujetos de `c1`; guardar `evidencia/green-c1-<n>.md` y apuntar el coste real.
- [ ] **Step 3: Verificación** — los 2 nombran la fila 0011. Si alguno no, ajustar el texto del paso 1 (una vuelta de REFACTOR cuenta en la previsión) y volver a correr solo ese.
- [ ] **Step 4: Commit de la task** — mensaje con el ticket 0028.

### Task 3 — Paso 2 repite lo pendiente (condicional, GREEN de c2)

**Tras**: Task 2
**Modelo**: sesión en Sonnet con effort medium; sujetos con `subagent_type: sdd-kit:effort-medium` + `model: sonnet`.
**Tests RED**: los de la Task 1 (`c2` × 3). Si el veredicto fue «no exhibe», no hay nada que poner en verde.

**Superficies**: docs
**Verificación**: si el RED de `c2` exhibió el fallo, los 2 sujetos GREEN de `c2` repiten lo pendiente antes de correr el gate. Si no lo exhibió, esta task no cambia la skill y los 2 sujetos GREEN de `c2` confirman que el paso 2 sigue sin necesitar cambio. Se anota el coste real.
**Se prueba en la aplicación**: no, porque es una skill, sin aplicación.

**Interfaces**:
- Consume: el veredicto del RED de `c2` (Task 1) y el paso 1 final (Task 2).
- Produce: el paso 2 de `skills/aviso-cierre/SKILL.md`, cambiado solo si el RED lo exhibió.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md` (solo si el RED lo exhibió)

- [ ] **Step 1: Implementación** — con RED exhibido, el paso 2 pasa a: `2. Repite lo pendiente y corre el gate.` Sin él, no se edita.
- [ ] **Step 2: GREEN** — despachar los 2 sujetos de `c2`; guardar `evidencia/green-c2-<n>.md` y apuntar el coste real.
- [ ] **Step 3: Verificación** — con RED exhibido, los 2 repiten lo pendiente antes del gate. Sin él, los 2 siguen sin necesitar cambio.
- [ ] **Step 4: Commit de la task** — mensaje con el ticket 0028; sin cambios en la skill, solo la evidencia.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h (aproximado)
- Estimación de implementación: 1,5 h
- Base de la estimación: 3 tasks, 9 sujetos de unos minutos cada uno, sin código de aplicación; incertidumbre en el molde corregido y en el RED de `c2`.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2): el coste real de los 9 sujetos no supera 6,30 $
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- GIVEN un cierre sin `pendientes.md` en el molde → Task 1, Step 1 (borra el fichero y añade el roadmap) y Step 3 (el RED parte de ese molde). ✓
- WHEN se avisa → Tasks 1 y 2, los sujetos de `c1` ejecutan la skill. ✓
- THEN el aviso nombra lo pendiente sacándolo del roadmap → Task 2, Step 3: los 2 sujetos GREEN de `c1` nombran la fila 0011 del roadmap del molde. ✓
- Scope «paso 2 repite lo pendiente si el RED lo exhibe» → Task 3, RED de `c2` × 3 y GREEN de `c2` × 2. ✓
- Scope «No entra: el roadmap» → N/A, el plan no toca `.docs/sdd/roadmap.md`. ✓
- Previsión de coste (9 sujetos, 6,30 $) → Restricciones globales y Verificación de las tasks 1–3. ✓
- Roadmap sin filas pendientes → sin observar: la spec no lo fija y la previsión no deja sujetos (avisado en las decisiones y en el Review Focus). ⚠
- Línea del Review Focus → verificación: lectura del paso 1 en la revisión final. ✓
