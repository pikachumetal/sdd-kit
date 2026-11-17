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

1. **Modelo y effort**: las dos tasks las hace la sesión en Native, Sonnet con effort medium: editan una skill de 2 pasos y el plan lleva el texto exacto. Los sujetos de la batería son Sonnet (`tech-stack.md`). La revisión final de rama va con los modelos de `sdd-verify` (Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. **Ejecución**: Native, fijado en `sdd-kit.json`.
3. **El molde contradice la spec**: la spec dice que `mold-c` no tiene `pendientes.md`, pero lo tiene (`- 0011: responsables de sala`). Con él, el sujeto saca lo pendiente de ese fichero y `c1` no distingue la skill. La Task 1 borra `pendientes.md` y deja en el molde un `roadmap.md` con la fila `0011` pendiente, porque la THEN dice «sacándolo del roadmap». Es un cambio de fixture, no de alcance; si no lo quieres, dilo antes de la Task 1.
4. **`c2` con n = 3**: la spec fija RED con n = 3 y `battery.md` tiene `c2` con n = 2. No toco la batería: el RED de `c2` se lanza con n = 3 como parámetro de la tanda y el GREEN con n = 2, que es el de la batería.
5. **Orden del RED**: `c1` × 2 corre antes de editar el paso 1. `c2` × 3 corre después de la Task 1, no antes: contra la skill original el paso 2 fallaría siempre, porque el paso 1 aún no nombra lo pendiente. El total de sujetos y el coste son los de la spec (9 sujetos, 6,30 $).
6. **Tope de coste (Art. 5)**: 6,30 $ a ~0,70 $ por sujeto. Si RED + GREEN + REFACTOR lo superan, se para y decide el dev-lead; no se lanza una tanda extra por cuenta propia.
7. **Sin observar**: «sin pendientes en el roadmap, el aviso no inventa ninguno» no está en la spec y no cabe en la previsión de sujetos. Va al Review Focus y lo mira la revisión final leyendo el texto del paso 1. ⚠
8. **Coste estimado**: 1,5 h de implementación y 6,30 $ de sujetos.

Review Focus: 1 entrada que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el paso 1 de `skills/aviso-cierre/SKILL.md` hace que el aviso diga qué queda pendiente, sacándolo del roadmap, y el paso 2 lo repite antes del gate si el RED de `c2` lo exhibe.

**Architecture**: se edita el texto de una skill, test-first con sujetos como manda el Art. 5: RED sobre la skill sin tocar, texto mínimo, GREEN con los mismos escenarios. No hay código de `src/`.

**Tech Stack**: Node 22 sin dependencias; baterías de sujetos en `tests/batteries/`; sujetos Sonnet.

**Spec**: `./spec.md`

**Ejecución**: native, fijado en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill y un fixture de batería; ningún módulo, dependencia ni contrato.

## Restricciones globales

### De código

- La skill y los documentos, en castellano (constitución, Art. 4).
- Ninguna edición de `skills/aviso-cierre/SKILL.md` sin un RED visto antes (constitución, Art. 5): si se escribe antes, se borra y se empieza otra vez.
- El roadmap no se toca (Scope de la spec).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task); el texto de la skill se explica solo.

### De proceso

- Sujetos Sonnet, ~0,70 $ cada uno; previsión 6,30 $ (9 sujetos). Pasar de ahí para y decide el dev-lead.
- Método Native; commits sin atribución distinta de la que fije el entorno.

## Review Focus

- Cierre sin nada pendiente en el roadmap → el aviso no inventa pendientes · sin test (no cabe en la previsión de sujetos); lo cubre la revisión final del eje Spec leyendo el paso 1 de la Task 1.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos frases en la skill, nada más.
- [x] **YAGNI gate**: no se añade ningún paso; el paso 2 solo entra si el RED lo exhibe.
- [x] **Brownfield gate**: respeta la estructura de 2 pasos de la skill; sin refactor fuera de scope.
- [x] **Constitution check**: Art. 2 (gate entero verde), Art. 4 (castellano) y Art. 5 (RED → GREEN, previsión de coste) respetados.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/aviso-cierre/mold-c/roadmap.md` — roadmap del molde con la fila `0011` pendiente, de donde el sujeto saca lo pendiente.

**Modificar**:

- `skills/aviso-cierre/SKILL.md` — el paso 1 nombra lo pendiente; el paso 2 lo repite antes del gate, solo si el RED de `c2` lo exhibe.

**Borrar**:

- `tests/batteries/aviso-cierre/mold-c/pendientes.md` — sin él, `c1` mide la skill y no el fichero (decisión 3).

**NO se tocan**:

- `.docs/sdd/roadmap.md` — el Scope de la spec lo excluye.
- `tests/batteries/aviso-cierre/battery.md` — `c2` sigue con n = 2; el RED usa n = 3 por parámetro (decisión 4).

### 1.6 Dependencias

Ninguna: la spec no tiene predecesoras y no se toca ningún servicio.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `c1` pasa en RED porque el sujeto ya nombra lo pendiente del molde | Media | Alto: no hay nada que arreglar | Si pasa 2/2, no se escribe el paso 1; se para y se dice, porque el RED no exhibe el fallo |
| El coste pasa de 6,30 $ por un REFACTOR | Media | Medio | Art. 5: se para y decide el dev-lead |
| Los sujetos leen `pendientes.md` por haber quedado en caché de molde | Baja | Medio | Comprobar que el molde de la tanda no lo contiene antes de lanzar |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El paso 1 nombra lo pendiente (`c1`)

**Tras**: —
**Modelo**: la sesión Native, Sonnet con effort medium; hay que interpretar el resultado de los sujetos.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md`, escenario `c1`, n = 2, sin commitear: va en el commit de la task.

