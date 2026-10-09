---
id: 20261009-082930-feature-0162-validation-panel-spike
feature: 0162
title: Plan de implementación — Spike: panel de validación inyectado con Claude in Chrome
spec: ./spec.md
status: approved
created: 2026-10-09
---

# Plan de implementación — Spike: panel de validación inyectado con Claude in Chrome

## Decisiones que he tomado yo — valida estas

1. **Modelo por task**: las tres en el hilo principal (Native). Las medidas necesitan las herramientas de Claude in Chrome de esta sesión y al dev-lead probando a mano, así que un subagente no puede medirlas.
2. **Ejecución**: Native (ver la línea Ejecución).
3. **Revisor final**: `sdd-kit:effort-high` + `opus`. Contrasta `research.md` con la evidencia de `probe/evidence/`: cada objetivo queda como medido, no medido o no cumple, y la recomendación solo cita lo medido.
4. **Tasks con «Evidencia» en vez de tests RED** (forma de spike de la propuesta 0131). Un objetivo sin evidencia guardada queda como «no medido».
5. **El panel es un único `probe/panel.js` autocontenido**: una función que recibe la lista de pruebas, pinta el panel y guarda el estado en `localStorage` bajo la clave `sdd-validation-panel`. Claude lo inyecta con `javascript_tool` y lee el estado con otro `javascript_tool`. Sin dependencias.
6. **La hora de cada marca la pone el panel** (`markedAt`, ISO), para cruzar cada KO con la consola y la red del momento.
7. **Riesgo alto**: Claude in Chrome no está conectado a esta sesión de Orca o le falta el permiso del sitio. Si pasa, la Task 1 lo registra con el error literal y se para a preguntarte: sin navegador no hay spike.
8. **Coste estimado**: ~2,5 h de reloj, casi todo esperando tus pruebas, más un revisor final (~100k tokens).
9. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: medir los cinco objetivos de la spec con una app real y dejar `research.md` con la evidencia, las alternativas y la recomendación.

**Architecture**: Claude in Chrome navega a la URL que da el dev-lead, inyecta `probe/panel.js` y lee el estado de `localStorage`. La consola y la red se leen con `read_console_messages` y `read_network_requests`, y la captura con `computer` (screenshot) o `gif_creator`. Las medidas se guardan como Markdown en `probe/evidence/`.

**Tech Stack**: Claude in Chrome (extensión y MCP `claude-in-chrome`), JavaScript del navegador sin dependencias, app Angular del dev-lead (enmendado en la spec: app Vite + React desechable que levanta Claude).

**Spec**: `./spec.md`

**Ejecución**: native, porque las tres tasks usan las herramientas del navegador de esta sesión y necesitan al dev-lead en el bucle. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- El panel es código desechable del spike: vive solo en `probe/` de esta carpeta, nunca en `skills/` ni en `cli/`.
- La URL de la app es un parámetro que da el dev-lead; ningún fichero fija `localhost:4200` ni otro puerto.
- Sin nombres de empresa ni de personas en los artefactos.
- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Native: el hilo ejecuta las tres tasks; solo el revisor final es un subagente.
- Esperar al «listo» es terminar el turno, sin sondear el navegador.
- Commits: tipo y scope en inglés, título y cuerpo en castellano, con la línea `Co-Authored-By` de la sesión.

## Review Focus

- La app de Angular recarga en caliente (HMR de `ng serve`) mientras el dev prueba → el panel desaparece como en un F5; la tabla de O2 lo cuenta como una recarga más · Task 2, evidencia `o2-reloads.md`
- La redirección sale a otro origen (un login SSO externo) → el estado sigue en el `localStorage` del origen de la app y se recupera al volver; si no se recupera, se anota como fallo · Task 2, `o2-reloads.md`
- El CSS de la app tapa o hereda estilos del panel → el panel se ve encima (z-index máximo) y legible; captura en la evidencia · Task 1, `o1-read.md`
- Una petición fallida antes de inyectar el panel → no se atribuye a ningún KO; solo cuenta la red desde la hora de la marca anterior · Task 2, `o3-ko-context.md`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un fichero JS sin dependencias y evidencia en Markdown.
- [x] **YAGNI gate**: sin abstracciones; el panel no se reutiliza fuera del spike.
- [x] **Constitution check**: no toca skills (Art. I no aplica), Art. III en los textos y Art. X en `panel.js`.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `probe/panel.js` — panel desechable: `window.sddValidationPanel = { mount(tests), read(), clear() }`.
- `probe/evidence/o1-read.md` — O1, O4 y el entorno de O5.
- `probe/evidence/o2-reloads.md` — la tabla de 10 recargas y la redirección.
- `probe/evidence/o3-ko-context.md` — el KO con su captura, consola y red.
- `research.md` — la plantilla de `sdd-templates`, con el resultado de cada objetivo, la comparación, la recomendación, el plan B y la lista para Mac.
- `tasks.md` — el registro vivo.

**Modificar**: `.docs/sdd/roadmap.md` — fila 0162, al cerrar.

**NO se tocan**: `skills/`, `cli/` y las plantillas, que no se tocan en el spike.

### 1.6 Dependencias

La extensión Claude in Chrome conectada a la sesión, con permiso sobre el origen de la app. La app la levanta el dev-lead (enmendado en la spec: la levanta Claude, desechable).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Claude in Chrome no conecta desde Orca | media | bloquea | error literal en `o1-read.md` y parada al dev-lead |
| La CSP de la app bloquea la inyección | baja | alto | se anota; `javascript_tool` corre por la extensión y no por un `<script>` inline |
| La captura no se puede guardar en disco | media | medio | se anota en O3 como «solo en la conversación» |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Panel inyectado, lectura sin copiar y espera sin tokens (O1, O4, O5 en Windows)

