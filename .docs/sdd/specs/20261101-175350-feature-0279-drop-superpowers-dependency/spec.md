---
id: 20261101-175350-feature-0279-drop-superpowers-dependency
feature: 0279
proposal: 0131
title: Retirar la dependencia de superpowers del plugin
mode: full
profile: delegate
status: approved
created: 2026-11-01
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-01
---

# Spec — Retirar la dependencia de superpowers del plugin

🦆 Hoy, para usar el kit, hay que instalar antes otro plugin que el kit ya no usa; si falta, Claude Code deshabilita el kit. Con este cambio se instala solo el kit: `/plugin install sdd-kit@sdd-kit`, y funciona. Un proyecto nuevo deja de activar superpowers, y uno que ya lo tiene activado recibe una pregunta al migrar: «¿lo quito?», con un «no» que lo deja como está, porque puede usarlo por su cuenta. Las pruebas de skills dejan de pedir la ruta de superpowers y siguen sin leer la configuración del dev-lead.

Validación: agente — son manifests, documentación, texto de skills y el lanzador de pruebas; el uso real llega por los tickets (`validation.mode: field`).

## Capacidades

- Modificadas: `routing` — se añade que el kit carga y enruta sin superpowers.
- Modificadas: `onboarding` — la init deja de activar superpowers.
- Modificadas: `cli` — `sdd init --finish` deja de fusionar las hojas de superpowers.
- Modificadas: `kit-feedback` — la cabecera del ticket deja de declarar la versión de superpowers.
- Modificadas: `migration` — la migración a v3.0.0 propone quitar la activación.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: un revisor (Opus, siete puntos), decidida por mí por el perfil `delegate`, sin pregunta — señales: contrato público (`plugin.json`, el bloque de `settings.json`), MODIFIED, tres o más capacidades, migración · tamaño: ~150 líneas de texto y código en ~45 ficheros, 28 de ellos solo por el nombre de la variable en las baterías
- Dominio: si el «no» de la migración deja el proyecto intacto y si el marketplace compartido con otro plugin se conserva (señal: migración)
- Técnica: si el aislamiento del sujeto sobrevive a la retirada de la variable (señal: contrato público)
- Mínimo razonable: ninguno — deja sin mirar por un tercero, antes de implementar, la decisión 2 y la 4, que la revisión final vuelve a leer ya implementadas.

