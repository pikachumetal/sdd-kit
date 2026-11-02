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

1. **Modelo y effort por task**: Task 1 y Task 2 en el hilo principal, Sonnet con effort medium (editar una skill de dos líneas y leer las salidas de los sujetos es interpretar prosa; no hay código que traiga escrito). Los sujetos de la batería son Sonnet (`tech-stack.md`). La revisión final de rama no sigue esta política: sus ejes van con el modelo de `sdd-verify`.
2. **Ejecución**: native, fijado en `sdd-kit.json`; son 2 tasks encadenadas.
3. **`mold-c/pendientes.md` existe y la spec dice que no** («`mold-c` no tiene `pendientes.md`»): con el fichero, el sujeto de `c1` lee lo pendiente de ahí y no de la skill, y el RED no mide nada. La Task 1 lo borra antes del RED de `c1`. Es fixture de la batería, no producto, y queda dentro del Scope («Dónde se prueba»). Aviso al dev-lead en el cierre del plan; no cambia la spec aprobada.
4. **`n` de `c2`**: la batería declara `c2` con n = 2 y la spec pide RED con n = 3. La Task 2 sube `c2` a n = 3 en `battery.md` para el RED, y la previsión de coste de la spec cuenta 3. En GREEN vuelve a 2, como dice la spec.
5. **Paso 2 condicionado**: se edita solo si el RED de `c2` exhibe que el aviso no repite lo pendiente antes del gate. Si no lo exhibe, no se toca y el plan lo dice en el cierre (Scope: «si el RED lo exhibe»).
6. **Coste (Art. 5 de la constitution)**: previsión de la spec, 9 sujetos y 6,30 $ (RED 3,50 $ + GREEN 2,80 $), a ~0,70 $ por sujeto. Si una tanda la supera, se para y decide el dev-lead; REFACTOR cuenta en el tope.
7. **Spec**: «Capacidades: Ninguna» y el delta lleva `ADDED` en la capacidad `aviso-cierre`, que no está en `capabilities/` (el proyecto no tiene la carpeta). Lo señalo al dev-lead; no bloquea el plan y no creo la capacidad sin que la spec la declare.
8. **Coste estimado**: ~1,5 h de implementación, 6,30 $ de sujetos.

Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `skills/aviso-cierre/SKILL.md` dice qué queda pendiente al avisar del cierre, y el paso 2 lo repite antes del gate si el RED lo exhibe.

**Architecture**: se edita solo el texto de una skill, con su prueba con sujetos (RED → GREEN) sobre la batería `aviso-cierre`. No hay código de producto.

**Tech Stack**: Node 22 sin dependencias (`node --test`, `scripts/lint.mjs` para el gate); sujetos Sonnet.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y un fixture de test; ni módulo, ni dependencia, ni contrato.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitution, Art. 4).
- Ninguna edición de `skills/aviso-cierre/SKILL.md` sin su RED antes: el RED se ve fallar con sujetos (constitution, Art. 5).
- Comentarios: ninguno que repita el código ni que cite documentos (constitution, spec, task, capacidad).
- El aviso saca lo pendiente del roadmap (`.docs/sdd/roadmap.md`), no de otro fichero (spec, THEN).
- El roadmap del proyecto no se toca (spec, Scope «No entra»).

### De proceso

