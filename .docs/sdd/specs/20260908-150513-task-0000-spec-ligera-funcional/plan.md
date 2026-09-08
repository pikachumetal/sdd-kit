---
id: 20260908-150513-task-0000-spec-ligera-funcional
task: 0000
title: Plan de implementación — Spec ligera y funcional/ vivo
spec: ./spec.md
status: approved
created: 2026-09-08
approved_at: 2026-09-08
---

# Plan de implementación — Spec ligera y `funcional/` vivo

**Goal**: sustituir la plantilla de spec por la ligera (decisiones · Intent/Scope/Approach · delta · aprobaciones), crear `funcional/` por capacidad con su plantilla y su paso de fusión en `sdd-end-task`, y renombrar `funcional.md` → `funcional/` en todo el kit — escribiendo en las skills solo la guidance que el RED reclame.

**Architecture**: dos plantillas nuevas **por despacho** (la spec ya aprobada es su brief y su primer ejemplar), en paralelo con un RED sobre las tres skills cuya conducta se mide (`sdd-end-task` fusiona, `sdd-consult` lee `funcional/`, `sdd-init-brownfield` no vuelca). El rename de convención se aplica en todo caso (Art. IV). Lo técnico que sale de la spec entra en `plan-template.md`. GREEN + A/B en una tanda. Cierre con **dogfooding real**: `sdd-end-task` fusiona el delta de esta spec en `funcional/flujo-de-task.md` del kit — el primer fichero de capacidad del kit lo escribe el paso que esta task introduce.

**Tech Stack**: Markdown puro. Subagentes Sonnet sobre fixtures desechables. Evidencia verificada en disco.

**Spec**: `./spec.md`

## Restricciones globales

Copiadas de la spec y la constitution. Toda task las hereda; **quien despacha las incluye en el encargo**.

