---
id: 20260928-210002-feature-0098-visual-patch-lane
feature: 0098
title: Plan de implementación — El carril patch acepta ajustes visuales
spec: ./spec.md
status: approved
created: 2026-09-28
---

# Plan de implementación — El carril patch acepta ajustes visuales

## Decisiones que he tomado yo — valida estas

1. **Dos tasks, no tres.** La Task 1 cubre las puertas: `using-sdd`, el paso 2 de `sdd-start-feature`, la `description` y el árbol de `sdd-start-patch`, más el glosario de `mission.md` y la frase del roadmap. La Task 2 cubre el recorrido y el cierre: el paso 1 y los pasos 3 y 4 de `sdd-start-patch`, los pasos 0 y 3 de `sdd-end-patch` y `patch-template.md`. Los dos ficheros de docs van con la Task 1, cuyo cambio los hace falsos. Separarlos en otra task sería una task sin test propio.
2. **Ejecución Native.** Las dos tasks son texto de skills que el hilo escribe contra su propia campaña RED, y la campaña la orquesta el hilo en cualquier método. Un implementador subagente no ahorra nada y pagaría el contexto dos veces.
3. **Modelos**: los sujetos van en Sonnet (`MODEL=sonnet`, el default del lanzador). El revisor final de rama va con `subagent_type: sdd-kit:effort-high` + `model: opus`. No hay más despachos.
4. **RED en dos capas.**
   - Un Pester estático, `tests/VisualPatch.Tests.ps1`, que el hilo escribe antes del texto. Fija los literales del predicado en cada puerta, `Changed` en el cierre y el §2 de la plantilla.
   - La campaña de sujetos, que mide la conducta.

   El Pester no sustituye a la campaña. Evita que una puerta se quede con el predicado a medias (decisión 6 de la spec).
5. **Que los sujetos no se encallen** (condición de la aprobación):
   - `MAX_TURNS=25` en los escenarios de puerta (v1, v2, c1, c2) y `40` en los de recorrido (f1, f2, k1).
   - Tope de reloj de 12 min por sujeto: el `subject.sh` define una función `claude` que envuelve la real con `timeout 720`. `subject_launch` llama a `claude` por nombre, así que no hace falta tocar `lib.sh`.
   - Cada petición cierra de antemano las dudas de alcance y dice el perfil, para que el sujeto no pare a preguntar (`AskUserQuestion` va bloqueada en el lanzador).
   - f1 y k1 llevan el paquete `playwright` ya instalado en el molde, con `node_modules` enlazado a una instalación única en el scratchpad y los navegadores de `%LOCALAPPDATA%\ms-playwright`: el sujeto no descarga nada.
   - f2 parte con la validación ya escrita en `patch.md` §4, para que el paso 0 no pare a preguntar.
   - Cada tanda se lanza en segundo plano con su vigía de silencio sobre la salida de `run.sh`, con un máximo de 3 sujetos a la vez (`control.maxParallelAgents`).
   - Un sujeto que llega al tope cuenta como «sin llegar» en la evidencia y no se relanza a ciegas.
6. **Molde**: `ventas`, un proyecto de páginas estáticas: `pages/pedido-detalle.html` y `pages/albaran-detalle.html` con la cabecera `.ficha-cabecera` y los botones Guardar, Cancelar y Borrar, `styles/ficha.css`, `app.js` con el cálculo del total de la línea (en k1 lleva el bug: redondea antes de sumar el IVA), `.docs/sdd/` con `sdd-kit.json` en `delegate` y `ids.mode: sequence`, `changelog.md`, `roadmap.md` y `capabilities/`. Rama de integración `develop`.
7. **Coste**: el de la spec, 26 sujetos, ~16 $ y ~2,5 h, con techo de 32 sujetos o 22 $ (`SUBJECT_CAP=32`, `COST_CAP=22` en `run.sh`, que cuentan todas las fases de la carpeta). La implementación de texto es ~40 min. Revisor final: ~150k tokens de Opus.

**Goal**: que un ajuste solo de presentación entre por el patch con el predicado de la spec, se verifique con una captura y cierre como `Changed`, sin que la lógica o los textos se cuelen por ahí.