1. **La migración va en `v3.0.0.md`, como paso 10**: la 3.0.0 no se ha publicado, y un `v3.0.1.md` obligaría a dos migraciones en la misma entrega. Va después del paso 9, en su propio commit `chore(sdd): quitar la activación de superpowers`, y no frena el marcador, igual que el paso 8.
2. **`--setting-sources ""` pasa a ser incondicional en el lanzador.** Hoy `SUPERPOWERS_DIR` hace dos cosas: cargar superpowers y aislar al sujeto de la configuración del dev-lead. Quitar la variable sin separarlas haría que los sujetos leyeran el `CLAUDE.md` global, y sus puertas saldrían verdes por eso (`lib.mjs:416`). Sigue como **opcional**, solo para cargar superpowers junto al kit, porque un proyecto puede tenerlo y la competencia con `brainstorming` se sigue pudiendo medir.
3. **Sale la guarda `el kit declara dependencies: define SUPERPOWERS_DIR`.** Un A/B contra un kit anterior a esta feature pasa la variable a mano; si se olvida, `battery.mjs` ya da rojo por `Unknown skill` en la primera llamada.
4. **`cli/src/init/settings.ts`, `sdd-init` paso 7 y su test entran en el Scope, aunque la petición no los nombra.** `cli/test/init/readme.test.ts` compara el bloque del README con `INIT_SETTINGS`, y una init que siga activando superpowers contradice el objetivo. Una init sobre un `settings.json` con superpowers ya activado no lo quita: `mergeSettings` solo añade.
5. **El paso 10 conserva el marketplace si otro plugin lo usa**: con `elements-of-style@superpowers-marketplace` activado, quita solo `superpowers@superpowers-marketplace` y dice por qué se queda el marketplace. Borrarlo dejaría a ese plugin sin fuente.
6. **Texto de la pregunta del paso 10**, literal: «El kit ya no usa superpowers. ¿Quito su activación de `.claude/settings.json`? Si el proyecto usa sus skills fuera del kit, di que no y se queda como está.» Sin el «sí», el informe lleva: «Superpowers sigue declarado en `.claude/settings.json`. Para quitarlo más tarde, borra `enabledPlugins["superpowers@superpowers-marketplace"]` y, si ningún otro plugin activado sale de ese marketplace, `extraKnownMarketplaces["superpowers-marketplace"]`.» Da la edición a mano porque, con el marcador ya en `3.0.0`, `sdd upgrade` no vuelve a este paso.
7. **El paso 10 no desinstala nada ni toca `~/.claude/settings.json`**: solo el `.claude/settings.json` del proyecto.
8. **Se retira `superpowers_version` del ticket y el paso 1 de `sdd-feedback` deja de leerla**: en un proyecto sin superpowers no hay de dónde sacarla. Ningún código lee ese campo (`git grep superpowers_version -- cli tests/headless`). Los tickets ya escritos no se tocan.
9. **Siguen nombrando superpowers, por ser instrucción válida para un proyecto que lo conserve**: la frase de precedencia de `using-sdd` y su `description`, `NEVER superpowers' brainstorming` de `sdd-explore`, `Never create docs/superpowers/` de `sdd-propose` y `sdd-init`, y `.superpowers/` en `.gitignore`. Una línea en un `.gitignore` no cuesta nada, y quitarla no evita ningún fallo medido. El sondeo de esta spec dio 0 confusiones con solo el kit, en un sujeto Haiku, sin medir enrutado: lo mide el GREEN.
10. **La frase del README se conserva**: «El kit invoca 0 skills de superpowers: ninguna» y su test siguen, como guarda de que no vuelva a invocarlas. Sale «Versión validada: 7.0.0…», y con ella la cláusula del Art. V y la última frase del Art. IX, que ya no aplican. Superpowers sigue en `THIRD_PARTY_NOTICES.md`, y `kit:upstream` no lee esa frase (`git grep "ersión validada" -- tests/headless cli`).
11. **El paso 9 de `v2.0.0.md` no se toca**: las migraciones publicadas son historia. Un proyecto anterior a la 2.0.0 añade el marketplace y el paso 10 le pregunta si lo quita.
12. **El smoke guarda un resumen** en `green/smoke/` de esta carpeta, con y sin plugin, porque en la 0116 el eje Spec no pudo verificar los smokes (ticket §Menores).
13. **Sin `SUPERPOWERS_DIR`**, un sujeto de `using-sdd` da el «Está hecho» de que un sujeto carga e invoca, y un sujeto de la batería de `sdd-propose` cubre la edición de su Overview (Art. I, tramo del paso).
14. **Una pieza entra, otra sale**: entra el paso 10 (~130 palabras en una referencia); salen la dependencia, la instalación de superpowers, el campo del ticket y las cláusulas de la constitution.
15. **Delta probado en una copia**: ver el resultado al final de «Delta de comportamiento».
16. **`migration-init-parity.test.ts` lleva una exención**, `extraKnownMarketplaces.superpowers-marketplace`: `v2.0.0.md` la declara en su `**Escribe**` y es historia, y la init deja de tenerla. El `**Escribe**` de v3.0.0 nombra el paso 10 en prosa, sin clave nueva, porque el paso solo retira.
17. **La init no lleva la pregunta del paso 10, y no lo cuento como excepción al Art. V**: esa regla reparte lo que una migración *añade*, y el paso 10 solo retira. Un proyecto nuevo no tiene nada que quitar; una init sobre un `settings.json` que ya lo activa no lo toca (decisión 4).
18. **El paso 10 queda fuera de «Verificación»**, como el paso 8: corre después del marcador, y la verificación corre antes.
19. **Qué activa el paso 10**: la clave `superpowers@superpowers-marketplace` en `enabledPlugins`, con cualquier valor, o el marketplace declarado sin ningún otro `*@superpowers-marketplace` en `true`. Con solo el marketplace y otro plugin que lo usa, no hay nada que quitar: el paso se salta y lo dice.
20. **El smoke no pasa por el lanzador**: con `--setting-sources ""` no correría el hook del proyecto. Va con `claude -p --plugin-dir <copia> --setting-sources project`, y el control sin plugin demuestra que ese hook corre y avisa.
21. **El delta no cambia «Reglas de la capacidad» de `migration`**: el dato vive en `.claude/settings.json`, y el aviso de un gate sin respuesta ya es la regla vigente; límites e idioma, no aplica.

