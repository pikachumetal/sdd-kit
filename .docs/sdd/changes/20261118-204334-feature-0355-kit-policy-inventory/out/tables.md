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