**Superficies**: tooling · docs
**Verificación**: tanda de `c1` según `battery.md`, leída sujeto a sujeto. RED: 0/2 nombran la fila `0011`. GREEN: 2/2 la nombran sacándola del `roadmap.md` del molde. Después `node scripts/lint.mjs` → `lint: sin hallazgos`.
**Se prueba en la aplicación**: no, porque es el texto de una skill: no hay aplicación.

**Interfaces**:
- Consume: nada.
- Produce: el paso 1 de la skill, con el texto de abajo, que la Task 2 deja intacto.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`; borrar `tests/batteries/aviso-cierre/mold-c/pendientes.md`; crear `tests/batteries/aviso-cierre/mold-c/roadmap.md`.

- [ ] **Step 1: Molde** — borra `mold-c/pendientes.md` y crea `mold-c/roadmap.md` con una tabla `| # | Ítem | Estado |` y la fila `| 0011 | **Anular reservas de otros**: solo el responsable de cada sala anula reservas de otras personas | ⏳ |`. Comprueba que `mold-c/` no tiene ningún otro fichero con lo pendiente.
- [ ] **Step 2: RED** — lanza `c1` × 2 con la skill sin tocar. Esperado: ningún aviso nombra `0011` ni «Anular reservas de otros». Guarda lo que dijo cada sujeto, literal. Si algún sujeto lo nombra, para y dilo: sin fallo no se escribe la skill.
- [ ] **Step 3: Escribir el paso 1** — sustituye `1. Di qué se cierra.` por `1. Di qué se cierra y qué queda pendiente: las filas del roadmap que siguen abiertas, con su id.` Nada más en la skill.
- [ ] **Step 4: GREEN** — lanza `c1` × 2 con la skill editada. Esperado: 2/2 nombran la fila `0011`. Si falla alguno, REFACTOR dentro del tope de coste.
- [ ] **Step 5: Verificación** — `node scripts/lint.mjs`. Esperado: `lint: sin hallazgos`.
- [ ] **Step 6: Commit de la task** — uno solo al quedar limpia su revisión: `feat(0028): el aviso de cierre nombra lo pendiente`.

### Task 2 — El paso 2 repite lo pendiente (`c2`), si el RED lo exhibe

**Tras**: Task 1
**Modelo**: la sesión Native, Sonnet con effort medium.
**Tests RED**: hilo principal · `tests/batteries/aviso-cierre/battery.md`, escenario `c2`, n = 3 en el RED y n = 2 en el GREEN, sin commitear: van en el commit de la task.

**Superficies**: tooling · docs
**Verificación**: tanda de `c2` según `battery.md`. RED: se cuenta cuántos de 3 sujetos no repiten lo pendiente antes de correr el gate. GREEN: 2/2 lo repiten. Después `node scripts/lint.mjs` → `lint: sin hallazgos`.
**Se prueba en la aplicación**: no, porque es el texto de una skill: no hay aplicación.

**Interfaces**:
- Consume: el paso 1 de la Task 1 (ya nombra lo pendiente).
- Produce: el paso 2 de la skill.

**Ficheros**: modificar `skills/aviso-cierre/SKILL.md`.

- [ ] **Step 1: RED** — lanza `c2` × 3 con la skill tal como la dejó la Task 1. Esperado para que el paso 2 entre: al menos 1 de 3 sujetos corre el gate sin repetir lo pendiente. Si los 3 lo repiten, el RED no lo exhibe: el paso 2 no se escribe, la Task 2 termina aquí y se dice en el cierre (Scope: «si el RED lo exhibe»).
- [ ] **Step 2: Escribir el paso 2** — solo si el RED lo exhibe: sustituye `2. Corre el gate.` por `2. Repite lo pendiente y corre el gate.` Nada más.
- [ ] **Step 3: GREEN** — lanza `c2` × 2 con la skill editada. Esperado: 2/2 repiten lo pendiente antes de correr el gate. Si falla alguno, REFACTOR dentro del tope de coste.
- [ ] **Step 4: Verificación** — `node scripts/lint.mjs`. Esperado: `lint: sin hallazgos`.
- [ ] **Step 5: Commit de la task** — uno solo: `feat(0028): el aviso repite lo pendiente antes del gate`; si el RED no lo exhibió, sin commit y con la nota en el cierre.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,7 h (aproximado)
- Estimación de implementación: 1,5 h
- Base de la estimación: 2 tasks, 9 sujetos de ~0,70 $ que tardan en correr; incertidumbre: si el RED de `c1` o `c2` no exhibe el fallo, la task se acorta.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node --test && node scripts/lint.mjs`
- [ ] Verificación de los criterios de éxito de la spec (§ Dónde se prueba): `c1` 2/2 en GREEN y, si entró, `c2` 2/2
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN «el aviso nombra lo pendiente sacándolo del roadmap» → Task 1, `c1` × 2 (RED 0/2, GREEN 2/2 nombran `0011` desde `mold-c/roadmap.md`). ✓
- GIVEN «un cierre sin `pendientes.md` en el molde» → Task 1, Step 1 (borra el fichero que el molde sí tenía). ✓
- Scope «el paso 2 repite lo pendiente, si el RED lo exhibe» → Task 2, `c2` × 3 RED y × 2 GREEN. ✓
- Scope «no entra: el roadmap» → N/A (`.docs/sdd/roadmap.md` en «NO se tocan»). ✓
- Capacidades: ninguna → N/A (confirmado en spec). ✓
- Previsión de coste: RED `c1` × 2 + `c2` × 3, GREEN `c1` × 2 + `c2` × 2 = 9 sujetos → Tasks 1 y 2. ✓
- Review Focus: cierre sin pendientes → sin test, lo cubre la revisión final (decisión 7). ⚠