- **Regla de contenido de la spec**: si la implementación puede cambiar sin cambiar el comportamiento observable, no va en `spec.md`; va en `plan.md`.
- **Una capacidad es un sustantivo del dominio** (`pedidos`, `flujo-de-task`), nunca un ticket ni una task. Crear una capacidad se declara en "Decisiones a validar" de la spec que la crea. `sdd-end-task` fusiona, nunca crea capacidades no declaradas.
- **Un requisito vive en una sola capacidad**; otra lo enlaza.
- **Brownfield no vuelca `funcional/`**; greenfield la crea vacía.
- **Política de modelos** (Art. IV): modelo y effort explícitos; gama media como suelo; sujetos de campaña Sonnet/medium.
- **Ejecución**: default agente. Las tasks de medición van en línea (sujetos ≠ implementadores); las ediciones de skill van en línea (decisión Art. I línea a línea); las plantillas van por agente.
- **Skill bajo test entregada por lectura del fichero del working tree**; `superpowers` la resuelve el harness; prompt neutro; n=1 no es veredicto.
- Art. I — guidance que el baseline ya cumple no se escribe. Art. VIII — plantillas solo en `skills/sdd-templates/templates/`. Art. III/VI — castellano con tildes, commits por heredoc.

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: lo simple sería reescribir las plantillas y las skills sin RED. Rechazado: Art. I para las skills; para las plantillas el propio Art. II dice que un fallo de forma se resuelve con receta/contrato, y eso es la plantilla — pero su *uso* por las skills sí se mide.
- [ ] **YAGNI gate**: sin índice de capacidades; sin migrar specs antiguas; sin `funcional/` en Alybo.
- [ ] **Brownfield gate**: las specs ya escritas siguen siendo válidas; ninguna skill cambia de nombre ni de `description`.
- [ ] **Constitution check** (recibido de la spec): Art. I (RED/A/B), II (receta para la forma), IV (rename de convención con spec dedicada: esta), VII (dogfooding: `funcional/flujo-de-task.md` del kit), VIII (plantillas en su única fuente), IX (mapeo por conceptos desde OpenSpec, no se copia layout).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/templates/spec-template.md` — **reescrita entera** (cuatro bloques).
- `skills/sdd-templates/templates/funcional-template.md` — forma de un fichero de capacidad.
- `.docs/sdd/funcional/flujo-de-task.md` — primera capacidad del kit, escrita **por el paso de fusión** al cerrar esta task, no a mano.
- `tests/spec-ligera-red.md`, `tests/spec-ligera-green.md`.

**Modificar**:

- `skills/sdd-templates/templates/plan-template.md` — recibe §UX, §Dependencias, §Riesgos, §Rollout y §Excepciones a la constitution (el constitution check ya lo tiene en Phase -1).
- `skills/sdd-templates/SKILL.md` — filas de `spec-template` (descripción nueva) y `funcional-template`.
- `skills/sdd-start-task/SKILL.md` — paso 4: el gate presenta primero "Decisiones a validar"; `references/modo-lite.md`: la spec lite es la misma plantilla con el bloque de estimación.
- `skills/sdd-end-task/SKILL.md` — paso nuevo entre `walkthrough.md` y `tasks.md`: fusionar el delta en `funcional/`.
- `skills/sdd-consult/SKILL.md` — paso 1: `funcional/<capacidad>` para preguntas de comportamiento.
- `skills/sdd-init-greenfield/SKILL.md` + `references/estructura.md`, `skills/sdd-init-brownfield/references/generacion.md`, `skills/sdd-end-release/references/acta-y-retro.md`, `skills/sdd-templates/templates/feedback-template.md`, `.docs/sdd/mission.md` — rename `funcional.md` → `funcional/`.
- `tests/sdd-start-task-ab.md`, `sdd-end-task-ab.md`, `sdd-consult-ab.md`, `sdd-init-greenfield-ab.md`, `sdd-init-brownfield-ab.md`, `sdd-end-release-ab.md` — sección de no-regresión.
- `.docs/sdd/architecture.md`, `roadmap.md`.

**NO se tocan**:

- Las specs ya escritas en `.docs/sdd/specs/` (registro histórico).
- `walkthrough-template.md` (decisión 7 de la spec).
- La `description` de ninguna skill.

### 1.2 Riesgos *(recibidos de la spec)*

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Proliferación de capacidades ("sin dios") | Media | Alto | Cinco reglas en Restricciones globales y en la plantilla: sustantivo del dominio, creación declarada en la spec, fusión nunca crea, sin volcado, un requisito en un sitio. El GREEN mide que `sdd-end-task` no crea capacidades no declaradas |
| La spec ligera pierde algo que la de 11 secciones capturaba | Media | Medio | Lo que sale va a `plan-template.md` (riesgos, rollout); el constitution check ya estaba en el plan. Nada se borra, se recoloca |
| La fusión de `MODIFIED` sustituye mal un requisito | Media | Medio | La plantilla de capacidad da a cada requisito un título estable; `MODIFIED (antes: …)` lo cita literal. El GREEN lo mide con una fixture que ya tiene la capacidad |
| Las specs antiguas y las nuevas conviven y confunden | Baja | Bajo | El frontmatter y la primera sección las distinguen a simple vista; no se migran |

### 1.3 Rollout *(recibido de la spec)*

Directo, local-only. A partir de esta task toda spec nueva del kit y de los proyectos consumidores usa la plantilla ligera; las existentes no se tocan.

---

## 2. Tasks

### Task 1 — Campaña RED

**Modelo**: Sonnet, effort medium (sujetos).
**Ejecución**: en línea — medición.

**Ficheros**: crear `tests/spec-ligera-red.md`; fixture "Bookline-fn" en el scratchpad.

- [ ] **Step 1: Fixture.** Copia del molde Bookline con: `.docs/sdd/funcional/pedidos.md` (capacidad existente, en el formato de la plantilla nueva: dos requisitos con escenarios, títulos estables); una task `0000-filtro-estado` con `spec.md` **en formato ligero** cuyo delta trae un `ADDED` (filtro por estado) y un `MODIFIED (antes: …)` sobre uno de los dos requisitos de `pedidos`, implementada y con `walkthrough.md` pendiente; y `sdd-end-task`, `sdd-consult`, `sdd-init-brownfield` **vigentes**.
- [ ] **Step 2: Escenarios.**

  | Id | Skill vigente | Petición | Qué mide |
  | --- | --- | --- | --- |
  | E1 | `sdd-end-task` | «Cierra la task del filtro por estado.» | ¿Fusiona el delta en `funcional/pedidos.md` (ADDED añadido, MODIFIED sustituido)? ¿Crea algún fichero de capacidad no declarado? |
  | E2 | `sdd-consult` | «¿Qué hace hoy el listado de pedidos con el estado?» | ¿Responde desde `funcional/pedidos.md` o reconstruye desde specs/código? |
  | E3 | `sdd-init-brownfield` | «Déjalo preparado para SDD.» (repo sin `.docs/sdd/`) | ¿Crea `funcional.md` (convención vieja), vuelca `funcional/`, o no crea nada? |
  | E4 | ninguna (baseline sin skill), con la **plantilla nueva** disponible | «Escribe la spec del filtro por estado.» | ¿La plantilla basta para que el bloque de decisiones vaya primero y el delta lleve escenarios? (Art. II: la forma la da la receta) |

- [ ] **Step 3: Correr** los cuatro (un `Workflow`). E4 necesita la plantilla de la Task 2 terminada: si aún no está, E4 corre en la Task 4 como GREEN-de-forma.
- [ ] **Step 4: Verificar en disco**: contenido de `funcional/pedidos.md` antes/después (diff), ficheros nuevos en `funcional/`, texto de la respuesta de E2, existencia de `funcional.md` en E3.
- [ ] **Step 5: Escribir `tests/spec-ligera-red.md`.**
- [ ] **Step 6: Commit** — `test(skills): RED de la spec ligera y la fusión en funcional/`.

### Task 2 — Plantillas `spec-template.md` y `funcional-template.md`

**Modelo**: Sonnet, effort medium — redacción a partir de una spec cerrada y un ejemplar real.
*(Ejecución: agente, el default. Un despacho con los dos ficheros: son el mismo contrato visto desde dos lados.)*

**Ficheros**: reescribir `spec-template.md`; crear `funcional-template.md`; modificar `plan-template.md` y `skills/sdd-templates/SKILL.md`.

- [ ] **Step 1: Despachar** con: (1) dónde encaja; (2) brief = la spec de esta task íntegra (es el ejemplar) + su §"Decisiones" 1-4 como reglas + las plantillas hermanas como patrón de forma; (3) Restricciones globales de este plan; (4) los dos ficheros a producir y el contrato de cada uno: `spec-template.md` con frontmatter (id, task, title, mode, status, created, author, approvers), los cuatro bloques, bloque de estimación marcado *(solo lite)*, y la regla de contenido como bloque de ayuda; `funcional-template.md` con cabecera de capacidad, un requisito de ejemplo con título estable y escenarios GIVEN/WHEN/THEN, y las cinco reglas anti-proliferación como bloque de ayuda; (5) informe: secciones de cada fichero y líneas.
- [ ] **Step 2: Revisar** (task review): la spec de esta task debe poder reescribirse con la plantilla sin perder nada; la plantilla de capacidad debe soportar `MODIFIED (antes: …)` por título estable.
- [ ] **Step 3: En línea — `plan-template.md`**: añadir tras §1.4 las secciones `### 1.5 UX`, `### 1.6 Dependencias`, `### 1.7 Riesgos` (tabla), `### 1.8 Rollout` y `### 1.9 Excepciones a la constitution`, con bloque de ayuda «recibido de la spec ligera, que ya no lo lleva». *(Corregido tras el code-review del cierre: la primera versión solo añadió Riesgos y Rollout y perdió UX, Dependencias y Excepciones.)* `skills/sdd-templates/SKILL.md`: descripción nueva de `spec-template` («decisiones a validar · Intent/Scope/Approach · delta por capacidad · aprobaciones») y fila de `funcional-template` («`funcional/<capacidad>.md` — verdad viva del comportamiento; la crea la spec que declara la capacidad, la fusiona `sdd-end-task`»).
- [ ] **Step 4: Commit** — `feat(templates): spec ligera y plantilla de capacidad`.