### Hallazgos de la review

Un revisor Opus, 10 hallazgos, comprobados contra las capacidades y el test de paridad:

- **Aceptado** — `cli.md:85` exige dos marketplaces y dos plugins → `MODIFIED` añadido.
- **Aceptado** — la paridad falla por `v2.0.0.md` → decisión 16 y `MODIFIED` en `migration`.
- **Aceptado** — Art. V no declarado → decisión 17.
- **Aceptado** — el paso 10 corre tras «Verificación» → decisión 18.
- **Aceptado** — el informe mandaba reanudar por una puerta que no existe → decisión 6, edición a mano.
- **Aceptado** — casos sin definir (`false`, solo marketplace) → decisión 19 y sus `AND`. Las reglas: decisión 21.
- **Aceptado** — el smoke no puede pasar por el lanzador → decisión 20.
- **Aceptado** — «sin ningún aviso» no era verificable → GIVEN de `routing` con versión y hook, y propósito en Scope. El caso con superpowers sale: ya lo cubren los requisitos vigentes.
- **Aceptado** — la edición de `sdd-propose` sin su tramo → decisión 13 y un sujeto más.
- **Aceptado** — inventario solo de `skills/` → grep de todo el repo clasificado, y tests y escenarios corregidos en Scope.

- Política de modelos: revisores de la spec, uno en Opus · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- La migración propone y espera, porque el proyecto puede usar sus skills fuera del kit — prompt de arranque, «propone y espera».
- El saldo de palabras de cada skill editada queda igual o baja — prompt de arranque.
- Perfil y cierre — «Perfil delegate. Al fusionar, `sdd merge --push`.»

## Intent

Desde la 0151 el kit invoca 0 skills de superpowers, pero `plugin.json` lo exige, `marketplace.json` lo permite, el README manda instalarlo y cada init lo activa. Un proyecto instala un plugin que no usa, y sin él Claude Code deshabilita el kit. El éxito es que `plugin.json` no lo declare, que un sujeto cargue el kit e invoque una skill suya sin `SUPERPOWERS_DIR`, que un smoke con solo el kit arranque el hook sin avisos falsos, que el README instale el kit en un solo paso y que la migración proponga quitar la activación sin borrarla sin un sí. Fracasa si un proyecto que usa superpowers lo pierde sin haber dicho que sí, o si los sujetos dejan de ir aislados.

## Scope

