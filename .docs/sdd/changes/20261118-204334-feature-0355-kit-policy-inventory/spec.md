---
id: 20261118-204334-feature-0355-kit-policy-inventory
feature: 0355
title: Spike — inventario del texto del kit que es política de cada proyecto
mode: spike
profile: delegate
status: approved
created: 2026-11-18
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-18
---

# Spec — Spike: inventario del texto del kit que es política de cada proyecto

🦆 Hoy el kit le dice a cada proyecto cómo escribir sus E2E, cuánto puede tardar su suite, cuántos retries lleva, cómo es el guion de validación o con qué verifica la pantalla, aunque cada proyecto lo decide a su manera: `document-manager` ya tiene su propia skill de guion y le iba mejor. Este spike barre las 24 skills, sus referencias y plantillas, lee por sección lo que nombra un marcador, y apunta cada trozo que dicta una regla del proyecto en vez de leerla de lo que el proyecto declara. Para cada trozo dice si se queda en el kit, si sale a una skill del proyecto que el kit carga cuando existe, o si sale al template del proyecto, con su motivo y sus palabras: por ejemplo, `writing-e2e.md` (999 palabras) de `sdd-tdd`. Al final, `research.md` suma lo que saldría de cada skill y propone en qué versiones cortarlo; no se retira nada: eso lo decides tú después.

Validación: agente — la salida es un documento y sus recuentos, que el agente mide; con `validation.mode: field`, la verificación es la tabla y la comprobación de sus sumas.

## Capacidades

- Ninguna, porque investigación.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: ninguna, por carril — `sdd-propose` la pide en full y lite; un spike sin delta no la lleva (como la 0299; la 0341 la tuvo por petición del dev-lead).

1. **Enfoque: A, barrido con marcadores más índice de encabezados de cada fichero, y lectura de lo que nombra un marcador (entero, por sección o por contexto, decisión 8), frente a B y C (ver Approach).**
2. **Qué es una pieza**: el bloque más pequeño con un solo destino, normalmente una sección `##` o `###`, una regla numerada, un campo de plantilla o una fila de una tabla de racionalizaciones. Un bloque que mezcla enganche y política se parte en dos filas: la línea que lee lo que el proyecto declara se queda y la regla sale.
3. **Criterio de frontera**, de las decisiones de la fila: **se queda** lo común a todos los proyectos (flujo, TDD sin niveles como el de superpowers, artefactos, ids, roadmap, que el cierre corra la gate del proyecto, el ciclo de vida de los tests de la 0349) y todo lo que **lee** algo que el proyecto declara y actúa según su valor; **sale** lo que **dicta** un valor, una herramienta, un formato o un procedimiento que cada proyecto decide a su manera (un runner, un tope de minutos, unos retries, cómo se escribe un E2E, cómo es el guion).
4. **Dónde va lo que sale**, entre los dos destinos de la fila:
   - **Skill del proyecto** que el kit carga si existe: un procedimiento que el agente sigue en un paso del flujo (cómo escribir un E2E, el guion de validación, los pasos de verificar una pantalla). Modelo: `.claude/skills/validation-script/SKILL.md` de `document-manager`.
   - **Template** (`sdd-project-template`): un valor o un campo que el proyecto declara, o un check que corre su gate (el presupuesto E2E, los retries, el test de títulos). El kit se queda solo con el nombre del campo que lee.
   - Cada fila dice además el **enganche** que dejaría en el kit (p. ej. «si existe la skill `<nombre>` del proyecto, cárgala en este paso»), con sus palabras estimadas, para dar el neto. El enganche es solo esa línea, sin reglas de reserva: sin la skill o el campo, el kit no dicta nada (decisión del dev-lead). El coste, un proyecto sin template que se queda sin guía hasta escribir la suya, va en `research.md` por corte. `sdd-project-template` ya siembra una skill `e2e` en sus dos plantillas (`templates/angular-dotnet/.claude/skills/e2e`, `templates/react-dotnet/.claude/skills/e2e`): el inventario la contrasta con `writing-e2e.md`.