### Task 3 — Guidance reclamada por el RED + rename de convención

**Modelo**: ninguno.
**Ejecución**: en línea — decisiones Art. I línea a línea; el rename es mecánico pero toca siete sitios con contexto distinto.

- [ ] **Step 1: Rename `funcional.md` → `funcional/`** en los siete sitios (`grep -rn "funcional" skills/ .docs/sdd/mission.md`), adaptando cada frase: `sdd-start-task` paso 1 «+ `funcional/` si existe»; `sdd-consult` paso 1 «`funcional/<capacidad>`»; `init-greenfield` `estructura.md` «`funcional/` (vacía; una capacidad por fichero, las crean las tasks)» y paso 6; `init-brownfield` `generacion.md` «`funcional/` NO se crea: aparece con la primera task»; `end-release` `acta-y-retro.md` «el dueño actualiza `funcional/<capacidad>`»; `feedback-template.md`; `mission.md` glosario. Se escribe en todo caso: es Art. IV, no guidance nueva.
- [x] ~~**Step 2: `sdd-end-task`~~ **NO SE EJECUTA** (E1 3/3: el baseline fusiona el delta sin paso que lo nombre; Art. I). Registrado en `tests/spec-ligera-red.md`. Texto original: ** *(si E1 falla)* — insertar como paso 1-bis, tras `walkthrough.md`: «**Fusionar el delta en `funcional/`** — cada `ADDED` se añade a `funcional/<capacidad>.md`, cada `MODIFIED (antes: …)` sustituye el requisito con ese título, cada `REMOVED` lo quita. **Nunca crees una capacidad que la spec no declare** en "Decisiones a validar". Sin delta → no aplica y se dice.»
- [x] ~~**Step 3: `sdd-consult`~~ **NO SE EJECUTA** (E2: el baseline lee la capacidad y detecta que está desfasada sin tocarla; Art. I). Registrado en `tests/spec-ligera-red.md`. Texto original: ** *(si E2 falla)* — en el paso 1: «una pregunta de comportamiento ("¿qué hace hoy…?") lee `funcional/<capacidad>.md` antes que las specs o el código: es la verdad viva».
- [x] ~~**Step 4: `sdd-init-brownfield`~~ **NO SE EJECUTA** (E3: el baseline no vuelca ni crea `funcional.md`; Art. I). Registrado en `tests/spec-ligera-red.md`. Texto original: ** *(si E3 falla creando o volcando)* — ya cubierto por el rename del Step 1 si la frase «NO se crea» basta; si el RED muestra volcado pese a ella, se añade la fila de racionalización con su frase textual.
- [ ] **Step 5: `sdd-start-task` paso 4** — «`spec.md` calcando `spec-template.md`: el gate presenta **primero el bloque "Decisiones que he tomado yo — valida estas"**». Es forma (Art. II): se escribe con la plantilla.
- [ ] **Step 6: Verificación** — gates ⛔ y racionalizaciones intactos; `grep -rn "funcional\.md" skills/ .docs/sdd/*.md` vacío.
- [ ] **Step 7: Commit** — `feat(skills): fusión del delta en funcional/ y rename de la convención`.

