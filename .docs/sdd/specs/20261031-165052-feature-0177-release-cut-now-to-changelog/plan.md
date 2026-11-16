---
id: 20261031-165052-feature-0177-release-cut-now-to-changelog
feature: 0177
title: Plan de implementación — El corte saca lo hecho de Now al changelog, sin changelog de cliente ni email
spec: ./spec.md
status: approved
created: 2026-10-31
---

# Plan de implementación — El corte saca lo hecho de Now al changelog

## Decisiones que he tomado yo — valida estas

1. Modelo: las tres tasks las hace la sesión (Native). La revisión final de rama va con Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native; el motivo está en la línea `Ejecución`.
3. `references/notas-y-roadmap.md` pasa a `references/release-notes.md`; `versionado.md` y `retro.md` conservan el nombre: un renombrado de más no paga nada, y `versionado.md` lo cita la capacidad.
4. Los escenarios nuevos del molde son `i` (sin `CHANGELOG.md`) y `j` (2.x que para), y el molde `a` gana en el GREEN el id ya nombrado en `[Unreleased]`, en un `a2` aparte para no ensuciar `a`.
5. Riesgo alto: un sujeto del GREEN escribe la entrada del cierre porque `add-to-changelog` siga pareciendo del cierre; lo mide `h`.
6. Coste: ~3 h y ~8 $ restantes, sujetos en serie.
7. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: que `sdd-end-release` corte desde Now en la forma 3.0.0, que los cierres dejen de escribir el changelog en esa forma y que desaparezcan el changelog de cliente y el email.

**Architecture**: solo texto de skills y plantillas: sin verbo nuevo en la CLI, que ya avisa de lo que caduca. La skill apoya el corte en `sdd roadmap check`, ejecutado tras sellar.

**Tech Stack**: skills en Markdown, Vitest en `cli/test/kit/` y sujetos headless sobre `tests/headless/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks de texto con poca interfaz entre ellas, un error lo caza el sujeto de su frente y la revisión final, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y plantillas, sin módulo, dependencia ni contrato nuevos entre módulos.

## Restricciones globales

### De código

- Art. III: `sdd-end-release` y `add-to-changelog` en inglés; le dicen al agente que hable con el usuario en su idioma. Los literales que el usuario o la CLI leen siguen en castellano (`smoke:`, `caducada`, `🧪 validación diferida a`).
- Saldo de palabras, con el conteo de `word-budget.test.ts`: `sdd-end-release/SKILL.md` ≤ 2.040; `sdd-end-release` total ≤ 2.608; `add-to-changelog` ≤ 403; `sdd-archive/SKILL.md` ≤ 4.613. Ningún tope sube.
- Art. X si se toca un test: sin comentarios que repitan el código ni que citen documentos, nombres en inglés, funciones ≤ 20 líneas.
- Migraciones pasadas y artefactos de `specs/`: no se tocan.

### De proceso

- Sujetos: `MODEL=sonnet`, `MAX_PARALLEL=1`, `SUBJECT_CAP=32`, `COST_CAP=24`, `RUNS_DIR=.temp/0177/r`, kit copiado sin `.docs/` ni `tests/` con `skills`, `.claude-plugin`, `agents`, `cli` sin `node_modules` y `hooks`.
- Sin commits ni la base mientras corre una tanda.
- Commit: tipo y scope en inglés, título y cuerpo en castellano; atribución de la sesión.

## Review Focus

- Una fila 🧪 cuyo disparador no es esta release → entra en el changelog si no estaba, y sigue en Now con su disparador, sin que el corte pregunte por ella · Task 1, sujeto `a` (texto de la skill).
- Now sin ninguna fila ✅ ni 🧪 y `[Unreleased]` vacío → el corte dice que no hay nada que publicar y para · Task 1, lectura del paso de scope; sin sujeto.
- Fila ✅ de un cambio sin artefacto en `changes/` ni `specs/` → es evidencia faltante del gate de entrada, decide el usuario · Task 1, conservado del gate actual; sin sujeto nuevo (`e-1` lo mostró).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin CLI nueva.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Brownfield gate**: 2.x sigue cerrando con `sdd-archive`; solo el corte exige 3.0.0, por la decisión aprobada.
- [x] **Constitution check**: Art. I (previsión en la spec), III, V (el corte sigue haciendo bump y la migración v3.0.0 no cambia), VIII.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-end-release/references/release-notes.md` — receta de las release notes.
- `tests/sdd-end-release-0177-green.md` — evidencia RED y GREEN.

**Modificar**:

- `skills/sdd-end-release/SKILL.md`, `references/versionado.md`, `references/retro.md` — en inglés, el corte nuevo.
- `skills/add-to-changelog/SKILL.md` — la invoca el corte.
- `skills/sdd-archive/SKILL.md`, `references/records.md`; `skills/sdd-start-feature/SKILL.md` (paso 7), `references/nombrado.md`, `references/commit-milestones.md` — sin entrada al cerrar en 3.0.0.
- `skills/sdd-templates/SKILL.md`, `templates/changelog-template.md`, `templates/release-notes-template.md`, `skills/using-sdd/SKILL.md`, `.docs/workflow/greenfield.md`.
- `red/subject.mjs` de esta spec — escenarios `a2`, `i` y `j`.

**Borrar**:

- `skills/sdd-end-release/references/notas-y-roadmap.md`, `skills/sdd-templates/templates/client-changelog-template.md`.

**NO se tocan**:

- `skills/sdd-upgrade/references/migrations/*` — historia; la decisión 10 de la spec.
- `cli/src/` — el validador ya avisa de lo que caduca.
- `skills/sdd-roadmap/SKILL.md` — sigue proponiendo la caducidad en un triaje; no es el corte.

### 1.6 Dependencias

Nada nuevo. La 0206 retira `sdd-start-feature` más tarde: lo que aquí cambia en ella se mueve con ella.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un cierre no escribe entrada y tampoco deja fila | baja | alto | Requisito `archive` y sujeto `h` |
| La reescritura pierde una regla del gate o del atajo | media | alto | Control `f` y lista de reglas conservadas en la Task 1 |

### 1.8 Rollout

Directo: va en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `sdd-end-release` corta desde Now

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · el RED ya medido en `red/out/` (`a-1`, `b-1`, `c-1`, `f-1`, `e-2`).
**Superficies**: tooling · docs
**Verificación**: `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts` desde `cli/` → `Tests  N passed (N)`; sujetos `a`, `a2`, `b`, `c`, `d`, `f`, `i`, `j`.
**Interfaces**:
- Consume: `sdd roadmap check --path .docs/sdd`, con sus avisos `caduca` y `sale en el corte`.
- Produce: `add-to-changelog` es invocada por el corte con una fila de Now; la línea `smoke:` va bajo la cabecera de la versión.

**Ficheros**: `skills/sdd-end-release/SKILL.md`, `references/release-notes.md` (nuevo), `references/versionado.md`, `references/retro.md`; borrar `references/notas-y-roadmap.md`; `red/subject.mjs`.

- [ ] **Step 1: Escenarios** — en `red/subject.mjs`: `a2`, como `a` con `- **0012** — Exportar reservas.` ya en `[Unreleased]`; `i`, como `a` sin `CHANGELOG.md` y con la 0016 «Tras» `0012`; `j`, solo `.docs/sdd/roadmap.md` 2.x con `## Próximo`, sin `ROADMAP.md`.
- [ ] **Step 2: Reescritura** — pasos, en este orden: forma (2.x para y ofrece `sdd-upgrade`); scope y versión desde ✅ y 🧪 de Now (nada que publicar: lo dice y para); smoke y diferidas (las 🧪 cuyo disparador es esta release y, en el primer corte tras migrar, las `validaciones pendientes:` del `roadmap.md` borrado en git); changelog (una línea por fila con `add-to-changelog`, sin repetir un id ya nombrado en `[Unreleased]` ni en una versión sellada; categoría del artefacto; sellado; línea `smoke:`); Now (salen ✅ y 🧪 validadas; las 🧪 no validadas se quedan con disparador nuevo y adenda; rescatada no validada gana fila con brief; título a `## Now`); deuda (`sdd roadmap check` tras sellar, «En espera» avisada a «Descartadas» con `caducada` y fecha del corte, «Descartadas» avisada sale, prefijo `**[… saldada …]**` sale de «Lista»); release notes con `hasRecipient: true`, sin email; validador en `Roadmap válido`; bump, merge y tag. Sin `CHANGELOG.md`: mensaje del tag y «Tras» a `—`.
- [ ] **Step 3: Reglas que se conservan literalmente en su sentido** — gate de entrada (evidencia faltante, trabajo a medias, suite o CI en el sha, usuario ausente), pregunta de `hasRecipient`, atajo de tres condiciones, tag anotado en el merge commit y merge de vuelta, feedback a `sdd-roadmap`, retro opcional, tracker con tickets, y sus red flags y racionalizaciones que no hablen del colapso ni del email.
- [ ] **Step 4: Verificación** — lanzar los sujetos, leer en disco `CHANGELOG.md`, `ROADMAP.md`, `debt.md` y `releases/`.
- [ ] **Step 5: Commit de la task** — `feat(sdd-end-release): cortar desde Now y caducar la deuda, sin email`.

### Task 2 — Los cierres dejan el changelog al corte

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `h-1` de `red/out/`.
**Superficies**: docs
**Verificación**: `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts` desde `cli/` → `Tests  N passed (N)`; sujeto `h`, más el tramo de 3 sujetos de `tests/batteries/sdd-archive`.
**Interfaces**:
- Consume: `add-to-changelog` invocada por el corte.
- Produce: fila en Now con brief para todo cambio cerrado.