- Política de modelos: Sonnet con effort medium para el hilo; sujetos Sonnet; sin Haiku ni Fable.
- Execution: native, sin subagentes de task.
- La previsión de coste va declarada antes del primer sujeto (Art. 5); si una tanda supera el tope de la spec, se para.
- Commits con el atributo `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- Molde con `pendientes.md` presente → el sujeto de `c1` lo lee y el RED da un falso verde → se borra antes del RED · Task 1, comprobación `test ! -e tests/batteries/aviso-cierre/mold-c/pendientes.md`
- Roadmap sin filas pendientes → el aviso dice que no queda nada pendiente, no inventa filas · Task 1, un sujeto de `c1` exhibe la salida (se lee en la tanda GREEN)
- `c2` con n = 2 en `battery.md` mientras la spec pide RED con n = 3 → el RED corre 3 sujetos · Task 2, el recuento de sujetos de la tanda

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos líneas de skill y un fixture; no hay forma más simple.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Brownfield gate**: retrocompatible; no toca más skill que `aviso-cierre`.
- [x] **Constitution check**: Art. 1, 2, 4 y 5 respetados (RED antes que edición; coste declarado).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 dice qué queda pendiente; paso 2 lo repite antes del gate, solo si el RED de `c2` lo exhibe.
- `tests/batteries/aviso-cierre/battery.md` — `c2` pasa a n = 3 para el RED y vuelve a 2 para el GREEN.

**Borrar**:

- `tests/batteries/aviso-cierre/mold-c/pendientes.md` — el molde no puede tener lo pendiente fuera del roadmap (decisión 3).

**NO se tocan**:

- `.docs/sdd/roadmap.md` — fuera de Scope.
- `src/`, `test/`, `scripts/` — no hay producto que cambiar.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Borrar `pendientes.md` rompe otra batería que lo use | Baja | Medio | `grep -r pendientes tests/ skills/` antes de borrar; hoy solo hay `mold-c` |
| RED de `c1` ya pasa sin tocar la skill | Media | Medio | Si pasa, la skill ya lo decía o el molde aún filtra la respuesta: se para y se avisa, no se escribe el paso a ciegas |
| El coste de los sujetos supera los 6,30 $ | Baja | Medio | Parar y decidir con el dev-lead (Art. 5) |

### 1.8 Rollout

Directo: merge de la rama a `develop`.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 dice qué queda pendiente

**Tras**: —
**Modelo**: hilo principal, Sonnet con effort medium (native; sin despacho).
**Tests RED**: `c1` × 2 sujetos Sonnet sobre `mold-c` sin `pendientes.md`, antes de editar la skill: debe fallar, es decir, el aviso no nombra lo pendiente del roadmap.

**Superficies**: docs (skill y fixture de la batería).
**Verificación**: `test ! -e tests/batteries/aviso-cierre/mold-c/pendientes.md` → sale con 0 · tanda GREEN de `c1` × 2: los dos avisos nombran lo pendiente sacado del roadmap · `node --test && node scripts/lint.mjs` no se corre aquí (es el gate de §3).
**Se prueba en la aplicación**: no, porque es el texto de una skill: no hay aplicación que cambie.

**Interfaces**:
- Consume: nada.
- Produce: el paso 1 de la skill con lo pendiente; la Task 2 corre sobre ese texto.

**Ficheros**: borrar `tests/batteries/aviso-cierre/mold-c/pendientes.md`; modificar `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Molde** — `grep -r pendientes tests/ skills/` para ver quién más lo usa; borrar `mold-c/pendientes.md`.
- [ ] **Step 2: RED** — correr `c1` × 2 (≈1,40 $); el aviso no nombra lo pendiente. Guardar la salida literal en la carpeta de la spec. Si pasa, parar (riesgo 2).
- [ ] **Step 3: Implementación** — paso 1 de `SKILL.md`: «Di qué se cierra y qué queda pendiente, sacándolo de `.docs/sdd/roadmap.md`.» Si el roadmap no deja filas pendientes, el aviso lo dice.
- [ ] **Step 4: GREEN** — correr `c1` × 2 (≈1,40 $); los dos avisos nombran lo pendiente del roadmap.
- [ ] **Step 5: Commit de la task** — uno solo al quedar limpia su revisión: `feat(0028): el aviso de cierre dice qué queda pendiente`.

### Task 2 — El paso 2 repite lo pendiente antes del gate

**Tras**: Task 1
**Modelo**: hilo principal, Sonnet con effort medium (native; sin despacho).
**Tests RED**: `c2` × 3 sujetos Sonnet (≈2,10 $) sobre la skill con el paso 1 ya escrito.

**Superficies**: docs.
**Verificación**: `c2` × 3 en RED: ¿el aviso repite lo pendiente justo antes de correr el gate? · si no lo repite, se escribe el paso 2 y `c2` × 2 en GREEN (≈1,40 $) lo repite en los dos.
**Se prueba en la aplicación**: no, porque es el texto de una skill.

**Interfaces**:
- Consume: el paso 1 de la Task 1 (lo pendiente ya dicho).
- Produce: el paso 2 con lo pendiente repetido, si el RED lo exhibe.

**Ficheros**: modificar `tests/batteries/aviso-cierre/battery.md`; modificar `skills/aviso-cierre/SKILL.md` solo si el RED lo exhibe.

- [ ] **Step 1: n de c2** — `c2` pasa de n = 2 a n = 3 en `battery.md`.
- [ ] **Step 2: RED** — correr `c2` × 3; guardar las salidas literales. Si los tres repiten lo pendiente, no hay fallo: no se edita el paso 2 y se anota en el cierre.
- [ ] **Step 3: Implementación** — solo si el RED falla: paso 2 de `SKILL.md`: «Repite lo pendiente y corre el gate.»
- [ ] **Step 4: GREEN** — solo si hubo edición: `c2` × 2 (≈1,40 $); `c2` vuelve a n = 2 en `battery.md`.
- [ ] **Step 5: Commit de la task** — `feat(0028): el paso 2 repite lo pendiente antes del gate` (o `test(0028): c2 con n = 3` si el RED no exhibió fallo).

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,5 h
- Base de la estimación: 2 tasks; 9 sujetos de ~0,70 $; incertidumbre en si `c2` exhibe fallo
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, `c1` × 2 en GREEN. ✓
- GIVEN «un cierre sin `pendientes.md` en el molde» → Task 1, Step 1 y comprobación `test ! -e …/mold-c/pendientes.md`. ✓
- Scope «paso 2 repite lo pendiente antes del gate, si el RED lo exhibe» → Task 2, `c2` × 3 en RED y `c2` × 2 en GREEN. ✓
- Scope «No entra: el roadmap» → N/A, el plan no lo toca (confirmado en spec). ✓
- Coste → 5 sujetos en RED (Task 1: 2, Task 2: 3) y 4 en GREEN = 9, 6,30 $. ✓
- Review Focus (3 entradas) → Task 1 (comprobación del molde y salida de `c1`) y Task 2 (recuento de `c2`). ✓