5. **Cómo encuentra el kit la skill del proyecto** no se decide aquí: `research.md` propone una forma (un campo en `operations.md` que la nombra, o un nombre fijo en `.claude/skills/`) con lo que cuesta cada una, y lo decide el dev-lead.
6. **Las palabras**, con el conteo de `cli/test/kit/word-budget.test.ts`: `text.split(/\s+/).filter(Boolean).length` sobre `dist/skills/`, sin `migrations/`, en un script `.mjs` dentro de la carpeta del spike; la suma por skill es la de su tope `total` (las plantillas cuentan en `sdd-templates`). Cada fila da sus palabras; `research.md` da por skill: palabras hoy, lo que saldría, lo que entraría en enganches y el neto.
7. **Marcadores del barrido** (insensibles a mayúsculas, sobre `dist/skills/` sin `migrations/`): `E2E`, `end-to-end`, `Playwright`, `Flujos core`, `Títulos heredados`, `Presupuesto`, `Retries`, `Timeouts`, `flaky`, `stress`, `estrés`, `repeat-each`, `validation`, `validación`, `guion`, `script`, `§Frontend`, `impeccable`, `screenshot`, `captura`, `Acceso a la aplicación`, `Entorno de la suite`, `Datos`, `critical-path`, `Camino crítico`, `coverage`, `cobertura`, `lint`. El script guarda los aciertos por fichero en la carpeta del spike.
8. **Qué se lee**:
   - **Enteros**: los seis de la fila (`sdd-tdd/references/writing-e2e.md`, `sdd-archive/references/e2e-suite.md`, los campos E2E de `operations-template.md`, la sección «E2E tests» de `sdd-verify/references/code-reviewer-prompt.md`, `sdd-archive/references/dev-validation.md`, `sdd-implement/references/frontend-verification.md`) y los dos de la decisión 10.
   - **Por sección**, en cada otro fichero con un acierto de un **marcador fuerte** (todos los de la decisión 7 salvo los débiles `script`, `Datos`, `coverage`, `cobertura` y `lint`): la sección del encabezado más cercano por encima del acierto, hasta el siguiente encabezado de su mismo nivel o superior. Un acierto antes del primer encabezado lee el frontmatter y el preámbulo enteros.
   - **Por contexto**, en un fichero con solo aciertos de marcadores débiles: ±3 líneas de cada acierto.
   - De los demás, su índice de encabezados, para ver si alguna sección dicta algo sin nombrar un marcador.
   - `measure.mjs sweep` calcula esos rangos y escribe un manifiesto (`out/reading.tsv`: fichero, modo, rangos), y la lectura sigue el manifiesto: así todo acierto fuerte cae en un rango leído por construcción, y las cifras de la decisión 11 salen de él.
