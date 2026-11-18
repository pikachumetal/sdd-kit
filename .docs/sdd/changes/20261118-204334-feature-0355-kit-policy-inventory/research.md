---
id: 20261118-204334-feature-0355-kit-policy-inventory
title: Research — texto del kit que es política de cada proyecto
spec: ./spec.md
status: done
created: 2026-11-18
timeboxed: 2h
---

# Research — texto del kit que es política de cada proyecto

## 1. Pregunta a resolver

¿Qué texto de las skills del kit dicta una regla que cada proyecto decide a su manera, adónde va cada trozo y cuántas palabras saca de cada skill?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — una fila por pieza del terreno de la fila, con destino, motivo, palabras y enganche; cero sin destino | cumple | 86 piezas: 29 se quedan, 32 salen a una skill del proyecto, 25 al template; `sin destino: 0 · solapes: 0` | `pieces.tsv`, `out/tables.md` («Piezas») |
| O1 bis — una fila por terreno del resto | cumple | 6 terrenos con ficheros y palabras, fuera de las sumas | `terrains.tsv`, `out/tables.md` («Otros terrenos») |
| O2 — por skill: hoy, sale, entra y neto; las sumas cuadran | cumple | salen 6.185 de 102.745 palabras (6 %), entran ~175 en enganches; `cuadra: sí` | `node measure.mjs table`, `out/tables.md` («Por skill») |
| O3 — corte por versiones con lo que pide cada corte y su SemVer | cumple | tres cortes, §4 | este documento |

**Método y límite** (decisiones 8 y 11 de la spec). `measure.mjs sweep` barre los 100 ficheros de `dist/skills/` sin `migrations/` y escribe el manifiesto `out/reading.tsv`. La salida de `node measure.mjs table`:

```
lectura: entero 12 · sección 10 · solo la línea del acierto 31 · contexto 25 · índice 22 · palabras leídas por sección o entero: 24523 de 102745
```

En 31 ficheros que el manifiesto mandaba leer por sección, todos los aciertos fuertes eran falsos positivos (la palabra genérica `validation` del paso de cierre, `stress-test`, `Timeouts` de despacho de agentes): se leyó la línea de cada acierto y no la sección (ruling del ledger, lista en `out/hit-lines-only.txt`). Una regla de proyecto escondida en prosa sin marcador, en una de esas secciones o en los 22 ficheros solo indexados, puede haber quedado fuera. La granularidad es la línea: una línea que mezcla lo que se queda y lo que sale lleva un solo destino, y el motivo lo dice (p. ej. el paso 1 de `sdd-end-release` lleva dentro `release.hasRecipient`, que sale, y cuenta como `queda`). Las palabras de cada pieza las calcula el script por rango; el enganche es una estimación a ojo.

**Lo que dice el campo**:

- Las fuentes que el kit sigue no distribuyen nada de esto. superpowers, OpenSpec, spec-kit y mattpocock-skills no llevan roadmap, changelog ni release en lo que instalan (`git grep` en `$SDD_UPSTREAM_DIR`, 2026-11-18). OpenSpec guarda su release en una skill de su propio repo, `.agents/skills/release-openspec/SKILL.md`: el patrón «skill del proyecto».
- superpowers corre la suite entera al cerrar la rama (`finishing-a-development-branch`, Step 1); el kit la sustituyó por la gate de cierre con filtro porque tardaba una hora (dev-lead), y la volvió a meter en el corte de la release.
- `document-manager` retiró a mano lo que el kit le dicta: `feature/0702-limpieza-tests`, `9926def2b` «retirar la selección de E2E, el presupuesto y test-changed» y `818686632` «solo el camino crítico», y otras dos limpiezas (0691, 0695). Según el dev-lead, la suite completa de la release nunca encontró nada y dio muchos falsos positivos (testimonio, sin registro de rojos en el repo).
- `sdd-project-template` ya siembra una skill `e2e` en sus dos plantillas, y `document-manager` tiene `validation-script`: los destinos «skill del proyecto» existen.

## 3. Aguante

No aplica: ningún objetivo es de rendimiento.

## 4. Recomendación

### Cómo encuentra el kit la skill del proyecto (decisión 5)