- Entra:
  - `.claude-plugin/plugin.json` sin `dependencies`; `marketplace.json` sin `allowCrossMarketplaceDependenciesOn`; `cli/test/kit/skills.test.ts`, que pasa a exigir que no estén; `cli/test/kit/migration-init-parity.test.ts` (decisión 16).
  - `README.md`: instalación, `settings.json` de ejemplo, tabla de dependencias, «Enrutado automático» y la frase de la versión validada.
  - `cli/src/init/settings.ts`, `cli/test/init/settings.test.ts` y `verbs.test.ts`, `skills/sdd-init/SKILL.md` paso 7. `readme.test.ts` no cambia: compara el README con `INIT_SETTINGS`.
  - `tests/headless/lib.mjs`, `tests/headless/battery.mjs` (comentario), `cli/test/kit/headless/lib.test.ts`, `molds.test.ts` y `subject.test.ts`.
  - Los 28 ficheros de `tests/batteries/` que nombran la variable: de «con `SUPERPOWERS_DIR`» a que el sujeto va aislado. `tests/batteries/sdd-implement/subject.mjs:173` y `compose.mjs` siguen leyéndola, opcional.
  - `skills/sdd-upgrade/references/migrations/v3.0.0.md`: paso 10, cabecera de pasos y `**Escribe**`; tres escenarios en `tests/batteries/sdd-upgrade/battery.md`, con un molde `v2x` que activa superpowers.
  - `skills/sdd-propose/SKILL.md:11`, `skills/sdd-feedback/SKILL.md:14`, `skills/sdd-templates/templates/kit-feedback-template.md:3` y `:53`.
  - `.docs/sdd/tech-stack.md` (líneas 25, 28 y 108, y la de la 0074 sobre `SUPERPOWERS_DIR`), `.docs/sdd/constitution.md` (Art. V y IX), `.docs/workflow/usage-guide.md:217` y `:223`, `CLAUDE.md:14`, el propósito de `capabilities/routing.md:5`.
- No entra: los `NOTICE` y las líneas de procedencia (lista abajo); desinstalar o prohibir superpowers; `kit:upstream`; este repo, incluido su `.claude/settings.json` (0198); las migraciones ya publicadas; los GIVEN de `routing` que dicen «superpowers instalado», que siguen siendo un caso válido.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Dependencia en el manifest | `plugin.json:6-11`, `marketplace.json:7`, `skills.test.ts:86-93`, `README.md:61` | Scope |
| Instalar superpowers | `README.md:54,56,61,63,65,77-84,179`, `usage-guide.md:217,223`, `tech-stack.md:28` | Scope |
| `SUPERPOWERS_DIR` obligatoria | `lib.mjs:192-196`, `lib.test.ts:177-183`, `tech-stack.md:25,108` | Scope, decisiones 2 y 3 |
| Variable en encabezados de batería | 28 ficheros de `tests/batteries/` | Scope |
| Hojas de superpowers de la init | `settings.ts:8,12`, `sdd-init/SKILL.md:66`, `onboarding.md:69,72`, `cli.md:85,96,98` | Delta, `MODIFIED` |
| `superpowers_version` | `kit-feedback-template.md:3,53`, `sdd-feedback/SKILL.md:14`, `kit-feedback.md:23,26` | Delta, `MODIFIED`, decisión 8 |
| «Los `superpowers:*` se usan como proceso» | `sdd-propose/SKILL.md:11` | Scope: falso desde la 0151 |
| Versión validada | `README.md:185`, `constitution.md:61` | Scope, decisión 10 |
| «Sigue invocando las que no ha copiado» | `constitution.md:85` | Scope, decisión 10 |
| Índice «dependencia de superpowers» | `CLAUDE.md:14` | Scope |

Lo que `git grep -i superpowers -- skills` encuentra y se queda:

| Clase | Casos |
| --- | --- |
| Atribución | Los `NOTICE` de `sdd-agent-writing`, `sdd-archive`, `sdd-debugging`, `sdd-grilling`, `sdd-implement`, `sdd-parallel-agents`, `sdd-propose`, `sdd-tdd`, `sdd-verify` y `sdd-worktrees`; «Forked from» y «Adapted from» en `sdd-agent-writing/SKILL.md:8`, `skill-mechanics.md:3`, `sdd-archive/SKILL.md:10`, `sdd-debugging/SKILL.md:10`, `sdd-implement/SKILL.md:10`, `sdd-parallel-agents/SKILL.md:10`, `plan-writing.md:3`, `spec-writing.md:3`, `sdd-tdd/SKILL.md:10`, `sdd-verify/SKILL.md:10` y `sdd-worktrees/SKILL.md:10` |
| Procedencia de una regla | `implementer-prompt.md:124`, `encargo-revision.md:19,21,64,76`, `plan-template.md:168` (medición), y las citas a `tests/superpowers-*.md` en `sdd-grilling/SKILL.md:39` y `spec-writing.md:26,30` |
| Instrucción, se queda (decisión 9) | `using-sdd/SKILL.md:10`, `sdd-explore/SKILL.md:21`, `sdd-propose/SKILL.md:13`, `sdd-init/SKILL.md:81`, `sdd-init/references/structure.md:10` |
| Instrucción, historia (decisión 11) | `migrations/v2.0.0.md:12,29,46,56,72,78` |
| Instrucción, sale | `sdd-propose/SKILL.md:11`, `sdd-feedback/SKILL.md:14`, `sdd-init/SKILL.md:66`, `kit-feedback-template.md:3,53` |

