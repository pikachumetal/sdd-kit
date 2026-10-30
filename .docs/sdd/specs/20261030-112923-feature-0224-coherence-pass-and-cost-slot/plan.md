---
id: 20261030-112923-feature-0224-coherence-pass-and-cost-slot
feature: 0224
title: Plan de implementación — La regla del entorno en la clasificación y el hueco «Previsión de coste» de la spec
spec: ./spec.md
status: draft
created: 2026-10-30
---

# Plan de implementación — La regla del entorno en la clasificación y el hueco «Previsión de coste» de la spec

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las tres tasks las hace la sesión (Native), en el modelo de la sesión; los sujetos, Sonnet — lo fija la batería.
2. Ejecución: Native — tres tasks de texto, independientes y cortas, y la revisión final ve la rama entera.
3. Frase nueva del paso 2 de `sdd-propose`, con no más palabras que la que sustituye en «Config lane»: «Before running the code, a test or a gate, here or in any later step, prepare the environment with Step 2 of `sdd-worktrees` («Project Setup»): a worktree a launch prompt opens has no dependencies.»
4. Riesgo alto: quitar la frase de `sdd-start-patch` deja sin regla un patch retomado en un worktree nuevo, que no pasa por `sdd-propose`. Se acepta: un retomado ya tuvo su entorno, y si no, el `Cannot find module` lo dice.
5. Coste: 0,5 h y ~6,6 $ de sujetos, con el techo de la previsión de la spec. Revisión final aparte.
6. Review Focus: 1 entrada; ver la sección.

**Goal**: mover la regla del entorno al paso 2 de `sdd-propose`, añadir el hueco «Previsión de coste» a la spec y repartir la fila 0224 entre esta parte y la 0264.

**Architecture**: solo texto de skills, plantilla y roadmap. Cada edición de skill va con su RED ya medido, y el saldo de palabras no sube.

**Tech Stack**: Markdown, baterías con `tests/headless/battery.mjs`, Vitest de `cli/test/kit/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks sin interfaces entre ellas, un error lo caza su batería y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y una plantilla.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos; texto humano en castellano con tildes.
- El saldo de palabras de `sdd-propose`, `sdd-start-patch` y `sdd-templates` queda igual o baja: medidos 5.356 y 6.900; 1.940; 1.663 y 16.064.
- Sin línea `Evidencia:` en `launch-prompt-template.md`.

### De proceso

- Sujetos Sonnet, techo de la spec: 22 sujetos y 7,93 $ contando los 1,36 $ del RED. Kit de cada GREEN sacado sin `.docs/` ni `tests/`.

## Review Focus

- Carril config con el entorno sin preparar, porque no ejecutó nada al clasificar → la frase del paso 2 alcanza también al gate de un paso posterior; corre `Project Setup` antes del gate · Task 1, `ws2`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: mover una frase y añadir un hueco.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Brownfield gate**: un hueco condicional no afecta a un proyecto sin sujetos.
- [x] **Constitution check**: Art. I (RED antes de la spec), Art. II (hueco para un elemento omitido).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/sdd-propose/SKILL.md` — la frase, en el paso 2; fuera, de «Config lane».
- `skills/sdd-start-patch/SKILL.md` — fuera, la frase del paso 1.
- `skills/sdd-templates/templates/spec-template.md` — hueco nuevo; fuera, dos ayudas y un porqué.
- `tests/batteries/sdd-propose/battery.md` — escenarios y procedencia.
- `.docs/sdd/roadmap.md` — filas 0224, 0255, 0264 y destinos de deuda.

**NO se tocan**:

- `skills/sdd-roadmap/SKILL.md`, `launch-prompt-template.md` — son de la 0264 o quedan fuera.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los tres frentes retirados eran falsos negativos | media | medio | siguen en la batería y en deuda con su veredicto |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — La regla del entorno en la clasificación

**Tras**: —
**Modelo**: la sesión (Native); sujetos Sonnet
**Tests RED**: `ws3` de `red2/` y `green/` en la carpeta de la 0253, ya medidos
**Superficies**: docs
**Verificación**: `BATTERY=sdd-propose STEPS="setup-lockfile setup" node tests/headless/battery.mjs run` y rúbrica `WS` en `tools.txt` → `ws3` 2/2, `ws1` 2/2 y `ws2` 2/2
**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: modificar `skills/sdd-propose/SKILL.md`, `skills/sdd-start-patch/SKILL.md`, `tests/batteries/sdd-propose/battery.md`