- **A — un campo en `operations.md`** que nombra cada skill (`- **Skill E2E**: e2e`, `- **Skill de guion**: validation-script`, `- **Skill de release**: release`). Cuesta tres campos en `operations-template.md` (~30 palabras) y que el template los rellene; el kit lee lo que el proyecto declara, como hace con «Gate de cierre», y las skills que ya existen (`e2e`, `validation-script`) no cambian de nombre.
- **B — un nombre fijo en `.claude/skills/`** (`sdd-e2e`, `sdd-validation-script`, `sdd-release`). Cero configuración, pero el kit vuelve a dictar algo al proyecto (el nombre), y la `e2e` del template y la `validation-script` de `document-manager` tendrían que renombrarse.
- **Elegida: A** · **Por qué**: es la frontera de la spec (el kit lee lo que el proyecto declara), y no obliga a tocar las dos skills que ya existen.

### Corte por versiones (decisión 9, SemVer del Art. V)

| Corte | Qué sale o entra | Palabras | Qué pide a los proyectos | SemVer |
| --- | --- | --- | --- | --- |
| A — la release sin cliente ni suite | Salen la suite verde del corte (`sdd-end-release` línea 22), las notas de release, `release.hasRecipient`, `release-notes-template.md` y sus menciones: 8 piezas | −482 | Nada para seguir trabajando: «cierra la release» sigue sellando el changelog y limpiando Now; un proyecto con `hasRecipient: true` deja de recibir las notas y, si las quiere, las pone en su skill de release. Sin dependencias: va primero | menor, salvo que algún proyecto viva de las notas (no lo he comprobado proyecto a proyecto) |
| B — los enganches | Entran el campo de skills del proyecto (forma A) y una línea en cada punto de carga: `sdd-tdd`, `sdd-archive` (guion, suite E2E), `sdd-implement` (verificación visual), `sdd-end-release` (versión, merge y tag); `sdd-project-template` añade `validation-script` y `release` a las suyas | +~175 | Nada: sin el campo, todo sigue como hoy | menor |
| C — la política fuera | Salen `writing-e2e.md`, `e2e-suite.md`, `dev-validation.md` y el guion de `validation-template.md`, los campos E2E y de filtrado de `operations-template.md` (con su pregunta en `sdd-init`), las reglas de filtrado de `closing-suite.md`, «Running a gate» y `sdd-worktrees`, la parte procedimental de `frontend-verification.md`, y el versionado, el merge y el tag de `sdd-end-release`: 49 piezas | −5.703 | Un proyecto sin template ni skills declaradas se queda sin guía E2E, sin guion de validación y sin tag en el corte hasta que escriba sus skills (decisión del dev-lead: sin skill, el kit no dicta nada); la migración retira los campos E2E de `operations.md` y avisa de qué skills declarar. Depende de B | mayor |

- El corte C solapa con la 0350, que ya retira «Flujos core» y «Títulos heredados»: conviene que la 0350 entre en C o que C la absorba, para no migrar dos veces los mismos campos.
- Lo que más pesa está en cuatro skills: `sdd-archive` (−1.477), `sdd-templates` (−1.072), `sdd-tdd` (−999, el 25 %) y `sdd-end-release` (−823, el 39 %).
- **Descartadas**: retirar todo en una sola versión mayor (sin B, un proyecto con template perdería la guía E2E el mismo día que la gana en su skill); dejar las reglas de reserva en el kit (decisión del dev-lead: sin skill no se dicta nada).

### Lo que no sale, y por qué

- El ciclo de vida de los tests (0349), el TDD sin niveles, la lectura de §Frontend y su detector, la gate de cierre tal como la declara el proyecto, el changelog, Now, las validaciones diferidas, la deuda y la retro se quedan: son las 29 piezas `queda` y todo lo que no es pieza.
- Los otros terrenos (tabla «Otros terrenos») son método del kit (commits, escritura de skills, retro, ticket) o ya condicionales (estimación con su predicado); el changelog se queda por decisión del dev-lead. Ninguno pide otro spike con lo medido.

## 5. Lo que sale

