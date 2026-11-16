---
id: 20261008-130000-feature-0028-close-notice-pending
feature: 0028
title: Plan de implementación — El aviso de cierre dice qué queda pendiente
spec: ./spec.md
status: draft
created: 2026-11-12
---

# Plan de implementación — El aviso de cierre dice qué queda pendiente

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: Sonnet, effort medium, las dos tasks — editar un párrafo de una skill y leer salidas de sujetos es interpretar prosa, no diseñar. La revisión final de rama va con el modelo de `sdd-verify` (Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: native, fijado en `sdd-kit.json`.
3. El molde de `c1` es `mold-cierre` sin `.docs/sdd/pendientes.md` y con una fila abierta en su `ROADMAP.md` (hoy el ROADMAP del molde está vacío y `pendientes.md` existe): la spec pide «un molde sin lista de pendientes» y que lo pendiente salga del roadmap, y con el molde actual ninguna de las dos cosas se puede observar. Se crea como molde propio de `c1`, `mold-cierre-sin-lista`, sin tocar `mold-cierre`, que sigue siendo el de `c2`.
4. La Task 2 solo escribe el paso 2 si el RED de `c2` (n = 3) lo exhibe: si los 3 sujetos ya repiten lo pendiente antes del gate con el paso 1 nuevo, el paso 2 no se toca y la task se cierra con esa evidencia.
5. Coste: RED 3,50 $ (`c1` × 2, `c2` × 3), GREEN 2,80 $ (`c1` × 2, `c2` × 2), suma 6,30 $ con 9 sujetos, la de la spec. Si una tanda la supera, REFACTOR incluido, se para y decide el dev-lead (Art. 5). Horas: ~1,5 h.
6. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra lo pendiente sacándolo del roadmap y, si el RED lo exhibe, el paso 2 lo repite antes del gate.

**Architecture**: la skill es un markdown de dos pasos; se edita con la prueba de sujetos de `tests/batteries/aviso-cierre/` (RED sin el cambio, GREEN con él). Cada task lleva su tanda, para que un fallo de `c2` no bloquee lo ya verde de `c1`.

**Tech Stack**: Node 22 sin dependencias (`node --test`, `scripts/lint.mjs`, `scripts/plan.mjs` para la previsión).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y un molde de pruebas; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitution, Art. 4).
- Ninguna edición de `skills/aviso-cierre/SKILL.md` sin su RED con sujetos antes (constitution, Art. 5); la previsión de coste es la de la spec: 9 sujetos, 6,30 $.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).
- El roadmap del proyecto (`ROADMAP.md` de la raíz) no se toca: está fuera de scope en la spec.

### De proceso

- Política de modelos: Sonnet effort medium para las tasks; sujetos de la batería en Sonnet.
- Ejecución native; el gate completo corre una vez, en §3.
- Commits: uno por task al quedar limpia su revisión, con la atribución del kit.

## Review Focus

- Roadmap del molde sin ninguna fila abierta → el aviso no inventa pendientes: dice que no queda ninguno · Task 1, `c1` con `ROADMAP.md` sin filas abiertas (un sujeto de la tanda RED y de la GREEN)
- Lo pendiente está en `.docs/sdd/pendientes.md` y no en el roadmap (molde de `c2`) → el aviso nombra lo del roadmap si lo hay y no se contradice con la lista · Task 2, `c2` en `mold-cierre`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos tasks, una por paso de la skill; sin tooling nuevo.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Brownfield gate**: `mold-cierre` y la batería siguen igual; solo se añade un molde.
- [x] **Constitution check**: Art. 4 y 5 respetados (arriba).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/aviso-cierre/mold-cierre-sin-lista/` — copia de `mold-cierre` sin `.docs/sdd/pendientes.md` y con una fila abierta en `ROADMAP.md`; molde de `c1`.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — el paso 1 nombra lo pendiente sacándolo del roadmap; el paso 2, solo si el RED lo exhibe, repite lo pendiente antes del gate.
- `tests/batteries/aviso-cierre/battery.md` — `c1` apunta a `mold-cierre-sin-lista` (la tabla de la batería no tiene columna de molde: se añade) y `c2` queda con n = 3 en la tanda RED.

**NO se tocan**:

- `ROADMAP.md` de la raíz — fuera de scope en la spec.
- `tests/batteries/aviso-cierre/mold-cierre/` — es el molde de `c2`.
- `scripts/plan.mjs` — solo se usa para la previsión.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED de `c1` ya pasa (el sujeto nombra lo pendiente sin el cambio) | baja | alto: la prueba no prueba | si pasa, se para y se revisa el molde antes de escribir nada |
| Los sujetos cuestan más que 0,70 $ y la tanda supera la previsión | media | medio | se mide tras la primera tanda; si se supera, para y decide el dev-lead |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`; en native, la propia sesión (Sonnet, effort medium).
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/` (molde y fila de `c1`), escritos antes de tocar la skill y sin commitear: van en el commit de la task. La tanda RED de `c1` son 2 sujetos sobre la skill actual.

**Superficies**: tooling · docs
**Verificación**: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` (previsión) · RED: 2 sujetos de `c1` sin el cambio, el aviso no nombra lo pendiente · GREEN: 2 sujetos de `c1` con el cambio, el aviso nombra la fila abierta del roadmap · `node --test` → `ℹ fail 0`.