- [ ] **Step 1: Implementación** — añadir al final del primer párrafo del paso 2 la frase: «Before running the code, a test or a gate, here or in any later step, prepare the environment with Step 2 of `sdd-worktrees` («Project Setup»): a worktree a launch prompt opens has no dependencies.»; quitar de «Config lane» paso 2 la frase «Prepare the environment… (patch 0245).»; quitar de `sdd-start-patch` el paso 1, frase «Antes de ejecutar el código o un test…(patches 0212 y 0241).»; fila de procedencia en la batería.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — la de arriba, con `wc -w` antes y después.
- [ ] **Step 4: Commit de la task**.

### Task 2 — El hueco «Previsión de coste»

**Tras**: —
**Modelo**: la sesión (Native); sujetos Sonnet
**Tests RED**: `co4` en `red/red/out/`, ya medido: sin controles ni medición tras la revisión final
**Superficies**: docs
**Verificación**: `BATTERY=sdd-propose STEPS="cost coherence-added coherence-budget coherence-cache control" node tests/headless/battery.mjs run`, con `co4` n = 2 y solo `s1` de `control`; rúbrica `CO4` → 2/2; `co1`, `co2` y `co3` sin regresión. `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts` → `Tests  N passed (N)`
**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: modificar `skills/sdd-templates/templates/spec-template.md`, `tests/batteries/sdd-propose/battery.md`

- [ ] **Step 1: Implementación** — antes de «## Enmiendas», la sección `## Previsión de coste *(solo si la spec edita una skill que se prueba con sujetos)*`, con la ayuda «Si se cumple, es obligatoria y no se borra con los bloques de ayuda. Cada cifra cita su batería y el precio por sujeto de `tech-stack.md`, o lo medido; el total es la suma de las filas.» y la tabla `Tanda | Sujetos (batería) | $` con las filas RED, GREEN, Una tanda de REFACTOR, Controles, Medición tras la revisión final y Suma. Quitar las ayudas «**Siguiente paso**» y «**Modo lite**» y la frase «sin él, el `estimation-log` pierde justo las tareas pequeñas, que son las que mejor lo calibran». `co4` a n = 2.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — la de arriba, con el conteo de `sdd-templates` (si sube, recortar otra ayuda de `spec-template.md`).
- [ ] **Step 4: Commit de la task**.

### Task 3 — El reparto del roadmap

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: no aplica: documento, lo comprueba `sdd roadmap check`
**Superficies**: docs
**Verificación**: `node cli/bin/sdd.js roadmap check --path .docs/sdd` → `Roadmap válido`
**Interfaces**:
- Consume: id 0264, reservado
- Produce: nada

**Ficheros**: modificar `.docs/sdd/roadmap.md`

- [ ] **Step 1: Implementación** — fila 0224: quita (a), (c), la 0250, (b), (d) y la 0244; deja (e) y la 0255; `Tamaño S`. Fila 0264 nueva tras la 0224, `parent: 0224`, con (a), lo que queda de (c) sin `Evidencia:`, la 0250 y la mitad de patch de «Un patch que añade texto…», ficheros `skills/sdd-roadmap/SKILL.md` y `skills/sdd-start-patch/SKILL.md`, `Tamaño S`. Filas 0250 y 0255 fuera de Próximo con su destino (0264; esta 0224). Deuda: los destinos `→ 0224` de lo que no se salda aquí pasan a `→ 0264`; las tres de los frentes limpios, a «Esperar otro caso» con su veredicto `co1`, `co2` o `co3` como posible falso negativo. Los saldados los marca el cierre.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — la de arriba.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,7 h
- Estimación de implementación: 0,5 h, más 0,3 h del gate de cierre y la CI
- Base de la estimación: 3 tasks de texto; dos tandas de sujetos que corren en segundo plano
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- THEN patch o config corren `Project Setup` antes del primer test → Task 1, `ws1`, `ws2`, rúbrica `WS`. ✓
- AND la clasificación también → Task 1, `ws3`, rúbrica `WS`. ✓
- AND el paso 2 nombra el paso y los otros no lo repiten → Task 1, `grep` de la frase en las dos skills. ✓
- THEN «Previsión de coste» lleva las cinco filas → Task 2, `co4`, rúbrica `CO4`. ✓
- AND cada cifra cita su batería y el precio, y el total es la suma → Task 2, `co4`. ✓
- AND una spec que no edita una skill no lleva la sección → Task 2, `co2`, sin la sección. ✓
- Filas de «Lo que se retira» → Tasks 1 y 2. ✓
- Línea del Review Focus → Task 1, `ws2`. ✓