- Corte A → fila nueva del roadmap por abrir (lo decide el dev-lead).
- Corte B → fila nueva, con su contraparte en `sdd-project-template` (`validation-script` y `release`).
- Corte C → fila nueva, mayor, coordinada con la 0350.

## Anexo — tablas

Generadas por `node measure.mjs table` desde `pieces.tsv` y `terrains.tsv`; copia literal de `out/tables.md`.

### Por skill

| Skill | Hoy | Sale | Entra (enganche, estimado) | Neto | % que sale |
| --- | --- | --- | --- | --- | --- |
| sdd-archive | 9487 | 1477 | 55 | 8065 | 16 % |
| sdd-templates | 17419 | 1072 | 25 | 16372 | 6 % |
| sdd-tdd | 4033 | 999 | 25 | 3059 | 25 % |
| sdd-end-release | 2111 | 823 | 20 | 1308 | 39 % |
| sdd-implement | 6531 | 592 | 20 | 5959 | 9 % |
| sdd-verify | 9471 | 525 | 20 | 8966 | 6 % |
| sdd-init | 3202 | 396 | 10 | 2816 | 12 % |
| sdd-worktrees | 1448 | 96 | 0 | 1352 | 7 % |
| sdd-propose | 13760 | 95 | 0 | 13665 | 1 % |
| sdd-config | 1437 | 59 | 0 | 1378 | 4 % |
| sdd-roadmap | 3249 | 51 | 0 | 3198 | 2 % |
| **Kit (24 skills)** | 102745 | 6185 | 175 | 96735 | 6 % |

### Por destino

| Destino | Piezas | Palabras |
| --- | --- | --- |
| queda | 29 | 4077 |
| skill-proyecto | 32 | 3752 |
| template | 25 | 2433 |

### Piezas