Fuera de `skills/`, `git grep -il superpowers` encuentra además, y se queda: las ADR (inmutables), `changelog.md`, `estimation-log.md`, `estimation.md`, `roadmap.md`, `evidence-and-references.md` y `architecture.md:52` (historia o procedencia); `THIRD_PARTY_NOTICES.md` (atribución); `.gitignore` y `cli/src/init/gitignore.ts` (decisión 9); `.claude/settings.json` (0198); los requisitos «no invoca» de `feature-flow` y `verification`, que siguen siendo ciertos. `hooks/`, `.github/`, `.moon/` y `start-kit-session.mjs` no lo nombran.

- Filas que implementa: 0279 → `.docs/sdd/roadmap.md:112` y la lista «tras» de la 0198 (`roadmap.md`); las marca el cierre.

## Approach

Primero los tests en rojo; después manifests, init y lanzador; después los textos, y al final la migración y el smoke. El paso 10, dentro de `v3.0.0.md`:

- **Predicado**: `.claude/settings.json` tiene `enabledPlugins["superpowers@superpowers-marketplace"]` o `extraKnownMarketplaces["superpowers-marketplace"]`.
- **Gate**: la pregunta de la decisión 6, tras el commit del paso 7. Con el «sí», quita las dos claves (el marketplace, salvo por la decisión 5). Sin él, no escribe nada.

## Dónde se prueba

- Manifests sin dependencia: `cli/test/kit/skills.test.ts` y `manifests.slow.test.ts`, que corre `claude plugin validate`.
- Init sin superpowers y conservación de lo previo: `cli/test/init/settings.test.ts`, `verbs.test.ts` y `readme.test.ts`.
- Lanzador: `cli/test/kit/headless/lib.test.ts`, sobre los argumentos que llegan a `claude`.
- Sujeto que carga e invoca sin la variable: un escenario de la batería de `using-sdd` sin `SUPERPOWERS_DIR` (decisión 13).
- Hook sin avisos falsos: smoke Haiku con solo el kit y el hook del proyecto (decisión 20), más su control sin plugin, que sí tiene que avisar; la evidencia es la traza del hook en el stream.
- Paso 10: escenarios nuevos de `tests/batteries/sdd-upgrade/battery.md`, con el «sí», el «no» y el marketplace compartido.
- `sdd-feedback`: `fb1` de su batería. `sdd-init`: humo de un sujeto de su batería.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna. La ADR 0009 ya decidió el fork; esto completa lo que decía, sin alternativa nueva.

## Delta de comportamiento

### Capacidad: `routing`

#### ADDED — El kit carga y enruta sin superpowers

- GIVEN un proyecto con `.docs/sdd/`, `sdd-kit.json` en la versión del kit cargado, el hook del proyecto instalado, y sin superpowers instalado
- WHEN arranca una sesión y el usuario escribe «añade autenticación con magic link»
- THEN el kit está cargado, el hook de sesión inyecta `using-sdd` sin ningún aviso, y el agente entra por `sdd-kit:sdd-propose`
- AND el hook del proyecto `.claude/hooks/sdd-kit-loaded.mjs` no escribe `AVISO sdd-kit: esta sesión no tiene cargadas las skills del kit.`

### Capacidad: `onboarding`

#### MODIFIED — La init deja la memoria automática desactivada y los temporales ignorados