9. **Propuesta de corte por versiones**: agrupa las filas que salen por dependencia (lo que necesita antes el campo del template o el enganche) y por SemVer del Art. V: un corte que obliga a un proyecto a cambiar algo para seguir trabajando es mayor. Lo que vive ya en `sdd-project-template` (contrato de la 0349, decisión 2) va antes.
10. **`validation-template.md` y `validation-modes.md`** entran en el inventario con el guion: son la forma del guion que hoy dicta el kit.
10 bis. **Alcance del barrido** (decisión del dev-lead): a fondo, pieza a pieza, solo el terreno de la fila (tests no unitarios, E2E, camino crítico, guion de validación, verificación de frontend). Del resto de terrenos donde el kit dicta algo que un proyecto podría decidir (formato del changelog, forma de las notas de release, método de estimación, topes de `CLAUDE.md`/`AGENTS.md`, forma de los commits, y los que salgan del índice de encabezados), una fila por terreno con sus ficheros y sus palabras, sin destino por pieza: dice si merece otro spike.
10 ter. **También a fondo, pieza a pieza** (enmienda del dev-lead): `sdd-end-release` con sus referencias, y las reglas de cómo filtrar la gate (`sdd-archive/references/closing-suite.md`, «Running a gate» de `sdd-verify`, la gate con filtro de `sdd-worktrees`, los campos «Lo afectado» y «Gate de cierre» de `operations-template.md`). Destinos ya decididos: la suite completa de la release sale del kit sin enganche (si un proyecto la quiere, va en su skill de release); el versionado, el merge y el tag salen a una skill de release del proyecto; las notas de release, `release.hasRecipient` y todo lo dirigido al cliente salen del kit (nacieron para un proyecto concreto: si otro los quiere, van en su skill de release); el changelog (sellar y una línea por fila que sale de Now, con `add-to-changelog`), Now, las validaciones diferidas, la deuda y la retro se quedan; las reglas de filtrado de la gate salen al template. Evidencia de campo: `document-manager`, `feature/0702-limpieza-tests` (`9926def2b` «retirar la selección de E2E, el presupuesto y test-changed», `818686632` «solo el camino crítico») y el testimonio del dev-lead; superpowers corre la suite entera al cerrar la rama (`finishing-a-development-branch`, Step 1), OpenSpec guarda su release en una skill de su repo (`.agents/skills/release-openspec/`) y ninguna fuente distribuye roadmap, changelog ni release.
11. **Límite declarado en `research.md`**: el barrido encuentra lo que nombra un marcador o un encabezado; una regla de proyecto escondida en prosa sin marcador, o en una sección sin acierto fuerte de un fichero leído por contexto, puede quedar fuera. Se dice con las cifras del manifiesto: ficheros leídos enteros, por sección y por contexto, los que solo se indexaron, frente a los 100, y las palabras leídas frente a las 102.745.
- Repaso de coherencia: sin delta, no hay `sdd capability merge`; nada retirado (`git grep 0355` fuera de `changes/`: solo `ROADMAP.md`); los ficheros citados existen y la sección «E2E tests» de `code-reviewer-prompt.md` está en la línea 88, con «Project E2E» en la 19. El script de conteo va en la carpeta del spike, además de `research.md` que nombra la fila: es su evidencia.
- Política de modelos (solo en `delegate`): sin revisores de la spec · sin subagentes: el barrido, la lectura y la tabla los hace esta sesión · ejes de la revisión final: según el plan.

### Hallazgos de la review de la enmienda (sonnet, effort medium)

- **Aceptado** — (1) la spec seguía `approved` con la enmienda sin aprobar → `status: in-review` hasta que el dev-lead la aprobó.
- **Aceptado** — (2) la decisión 1 decía «lectura entera» → reescrita.
- **Aceptado** — (3) `validation`, `validación`, `screenshot` y `captura` eran débiles y son del terreno → pasan a fuertes; débiles solo `script`, `Datos`, `coverage`, `cobertura` y `lint` (51 ficheros con acierto fuerte, 74.194 palabras de fichero entero).
- **Aceptado** — (4) nada comprobaba la cobertura de la lectura → manifiesto `out/reading.tsv` calculado por el script (decisión 8).
- **Aceptado** — (5) la sección era ambigua con encabezados anidados o sin encabezado → encabezado más cercano por encima; frontmatter y preámbulo enteros.
- **Aceptado** — (6) O1 bis se mezclaba en las sumas → tabla aparte, fuera de O2.
- **Aceptado** — (7) palabras a ojo → las calcula el script por rango; el enganche se marca como estimación.
- **Aceptado** — (8) el 🦆 prometía leer todo → «barre… lee por sección».
- **Aceptado** — (9) cifras de la decisión 11 → del manifiesto.
- **Rechazado** — (10) nombrar `document-manager` → lo nombra el dev-lead en la petición como referencia, y es un proyecto del propio equipo.

### Decisiones tomadas con el dev-lead

- Alcance: el terreno de la fila a fondo y una fila por terreno del resto — opción «3» (2026-11-18).
- Sin skill ni campo del proyecto, el kit no dicta nada: el enganche es una línea, sin reglas de reserva — opción «1» (2026-11-18).
- `sdd-end-release` y las reglas de filtrado de la gate, a fondo; la suite de release sale sin enganche — «lo de superpowers lo quitamos porque era correr una hora de test»; «allí hemos tenido que hacer limpieza de test 3 veces. además los test corriendo suite completa NUNCA encontró nada, eso sí falsos positivos» (2026-11-18).
- El changelog se queda en el kit — «el changelog lo mantendría porque es donde pasamos lo que sale de roadmap» (2026-11-18).
- De la release, solo el changelog; lo del cliente sale — «solo el changelog porque todo eso de hablar con el cliente y tal fue al principio con un proyecto concreto que estábamos probando, eso sí que no tiene cabida en el kit» (2026-11-18).