| Skill | Fichero | Líneas | Destino | Motivo | Palabras | Enganche |
| --- | --- | --- | --- | --- | --- | --- |
| sdd-tdd | `references/writing-e2e.md` | 1-10 | skill-proyecto | Cuándo cargar la guía E2E y su porqué: cabecera de la skill `e2e` del proyecto, que el template ya siembra | 116 | 25 |
| sdd-tdd | `references/writing-e2e.md` | 11-20 | template | «Flujos core», «Títulos heredados» y el test de títulos: lista y check que declara el proyecto; con «Camino crítico» ya los sustituye `critical-path.md` del template | 274 | 0 |
| sdd-tdd | `references/writing-e2e.md` | 21-70 | skill-proyecto | Localizadores, esperas y foco: técnica de un runner concreto (Playwright), igual que la skill `e2e` del template | 332 | 0 |
| sdd-tdd | `references/writing-e2e.md` | 71-74 | skill-proyecto | Datos propios y usuario del agente por test: convención de la suite de cada proyecto | 66 | 0 |
| sdd-tdd | `references/writing-e2e.md` | 75-78 | template | Retries y timeouts con valores de Playwright: valores que fija el proyecto en su config y en `operations.md` | 67 | 0 |
| sdd-tdd | `references/writing-e2e.md` | 79-90 | skill-proyecto | Triaje de un test inestable con `--repeat-each` y `test.fixme`, y sus racionalizaciones: procedimiento del runner | 144 | 0 |
| sdd-archive | `references/e2e-suite.md` | 1-8 | skill-proyecto | Levantar el entorno de la suite E2E antes de cada pasada: depende del entorno de cada proyecto | 172 | 15 |
| sdd-archive | `references/e2e-suite.md` | 9-12 | queda | Correr la gate tal como la declara el proyecto, sin interruptores: es correr la gate del proyecto, lo común | 67 | 0 |
| sdd-archive | `references/e2e-suite.md` | 13-16 | skill-proyecto | Un fallo de conexión es primero el entorno: diagnóstico de la suite E2E de cada proyecto | 67 | 0 |
| sdd-archive | `references/e2e-suite.md` | 17-20 | template | «Presupuesto E2E» y su fila de deuda: un tope que fija el proyecto; `document-manager` lo retiró en la 0702 | 61 | 0 |
| sdd-archive | `references/e2e-suite.md` | 21-40 | skill-proyecto | La línea `Tanda:` de una pasada repetida y sus racionalizaciones: procedimiento de la suite E2E | 269 | 0 |
| sdd-archive | `references/dev-validation.md` | 1-37 | skill-proyecto | El guion de validación del dev (pasos, entorno, manos fuera, registro): `document-manager` lo resolvió mejor con su skill `validation-script` | 602 | 25 |
| sdd-implement | `references/frontend-verification.md` | 1-10 | queda | La frontera (el kit dice cuándo y qué evidencia; el proyecto, con qué) y los tres momentos del flujo | 116 | 0 |
| sdd-implement | `references/frontend-verification.md` | 11-16 | queda | Lee la URL y el Detector de §Frontend: enganche a lo que el proyecto declara | 58 | 0 |
| sdd-implement | `references/frontend-verification.md` | 17-18 | template | Viewports por defecto (1280x800, 390x844) y Playwright como runner: valores que el kit dicta si el proyecto no los da | 30 | 0 |
| sdd-implement | `references/frontend-verification.md` | 19-35 | queda | Lee Acceso, Temas, Referencia y Skills de apoyo; el criterio antes de tocar y no cerrar con un hallazgo del detector abierto: enganche y evidencia | 418 | 0 |
| sdd-implement | `references/frontend-verification.md` | 36-37 | skill-proyecto | Rúbrica de composición, 3 rondas, capturas fuera de git y recorrido de estados: procedimiento visual de cada proyecto | 128 | 20 |
| sdd-implement | `references/frontend-verification.md` | 38-48 | queda | Qué lleva la presentación y la proporción por carril: evidencia y carriles del kit | 151 | 0 |
| sdd-implement | `references/frontend-verification.md` | 49-57 | skill-proyecto | Medidas de estilo, entorno del usuario, sin suite nueva y cómo entrar con login o magic link: procedimiento de cada app | 274 | 0 |
| sdd-implement | `references/frontend-verification.md` | 58-63 | template | Sin §Frontend, proponer impeccable y Playwright: el kit dicta herramientas; con la decisión del dev-lead, sin campo no se dicta nada y §Frontend lo trae el template | 108 | 0 |
| sdd-implement | `references/frontend-verification.md` | 64-67 | skill-proyecto | Opinión sobre regresión de píxeles: decisión de herramientas de cada proyecto | 52 | 0 |
| sdd-templates | `templates/operations-template.md` | 1-14 | queda | Forma del documento y «Suites» con su nivel: el kit lee el nivel para el ciclo de vida de los tests (0349) | 156 | 0 |
| sdd-templates | `templates/operations-template.md` | 15-16 | template | «Lo afectado» y «Gate de cierre» con su receta (moon `--affected`, qué suites entran): cómo filtrar lo decide el proyecto; el kit se queda con el nombre del campo | 86 | 15 |
| sdd-templates | `templates/operations-template.md` | 17-17 | queda | «Gate de merge»: la lee `sdd merge --verify` | 21 | 0 |
| sdd-templates | `templates/operations-template.md` | 18-19 | template | «Sin filtro» y «Lint» (nunca en el gate): reglas de filtrado y de estilo de cada proyecto | 75 | 0 |
| sdd-templates | `templates/operations-template.md` | 20-21 | queda | «CI de la base» y «Acceso a la aplicación»: campos que el kit lee | 105 | 0 |
| sdd-templates | `templates/operations-template.md` | 22-23 | template | «Motor de producción» y «Temporales» con su propuesta `.temp/`: datos de la suite que ninguna skill necesita para el flujo | 91 | 0 |
| sdd-templates | `templates/operations-template.md` | 24-26 | queda | «Camino crítico» y «Tests de feature»: contrato de la 0349 con el template | 102 | 0 |
| sdd-templates | `templates/operations-template.md` | 27-36 | template | Campos E2E (Flujos core, Títulos heredados, Presupuesto E2E, Retries, Timeouts, Entorno de la suite, Datos): política E2E de cada proyecto; `document-manager` retiró el presupuesto en la 0702 | 226 | 0 |
| sdd-templates | `templates/operations-template.md` | 37-39 | queda | Encabezado de §Frontend | 2 | 0 |
| sdd-templates | `templates/operations-template.md` | 40-40 | template | «Recomendados y probados con el kit: impeccable y Playwright»: herramienta que el kit recomienda en vez de leer | 45 | 0 |
| sdd-templates | `templates/operations-template.md` | 41-58 | queda | Campos de §Frontend y §Entornos que leen la verificación de frontend y `sdd-worktrees` | 295 | 0 |
| sdd-templates | `templates/operations-template.md` | 59-59 | template | Puertos reservados en Windows: truco de entorno de cada máquina | 35 | 0 |
| sdd-verify | `references/code-reviewer-prompt.md` | 19-22 | template | Bloque «Project E2E» con «Flujos core», «Retries» y «Timeouts»: campos E2E que salen al template; «Camino crítico» se queda en una línea | 22 | 10 |
| sdd-verify | `references/code-reviewer-prompt.md` | 88-89 | template | Hallazgo Important por un E2E fuera de «Flujos core»: regla de la lista E2E del proyecto | 54 | 0 |
| sdd-verify | `references/code-reviewer-prompt.md` | 90-90 | queda | Con «Camino crítico», el nivel más bajo y la lista que solo edita una persona: ciclo de vida de los tests (0349) | 66 | 0 |
| sdd-verify | `references/code-reviewer-prompt.md` | 91-91 | template | Retry o timeout por encima de lo declarado: valor del proyecto | 25 | 0 |
| sdd-verify | `references/code-reviewer-prompt.md` | 92-92 | skill-proyecto | Espera a estado interno entre dos acciones: técnica E2E que ya lleva la skill `e2e` del proyecto | 58 | 0 |
| sdd-templates | `templates/validation-template.md` | 1-6 | queda | Quién valida y los modos sin guion (`agente`, `field`): flujo del cierre | 105 | 0 |
| sdd-templates | `templates/validation-template.md` | 7-11 | skill-proyecto | Forma del guion en el terminal (el último, bloques sin lenguaje, uno por terminal): formato del guion de cada proyecto | 103 | 0 |
| sdd-templates | `templates/validation-template.md` | 12-34 | queda | 🦆, ✋, smoke por THEN, suites y «Sin probar»: la evidencia del cierre que da el kit | 101 | 0 |
| sdd-templates | `templates/validation-template.md` | 35-67 | skill-proyecto | El guion (terminales, entorno, pasos, parada, «Diferir:»): lo que `validation-script` de `document-manager` resuelve en el proyecto | 142 | 10 |
| sdd-archive | `references/validation-modes.md` | 1-13 | queda | Validación en campo y por el agente: modos del kit | 154 | 0 |
| sdd-archive | `references/validation-modes.md` | 14-16 | skill-proyecto | Con `manual`, componer y ensayar el guion con `dev-validation.md`: pasa a cargar la skill de guion del proyecto | 59 | 15 |
| sdd-archive | `references/validation-modes.md` | 17-27 | queda | Validación diferida, smoke por THEN y registro: filas 🧪 y evidencia del kit | 239 | 0 |
| sdd-end-release | `references/versionado.md` | 1-3 | skill-proyecto | Pre-1.0 y `v1.0.0` reservada para producción: política de versiones de cada proyecto | 58 | 0 |
| sdd-end-release | `references/release-notes.md` | 1-6 | skill-proyecto | Notas de release para el cliente: nacieron para un proyecto concreto, sin cabida en el kit (dev-lead) | 41 | 0 |
| sdd-end-release | `references/release-notes.md` | 7-11 | queda | La línea de smoke del changelog sellado: dispara las validaciones diferidas de las filas 🧪 | 99 | 0 |
| sdd-archive | `references/closing-suite.md` | 1-22 | queda | Cuándo corre la gate del proyecto en el cierre y el camino crítico (0349): correr la gate del proyecto y el ciclo de vida de los tests | 387 | 0 |
| sdd-archive | `references/closing-suite.md` | 23-25 | template | Las suites `unitario` y `pendiente` enteras antes de la gate y la lista «Sin filtro» con moon: cómo filtrar lo decide el proyecto | 120 | 0 |
| sdd-archive | `references/closing-suite.md` | 26-31 | queda | La línea `Gate:` y la gate en el merge de sincronización: registro y momento del flujo | 123 | 0 |
| sdd-archive | `references/closing-suite.md` | 32-32 | template | Cruzar los `inputs` de cada tarea (`moon task`) con lo que tocan rama y base: filtrado propio de moon | 127 | 0 |
| sdd-archive | `references/closing-suite.md` | 33-37 | queda | `--verified-at` y el 4.1 del walkthrough: artefactos del kit | 123 | 0 |
| sdd-end-release | `SKILL.md` | 1-21 | queda | Qué es el corte, forma del roadmap y trabajo cerrado: roadmap y artefactos | 296 | 0 |
| sdd-end-release | `SKILL.md` | 22-22 | skill-proyecto | Suite verde en el sha del corte, sin `--affected`: ceremonia sin fallo con evidencia (dev-lead: nunca encontró nada, solo falsos positivos); quien la quiera, en su skill de release | 100 | 0 |
| sdd-end-release | `SKILL.md` | 23-32 | queda | Paso 1 (alcance; lleva dentro la versión y `release.hasRecipient`, que salen: límite de la granularidad por línea), smoke y validaciones diferidas, changelog, Now, deuda y retro | 600 | 0 |
| sdd-end-release | `SKILL.md` | 33-33 | skill-proyecto | Paso 6, notas de release para el destinatario: cliente, sin cabida en el kit (dev-lead) | 52 | 0 |
| sdd-end-release | `SKILL.md` | 34-34 | skill-proyecto | Versión, tag anotado y merge de git-flow con su atajo: cómo publica cada proyecto, como `release-openspec` de OpenSpec | 261 | 20 |
| sdd-end-release | `SKILL.md` | 35-37 | queda | Encabezado de las red flags | 8 | 0 |
| sdd-end-release | `SKILL.md` | 38-39 | skill-proyecto | Red flags de versión y de suite verde | 36 | 0 |
| sdd-end-release | `SKILL.md` | 40-41 | queda | Red flags de filas ✅ y 🧪 en Now | 35 | 0 |
| sdd-end-release | `SKILL.md` | 42-42 | skill-proyecto | Red flag del borrador de correo y `client-changelog.md`: cliente | 9 | 0 |
| sdd-end-release | `SKILL.md` | 43-43 | queda | Red flag de deuda caducada | 12 | 0 |
| sdd-end-release | `SKILL.md` | 44-45 | skill-proyecto | Red flags de merge y tag sin confirmar y de `hasRecipient` | 45 | 0 |
| sdd-end-release | `SKILL.md` | 46-47 | queda | Red flags de walkthrough y `sdd roadmap check` | 36 | 0 |
| sdd-end-release | `SKILL.md` | 48-48 | skill-proyecto | Red flag de `releases/vX.Y.Z/`: carpeta de las notas al cliente | 22 | 0 |
| sdd-end-release | `SKILL.md` | 49-55 | queda | Racionalizaciones de roadmap, changelog, 🧪 y deuda | 130 | 0 |
| sdd-end-release | `SKILL.md` | 56-58 | skill-proyecto | Racionalizaciones del correo, las notas y `1.0.0` | 75 | 0 |
| sdd-end-release | `SKILL.md` | 59-59 | queda | Racionalización de la retro | 25 | 0 |
| sdd-end-release | `SKILL.md` | 60-63 | skill-proyecto | Racionalizaciones de versión, `hasRecipient` y CI de la suite | 124 | 0 |
| sdd-end-release | `SKILL.md` | 64-65 | queda | Racionalizaciones del validador y del walkthrough | 47 | 0 |
| sdd-worktrees | `SKILL.md` | 135-136 | template | Gate con `--affected --base`: correr sin filtro solo las tareas cuyos `inputs` leen el Scope (`moon task`): filtrado propio de moon | 96 | 0 |
| sdd-verify | `SKILL.md` | 59-61 | template | En el cierre, las suites `unitario` y `pendiente` enteras y la lista «Sin filtro» de 30 globs: cómo filtrar lo decide el proyecto | 136 | 10 |
| sdd-verify | `SKILL.md` | 62-66 | template | Qué se repite tras un rojo (`--base <sha>`, tareas dependientes) y el lint fuera de la gate: política de filtrado y de lint de cada proyecto | 188 | 0 |
| sdd-templates | `templates/release-notes-template.md` | 1-40 | skill-proyecto | Plantilla de las notas al cliente: lo del cliente no tiene cabida en el kit (dev-lead) | 193 | 0 |
| sdd-templates | `SKILL.md` | 28-28 | skill-proyecto | Fila de `release-notes-template.md` en el índice de plantillas | 14 | 0 |
| sdd-roadmap | `references/prepare-release.md` | 5-5 | skill-proyecto | Preguntar y escribir `release.hasRecipient` al preparar la release: cliente | 51 | 0 |
| sdd-propose | `references/spec-writing.md` | 22-22 | template | Sin §Frontend, la spec propone impeccable y Playwright: el kit dicta herramientas; sin campo no dicta nada (dev-lead) y §Frontend lo trae el template | 67 | 0 |
| sdd-verify | `SKILL.md` | 200-200 | template | El eje Código recibe «Flujos core», «Retries» y «Timeouts»: campos E2E que salen; se queda «Camino crítico» | 42 | 0 |
| sdd-init | `SKILL.md` | 50-50 | template | La init pregunta temporales, «Sin filtro», «Lint», títulos E2E, retries y timeouts: los campos E2E y de filtrado que salen al template | 348 | 10 |
| sdd-init | `SKILL.md` | 57-57 | template | La init recomienda impeccable y Playwright para lo que se ve: herramientas que el kit dicta; §Frontend lo trae el template | 48 | 0 |
| sdd-config | `SKILL.md` | 31-31 | skill-proyecto | Pregunta 8, arrancar el entorno antes del guion: preferencia del guion de validación, que sale a la skill del proyecto | 59 | 0 |
| sdd-propose | `references/control-profiles.md` | 30-30 | skill-proyecto | `validation.startEnvironment`: clave del guion de validación | 18 | 0 |
| sdd-propose | `references/control-profiles.md` | 233-233 | skill-proyecto | Fila de `validation.startEnvironment` en el catálogo de claves | 10 | 0 |
| sdd-templates | `templates/walkthrough-template.md` | 55-56 | template | «Entorno de la suite» y «E2E: <duración> de <Presupuesto E2E>» en el 4.1: campos E2E que salen al template | 40 | 0 |
| sdd-templates | `templates/walkthrough-template.md` | 83-83 | template | Suite por encima de su presupuesto (o de 10 min) como deuda: tope que fija el proyecto | 22 | 0 |