- GIVEN un `sdd-init` sobre un proyecto cuyo `.claude/settings.json` es `{"permissions": {"allow": ["Bash(npm test)"]}}`
- WHEN ejecuta `sdd init --root <raíz> --finish`
- THEN `.claude/settings.json` conserva `permissions` y gana `"autoMemoryEnabled": false`, `extraKnownMarketplaces.sdd-kit` con la fuente `github` `pikachumetal/sdd-kit` y `"autoUpdate": true`, y `enabledPlugins` con `"sdd-kit@sdd-kit": true`, sin ninguna clave de superpowers
- AND `.gitignore` contiene las líneas `.playwright-mcp/`, `.superpowers/`, `.docs/sdd/sdd-kit.local.json` y `.temp/` una sola vez cada una, y cada ruta de `--ignore`
- AND con `"autoMemoryEnabled": true` previo, la salida dice `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia` y el agente pregunta; con su «sí», repite `--finish` con `--memory-off` y la clave queda en `false`; con su «no», se queda en `true` y el resumen de cierre lo anota
- REMOVED AND si `claude plugin marketplace list` no muestra `superpowers-marketplace`, el agente ejecuta `claude plugin marketplace add obra/superpowers-marketplace`
- AND la init escribe `.claude/hooks/sdd-kit-loaded.mjs` y añade su entrada a `hooks.UserPromptSubmit` de `.claude/settings.json` una sola vez, sin tocar las que ya hubiera

### Capacidad: `cli`

#### MODIFIED — `sdd init --finish` fusiona `settings.json` por hoja sin pisar

- GIVEN un `.claude/settings.json` con `extraKnownMarketplaces.sdd-kit.source.repo` = `"otro/fork"`, `enabledPlugins["superpowers@superpowers-marketplace"]` = `true` y `enabledPlugins["sdd-kit@sdd-kit"]` = `false`
- WHEN se ejecuta `sdd init --root <raíz> --finish`
- THEN esas tres hojas no cambian, se añaden las que faltan del bloque, y la salida dice `extraKnownMarketplaces.sdd-kit.source.repo: se deja "otro/fork"` y `enabledPlugins.sdd-kit@sdd-kit: se deja false`, sin ninguna línea sobre superpowers, que no es del bloque
- AND con `"autoMemoryEnabled": true`, dice `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`, y con `--memory-off` la deja en `false`

#### MODIFIED — `sdd init --finish` escribe lo determinista de la init

- GIVEN un proyecto sin `.claude/settings.json`, con un `.gitignore` con CRLF que tiene `node_modules/` y `.superpowers/`, y un `sdd-kit.json` en curso con `init.config` = `{"ids":{"mode":"sequence"},"control":{"profile":"delegate"}}`
- WHEN se ejecuta `sdd init --root <raíz> --finish --ignore .auth/`
- THEN `.claude/settings.json` tiene el bloque de la init (memoria desactivada, el marketplace del kit con `autoUpdate: true` y el plugin del kit activado), igual al bloque marcado con `<!-- sdd-init: settings -->` del README, más la entrada del hook del proyecto
- REMOVED THEN `.claude/settings.json` tiene el bloque de la init (memoria desactivada, los dos marketplaces con `autoUpdate: true` y los dos plugins activados), igual al bloque marcado con `<!-- sdd-init: settings -->` del README, más la entrada del hook del proyecto
- AND `.gitignore` conserva `node_modules/` y `.superpowers/` una vez, gana `.playwright-mcp/`, `.docs/sdd/sdd-kit.local.json`, `.temp/` y `.auth/` con CRLF, y termina en salto de línea
- AND `.docs/sdd/sdd-kit.json` tiene `version` igual a la de `.claude-plugin/plugin.json`, `channel` `plugin`, `updated` del día, `ids.mode` `sequence` y `control.profile` `delegate`, sin `init`, y es el último fichero que se escribe
- AND la salida tiene una línea por fichero con `creado` o `actualizado`, y sale con 0
- AND repetir el mismo comando deja los cuatro ficheros iguales y dice `sin cambios` en los cuatro
- AND `.claude/hooks/sdd-kit-loaded.mjs` queda escrito y su entrada, en `hooks.UserPromptSubmit` de `.claude/settings.json`, antes de `sdd-kit.json`
- AND sin `.gitignore`, lo crea con las líneas de la init
- AND con un `sdd-kit.json` de template que ya tiene `"version": "1.1.0"`, la conserva