### Task 4 — GREEN + A/B

**Modelo**: Sonnet, effort medium (sujetos).
**Ejecución**: en línea — medición.

- [ ] **Step 1: GREEN** — E1, E2, E3 con las skills editadas; E4 con la plantilla si no corrió en el RED.
- [ ] **Step 2: A/B** — control = commit anterior a la Task 3, tratamiento = HEAD, sobre los escenarios de cada `-ab.md`: `sdd-start-task` (A, B, L, E5), `sdd-end-task` (task 104), `sdd-consult` (S1, S2, S3), `sdd-init-greenfield` (Bidly), `sdd-init-brownfield` (Ledgerly derivas), `sdd-end-release` (cierre v0.2.0).
- [ ] **Step 3: Verificar en disco**; bisecar y repetir donde haya diferencia.
- [ ] **Step 4: Evidencia** — `tests/spec-ligera-green.md` y las seis secciones `-ab.md`.
- [ ] **Step 5: Commit** — `test(skills): GREEN de la spec ligera y no-regresión de las seis skills editadas`.

### Task 5 — Cierre documental y dogfooding

**Modelo**: ninguno.
**Ejecución**: en línea.

- [ ] **Step 1: Roadmap** — T5 con el resultado; `architecture.md` — `funcional/` en la estructura del repo y en la anatomía de la evidencia si procede.
- [ ] **Step 2: Dogfooding** — al cerrar esta task con `sdd-end-task`, el paso de fusión nuevo escribe `.docs/sdd/funcional/flujo-de-task.md` desde el delta de esta spec. **No se escribe a mano antes**: si el paso no lo produce, el paso está mal.
- [ ] **Step 3: Verificación** — `funcional/flujo-de-task.md` contiene los siete requisitos del delta con sus escenarios; `ls .docs/sdd/funcional/` muestra exactamente un fichero.
- [ ] **Step 4: Commit** — `docs(sdd): T5 cerrada; primera capacidad del kit en funcional/`.

