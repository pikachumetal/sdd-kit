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

1. **Modelo y effort por task** — Native: la sesión implementa las dos tasks; son edición de una skill de cuatro líneas y pruebas con sujetos Sonnet (los sujetos los fija la batería). La revisión final de rama va con el modelo de `sdd-verify`.
2. **Ejecución** — native, fijado en `sdd-kit.json`.
3. **La spec dice que `mold-c` no tiene `pendientes.md`, y sí lo tiene** (`tests/batteries/aviso-cierre/mold-c/pendientes.md`, versionado, con «0011: responsables de sala»). Con él, el sujeto de `c1` leería lo pendiente de ahí y no de la skill: el RED no mediría nada. La Task 1 lo borra del molde y añade un `ROADMAP.md` mínimo con una fila abierta (`0011`), porque la spec pide que el aviso lo saque «del roadmap» y el molde no tiene ninguno. Es fixture de pruebas, no cambia el alcance, pero la spec afirma algo falso: **dev-lead, confirma o corrige la spec**.
4. **`c2` con n = 3 en el RED** — la batería declara n = 2 para `c2`; la spec prevé 3 en el RED y 2 en el GREEN. Se usa `N=3` en el RED sin tocar la tabla.
5. **El paso 2 es condicional** — la Task 2 solo se ejecuta si el RED de `c2` exhibe que, sin cambio, el aviso no repite lo pendiente antes del gate. Si no lo exhibe, se salta y se deja constancia en el walkthrough (la spec: «Entra, si el RED lo exhibe»).
6. **Coste** — previsión de la spec: 9 sujetos, 6,30 $ (RED 3,50 + GREEN 2,80), ~0,70 $ por sujeto. Si se supera con una tanda de REFACTOR incluida, se para y decide el dev-lead (constitution, art. 5). Tiempo: ~1,5 h.
7. **Review Focus**: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `aviso-cierre` nombra lo pendiente del roadmap, y el paso 2 lo repite antes del gate si el RED lo pide.

**Architecture**: se edita `skills/aviso-cierre/SKILL.md` siguiendo RED → GREEN con sujetos sobre la batería `tests/batteries/aviso-cierre/`. El molde `mold-c` se ajusta para que lo pendiente solo pueda salir de la skill y del roadmap.

**Tech Stack**: Markdown, `node scripts/plan.mjs` (previsión de coste), Node 22 sin dependencias.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y un fixture de pruebas; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitution, art. 4).
- Ninguna edición de `skills/aviso-cierre/SKILL.md` sin su RED con sujetos antes (constitution, art. 5): el paso 1 se prueba con `c1`, el paso 2 con `c2`.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).
- No se toca el roadmap del proyecto (spec, «No entra»).

### De proceso

- Native: la sesión implementa cada task en orden; modelos prohibidos por defecto: ninguno declarado.
- Commits con la convención del proyecto, referenciando la 0028; atribución: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Previsión de coste declarada antes del primer sujeto: `SCENARIOS="c1 c2" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`.

## Review Focus

- Un cierre cuyo roadmap no tiene filas abiertas → el aviso dice que no queda nada pendiente, no inventa filas · Task 1, `c1` con una variante del molde sin fila abierta (si no cabe en la batería, se anota como no cubierto en el walkthrough).
- El aviso nombra lo pendiente pero el paso 2 corre el gate sin repetirlo → es el comportamiento actual y solo se corrige si el RED lo exhibe · Task 2, `c2` RED n = 3.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos líneas en la skill y un fixture; nada más simple.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Brownfield gate**: retrocompatible; el paso 1 sigue diciendo qué se cierra; sin refactor fuera de scope.
- [x] **Constitution check**: respeta los artículos 1, 2, 4 y 5 (RED → GREEN con sujetos y previsión declarada).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/aviso-cierre/mold-c/ROADMAP.md` — roadmap mínimo del molde con una fila abierta (`0011 · responsables de sala`, estado ⏳) de la que el sujeto saca lo pendiente.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1: además de qué se cierra, nombra lo pendiente sacándolo del roadmap; paso 2 (solo si el RED de `c2` lo exhibe): repite lo pendiente antes de correr el gate.
- `tests/batteries/aviso-cierre/mold-c/pendientes.md` — se borra (ver decisión 3).

**NO se tocan**:

- `ROADMAP.md` del proyecto — la spec excluye el roadmap.
- `tests/batteries/aviso-cierre/battery.md` — el n del RED de `c2` se pasa con `N=3`.
- `scripts/plan.mjs`, `scripts/lint.mjs` — sin cambios.

### 1.6 Dependencias

Ninguna; la spec es independiente de otras features.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El molde no aísla la fuente (lo pendiente sale de `pendientes.md`) | Alta si no se corrige | El RED no mide nada | Task 1 borra `pendientes.md` y añade `ROADMAP.md` antes del RED |
| El RED de `c1` pasa sin tocar la skill | Media | No hay cambio que probar | Se para y se informa al dev-lead; no se edita la skill |
| El coste supera los 6,30 $ | Baja | Parada obligatoria (art. 5) | Se cuenta cada tanda contra la previsión |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: Native, la sesión (Sonnet, effort medium); los sujetos son los de la batería (Sonnet).
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md` fila `c1` (n = 2), sobre el molde `mold-c` ya corregido; el RED se corre antes de editar la skill.