### Capacidad: `kit-feedback`

#### MODIFIED — El ticket se escribe para un agente, no para una persona

- GIVEN una sesión que acaba de ejecutar una feature o un patch
- WHEN se redacta el ticket
- THEN cada hallazgo lleva evidencia de lo que pasó en la sesión, la línea «Fuente» con el fichero y la línea, o el comando, de donde sale cada versión, cifra o cita de «Qué pasó», el fichero **del kit** y el paso que lo origina —nunca un fichero del repo consumidor—, por qué el kit no lo evitó, una propuesta, la línea «Verificada» con `sí — <cómo>` o `sin verificar`, y un criterio de aceptación en forma de escenario
- AND si el hallazgo cita un fallo de ejecución, «Qué pasó» da el comando exacto, el shell y la línea de error: «`./scripts/check-docs.sh` en PowerShell → `The term './scripts/check-docs.sh' is not recognized`»
- AND un dato que el agente recuerda y no ha comprobado no va en «Qué pasó»: si recuerda «kit 2.4.0» y la versión que lee en `.docs/sdd/sdd-kit.json` es la 2.3.4, el ticket dice 2.3.4 con esa lectura en «Fuente», o no da versión
- AND «Fuente» cita metadatos o ficheros del kit (`.docs/sdd/sdd-kit.json`, la versión de un plugin, una skill) o un comando; un dato que sale de un fichero del proyecto se cita con un descriptor genérico («el changelog del proyecto»), como el resto del ticket
- AND una causa de coste cita la spec, el walkthrough o el commit que la respalda; con solo una frase del dev-lead, el coste da la cifra y marca la causa «sin respaldo»
- AND la cabecera declara la versión del kit (`.docs/sdd/sdd-kit.json`), el carril, el modo y el coste en reloj y tokens, con «no medido» como valor honesto cuando no hay contador
- REMOVED AND un dato que el agente recuerda y no ha comprobado no va en «Qué pasó»: si recuerda «superpowers 7.1.0» y la versión instalada que lee es la 7.0.0, el ticket dice 7.0.0 con esa lectura en «Fuente», o no da versión
- REMOVED AND la cabecera declara la versión del kit (`.docs/sdd/sdd-kit.json`), la de superpowers, el carril, el modo y el coste en reloj y tokens, con «no medido» como valor honesto cuando no hay contador

### Capacidad: `migration`

#### ADDED — La migración a v3.0.0 propone quitar la activación de superpowers

- GIVEN un proyecto que migra a v3.0.0 con `enabledPlugins["superpowers@superpowers-marketplace"]` y `extraKnownMarketplaces["superpowers-marketplace"]` en `.claude/settings.json`
- WHEN llega al paso 10, con el marcador ya en `3.0.0`
- THEN pregunta «El kit ya no usa superpowers. ¿Quito su activación de `.claude/settings.json`? Si el proyecto usa sus skills fuera del kit, di que no y se queda como está.» y espera, sin haber escrito nada
- AND con un «sí», quita las dos claves y hace el commit `chore(sdd): quitar la activación de superpowers`
- AND con un «no», o sin respuesta, `.claude/settings.json` no cambia y el informe dice «Superpowers sigue declarado en `.claude/settings.json`. Para quitarlo más tarde, borra `enabledPlugins["superpowers@superpowers-marketplace"]` y, si ningún otro plugin activado sale de ese marketplace, `extraKnownMarketplaces["superpowers-marketplace"]`.»
- AND con `enabledPlugins["elements-of-style@superpowers-marketplace"]` = `true`, el «sí» quita solo `superpowers@superpowers-marketplace`, conserva el marketplace y dice que lo usa ese plugin
- AND con esa misma clave en `false`, el marketplace se quita: un plugin desactivado no lo usa
- AND no desinstala nada ni toca `~/.claude/settings.json`
- AND sin ninguna de las dos claves, o con solo el marketplace y otro plugin en `true`, el paso se salta y lo dice