**Architecture**: cambios de texto en tres skills y una plantilla, con el mismo predicado literal en cada puerta. La evidencia es una campaña RED/GREEN sobre el lanzador de `tests/headless/` y un Pester estático que fija los literales.

**Tech Stack**: skills en Markdown, Pester 5 y PowerShell 7 para el test estático, y Bash con `claude -p` para los sujetos (`tests/headless/run.sh`, `lib.sh`).

**Spec**: `./spec.md`

**Ejecución**: native, porque las dos tasks son texto que el hilo escribe contra su propia campaña, y un implementador subagente no ahorra nada. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Predicado, literal en cada puerta (spec, decisión 1). Un ajuste es de presentación si el cambio solo toca ficheros de plantilla (`.html`, `.component.html`, `.razor`, `.cshtml`…) o de estilos (CSS, SCSS, LESS). En las plantillas solo mueve, envuelve o cambia la clase de elementos: no añade, quita ni cambia bindings, directivas de control (`@if`, `*ngIf`, `v-if`, `@for`), manejadores de eventos, texto visible ni claves de i18n. No toca TypeScript ni otro código, API, datos ni capacidades. Si falla una, es feature.
- Contraejemplo, literal: «solo toco la plantilla» no vale si la plantilla gana un `@if`: eso es lógica aunque no haya TypeScript.
- Texto humano en castellano con ortografía correcta (Art. III); nombres de fichero en inglés kebab-case.
- La `description` de una skill solo dice cuándo usarla, nunca resume el flujo (architecture.md, Anatomía, punto 1).
- Art. X, literal:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en cada despacho, `fable` y `opus xhigh` prohibidos, y revisor final de Native con `sdd-kit:effort-high` + `opus`.
- Sujetos: `SUPERPOWERS_DIR` con la caché de superpowers 6.4.2, `SPEC_DIR` en ruta absoluta y `KIT_DIR` como `git archive` del commit medido. Las tandas van en serie, de 3 en 3 como máximo.
- Commits bilingües (Art. VI), con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin carril ni prefijo nuevo; es una rama del paso 1 del patch.
- [x] **YAGNI gate**: sin scripts nuevos; el único código es un Pester de literales.
- [x] **Constitution check**: Art. I (RED antes, previsión declarada), Art. II (predicado con contraejemplo), Art. VIII (se toca la plantilla fuente, sin copias).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/VisualPatch.Tests.ps1`: literales del predicado y del cierre.
- `tests/visual-patch-red.md` y `tests/visual-patch-green.md`: la evidencia narrada.
- `.docs/sdd/specs/20260928-210002-feature-0098-visual-patch-lane/red/` y `green/`: `mold.sh`, `subject.sh` y `out/`.

**Modificar**:

- `skills/using-sdd/SKILL.md`, `skills/sdd-start-feature/SKILL.md` (paso 2), `skills/sdd-start-patch/SKILL.md`, `skills/sdd-end-patch/SKILL.md` y `skills/sdd-templates/templates/patch-template.md`.
- `.docs/sdd/mission.md` (glosario) y `.docs/sdd/roadmap.md` (orden 5 de «Versión siguiente»).

**NO se tocan**:

- `skills/sdd-consult/SKILL.md`, `skills/sdd-start-feature/references/overrides-superpowers.md` y `skills/add-to-changelog/SKILL.md`: spec, decisión 7.
- `tests/headless/lib.sh` y `run.sh`: el tope de reloj va en el `subject.sh` de la campaña.
- El paso 6 de `sdd-start-feature`, que es del patch del orden 5.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un sujeto se encalla (espera, descarga, bucle) | media | coste y reloj | los topes de la decisión 5 y el vigía sobre cada tanda |
| El RED de c1 o c2 ya sale limpio y el GREEN cae | media | la puerta nueva abre la trasera | c1 y c2 son filas de control en el GREEN, y el contraejemplo va literal |
| k1 regresa: un bug real se trata como visual | baja | se pierde la causa raíz | k1 en el GREEN y el árbol con la pregunta de presentación antes de la de determinismo |

### 1.8 Rollout

Directo: entra en `[Unreleased]` de la 2.0.1.

---

## 2. Tasks

### Task 1 — Las puertas admiten el ajuste solo de presentación

**Modelo**: hilo principal (Native). Los sujetos van en Sonnet por el lanzador.
**Tests RED**: hilo principal · `tests/VisualPatch.Tests.ps1`, bloque `Describe 'Puertas del patch visual'`, más la campaña RED de v1, v2, c1 y c2 con el kit de `HEAD` antes del cambio.
**Superficies**: docs (skills) · tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/VisualPatch.Tests.ps1 -Output Detailed"` y la campaña GREEN de v1, v2, c1 y c2 (`run.sh` con `PHASE=green`).
**Verificación lenta**: la campaña GREEN de la task (4 escenarios × 2 sujetos, ~25 min), en segundo plano con su vigía.