## Forma spike

- **Pregunta**: ¿qué texto de las skills del kit dicta una regla que cada proyecto decide a su manera, adónde va cada trozo y cuántas palabras saca de cada skill?
- **Objetivos**:
  - O1 — en el terreno de la fila, una fila por pieza con fichero y sección, destino (se queda · skill del proyecto · template), motivo en una frase, palabras y enganche estimado; cero piezas sin destino.
  - O2 — tabla por skill, solo con las piezas de O1: palabras hoy (las del tope `total`), las que salen, las que entran en enganches y el neto; las sumas cuadran con las filas (lo comprueba el script).
  - O1 bis — del resto de terrenos, una fila por terreno con ficheros y palabras, en tabla aparte: no entra en las sumas de O2.
  - Las palabras de cada pieza las calcula el script desde su rango de líneas; el enganche es una estimación a ojo y la tabla lo marca así.
  - O3 — propuesta de corte por versiones, con lo que cada corte pide a los proyectos y su nivel SemVer.
- **Decisión que desbloquea**: qué retira el dev-lead del kit, adónde lo mueve y en qué versión.

## Approach

- A: barrido con marcadores y el índice de encabezados de cada fichero, lectura entera de los seis de la fila, por sección donde hay un marcador fuerte y por contexto donde solo hay débiles, y conteo con un script — cubre las 24 skills por lo que nombran y por su estructura; lo leído entero es una parte, y una regla escondida sin marcador puede escapar (límite declarado, decisión 11).
- B: leer las 24 skills enteras en esta sesión (100 ficheros, 102.745 palabras) — no deja fuera nada, pero el contexto se compacta a mitad y la tabla se escribe con el principio olvidado.
- C: solo los seis ficheros de la fila — barato, pero la fila pide skill por skill y dejaría fuera lo que se repite en otras skills (el eje Código de `sdd-verify`, el brief del implementador).
- Elegido: A — cubre el kit entero a un coste que cabe en una sesión, y su hueco se nombra.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada: el spike solo escribe en su carpeta de `.docs/sdd/changes/` | — | — |

- Filas que implementa: 0355 → `ROADMAP.md` (su estado lo marca el cierre) | comprobado con `git grep -n 0355 -- . ':!.docs/sdd/changes'`.
- Una pieza entra, otra sale (Art. I): no entra nada en las skills ni sale nada en esta rama; lo que sale lo decide el dev-lead tras el spike, como dice la fila.

## Términos y ADR

- Términos resueltos: **enganche** — texto del kit que lee lo que el proyecto declara y actúa según ello; **política** — texto del kit que dicta lo que cada proyecto decide; **pieza** — el bloque más pequeño con un solo destino.
- ADR candidatas: ninguna en el spike; la frontera enganche/política la escribe como ADR la feature que retire la primera pieza.

## Enmiendas

- 2026-11-18 — Decisión 8, decisión 11 y Approach A: lectura por sección (marcador fuerte) y por contexto (solo débiles) en vez de entera para todo fichero con acierto — el barrido dio 76 ficheros con acierto y 96.245 de 102.745 palabras: leerlos enteros es el enfoque B que la spec descarta; con marcador fuerte quedan 51 ficheros (74.194 palabras de fichero entero), de los que solo se leen las secciones con acierto; manifiesto calculado por el script — Task 1 — aprobada: «si el changelog lo mantendría porque es donde pasamos lo que sale de roadmap», junto con la decisión 10 ter

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-18 | aprobada (opción «Apruebo») |
| Àngel Delgado | 2026-11-18 | enmienda aprobada: «si el changelog lo mantendría porque es donde pasamos lo que sale de roadmap» |
