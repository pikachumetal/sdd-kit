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

1. **Modelo y effort por task**: Task 1 y Task 2 con el hilo principal en Native (sesión en gama media, Sonnet con effort medium); los sujetos de la batería van con Sonnet, como fija `tech-stack.md` y la batería. La revisión final de rama no sigue esta política: sus ejes van con el modelo de `sdd-verify`.
2. **Ejecución**: Native, fijado en `sdd-kit.json`.
3. **El molde no tiene el caso de `c1`**: la spec pide `c1` «en un molde sin lista de pendientes», pero `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md` existe y el `roadmap.md` del molde no tiene filas. La Task 1 quita `pendientes.md` del molde y pone en su `roadmap.md` una fila abierta (`0011`, la que hoy está en `pendientes.md`), para que el aviso pueda sacarla del roadmap. `c2` usa el mismo molde.
4. **`c2` pide n = 3 en el RED y la batería dice 2**: el RED de `c2` corre con n = 3 (la spec y la previsión de coste); la batería queda en n = 2, que es el de GREEN. No se sube `n` en `battery.md`.
5. **La Task 2 es condicional**: la spec la mete solo «si el RED lo exhibe». Si los 3 sujetos del RED de `c2` ya repiten lo pendiente antes de correr el gate, no se edita el paso 2: se anota en la evidencia y la Task 2 acaba sin GREEN (ahorra 1,40 $).
6. **Coste**: previsión de la spec, 9 sujetos y 6,30 $ (RED 3,50 + GREEN 2,80, a ~0,70 $ por sujeto). Si la prueba la supera, REFACTOR incluido, se para y decide el dev-lead (constitution, Art. 5). Horas: ~1,5 h.
7. **Incoherencia de la spec, sin tocar**: su bloque «Capacidades» dice «Ninguna» y su delta añade `aviso-cierre` (ADDED). Es una spec aprobada; el plan no la corrige. El cierre (`sdd-archive`) fusionará el delta y creará `capabilities/aviso-cierre.md`; el dev-lead decide en la validación si la spec se enmienda.
8. **Riesgos altos**: ninguno. Una skill de dos pasos; el riesgo es que el texto nuevo no cambie el comportamiento, y para eso están el RED y el GREEN.

9. **Roadmap sin filas abiertas, sin sujeto**: la spec no lo cubre y la previsión de coste no deja sujetos para probarlo; queda en el Review Focus como entrada sin test. Si el dev-lead lo quiere probado, hay que ampliar la previsión (2 sujetos más, ~1,40 $).

Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `skills/aviso-cierre/SKILL.md` hace que el aviso nombre lo pendiente sacándolo del roadmap, y el paso 2 lo repite antes del gate si el RED lo exhibe.

**Architecture**: se edita el texto de una sola skill, con la prueba con sujetos de la constitution (RED → GREEN). Cada task lleva su batería: `c1` prueba el paso 1, `c2` el paso 2. No hay código de producción.