**Interfaces**:
- Consume: nada.
- Produce: el molde `red/mold.sh` (función `ventas_base`) y `red/subject.sh`, con los escenarios `v1 v2 c1 c2 f1 f2 k1`, que usa también la Task 2. En `tests/VisualPatch.Tests.ps1`, `Get-KitFile` y el patrón de literales `$script:PredicateLiterals`.

**Ficheros**: crear `tests/VisualPatch.Tests.ps1`, `red/mold.sh`, `red/subject.sh` y `tests/visual-patch-red.md`; modificar `skills/using-sdd/SKILL.md`, `skills/sdd-start-feature/SKILL.md`, `skills/sdd-start-patch/SKILL.md` (frontmatter `description`, Overview y árbol), `.docs/sdd/mission.md` y `.docs/sdd/roadmap.md`; crear `tests/visual-patch-green.md` (sección de la Task 1).

- [ ] **Step 1: Pester RED**, `tests/VisualPatch.Tests.ps1`:
  - `$script:PredicateLiterals = @('solo plantillas o estilos', '`@if`', 'claves de i18n', 'TypeScript', 'solo toco la plantilla')`.
  - `It 'la puerta de using-sdd lleva el predicado entero'`: cada literal `Should -Match ([regex]::Escape($_))` sobre `skills/using-sdd/SKILL.md`.
  - `It 'el paso 2 de sdd-start-feature lleva el predicado entero'`: los mismos literales, sobre el texto entre `2. **Enrutado**` y `3. **Branch**`.
  - `It 'el árbol de sdd-start-patch pregunta por la presentación'`: el bloque `dot` `Should -Match '¿Solo presentación'`.
  - `It 'la description de sdd-start-patch admite el ajuste visual'`: la línea `description:` `Should -Match 'solo de presentación'`.
  - Ejecutarlo. Esperado: 4 fallos.
- [ ] **Step 2: Molde y sujeto.** `red/mold.sh` con `ventas_base` (plan, decisión 6) y `red/subject.sh`, que carga `lib.sh` y define `claude() { timeout 720 command claude "$@"; }`. `MAX_TURNS` de 25 en v1, v2, c1 y c2, y de 40 en f1, f2 y k1. Peticiones:
  - v1 (hook, sin skill): «Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas (`pages/pedido-detalle.html` y `pages/albaran-detalle.html`); es solo maquetación. Trabajamos en delegate: decide tú el método y sigue.»
  - v2: `/sdd-kit:sdd-start-feature` más la petición de v1.
  - c1 (hook): «Oculta Borrar si el pedido está facturado y pásalo a la derecha, en las dos fichas. Trabajamos en delegate: decide tú el método y sigue.»
  - c2 (hook): «Cambia "Guardar" por "Guardar y cerrar" y ponlo a la derecha, en las dos fichas. Trabajamos en delegate: decide tú el método y sigue.»

  Un ensayo con `DRY_RUN=1` de un escenario: esperado `[v1-1] listo`, el molde con su propio `.git` y `.args` con `--setting-sources`.