**Interfaces**:
- Consume: nada.
- Produce: `skills/aviso-cierre/SKILL.md` con el paso 1 nuevo, que la Task 2 lee como base; `mold-cierre-sin-lista` con la fila `0011` abierta en su `ROADMAP.md`.

**Ficheros**: crear `tests/batteries/aviso-cierre/mold-cierre-sin-lista/`; modificar `tests/batteries/aviso-cierre/battery.md`, `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Molde y RED** — copiar `mold-cierre` a `mold-cierre-sin-lista`, borrar su `.docs/sdd/pendientes.md` y poner en su `ROADMAP.md` una fila abierta (`0011 · responsables de sala · ⏳`); correr `c1` × 2 sobre la skill sin tocar. Esperado: el aviso no nombra lo pendiente en los 2 sujetos. Si alguno lo nombra, parar (riesgo de §1.7).
- [ ] **Step 2: Implementación** — en el paso 1 de `SKILL.md`, añadir que se nombra lo pendiente sacándolo del roadmap, y que si el roadmap no tiene ninguna fila abierta se dice que no queda pendiente. Texto en castellano, sin copiar el roadmap.
- [ ] **Step 3: GREEN** — `c1` × 2 con el cambio. Esperado: el aviso nombra `0011` como pendiente en los 2; con el coste anotado frente a la previsión (RED + GREEN de `c1` ≤ 2,80 $ de los 6,30 $).
- [ ] **Step 4: Verificación** — `node --test` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión, con `feat(0028): el aviso de cierre nombra lo pendiente`.

### Task 2 — El paso 2 repite lo pendiente (si el RED lo exhibe)

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`; en native, la propia sesión (Sonnet, effort medium).
**Tests RED**: hilo principal · `c2` en `mold-cierre`, n = 3, sobre la skill con el paso 1 nuevo y sin tocar el 2; escritos antes de editar el paso 2 y sin commitear.

**Superficies**: tooling · docs
**Verificación**: `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $` · RED: de los 3 sujetos, cuántos no repiten lo pendiente antes del gate · si ≥ 1, GREEN: `c2` × 2 con el paso 2 nuevo, ambos repiten lo pendiente antes del gate · `node --test` → `ℹ fail 0`.

**Interfaces**:
- Consume: `skills/aviso-cierre/SKILL.md` de la Task 1, con el paso 1 nuevo.
- Produce: `SKILL.md` con el paso 2 nuevo, o intacto con la evidencia de que no hacía falta.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md` (solo si el RED lo exhibe).

- [ ] **Step 1: RED** — `c2` × 3 sobre la skill tal como queda tras la Task 1. Esperado: se anota cuántos sujetos corren el gate sin repetir lo pendiente.
- [ ] **Step 2: Implementación** — si el RED exhibe el fallo (≥ 1 sujeto), el paso 2 repite lo pendiente antes de correr el gate; si los 3 ya lo repiten, no se edita y se anota en el commit.
- [ ] **Step 3: GREEN** — con el paso 2 editado, `c2` × 2. Esperado: ambos repiten lo pendiente antes del gate. Sin edición, este step no corre.
- [ ] **Step 4: Verificación** — `node --test` → `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión, con `feat(0028): el aviso de cierre repite lo pendiente antes del gate` (o `test(0028): c2 no exhibe fallo; el paso 2 queda como está`).

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,0 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 2 tasks; el tiempo es sobre todo esperar a 9 sujetos; la incertidumbre es si el RED de `c2` exhibe el fallo (si no, la Task 2 se reduce a la medición); sin estimation-log previo.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, `c1` × 2 en `mold-cierre-sin-lista`: el aviso nombra `0011`, que solo está en el roadmap. ✓
- Scope «el paso 2 repite lo pendiente antes de correr el gate, si el RED lo exhibe» → Task 2, `c2` × 3 RED y × 2 GREEN. ✓
- Dónde se prueba «`c1`, en un molde sin lista de pendientes» → Task 1, Step 1 (molde nuevo, porque `mold-cierre` trae `pendientes.md`). ✓
- Previsión de coste (9 sujetos, 6,30 $) → Tasks 1 y 2, el coste de cada tanda anotado frente a ella. ✓
- No entra: el roadmap → N/A (confirmado en spec; el `ROADMAP.md` de la raíz va en «NO se tocan»). ✓
- Review Focus: roadmap sin filas abiertas → Task 1, sujeto de `c1` con ese roadmap. ⚠ la tabla de la batería solo tiene n = 2 para `c1`: el sujeto de roadmap vacío sale de repartir esos 2, sin sujetos extra.
- Review Focus: pendientes en `pendientes.md` y no en el roadmap → Task 2, `c2` en `mold-cierre`. ✓