**Tech Stack**: Node 22 sin dependencias; sujetos de batería con Sonnet (`.docs/sdd/tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y su molde de pruebas; sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Texto de la skill y de los documentos en castellano (constitution, Art. 4).
- Ninguna edición de `skills/aviso-cierre/SKILL.md` sin su RED con sujetos antes (constitution, Art. 5).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code.
- Sin dependencias nuevas (`package.json` queda como está).

### De proceso

- Política de modelos: sesión en gama media; sujetos de batería con Sonnet.
- Modo de ejecución: native.
- Previsión de coste de la spec: 9 sujetos, 6,30 $; si se supera, se para y decide el dev-lead.
- Commits: un commit por task, con la convención del proyecto (`tipo: descripción`) y la atribución que pida la sesión.

## Review Focus

- Roadmap sin ninguna fila abierta → el aviso dice que no queda nada pendiente, sin inventar filas · sin test: la previsión de 9 sujetos no deja ninguno para este caso (decisión 9); lo mira la revisión final con el texto de la skill delante
- El aviso del paso 1 nombra lo pendiente pero el paso 2 corre el gate sin repetirlo → lo pendiente se repite antes del gate · Task 2, `c2`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos tasks, un fichero de skill y uno de molde.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: la skill ya existe; solo se añade texto a sus pasos y no se reordena.
- [x] **Constitution check**: Art. 1 (flujo SDD), Art. 4 (castellano), Art. 5 (RED → GREEN y previsión de coste) respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- Ninguno.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — paso 1 dice qué queda pendiente sacándolo del roadmap; paso 2 repite lo pendiente antes del gate (solo si el RED de `c2` lo exhibe).
- `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/roadmap.md` — fila abierta `0011` para que haya algo pendiente que nombrar.
- `tests/batteries/aviso-cierre/battery.md` — sin cambios previstos; solo si la Task 1 necesita fijar en la batería el enunciado de `c1`.

**Se borra**:

- `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md` — el molde de `c1` no lleva lista de pendientes.

**NO se tocan**:

- `.docs/sdd/roadmap.md` del proyecto — la spec lo deja fuera (No entra: el roadmap).
- `src/`, `test/`, `scripts/` — no hay producto que cambiar.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED de `c1` ya pasa con la skill actual (el sujeto nombra lo pendiente sin que se lo pidan) | Media | Medio | Si pasa, no hay edición del paso 1: se para y se avisa al dev-lead, porque la spec cambia. |
| Pasar de la previsión de coste | Baja | Medio | Contar sujetos al cerrar cada tanda; parar al llegar a 6,30 $. |

### 1.8 Rollout

Directo: la skill vive en el repo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 nombra lo pendiente

**Tras**: —
**Modelo**: hilo principal en Native, Sonnet con effort medium; sujetos de batería con Sonnet.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md` (fila `c1`), 2 sujetos con la skill sin editar, sobre el molde adaptado; el RED se registra en la evidencia de la task antes de tocar `SKILL.md`.

**Superficies**: docs (skill y molde de batería)
**Verificación**: `c1` × 2 sujetos en RED (el aviso no nombra lo pendiente) y `c1` × 2 en GREEN (los 2 avisos nombran la fila abierta `0011` del roadmap). Gate de la task: `node --test` → `ℹ fail 0`.
**Se prueba en la aplicación**: no, porque es el texto de una skill: lo observan los sujetos de la batería.

**Interfaces**:
- Consume: nada.
- Produce: el paso 1 de `SKILL.md` con el nombre de lo pendiente; el molde con `0011` abierta en su roadmap y sin `pendientes.md`.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`, `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/roadmap.md`; borrar `tests/batteries/aviso-cierre/mold-cierre/.docs/sdd/pendientes.md`.

- [ ] **Step 1: Molde** — borrar `pendientes.md` del molde y poner en su `roadmap.md` una tabla con la fila abierta `| 0011 | Responsables de sala | ⏳ |`.
- [ ] **Step 2: RED** — correr `c1` × 2 con la skill actual. Esperado: ningún aviso nombra la `0011` como pendiente. Registrar la salida de los 2 sujetos en la evidencia. Si alguno ya la nombra, parar (riesgo 1).
- [ ] **Step 3: Implementación** — en el paso 1 de `SKILL.md`, junto a «Di qué se cierra.», añadir la instrucción de decir también qué queda pendiente, leyéndolo del roadmap (las filas abiertas). El texto exacto lo escribe el implementador en castellano, sin repetir lo que el paso 2 hace.
- [ ] **Step 4: GREEN** — correr `c1` × 2 con la skill editada. Esperado: los 2 avisos nombran la `0011`. Correr `node --test`. Esperado: `ℹ fail 0`.
- [ ] **Step 5: Commit de la task** — uno solo con molde, skill y evidencia; `feat: el aviso de cierre dice qué queda pendiente (0028)`.

### Task 2 — El paso 2 repite lo pendiente antes del gate *(condicional)*

**Tras**: Task 1
**Modelo**: hilo principal en Native, Sonnet con effort medium; sujetos de batería con Sonnet.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md` (fila `c2`), **3 sujetos** con la skill tal como queda tras la Task 1, antes de escribir el paso 2; el RED se registra en la evidencia.

**Superficies**: docs (skill)
**Verificación**: `c2` × 3 en RED; si lo exhibe, `c2` × 2 en GREEN. Gate de la task: `node --test` → `ℹ fail 0`.
**Se prueba en la aplicación**: no, porque es el texto de una skill: lo observan los sujetos de la batería.

**Interfaces**:
- Consume: el paso 1 de la Task 1 (el aviso ya nombra lo pendiente).
- Produce: el paso 2 de `SKILL.md` repitiendo lo pendiente antes de correr el gate, o nada si el RED no lo exhibe.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md` (solo si el RED lo exhibe).

- [ ] **Step 1: RED** — correr `c2` × 3. «Lo exhibe» es que al menos un sujeto corre el gate sin repetir lo pendiente. Registrar las salidas. Si ninguno falla, anotar «el RED no lo exhibe: el paso 2 no se edita», saltar a Step 4 y no hacer GREEN.
- [ ] **Step 2: Implementación** — en el paso 2 de `SKILL.md`, antes de «Corre el gate.», pedir que repita lo pendiente. Sin duplicar el texto del paso 1.
- [ ] **Step 3: GREEN** — correr `c2` × 2. Esperado: los 2 repiten lo pendiente antes de correr el gate. Correr `node --test`. Esperado: `ℹ fail 0`.
- [ ] **Step 4: Commit de la task** — uno solo con la skill y la evidencia; `feat: el paso 2 del aviso repite lo pendiente (0028)`. Si no hubo edición, el commit lleva solo la evidencia.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,5 h
- Base de la estimación: 2 tasks sobre un fichero de skill; 9 sujetos como máximo; la Task 2 puede quedar sin edición
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (Dónde se prueba: `c1` y `c2`)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- GIVEN un cierre en un molde sin lista de pendientes · WHEN se avisa → Task 1, Step 1 (molde sin `pendientes.md`) y `c1`. ✓
- THEN el aviso nombra lo pendiente → Task 1, `c1` GREEN: el aviso nombra la `0011`. ✓
- AND sacándolo del roadmap → Task 1, Step 4: el molde solo tiene la `0011` en el roadmap, así que nombrarla prueba que viene de ahí. ✓
- Scope «Entra, si el RED lo exhibe: el paso 2…» → Task 2, `c2` RED con n = 3 y, si falla, GREEN. ✓
- Scope «No entra: el roadmap» → N/A: `.docs/sdd/roadmap.md` en «NO se tocan». ✓
- Previsión de coste (9 sujetos, 6,30 $) → decisión 6 y Restricciones de proceso. ✓
- Review Focus: roadmap sin filas abiertas → sin observar: sin presupuesto de sujetos (avisado en la decisión 9). ⚠
- Review Focus: paso 2 → Task 2, `c2`. ✓