- [ ] **Step 3: Campaña RED**, en segundo plano, con el vigía sobre su salida. Las tandas `v1 v2 c1` y `c2`, con `SUBJECT=1` y después `SUBJECT=2`; `KIT_DIR` es un `git archive` de `HEAD`. Se lee la primera línea `>>> Skill:` de cada `tools.txt`, si se crea `spec.md` y qué condición nombra el sujeto. `tests/visual-patch-red.md` queda con una fila por sujeto: turnos, $, puerta, cita y veredicto.
- [ ] **Step 4: Texto** dirigido a lo que falló, con el predicado literal de las Restricciones:
  - `using-sdd`: la fila de puertas del patch pasa a «Un fallo pequeño y reproducible, o un ajuste solo de presentación: …», con el predicado.
  - `sdd-start-feature` paso 2: la salida al patch añade el ajuste solo de presentación, con el predicado y el contraejemplo.
  - `sdd-start-patch`: la `description` («… o un ajuste solo de presentación: mover, alinear o reestilar sin tocar lógica, textos ni datos …»), el Overview y un diamante nuevo en el árbol, «¿Solo presentación (predicado)?», antes del de determinismo, que lleva a «PATCH visual: este flujo, paso 1 variante». Las racionalizaciones que salgan del RED van en la tabla.
  - `mission.md`: «bugs deterministas y ajustes solo de presentación».
  - `roadmap.md`, orden 5: «comparte con la 0098 `skills/sdd-start-feature/SKILL.md` (esta toca el paso 2, aquel el paso 6); van en serie».
- [ ] **Step 5: Verificación.** El Pester en verde y después el GREEN de v1, v2, c1 y c2, 2 sujetos cada uno, como Verificación lenta. Esperado: v1 y v2 en `sdd-start-patch` sin `spec.md`; c1 y c2 en `sdd-start-feature` nombrando el `@if` o el texto. Sección de la Task 1 en `tests/visual-patch-green.md`.
- [ ] **Step 6: Commit de la task**: `feat(sdd-start-patch): las puertas admiten el ajuste solo de presentación`, con el cuerpo en castellano.

### Task 2 — El patch visual se recorre con la intención y la captura, y cierra en `Changed`

**Modelo**: hilo principal (Native). Los sujetos van en Sonnet por el lanzador.
**Tests RED**: hilo principal · `tests/VisualPatch.Tests.ps1`, bloque `Describe 'Recorrido y cierre del patch visual'`, más la campaña RED de f1 y f2 con el kit de antes de esta task.
**Superficies**: docs (skills y plantilla) · tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/VisualPatch.Tests.ps1 -Output Detailed"` y la campaña GREEN de f1, f2 y k1.
**Verificación lenta**: la campaña GREEN de la task (3 escenarios × 2 sujetos, ~25 min), en segundo plano con su vigía.

**Interfaces**:
- Consume: de la Task 1, `red/subject.sh` con los escenarios `f1 f2 k1` y `ventas_base`; en el Pester, `Get-KitFile`.
- Produce: nada que use otra task.

**Ficheros**: modificar `skills/sdd-start-patch/SKILL.md` (paso 1, pasos 3 y 4, red flags y racionalizaciones), `skills/sdd-end-patch/SKILL.md` (pasos 0 y 3), `skills/sdd-templates/templates/patch-template.md` (§2 y §4), `tests/VisualPatch.Tests.ps1`, `tests/visual-patch-red.md` y `tests/visual-patch-green.md`.

- [ ] **Step 1: Pester RED**, nuevo `Describe`:
  - `It 'el paso 1 de sdd-start-patch tiene la variante de intención'`: `Should -Match 'intención en una frase'` y `Should -Match 'captura'`.
  - `It 'el cierre registra el ajuste visual como Changed'`: `skills/sdd-end-patch/SKILL.md` `Should -Match '`Changed`'`.
  - `It 'la plantilla admite la intención en §2'`: `patch-template.md` `Should -Match '## 2\. Causa raíz \(o intención, en un ajuste visual\)'` y sigue con `'## 5\. Tiempo'`.

  Ejecutarlo. Esperado: 3 fallos.