#### MODIFIED — Lo que escribe una migración lo reciben también las init

- GIVEN una migración de `skills/sdd-upgrade/references/migrations/` que escribe en `sdd-kit.json` u otro fichero del proyecto
- WHEN corre la suite del kit
- THEN la migración declara en su línea `**Escribe**:` cada fichero y cada clave que escribe
- AND la suite falla si una clave declarada no aparece literal en `sdd-init`, contando su `SKILL.md`, sus `references/`, los documentos que estos enlazan salvo `skills/sdd-upgrade/`, `sdd-config` incluido, y los `.ts` de `cli/src/init/`, salvo `extraKnownMarketplaces.superpowers-marketplace`, que el kit retiró después de escribirla `v2.0.0.md`
- REMOVED AND la suite falla si una clave declarada no aparece literal en `sdd-init`, contando su `SKILL.md`, sus `references/`, los documentos que estos enlazan salvo `skills/sdd-upgrade/`, `sdd-config` incluido, y los `.ts` de `cli/src/init/`
- AND la suite falla si el texto de una pregunta del catálogo de `sdd-config` aparece en la init o en una migración, o si una de ellas no nombra `sdd-config`

Prueba en una copia de `.docs/sdd`: `sdd capability merge` añade 1 requisito a `routing.md` y 1 a `migration.md`, y sustituye 1 en `onboarding.md`, 2 en `cli.md`, 1 en `kit-feedback.md` y 1 en `migration.md`, sin rechazos.

## Topes de palabras

Medido con `words()` de `cli/test/kit/word-budget.test.ts`, el 2026-11-01. El test aplica una holgura de 1,25 sobre cada tope. Todas las ediciones bajan, así que ningún tope cambia. El paso 10 no cuenta: `skillWords` excluye `migrations/`.

| Fichero | Medido / tope | Margen, con holgura | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-propose/SKILL.md` | 5336 / 5250 | 1227 | sin cambio |
| `sdd-feedback/SKILL.md` | 710 / 800 | 290 | sin cambio |
| `sdd-init/SKILL.md` | 2663 / 2500 | 462 | sin cambio |
| `constitution.md` | 2236 / 2236 | 559 | sin cambio |
| `tech-stack.md` | 21597 / 19663 | 2982 | sin cambio |

## Previsión de coste

Precio: ~0,45 $ por sujeto de una fase corta (0272: ~13 $ con la batería de `using-sdd` y un humo); un sujeto de migración, ~1,5 $ (lee y mueve documentos), a confirmar con el primero.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 1 de `sdd-upgrade`: `v2x` con superpowers activado, kit sin el paso 10 | 1,5 |
| GREEN | 3 de `sdd-upgrade` (sí, no, marketplace compartido), 1 de `using-sdd`, 1 de `sdd-propose`, 1 de `sdd-feedback` (`fb1`), 1 de `sdd-init` | 6,9 |
| Una tanda de REFACTOR | 2 de `sdd-upgrade` | 3 |
| Controles | 1 de `using-sdd` con `SUPERPOWERS_DIR`: sigue por delante de `brainstorming` | 0,5 |
| Medición tras la revisión final | Reserva del 20 % para repetir lo que cambie | 2,4 |
| Smoke | 2 Haiku | 0,1 |
| Suma | | 14,4 |

Pasos del agente cambiados y su escenario: paso 10 de `v3.0.0.md` → los tres de `sdd-upgrade`; paso 7 de `sdd-init` → su humo; paso 1 de `sdd-feedback` y su plantilla → `fb1`; la frase de `sdd-propose` → su sujeto.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-01 | aprobada (opción «Apruebo») |