### Otros terrenos

| Terreno | Ficheros | Palabras | Nota |
| --- | --- | --- | --- |
| Formato del changelog | `add-to-changelog/SKILL.md`, `sdd-templates/templates/changelog-template.md` | 415 | Keep a Changelog y una línea por fila que sale de Now; se queda por decisión del dev-lead |
| Método de estimación | `sdd-templates/templates/estimation-template.md` | 327 | Horas, tipos y factor de calibración: un proyecto sin estimación ya puede no tener `estimation.md` (predicado); el método en sí lo dicta el kit |
| Forma de los commits e historia de la rama | `sdd-implement/references/commit-milestones.md` | 942 | Apertura, una por task y cierre (Art. IV): convención que el kit fija a los proyectos y que la constitution permite desviar por escrito |
| Escritura de skills y de CLAUDE.md o AGENTS.md | `sdd-agent-writing/SKILL.md`, `sdd-agent-writing/references/skill-mechanics.md`, `sdd-agent-writing/references/skill-testing.md` | 6535 | Cómo se escribe y se prueba una skill: método del kit, aplicado también a las del proyecto |
| Retro de la release | `sdd-retro/SKILL.md`, `sdd-templates/templates/retro-template.md` | 879 | Propuestas de mejora del entorno al cerrar; ligada al cierre y a la deuda |
| Formato del ticket de campo | `sdd-feedback/SKILL.md`, `sdd-templates/templates/kit-feedback-template.md` | 1306 | Ticket de mejora del kit: es del kit, no del proyecto |