**Ficheros**: `skills/add-to-changelog/SKILL.md`, `skills/sdd-archive/SKILL.md`, `references/records.md`, `skills/sdd-start-feature/SKILL.md`, `references/nombrado.md`, `references/commit-milestones.md`.

- [ ] **Step 1: `add-to-changelog`** — en inglés; invocada por el corte en 3.0.0 y por el cierre en 2.x; recibe la tabla de categorías del patch (`Fixed` fallo, `Changed` ajuste de presentación, `Added` o `Changed` petición cerrada, `Removed` retirada); enlace `.docs/sdd/changes/<carpeta>/` o `.docs/sdd/specs/<carpeta>/`; sin «changelog de cliente».
- [ ] **Step 2: Cierres** — `sdd-archive` paso 4: «Changelog» solo con `.docs/sdd/changelog.md`, y una frase: con `ROADMAP.md` `CHANGELOG.md` no se toca. `records.md`, «Roadmap 3.0.0»: un cambio sin fila gana una en Now con su brief. `sdd-start-feature` paso 7, `nombrado.md` y `commit-milestones.md`: el borrador de entrada solo en 2.x.
- [ ] **Step 3: Verificación** — sujeto `h`: `CHANGELOG.md` sin cambios y fila 0021 ✅; batería.
- [ ] **Step 4: Commit de la task** — `feat(sdd-archive): dejar el changelog al corte en la forma 3.0.0`.

### Task 3 — Fuera el changelog de cliente y el email

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `c-1` de `red/out/`.
**Superficies**: docs
**Verificación**: `git grep -nE 'client-changelog|changelog de cliente|email de entrega' -- skills .docs/workflow ':!skills/sdd-upgrade/references/migrations'` → sin salida; `npx vitest run test/kit/` desde `cli/` → `Tests  N passed (N)`; sujeto `c` y controles `e`, `g`.
**Interfaces**:
- Consume: nada.
- Produce: nada.

**Ficheros**: `skills/sdd-templates/SKILL.md`, `templates/client-changelog-template.md` (borrar), `templates/release-notes-template.md`, `templates/changelog-template.md`, `skills/using-sdd/SKILL.md`, `.docs/workflow/greenfield.md`.

- [ ] **Step 1: Retirada** — borrar la plantilla y su fila; quitar la frase del email de `release-notes-template.md`; `changelog-template.md`: «`sdd-end-release` añade las entradas y sella» (y en 2.x, el cierre); `greenfield.md:31` sin `client-changelog.md`.
- [ ] **Step 2: Verificación** — grep y Vitest; sujetos.
- [ ] **Step 3: Commit de la task** — `refactor(sdd-templates): retirar el changelog de cliente y el email`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 3 h
- Base de la estimación: 3 tasks, 8-13 sujetos por tanda en serie; reescritura de una skill con su RED ya medido.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- «El corte saca lo hecho de Now al changelog», las líneas, Now, categoría y validador → Task 1, sujeto `a`, en `CHANGELOG.md` y `ROADMAP.md`. ✓
- «Una fila validada en un corte posterior sale sin otra entrada» → Task 1, sujeto `a2` para el id ya nombrado; la 🧪 del corte siguiente, solo por el texto de la skill y la revisión. ⚠
- «Sin changelog, el mensaje del tag nombra lo publicado» → Task 1, sujeto `i`; el mensaje del tag se lee de lo que prepara, porque el merge queda sin ejecutar. ✓
- «El corte caduca la deuda en espera», sus tres cláusulas → Task 1, sujeto `b`, en `debt.md`; `[1.3.1]` ya lo prueba `roadmap.md`, capacidad vigente. ✓
- «El corte saca de “Lista” lo saldado» → Task 1, sujeto `d`. ✓
- «El primer corte rescata las validaciones pendientes» → Task 1, sujeto `d`; «en el corte siguiente no se busca», por el texto de la skill. ⚠
- «Solo se corta en la forma 3.0.0» → Task 1, sujeto `j`. ✓
- «Sin changelog de cliente ni email» → Task 3, sujeto `c` y grep. ✓
- «Sin destinatario no hay release notes» → Task 1, sujeto `a`. ✓
- MODIFIED de `release-flow`: opcional y versión → sujeto `a`; tracker y retro → texto de la skill, sin sujeto. ⚠
- MODIFIED de la línea de smoke → sujeto `a`, en `CHANGELOG.md`. ✓
- «Con `ROADMAP.md`, el cierre no escribe el changelog» → Task 2, sujeto `h`; 2.x → batería. ✓
- MODIFIED de `onboarding` → Task 3, `git grep` y `skills.test.ts`. ✓
- Review Focus → Task 1, sujeto `a` y lectura. ✓