---

## Estimación y esfuerzo

- Tipo: docs
- Estimación de implementación: **1,5 h** (rango 1–2,5)
- Base de la estimación: 5 tasks, una fixture (20 min presupuestados), ~4 runs RED + ~14 GREEN/A/B, dos plantillas por despacho con revisión (10 min), siete renames con contexto (20 min), ocho ficheros de evidencia. **Corrección del sesgo de T3/T4**: se estima el **reloj**, no la suma — Task 2 corre en paralelo con Task 1, y el montaje del A/B durante ambas. T4, de forma parecida, cerró en ~0,4 h; aquí hay más ficheros de evidencia y más renames, de ahí el margen.
- Confianza: media

---

## 3. Validación final

- [ ] Sin build: frontmatter válido, enlaces resolviendo, `grep funcional\.md` vacío.
- [ ] Los 7 requisitos del delta de la spec verificados: cada uno tiene su escenario en RED/GREEN o su receta en plantilla.
- [ ] `funcional/flujo-de-task.md` producido por el paso de fusión, no a mano.
- [ ] Cierre por `sdd-end-task`.

---

## 4. Self-review (delta → tasks)

- "La spec presenta primero las decisiones" → Task 2 (plantilla) + Task 3 Step 5; medido en E4. ✓
- "El delta declara el comportamiento por capacidad" → Task 2 (plantilla); medido en E4. ✓
- "Lo técnico no vive en la spec" → Task 2 Step 3 (`plan-template` recibe riesgos y rollout). ✓
- "El cierre fusiona el delta" → Task 3 Step 2; medido en E1 y en el dogfooding de Task 5. ✓
- "Brownfield no vuelca" → Task 3 Steps 1 y 4; medido en E3. ✓
- "Los docs nombran `funcional/`" → Task 3 Step 1. ✓
- "La consulta lee la capacidad" → Task 3 Step 3; medido en E2. ✓
- Decisión 6 (kit estrena `funcional/`) → Task 5 Step 2. ✓ · Decisión 7 (walkthrough intacto) → §1.1 NO se tocan. ✓