- [ ] **Step 2: Campaña RED de f1 y f2**, con el kit de `HEAD` (la Task 1 ya commiteada) y 2 sujetos cada uno. Peticiones:
  - f1: `/sdd-kit:sdd-start-patch` más la petición de v1, con `playwright` en el molde. Se mide si invoca `systematic-debugging`, qué pone en §2, si saca la captura con navegador y dónde la deja, y si la enseña o da su ruta al parar en la validación.
  - f2: `/sdd-kit:sdd-end-patch` sobre un molde con el patch visual hecho, §4 con `Validado: 2026-09-28 · «lo he visto en la captura y funciona»` y la petición «cierra el patch». Se mide la categoría del changelog.

  Una fila por sujeto en `tests/visual-patch-red.md`.
- [ ] **Step 3: Texto.**
  - `sdd-start-patch` paso 1: la variante, si el árbol dijo «solo presentación». Escribe la intención en una frase sacada de la petición y no invoca `systematic-debugging`. Si para escribirla hace falta decidir qué se mueve o adónde, es feature. Si al hacer el cambio cae una condición del predicado, para y pasa a feature.
  - Pasos 3 y 4: §2 con la intención; tras el fix, una captura por pantalla tocada en un navegador real (el MCP de Playwright o un script con el paquete `playwright`), guardada fuera de git, con su ruta en §4. Sin tests, y el build tiene que pasar.
  - `sdd-end-patch` paso 0: en un patch visual, la presentación da la ruta de cada captura. Paso 3: `Fixed`, o `Changed` si es un ajuste solo de presentación.
  - `patch-template.md`: §2 pasa a `## 2. Causa raíz (o intención, en un ajuste visual)`, con su ayuda, y §4 lleva una fila de ejemplo `captura de <pantalla> · <ruta fuera de git> · enseñada en la validación`.
- [ ] **Step 4: Verificación.** El Pester en verde y después el GREEN de f1, f2 y k1, 2 sujetos cada uno. Esperado:
  - f1: intención en §2, sin `systematic-debugging`, ruta de captura en §4.
  - f2: `Changed`.
  - k1: `systematic-debugging` con causa raíz, sin captura, y `Fixed` si llega al cierre.

  Si la campaña pasa del techo, paro y decides tú. Sección de la Task 2 en `tests/visual-patch-green.md`.
- [ ] **Step 5: Commit de la task**: `feat(sdd-start-patch): el patch visual se verifica con captura y cierra en Changed`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,6 h
- Estimación de implementación: 3,5 h (texto ~40 min, campaña ~2,5 h, revisión final y validación ~20 min)
- Base de la estimación: dos tasks de texto, y una campaña de 26 sujetos comparable a la de la 0095 (22 sujetos, 2,2 h reales en total).
- Confianza: media (lo que más varía es el reloj de los sujetos f1 y k1, que levantan un navegador)

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Minimal"` (la suite entera, con `Slow`).
- [ ] Los tres requisitos de `routing` de la spec, con su evidencia en `tests/visual-patch-green.md`.
- [ ] Revisor final de rama: `sdd-kit:effort-high` + `opus`.
- [ ] Cierre con `sdd-end-feature`.

---

## 4. Self-review (cobertura spec → tasks)

- «Un ajuste solo de presentación entra por el carril patch» → Task 1 (v1, v2, Pester de las puertas). ✓
- «Un cambio con lógica o textos no entra por el patch aunque sea pequeño» → Task 1 (c1, c2). La cláusula «si cae dentro de un patch visual, para» → Task 2, Step 3 (texto) y la revisión final: ningún escenario la provoca, y queda en el foco de la revisión. ✓
- «Un patch visual se verifica con una captura y se registra como `Changed`» → Task 2 (f1, f2); el AND del bug determinista → Task 2 (k1). ✓
- Decisiones 5, 8 y 9 de la spec (Scope ampliado, plantilla y mission) → Task 1 Step 4 y Task 2 Step 3. ✓
- Foco de la revisión final: la subida a feature a mitad de patch (sin escenario); que el predicado sea idéntico en las tres puertas (lo fija el Pester, pero no su sentido); que la `description` nueva no resuma el flujo.
