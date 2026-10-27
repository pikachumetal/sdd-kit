---
id: 20261026-162553-feature-0226-drop-phrase-tests
feature: 0226
proposal: 0225
title: Frases fuera y anatomía a Vitest
mode: full
profile: delegate
status: approved
created: 2026-10-26
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-26
---

# Spec — Frases fuera y anatomía a Vitest

🦆 Hoy, cambiar una frase de una skill obliga a cambiar también el test Pester que la copia literal, y esos tests no dicen nada de cómo se comporta el agente. Tras esta feature, 48 ficheros Pester desaparecen enteros, y a Vitest, en `cli/test/kit/`, solo pasa lo que rompe algo de verdad —una skill que Claude Code no carga, un enlace que lleva a nada, una skill que invoca otra que no existe, una ruta que Windows no puede sacar, el nombre de un cliente en lo que se publica— más los topes de palabras, con los mismos valores. Por ejemplo, editar una frase de `control-profiles.md` o añadir un campo a una plantilla ya no toca ningún test; subir `sdd-archive` a 10.001 palabras o escribir `sdd-end-feature` en una skill sigue parando el commit. Los Pester que lanzan procesos se quedan para la 0227.

## Capacidades

- Modificadas: `migration` — tres requisitos citan `tests/MigrationInitParity.Tests.ps1`, que pasa a Vitest
- Modificadas: `roadmap` — «Las cabeceras de tabla y los estados son los de la plantilla» cita `tests/RoadmapStructure.Tests.ps1`
- Modificadas: `feature-flow` — «La spec mide el margen de palabras de lo que edita» pone de ejemplo `tests/WordBudget.Tests.ps1`
- Modificadas: `archive` — la regla **Límites** cita `tests/WordBudget.Tests.ps1`

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (cinco requisitos y una regla), tres o más capacidades (cuatro) · tamaño: ~150 líneas de texto en 14 ficheros, más el borrado de 57 ficheros y ~600 líneas de TypeScript nuevas
- Técnica: si el criterio deja fuera algo que hoy para un commit y rompe de verdad (señal: ninguna; lo cubre la tabla del Approach)
- Mínimo razonable: ninguna — los cambios de capacidad son rutas, sin comportamiento nuevo
```

1. **Qué se porta**: solo lo que **rompe algo de verdad** —la carga del plugin (frontmatter que lee Claude Code, `description` de 1.024 caracteres como máximo, manifests, los tres tipos de agente por effort que se despachan), la navegación del agente (enlaces que resuelven, `references/` sin huérfanos, sin `@`, el índice de `sdd-templates` igual a `templates/`, las skills invocadas existen), la privacidad (nombres de proyectos reales en `skills/`), Windows (rutas de menos de 140 caracteres) o un contrato con código (la cabecera de release de `sdd roadmap check` igual a la de `roadmap-template.md`)— más **lo que fija una regla escrita**: los topes de palabras (Art. I), la paridad migración–init (Art. V), el marcador de revisión de `.docs/workflow/` (`CLAUDE.md` del repo) y que cada skill adaptada de otra lleva su `NOTICE` (Art. IX). Se borra lo demás, también lo estructural que solo lee un agente: secciones y número de campos de las plantillas, H1 y Overview, el orden de la guía de uso, la forma de cierre de las filas del roadmap, caracteres de control. Medido el 2026-10-26 sobre los 67 ficheros (tabla en el Approach).
2. **Carpeta**: `cli/test/kit/`, un fichero `*.test.ts` por tema y `manifests.slow.test.ts` (lanza `claude plugin validate`, se salta sin `claude` en el PATH, como hoy). El reparto por fichero es del plan.
3. **`cli/moon.yml`, `testInputs`**: pasa a `/**/*` (enmienda del 2026-10-26: la lista `/README.md`, `/.claude-plugin/**`, `/agents/**`, `/.docs/**` y `/tests/**` dejaba fuera `.agents/`, `.claude/`, `hooks/`, `.githooks/`, `.moon/` y la raíz, que `path-length` también comprueba). Sin ellos, un commit que solo toca `.docs/workflow/` o una carpeta de spec con ruta larga da `cli:test` por bueno desde la caché de moon, y la anatomía deja de parar el commit (la regla de la propuesta: «el pre-commit falla igual que hoy»). Es `cli/moon.yml`, no el `moon.yml` raíz ni el pre-commit, que son de la 0228. Coste: el gate (`cli:test-min --affected`) corre también en un cambio que solo toca `.docs/`; casi todo cambio del kit ya toca `skills/`, que lo dispara hoy. **Valídalo**: tu petición decía «no cambia moon.yml»; lo leo como el raíz.
4. **`path-length` sigue en el conjunto rápido**, con una sola llamada a `git ls-files --cached --others --exclude-standard`, como el Pester de hoy, aunque la regla de `tech-stack.md` mande a `*.slow.test.ts` lo que lanza procesos: es un proceso, no un repo creado, y tiene que parar el commit.
5. **`RoadmapStructure`**: se porta solo «la cabecera de release del validador es la de `roadmap-template.md`»; «el roadmap del repo tiene la forma de la plantilla» ya lo corre `kit:roadmap` en el pre-commit.
6. **Nombres retirados, sin listas**: las listas de nombres que ya no existen (`sdd-end-feature`, `sdd-start-release`, `superpowers:using-git-worktrees`, `funcional.md`… en `NamingConvention`, `ArchiveSkill`, `FeatureRename`, `PlanEntry`, `ForkSkills`, `ImplementSkill`, `SuperpowersCompat`, `TddSkills`, `VerifySkill`, `UsingSdd`, `AnchorTemplates`) se borran. Las sustituye un test genérico que no crece: toda skill que una skill invoca —`sdd-kit:<nombre>`, o una skill del kit nombrada entre comillas invertidas— existe en `skills/`, y toda `superpowers:<nombre>` está en la lista del README; fuera quedan `references/migrations/` y los `NOTICE`, que nombran los viejos a propósito. La forma exacta de reconocer el nombre es del plan.
7. **Referencias a los Pester borrados**: se comprueban **una vez**, como smoke, con `git grep` sobre `skills/` y `capabilities/` antes y después de corregir las rutas; el resultado va al walkthrough y no queda test. Es el RED mecánico de las dos ediciones de skill (`tech-stack.md`, T19 (2)).
8. **Ediciones de skill**: `skills/sdd-upgrade/SKILL.md` («`tests/MigrationInitParity.Tests.ps1` checks it» → la ruta nueva) y `skills/sdd-templates/templates/spec-template.md` (el ejemplo de la sección «Topes de palabras»). Cambios de ruta: RED mecánico (decisión 7), sin sujetos. Previsión de coste (Art. I): 0 sujetos, 0 min, 0 $.
9. **Una pieza entra, otra sale**: salen 57 ficheros Pester (48 borrados enteros y 9 con su parte útil portada); entran ~8 ficheros de Vitest.
10. **ADR 0019** «Las skills no se prueban por sus frases», con `rutas: tests/**` y `cli/test/kit/**`: sustituye la consecuencia de la ADR 0011 «los Pester que quedan (frases y anatomía de skills) siguen hasta la 0152». La 0011 no se edita y sigue `accepted`: el resto de su decisión (la CLI en Node) sigue vigente.
11. **Las ADR 0001, 0002, 0005-0008, 0010, 0012, 0014-0016 citan Pester borrados en su «Confirmación»**: no se editan (son inmutables); la 0019 dice que esas confirmaciones de frase ya no tienen test y que el RED/GREEN de su batería es la prueba.
12. **El margen de la fila B21** (`Slack = 1.25`) viaja tal cual a `word-budget.test.ts`, con su comentario; los topes, idénticos.
13. **Filas del roadmap**: al cerrar, la 0226 pasa a ✅, la deuda «¿Hacen falta ~416 tests Pester…?» se salda, y la 0045 («¿Qué protege cada test Pester?») también, porque esta feature hace su inventario y su poda. La 0224 (b) y la 0227 se reescriben: la 0224 nombra `tests/WordBudget.Tests.ps1` (pasa a `cli/test/kit/word-budget.test.ts`), y la 0227 dice «`PathLength` si la 0226 no lo lleva» (lo lleva).
14. **No se tocan**: los 10 Pester de conducta (`HeadlessLauncher`, `Battery`, `SubjectOutputPrivacy`, `UpstreamWatch`, `Clear-GitEnv`, `Hook`, `DenyKillHook`, `KitSessionSource`, `TempDir`, `FastSuiteBudget`), `tests/Invoke-KitTests.ps1`, `moon.yml` raíz y `.githooks/`.
- Política de modelos: revisores de la spec, ninguno · revisión final en ejes: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin sujetos · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar los ejes de la revisión final; lo que no nombra se confirma aparte
- Prueba del delta: `sdd capability merge` sobre una copia de `.docs/sdd` → cinco requisitos sustituidos y la regla «Límites» de `archive`; `sdd capability check` → `Capacidades válidas: 20`

### Decisiones tomadas con el dev-lead

- Las frases se borran, no se portan — «se que no sirven de nada y testean FRASES»
- La anatomía pasa a Vitest en `cli/test/kit/` con los mismos topes, y una ADR nueva sustituye la regla de la 0011 sin editarla — prompt de arranque, 2026-10-26
- En paralelo con la 0223 y la 0227; no toca `moon.yml` ni el pre-commit, que son de la 0228 — «Sí, ya en paralelo»
- Perfil `delegate`; al fusionar, `sdd merge --push` — prompt de arranque, 2026-10-26
- Solo se porta lo que rompe algo de verdad más los topes, y las listas de nombres retirados se cambian por un test genérico «toda skill invocada existe»: una comprobación de retirada es un smoke, se hace una vez — «si eliminas un skill no vas a estar comprobando 5 años despues que ya no usa sel nombre... te aseguras que ya nadie lo usa y ya esta no?»; «Sí, los dos», 2026-10-26

## Intent

El repo tiene 67 ficheros Pester (969 `It`). La mayoría comprueban que una frase de una skill sigue escrita: no prueban conducta, que es lo que prueban las baterías RED/GREEN, y obligan a editar el test en cada edición de skill. Éxito: tras la feature, `tests/` solo tiene los 10 Pester de conducta; ningún test copia una frase ni la forma de una plantilla; y lo que rompe algo de verdad, más los topes, sigue parando el commit desde `cli:test`, con los mismos valores. Fracaso aunque funcione: que un tope de palabras, una ruta de 140 caracteres o un enlace roto de `.docs/workflow/` dejen de parar el commit porque moon da el test por bueno desde la caché.

## Scope

- Entra: borrar los 57 Pester que no son de conducta; portar a `cli/test/kit/` lo de la tabla y el test genérico de skills invocadas; `testInputs` de `cli/moon.yml`; las rutas en `sdd-upgrade/SKILL.md`, `spec-template.md`, las cuatro capacidades, `constitution.md`, `architecture.md`, `tech-stack.md` (estado, no los aprendizajes), `README.md`, el `CLAUDE.md` del repo; la ADR 0019; las filas 0224, 0227 y 0045 del roadmap.
- No entra: los 10 Pester de conducta (0227), `tests/Invoke-KitTests.ps1`, `moon.yml` raíz, `.githooks/` y `Start-KitSession.ps1` (0228); los aprendizajes cronológicos de `tech-stack.md` y las ADR, que citan Pester como historia; quitar el margen de la B21.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `tests/WordBudget.Tests.ps1` | `constitution.md:23`, `architecture.md:74-76`, `capabilities/archive.md:182`, `capabilities/feature-flow.md:611`, `spec-template.md:131`, roadmap fila 0224 | `cli/test/kit/word-budget.test.ts` · Scope, delta (`archive` regla, `feature-flow` `MODIFIED`), decisión 13 |
| `tests/MigrationInitParity.Tests.ps1` | `skills/sdd-upgrade/SKILL.md:24`, `capabilities/migration.md:124,135,164` | `cli/test/kit/migration-init-parity.test.ts` · Scope, delta (`MODIFIED`) |
| `tests/RoadmapStructure.Tests.ps1` | `capabilities/roadmap.md:82` | delta (`MODIFIED`): los mensajes los fijan los tests de `cli/test/roadmap/` |
| `tests/WorkflowDocs.Tests.ps1` | `CLAUDE.md:21` | `cli/test/kit/workflow-docs.test.ts` · Scope |
| «los Pester que quedan son de frases y anatomía» | `CLAUDE.md:23`, `README.md:159`, `tech-stack.md:6-8`, ADR 0011 | Scope; la ADR, decisión 10 |
| `tests/Skills.Tests.ps1`, `Manifests`, `PathLength`, `FastSuiteBudget`, `SuperpowersCompat`, `TempDir` | `tech-stack.md:7-8,51,58,65` | las líneas de estado (7-8), al fichero nuevo; 51, 58 y 65 son aprendizajes: no se tocan (Scope) |
| Pester citados en «Confirmación» | ADR 0001, 0002, 0005-0008, 0010, 0012, 0014-0016 | decisión 11 |
| `Pester`, `Invoke-Pester`, `tests/Foo.Tests.ps1` | `capabilities/feature-flow.md:362,369,467`, `plan-template.md:148` | se quedan: son ejemplos de un proyecto que usa Pester, no ficheros del kit |
| `DispatchBrief.Tests.ps1` | título de un test de `cli/test/tasks/executing.slow.test.ts:106` | se queda: nombra el origen del caso |

- Filas que implementa: 0226 → roadmap; deuda «¿Hacen falta ~416 tests Pester…?» → roadmap; 0045 → roadmap (decisión 13) — comprobado con `grep -n "0226\|416 tests" .docs/sdd/roadmap.md`

## Approach

Clasificación medida el 2026-10-26 (decisión 1):

| Grupo | Ficheros | Qué pasa a Vitest |
| --- | --- | --- |
| Útiles enteros (3) | `WordBudget`, `PathLength`, `Manifests` | todo, con los mismos valores |
| Útiles en parte (6) | `Skills` (frontmatter que lee Claude Code, `description` ≤ 1.024, sin `@`, enlaces, `references/` sin huérfanos, índice de `sdd-templates`, lista de superpowers del README, manifests), `NamingConvention` (solo los proyectos reales), `WorkflowDocs` (marcador de revisión y enlaces rotos), `RoadmapStructure` (cabecera de release), `AgentDefinitions` («Tipos de agente por effort»), `MigrationInitParity` («Paridad migración–init» salvo la frase de `sdd-upgrade`) | lo útil; el resto se borra con el fichero |
| Nuevos genéricos | sustituyen a los nombres retirados de 11 ficheros (decisión 6) y a los `NOTICE` de `ForkSkills` y `SuperpowersCompat` | toda skill invocada existe; toda skill que dice adaptarse de otra fuente lleva `NOTICE` |
| Se borran (48) | los demás que no son de conducta, `AnchorTemplates`, `RoadmapClosing` y `ControlProfiles` incluidos | nada |
| Conducta (10) | decisión 14 | no se tocan |

## Dónde se prueba

- Topes, rutas, carga, enlaces, skills invocadas y privacidad: `pnpm exec vitest run test/kit` en `cli/`, la suite que corre `cli:test` en el pre-commit; el RED es que cada test portado falle con el mismo caso que hacía fallar su Pester (un tope bajado, una ruta de 141 caracteres, un enlace roto, `sdd-end-feature` escrito en una skill), comprobado una vez por fichero y descartado.
- Que la caché no los salte: `moon run cli:test` tras tocar solo `.docs/workflow/usage-guide.md` corre la tarea, no sale de la caché.
- Referencias a los Pester borrados: `git grep` sobre `skills/` y `capabilities/`, una vez, con su salida antes y después en el walkthrough (decisión 7).
- Lo que queda en Pester: `moon run kit:test-fast` en verde, con solo los ficheros de conducta.

## Términos y ADR

- Términos resueltos: **frase** — un test que comprueba que una oración de prosa sigue escrita; **lo que rompe algo de verdad** — un test cuyo fallo sufre alguien: Claude Code no carga la skill, el agente sigue un enlace a nada o invoca una skill que no existe, se publica un nombre real, Windows no saca la ruta, la CLI no parsea (decisión 1).
- ADR candidatas: las skills no se prueban por sus frases — alternativa descartada: portar las frases a Vitest o quedarse solo con las frases de contrato (criterio de la 0045)

## Delta de comportamiento

### Capacidad: `migration`

**MODIFIED — La migración a v2.0.0 quita el historial de las capacidades** (antes: "`tests/MigrationInitParity.Tests.ps1` sigue en verde")

- GIVEN un proyecto en el kit v1.1.0 con `capabilities/bookings.md` terminado en `## Historial` con dos líneas
- WHEN se migra al kit v2.0.0
- THEN `bookings.md` pierde la sección `## Historial` entera, con su ayuda y sus líneas, y nada más, sin gate
- AND la verificación de la migración ejecuta `sdd capability check --path .docs/sdd`; si falla por otra cosa que el historial (un bloque de reglas del delta pegado, un requisito sin escenario), el informe lo lista como pendiente del dev-lead, sin tocarlo
- AND `cli/test/kit/migration-init-parity.test.ts` sigue en verde con `v2.0.0.md` en la carpeta
- AND sin carpeta `capabilities/`, el paso se salta y lo dice

**MODIFIED — La migración a v2.0.0 añade el propósito a las capacidades** (antes: "`tests/MigrationInitParity.Tests.ps1` sigue en verde")

- GIVEN un proyecto en el kit v1.1.0 con `capabilities/bookings.md`, que abre con el párrafo «Verdad viva de las reservas de salas por franja. La declaró la spec de la task 0003.» y no tiene `## Propósito`
- WHEN se migra al kit v2.0.0
- THEN `bookings.md` lleva tras el título `## Propósito` con una o dos frases de 300 caracteres como máximo sacadas de ese párrafo sin la procedencia («Reservas de salas por franja.»), y el párrafo desaparece
- AND si la capacidad no tiene párrafo bajo el título, el propósito sale de los títulos de sus requisitos
- AND va sin gate, y el informe lista las capacidades a las que se ha escrito el propósito, para que el dev-lead lo revise en el diff
- AND la verificación de la migración ejecuta `sdd capability check --path .docs/sdd`, y no queda ningún fallo del propósito
- AND la línea `**Escribe**:` de `v2.0.0.md` no gana tokens: el paso va en su frase «Además…», como el del historial, y `cli/test/kit/migration-init-parity.test.ts` sigue en verde
- AND sin carpeta `capabilities/`, el paso se salta y lo dice

**MODIFIED — La migración a v2.3.0 lleva el roadmap a la forma de la plantilla** (antes: "`tests/MigrationInitParity.Tests.ps1` sigue en verde")

- GIVEN un proyecto en 2.2.0 con `roadmap.md` commiteado en `284d195`, que falla `sdd roadmap check` (sección «Versión siguiente», decisiones en prosa, una fila saldada antes de la última release), y el dev-lead presente
- WHEN pide «ponme el proyecto al día»
- THEN el agente presenta una tabla con cada bloque que sale o se mueve y su destino, y espera la aprobación antes de cambiar `roadmap.md`
- AND tras aprobar, `sdd roadmap check` escribe `Roadmap válido` y sale con 0
- AND el informe y el cuerpo del commit de la migración llevan `git show 284d195:.docs/sdd/roadmap.md` como la forma de ver el roadmap anterior
- AND si el dev-lead cambia un destino de la tabla, se aplica el suyo; si la rechaza, `roadmap.md` queda sin tocar y el paso, pendiente
- AND con `roadmap.md` sin commitear, el paso para antes de la tabla y lo dice
- AND `v2.3.0.md` declara en su línea `**Escribe**:` `roadmap.md`, `validation.mode` y el marcador, y `cli/test/kit/migration-init-parity.test.ts` sigue en verde

### Capacidad: `roadmap`

**MODIFIED — Las cabeceras de tabla y los estados son los de la plantilla** (antes: "los mensajes que hoy da `tests/RoadmapStructure.Tests.ps1`")

- GIVEN una sección de release cuya tabla empieza por `| id | Task | Tamaño | Estado |`, una fila de «Próximo» con el estado `pendiente` y otra con `❌ descartado`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: línea <n>: la cabecera de «Release 1.3» debe ser «| id | Feature | Origen | Ficheros que toca | Estado |»`, y para cada una de las dos filas `roadmap.md: línea <n>: estado «<texto>» no admitido: ⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …`, y sale con 1
- AND una fila suelta, una fila vacía o una cabecera descuadrada con su separador dan su mensaje con el prefijo `roadmap.md: `, fijado en los tests de `cli/test/roadmap/`
- AND los tests fijan el número de línea exacto de cada fixture

### Capacidad: `feature-flow`

**MODIFIED — La spec mide el margen de palabras de lo que edita** (antes: "`tests/WordBudget.Tests.ps1` con `'sdd-propose' = @{ SkillMd = 5000; Total = 6325 }`")

- GIVEN un proyecto con topes de palabras (`cli/test/kit/word-budget.test.ts` con `'sdd-propose': { skillMd: 5000, total: 6325 }`) y una spec que edita `sdd-propose`, medido en 4.908 y 6.324
- WHEN el agente escribe la spec
- THEN la sección «Topes de palabras» lleva una fila por skill o documento con tope que la spec edita, con lo medido, el tope, el margen y el tope propuesto: `sdd-propose · 4.908 / 5.000 y 6.324 / 6.325 · 92 y 1 · 5.200 / 6.700`
- AND el tope propuesto es lo medido más lo previsto más un 2 % (mínimo 20 palabras) para la pasada de fix, y el gate lo aprueba como decisión del dev-lead
- AND el de una skill que funde otras parte de la suma medida de las fuentes, menos lo común, más margen
- AND si durante la feature se recorta texto para caber, el recorte es una edición de skill: si quita una instrucción, lleva su RED
- AND sin topes en el proyecto, la sección no se escribe

### Capacidad: `archive`

**Reglas de la capacidad**
- **Límites**: tope de palabras de `sdd-archive`, `SKILL.md` 3.920 y total 8.000 (`cli/test/kit/word-budget.test.ts`); la suite completa una vez por árbol (en la validación, y otra tras el merge de sincronización solo si la base trae cambios fuera de `.docs/` que no sean `*.md`); el informe de rojo lleva las últimas 20 líneas; una suite E2E que pasa de su «Presupuesto E2E», o sin presupuesto, una suite de más de 10 minutos, va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` dentro del `NOTICE` y el anexo de procedencia de `sdd-archive` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0)

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-upgrade` (`SKILL.md` y total) | 964 / 980 (1.225 con el margen B21) | 16 (261) | sin cambio: la ruta nueva tiene las mismas palabras |
| `sdd-templates` (total) | 15.699 / 15.720 (19.650) | 21 (3.951) | sin cambio: una ruta por otra |
| kit entero | 91.543 / 91.328 (114.160) | −215 (22.617) | sin cambio: ya pasa del tope sin margen; lo vigila la B21 |
| `constitution.md` | 2.236 / 2.236 (2.795) | 0 (559) | sin cambio: una ruta por otra |
| `architecture.md` | 1.900 / 1.900 (2.375) | 0 (475) | sin cambio |
| `tech-stack.md` | 19.651 / 19.663 (24.578) | 12 (4.927) | sin cambio: las líneas 6-8 se reescriben, no crecen |

## Enmiendas

- 2026-10-26 — decisión 3: `testInputs` de `cli/moon.yml` pasa a `/**/*`, porque con la lista aprobada una ruta de 144 caracteres en `.agents/` deja `cli:test` en caché y en verde (reproducido tras la revisión final, eje Spec, Important 1) — aprobada por el dev-lead en el gate de la enmienda («Apruebo '/**/*' (Recomendada)»)

## Aprobaciones
- 2026-10-26 — Àngel Delgado aprueba la spec en el gate («Apruebo (Recomendada)»), con la decisión 3 sobre `cli/moon.yml`