**Modelo**: hilo principal (Native).
**Evidencia**: `probe/evidence/o1-read.md`, en lugar de tests RED.
**Superficies**: docs.
**Verificación**: `node --check .docs/sdd/specs/20261009-082930-feature-0162-validation-panel-spike/probe/panel.js`
**Se prueba en la aplicación**: el dev-lead ve el panel flotante en su app con 3 pruebas, marca 2 OK y 1 KO con comentario y dice «listo».

**Interfaces**:
- Consume: nada.
- Produce: `window.sddValidationPanel.mount(tests: {id: string, title: string}[]): void`, `read(): {id, title, status: 'pending'|'ok'|'ko', comment: string, markedAt: string|null}[]` y `clear(): void`. El estado se guarda en `localStorage['sdd-validation-panel']`.

**Ficheros**: crear `probe/panel.js` y `probe/evidence/o1-read.md`.

- [ ] **Step 1**: comprobar que el navegador está conectado (`list_connected_browsers`, `tabs_context_mcp`) y apuntar en `o1-read.md` el navegador, la versión de la extensión y que la sesión corre en Orca sobre Windows 11.
- [ ] **Step 2**: escribir `panel.js` (si `localStorage` ya tiene estado, `mount` lo recupera) y pedir la URL al dev-lead.
- [ ] **Step 3**: navegar, inyectar con 3 pruebas, comprobar con `read()` que están en `pending` y capturar el panel.
- [ ] **Step 4**: anotar el uso de la sesión y terminar el turno: el dev prueba ≥ 5 min y escribe «listo». Volver a anotar el uso (O4).
- [ ] **Step 5**: leer con `read()` y escribir en `o1-read.md` las 3 pruebas leídas, si el dev pegó algo (debe ser no) y la diferencia de tokens.
- [ ] **Step 6: Commit**.

### Task 2 — Aguante a recargas y redirección, KO con contexto (O2, O3)

**Modelo**: hilo principal (Native).
**Evidencia**: `probe/evidence/o2-reloads.md` y `probe/evidence/o3-ko-context.md`.
**Superficies**: docs.
**Verificación**: `node --check .docs/sdd/specs/20261009-082930-feature-0162-validation-panel-spike/probe/panel.js`
**Se prueba en la aplicación**: el dev-lead hace 10 F5 y una redirección con el panel marcado, y marca un KO tras provocar un error.

**Interfaces**:
- Consume: `window.sddValidationPanel` y `localStorage['sdd-validation-panel']` de la Task 1.
- Produce: nada.

**Ficheros**: crear las dos evidencias; modificar `probe/panel.js` solo si la reinyección lo pide.

- [ ] **Step 1**: tabla de O2 con columnas `# · tipo (F5 | redirección) · panel visible sin reinyectar · estado en localStorage · reinyectado`. Después de cada recarga, comprobar con `javascript_tool` si `#sdd-validation-panel` existe y si el estado sigue. Si no existe, reinyectar con `mount` y comprobar que recupera el estado.
- [ ] **Step 2**: O3. El dev provoca un error (consola o petición 4xx/5xx), marca KO y dice «listo». Leer `read()`, `read_console_messages` (solo errores) y `read_network_requests` (solo ≥ 400), filtrados desde la `markedAt` de la marca anterior, y capturar. Anotar si la captura queda en disco y en qué ruta, o si solo queda en la conversación.
- [ ] **Step 3: Commit**.

### Task 3 — research.md: resultado, alternativas, recomendación y Mac

**Modelo**: hilo principal (Native).
**Evidencia**: `research.md`, que cita cada fichero de `probe/evidence/`.
**Superficies**: docs.
**Verificación**: `node cli/bin/sdd.js roadmap check --path .docs/sdd`
**Se prueba en la aplicación**: no, porque es el documento de la respuesta.

**Interfaces**:
- Consume: las tres evidencias.
- Produce: `research.md`.

- [ ] **Step 1**: calcar `research-template.md`. §1 es la pregunta de la spec. Añadir una tabla de objetivos O1-O5 con valor medido, no medido o no cumple, y el enlace a la evidencia.
- [ ] **Step 2**: §2, tres opciones: A, Claude in Chrome con el panel inyectado; B, una extensión de Chrome propia que lee una lista de puertos (riesgos: la política de Chrome gestionada de la empresa y el código fuera del plugin); C, una página local servida por la CLI `sdd` que escribe los resultados en un fichero. Pros, contras y coste de cada una, sobre el papel.
- [ ] **Step 3**: §3, la recomendación (solo con lo medido) y el plan B. §4 enlaza la rama y `probe/`. Lista numerada de comprobaciones para Claude Desktop en Mac.
- [ ] **Step 4: Commit**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5h
- Estimación de implementación: 2h (rango 1,5–3h)
- Base de la estimación: 3 tasks, la mayor parte esperando las pruebas manuales del dev-lead; la incertidumbre es la conexión de Claude in Chrome desde Orca.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre: `node cli/bin/sdd.js roadmap check --path .docs/sdd` y `node --check` de `probe/panel.js` (el spike no toca código del kit).
- [ ] Cada objetivo O1-O5 tiene su fila en `research.md` con su evidencia o «no medido».
- [ ] Cierre con `sdd-end-feature` (validación en campo).

---

## 4. Self-review (cobertura spec → tasks)

- O1 → Task 1. ✓
- O2 → Task 2. ✓
- O3 → Task 2. ✓
- O4 → Task 1. ✓
- O5 Windows → Task 1; lista para Mac → Task 3. ✓
- Alternativas, recomendación y plan B → Task 3. ✓
- Review Focus HMR y SSO → Task 2; CSS → Task 1; red anterior → Task 2. ✓