**Superficies**: tooling · docs
**Verificación**: `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` (previsión, antes del primer sujeto); tras el GREEN, `c1` × 2 con el aviso nombrando `0011`; `node --test && node scripts/lint.mjs` se corre solo en §3.

**Interfaces**:
- Consume: nada.
- Produce: el paso 1 de la skill nombra lo pendiente; el molde `mold-c` con `ROADMAP.md` y sin `pendientes.md`, que reutiliza la Task 2.

**Ficheros**: crear `tests/batteries/aviso-cierre/mold-c/ROADMAP.md`; borrar `tests/batteries/aviso-cierre/mold-c/pendientes.md`; modificar `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: Molde** — borrar `pendientes.md` y crear `ROADMAP.md` con la tabla `Now` y una fila abierta: `| 0011 | — | **Responsables de sala** | ⏳ | — | M |`.
- [ ] **Step 2: RED** — declarar la previsión con `plan.mjs` y correr `c1` × 2. Esperado: el aviso **no** nombra `0011`. Si lo nombra, parar e informar (decisión 1.7).
- [ ] **Step 3: Implementación** — en `skills/aviso-cierre/SKILL.md`, paso 1: «Di qué se cierra y qué queda pendiente, según las filas abiertas del `ROADMAP.md`.»
- [ ] **Step 4: GREEN** — correr `c1` × 2. Esperado: el aviso nombra `0011` en ambos sujetos. Registrar coste real.
- [ ] **Step 5: Commit de la task** — `feat: el aviso de cierre nombra lo pendiente (0028)`, con la atribución del proyecto.

### Task 2 — El paso 2 repite lo pendiente *(solo si el RED lo exhibe)*

**Tras**: Task 1
**Modelo**: Native, la sesión (Sonnet, effort medium); sujetos Sonnet.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md` fila `c2`, `N=3`, con la skill de la Task 1 ya en el árbol.

**Superficies**: tooling · docs
**Verificación**: `SCENARIOS="c2" N=3 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 3 sujetos · coste previsto: 2.10 $` (RED); GREEN con `N=2`.

**Interfaces**:
- Consume: el molde `mold-c` y el paso 1 de la Task 1.
- Produce: el paso 2 de la skill repite lo pendiente antes de correr el gate.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: RED** — correr `c2` × 3 y ver si el aviso, justo antes del gate, repite lo pendiente. Esperado: si en alguno no lo repite, el RED lo exhibe y se sigue; si lo repite en los 3, **se salta la task** y se anota en el walkthrough.
- [ ] **Step 2: Implementación** — paso 2: «Repite lo pendiente y corre el gate.»
- [ ] **Step 3: GREEN** — `c2` × 2. Esperado: el aviso repite `0011` antes del gate en ambos.
- [ ] **Step 4: Commit de la task** — `feat: el cierre repite lo pendiente antes del gate (0028)`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,3 h
- Base de la estimación: 2 tasks (una condicional), 9 sujetos previstos, la incertidumbre es lo que tarden las tandas; sin referencia en el estimation-log.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§Delta: el aviso nombra lo pendiente sacándolo del roadmap)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, `c1` × 2 (RED sin `0011`, GREEN con `0011`). ✓
- Scope «el paso 2 repite lo pendiente antes de correr el gate, si el RED lo exhibe» → Task 2, `c2` × 3 RED / × 2 GREEN. ✓
- «Sin `pendientes.md` en el molde» → Task 1, Step 1 (la spec lo daba por cierto y no lo era; ver decisión 3). ✓
- «No entra: el roadmap» → N/A (confirmado en spec; solo cambia el fixture del molde). ✓
- Previsión de coste (9 sujetos, 6,30 $) → decisión 6 y las `Verificación` de las tasks. ✓
- Review Focus 1 → Task 1, variante de `c1` sin filas abiertas, o constancia de no cubierto. ⚠ (la batería no la tiene; avisado en las decisiones)
- Review Focus 2 → Task 2, `c2` RED. ✓
