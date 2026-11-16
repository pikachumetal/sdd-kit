---
id: 20261017-143533-feature-0156-sdd-init
feature: 0156
parent: 0144
proposal: 0131
title: sdd-init — una sola init para proyecto nuevo y con código, con lo determinista en `sdd init`
mode: full
profile: delegate
status: done
created: 2026-10-17
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-17
---

# Spec — `sdd-init`: una sola init, con lo determinista en `sdd init`

🦆 Hoy hay dos skills para empezar con el kit, una para un proyecto nuevo y otra para uno con código, y las dos repiten casi todo. Pasa a haber una, `sdd-init`, que mira si el repo tiene código y, si lo tiene, deduce del código lo que antes preguntaba y te lo enseña para confirmar. Cada documento se escribe solo cuando lo apruebas, también el `CLAUDE.md`, y la init apunta en `sdd-kit.json` cada documento aprobado: si la sesión se corta tras aprobar `PRODUCT.md` y la constitution, la siguiente lo lee, no te los vuelve a enseñar y sigue por `operations.md`. Lo que no necesita juicio (el `.claude/settings.json` completo con los dos marketplaces y los plugins, el `.gitignore`, ese registro y el marcador con la versión del kit) lo escribe un verbo de la CLI, `sdd init`, que también usará la migración de la 0157. Los documentos nacen ya con la forma de la 3.0.0: `PRODUCT.md`, `ROADMAP.md` y `CHANGELOG.md` en la raíz y el resto en `.docs/sdd/steering/`.

## Capacidades

- Modificadas: `onboarding` — una sola init con dos modos por predicado, los documentos de la 3.0.0, `CLAUDE.md` dentro del gate, la init en curso registrada en `sdd-kit.json`, §Testing en la entrevista y el marcador escrito por `sdd init`
- Modificadas: `capabilities` — el volcado inicial a petición vale en los dos modos; `changes/` en lugar de `specs/`
- Modificadas: `migration` — el procedimiento y las migraciones pasan a `skills/sdd-init/references/migrations/`; el aviso del hook nombra `sdd-init`; la paridad cuenta `cli/src/init/`; un proyecto al día no se migra
- Modificadas: `routing` — el hook nombra `sdd-init`; una init en curso entra por `sdd-init`
- Modificadas: `cli` — verbo nuevo `sdd init`
- Modificadas: `archive` — el hotfix busca las migraciones en su ruta nueva
- Modificadas: `feature-ids` — la pregunta del modo de ids nombra una sola init (literal viejo que encontró el cierre)

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (nombre de la skill que nombran las otras skills, los proyectos y el hook; verbo nuevo `sdd init` y la forma de `.claude/settings.json` que escribe), MODIFIED (25 requisitos), tres o más capacidades (6), datos (`sdd-kit.json` cambia de quién y cuándo lo escribe) · tamaño: ~900 líneas en ~50 ficheros
- Dominio: si la tabla de reglas retiradas (Art. I) cubre cada paso, red flag y racionalización de las dos init; si el registro de la init en curso deja algún camino (template, migración, sin usuario) mal leído; si cada MODIFIED de `onboarding` conserva las cláusulas vigentes (señal: MODIFIED + contrato público)
- Técnica: si `sdd init` puede romper un `.claude/settings.json` existente (claves con otra fuente, JSON inválido, `autoMemoryEnabled: true`), si la paridad migración–init sigue midiendo algo con la fuente en la CLI, y si el Scope lista cada fichero que nombra las dos init (señal: contrato público + datos)
- Mínimo razonable: un revisor con los siete puntos — deja menos mirada la fusión de `settings.json` y la lista de ficheros que nombran las skills viejas
```

1. **Una sola skill, `sdd-init`, en inglés** (Art. III), que habla con el usuario en su idioma. Sin skill puente: `sdd-init-greenfield` y `sdd-init-brownfield` desaparecen de `skills/` sin alias, como en la 0149. Sus `references/` pasan a `skills/sdd-init/references/` traducidas al inglés: `structure.md` (de `estructura.md`) y `generation.md` (de `generacion.md`, con las reglas de oro).
2. **El modo sale de un predicado observable, no de la frase del usuario**: «con código» si la raíz tiene un manifiesto (`package.json`, `*.csproj`, `*.sln`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json`, `Gemfile`) o, fuera de `node_modules/`, `.git/` y `.docs/`, algún fichero con extensión `.ts`, `.js`, `.cs`, `.java`, `.py`, `.go`, `.rs`, `.php`, `.rb`, `.kt` o `.swift`; si no, «sin código». Con código, lo que el código muestra se presenta como propuesta para confirmar (lo de brownfield); sin código, se pregunta (lo de greenfield). **Un template recién instanciado es «sin código»** aunque traiga código (login y poco más): con el marcador `sdd-template: pending` lo decide el predicado (a), y sin él, el usuario lo corrige. El agente dice el modo en una línea antes de la primera pregunta, y con «con código» añade «si es un template recién instanciado, dímelo y sigo sin código».
3. **Predicados de entrada, en este orden**: (a) un `<!-- sdd-template: pending -->` en `.docs/sdd/` o en `PRODUCT.md`/`ROADMAP.md` → init sobre template, en modo sin código, que completa solo lo marcado y en la forma en que vienen sus documentos (2.x o 3.0.0); es el caso más común, el de `sdd-project-template` con su `/init-template`, que lanza `sdd-init`; (b) `.docs/sdd/sdd-kit.json` con la clave `init` → init en curso; (c) `.docs/sdd/sdd-kit.json` sin la clave `init` → migración, con el procedimiento de `references/migrations/README.md` y nada más (la 0157 lo saca a `sdd-upgrade`); con la `version` igual a la del kit, dice «el proyecto ya está al día con el kit <versión>» y no toca nada; (d) `.docs/sdd/mission.md` o `.docs/sdd/constitution.md` sin `sdd-kit.json` → pregunta si es un proyecto anterior a la v0.2.0 (migración, recomendada) o una init de la 2.x que se cortó (init nueva, con esos documentos como material de la cosecha); (e) nada de lo anterior → init nueva. Un `PRODUCT.md`, `CLAUDE.md`, `CHANGELOG.md` o `ROADMAP.md` previos no deciden el predicado: son material de la cosecha.
4. **La init en curso se registra en `sdd-kit.json`** (0034, B6): la clave `init` (`{"approved": [<rutas>], "config": {…}}`) la escriben `sdd init --approved <ruta>` tras cada «sí» y `sdd init --config <json>` tras las respuestas de `sdd-config`; `sdd init --finish` la quita. Solo cuenta como aprobado lo que está en `init.approved`, no lo que hay en disco. Una init en curso lista lo aprobado, no lo vuelve a presentar, recupera las respuestas de `sdd-config` de `init.config` y sigue por el primer documento que falta en el orden de la decisión 9; con todo aprobado, sigue por el paso de git.
5. **Un fichero previo de la raíz no se sobrescribe sin su gate**: `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md` o `CLAUDE.md` que ya existen se cosechan (lo verificado al documento que toca, lo no verificado a la lista de discrepancias) y su versión nueva se presenta con el diff contra la vieja antes del «sí».
6. **Sin usuario, la init espera** en los dos modos: su último mensaje es la primera pregunta o el primer documento por aprobar. Desaparecen los documentos «PENDIENTES DE REVISIÓN» de brownfield. Coste si mal: un brownfield desatendido ya no deja borradores escritos.
7. **`CLAUDE.md` dentro del gate** (0034, B4): es el último documento, se presenta como los demás y se escribe tras su «sí».
8. **Orden del final**: documentos → `sdd estimation log` → paso de git → `sdd init --finish` → resumen de cierre. `--finish` va tras el git para que una sesión cortada en el plan de ramas se retome como init en curso, no como migración.
9. **Documentos de la 3.0.0**, calcados de `sdd-templates`, en este orden: `PRODUCT.md` (raíz) → `.docs/sdd/steering/constitution.md` → `.docs/sdd/steering/operations.md` → `.docs/sdd/steering/architecture.md` → `ROADMAP.md` (raíz, `now-next-later-template.md`) → `.docs/sdd/steering/debt.md` (solo con código, con la deuda del inventario en «Por triar») → `.docs/sdd/steering/estimation.md` (calibración vacía) → `CHANGELOG.md` (raíz, opt-in) → `CLAUDE.md`. `environments.md` pasa a `## Entornos` de `operations.md`; el stack y sus decisiones abiertas, a `architecture.md` y a filas de Next del `ROADMAP.md`; las versiones y los bloqueos, a los manifiestos y a `debt.md`.
10. **Retiro de plantillas**: `mission-template.md`, `tech-stack-template.md` y `environments-template.md` salen de `sdd-templates`, como la marca «2.x: la retira la 0156» ya decía. Quedan `roadmap-template.md` (la retira la 0157) y `client-changelog-template.md` (la 0177). Las skills que aún nombran `mission.md`, `tech-stack.md` o `environments.md` de un proyecto 2.x no se tocan: leen documentos del proyecto, y su coherencia con la 3.0.0 es de la 0152.
11. **Sin changelog de cliente en la init**: la pregunta 14 de greenfield y la 3 de brownfield desaparecen (la propuesta lo saca; la plantilla la retira la 0177).
12. **§Testing en la entrevista** (0097): con código, `## Testing` de `operations.md` sale de los manifiestos, los scripts y el CI del repo (suites con su comando; lo afectado; gates de cierre y de merge; acceso a la aplicación; motor de producción) como propuesta dentro del gate de `operations.md`; la duración de cada suite queda `pendiente` salvo que el usuario la diga, porque medirla es correr la suite. Sin código, una pregunta «¿Cómo se prueba?» con la recomendación que sale del stack; «no sé» deja cada campo sin respuesta como `no declarado`, el literal que ya lee el paso 5 de `sdd-propose`.
13. **Canal y versión** (0034, A6): `channel` es siempre `plugin` (la propuesta deja la distribución solo como plugin) y no se pregunta; `version` es la de `.claude-plugin/plugin.json` del kit cargado, que lee `sdd init --finish`, no la mayor de `migrations/`. En la init sobre template, `--finish` conserva la `version` que trae el template, porque dice la forma de sus documentos: un template 2.x queda con su versión y su forma, y el hook le ofrece la migración (la 0157); el resumen de cierre lo dice. Migrar la skill puente del template a `sdd-init` es trabajo del repo del template, no de esta feature.
14. **Ramas con código**: con código, la pregunta de ramas recomienda la convención que se ve en el repo (ramas y rama por defecto del remoto); git-flow es la recomendada solo sin código o sin convención que se vea. Gestor de tickets y worktrees se preguntan en los dos modos: el código no los dice.
15. **Verbo `sdd init`** (Principio 4), con `--root <raíz>` y, como mucho, una de estas acciones por llamada:
    - `--config <json>`: fusiona en profundidad el objeto en `init.config` (en curso) o en la raíz de `sdd-kit.json` (sin `init`); en las hojas gana el `--config`; `version`, `channel`, `updated` e `init` del `--config` se ignoran con la línea `<clave>: la fija sdd init, se ignora`.
    - `--approved <ruta>`: añade la ruta a `init.approved` sin duplicar; crea `sdd-kit.json` con solo `init` si no existe.
    - `--finish [--ignore <ruta>]… [--memory-off]`: escribe `.claude/settings.json`, `.gitignore` y `sdd-kit.json`, en ese orden, este el último; sube `init.config` a la raíz, pone `version`, `channel: plugin` y `updated` del día, y quita `init`.
    - Sin acción, sale con 2 y el uso.
16. **Fusión de `.claude/settings.json` por hoja** (0093): el bloque es `autoMemoryEnabled: false`; `extraKnownMarketplaces.sdd-kit` = `{"source": {"source": "github", "repo": "pikachumetal/sdd-kit"}, "autoUpdate": true}`; `extraKnownMarketplaces.superpowers-marketplace` = `{"source": {"source": "github", "repo": "obra/superpowers-marketplace"}, "autoUpdate": true}`; `enabledPlugins["sdd-kit@sdd-kit"]` y `["superpowers@superpowers-marketplace"]` = `true`. Cada hoja que falta se añade; una hoja que existe con otro valor se deja y sale `<ruta con puntos>: se deja <valor JSON>` (p. ej. `extraKnownMarketplaces.sdd-kit.source.repo: se deja "otro/fork"`); las demás claves no se tocan. Con `autoMemoryEnabled: true` la línea es `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`, y con su «sí» el agente repite `--finish` con `--memory-off`, que la pone a `false`. Una ruta del bloque que existe con otro tipo (`enabledPlugins: []`) hace el fichero no fusionable.
17. **Atomicidad**: antes de escribir nada, `sdd init` lee y valida los ficheros que va a tocar. Un `.claude/settings.json` o un `sdd-kit.json` que no son JSON válido o no son fusionables no se tocan: `<ruta> no es JSON válido: no se toca` o `<ruta> no se puede fusionar: <ruta con puntos> no es un objeto`, sale con 1 y no escribe ningún fichero.
18. **`.gitignore`**: se crea si no existe; una línea se compara exacta tras quitar espacios a los lados, así que `.superpowers` sin barra o `/.superpowers/` no cuentan como la misma; respeta el fin de línea que ya usa (CRLF o LF) y añade el salto final que falte. `shortcut`: no reconoce variantes equivalentes de una ruta; se mejora si un proyecto lo reporta.
19. **Salida y códigos**: una línea por fichero (`<ruta>: creado`, `actualizado` o `sin cambios`); `updated` solo cambia si cambia otra clave de `sdd-kit.json`, así que repetir `--finish` da `sin cambios` en los tres. Sale con 0; con 1 en los casos de la decisión 17; con 2 si `--root` no existe, si el `--config` no se puede leer como JSON o no es un objeto (`[1]`, `{`), o si un `--ignore` está vacío, es absoluto o sale de la raíz con `..`.
20. **Una sola fuente del bloque de settings**: la constante de `cli/src/init/`, con cada clave escrita literal (la paridad la busca como texto). El README marca su bloque con `<!-- sdd-init: settings -->` y un test Vitest lo compara con la constante. El párrafo del README que pide añadir a mano el marketplace del kit y `enabledPlugins` se reescribe: los escribe la init.
21. **El alta de los marketplaces en la máquina se queda en la skill**: si `claude plugin marketplace list` no muestra `superpowers-marketplace`, el agente ejecuta `claude plugin marketplace add obra/superpowers-marketplace`, como hoy. La CLI no llama a `claude`.
22. **`estimation-log.md`** lo sigue generando `sdd estimation log --root "<raíz>"`, que ya resuelve la ruta 3.0.0 (`steering/`); `sdd init` no lo duplica.
23. **El volcado inicial de capacidades vale en los dos modos**, con sus condiciones de hoy (solo a petición, nunca se ofrece, partición aprobada antes de escribir, cada capacidad con gate, sin volcado si no lee el código entero en la sesión). Sustituye a «Brownfield no vuelca `capabilities/`»: con la partición y el gate por capacidad ya no salen ficheros que nadie revisa, y la condición de leer el código entero frena el volcado en un repo grande.
24. **Las migraciones pasan a `skills/sdd-init/references/migrations/`** sin cambiar su contenido salvo los nombres de skill de `README.md`; `v0.4.0.md`, `v1.0.0.md` y `v2.0.0.md` no se tocan (describen versiones pasadas). El hook (`cli/bin/session-start.js`) las busca en la ruta nueva y su aviso dice «pide «ponme el proyecto al día con sdd-init»». El hook no cambia con un `sdd-kit.json` en curso: sin `version`, no avisa. La 0157 moverá las migraciones a `sdd-upgrade`.
25. **Paridad migración–init**: `tests/MigrationInitParity.Tests.ps1` mide un solo corpus: `sdd-init` (su `SKILL.md`, sus `references/` sin `migrations/` y lo que enlazan, `sdd-config` incluido) más los `.ts` de `cli/src/init/`, porque las claves que escribe la CLI ya no están en el texto de la skill.
26. **Moldes de las baterías**: las constituciones y los `CLAUDE.md` de los moldes que nombran las init viejas se renombran (`tests/batteries/sdd-grilling/battery.md` incluido); las campañas `tests/*-red.md`, `*-green.md` y `*-ab.md` no se editan (son eventos).
27. **Topes de palabras**: `sdd-init` con `SkillMd = 2400; Total = 3000` (las dos de hoy suman 2.900 y 3.800); salen las filas de `sdd-init-greenfield` y `sdd-init-brownfield` de `tests/WordBudget.Tests.ps1`. El `Total` no cuenta `migrations/`, como hoy.
28. **Red flags y racionalizaciones que cambian**: el red flag de `docs/` pierde «ADR sueltos» y la racionalización «una estructura con ADR y glosario es más estándar» sale, porque la 3.0.0 tiene `decisions/` y `## Terminology`.
29. **Prueba (Art. I)** — batería nueva `tests/batteries/sdd-init/` (molde sin código y molde con código) con estos escenarios, cada uno con su RED con las skills de hoy antes de escribir la guidance: `n1` `CLAUDE.md` dentro del gate, con un `CLAUDE.md` previo (B4); `n2` init en curso que retoma sin re-presentar ni migrar (B6); `n3` §Testing deducido del código, con los gates propuestos y la duración `pendiente` (0097); `n4` humo sin código hasta la primera pregunta (una por turno, nada escrito); `n5` template instanciado con código de arranque y `sdd-template: pending` en documentos 2.x, que va sin código, no inventaría y no toca lo completo (molde calcado de la forma de `sdd-project-template`, sin copiar su contenido). Además, el tramo `sdd-init` de la batería de `using-sdd`: `i1` pasa a esperar `sdd-kit:sdd-init`, y entra `i2`, «Sigue con la init, se cortó ayer», en un molde con `sdd-kit.json` en curso. `sdd init` se prueba con Vitest, sin sujetos.
30. **Previsión de coste**: RED 3 sujetos (`n1`–`n3`), GREEN 10 (`n1`–`n3` con n = 2; `n4`, `n5`, `i1` e `i2` con n = 1), Sonnet: ~13 sujetos, ~60 min y ~10 $. `n5` no lleva RED: la init de hoy sobre template ya va como greenfield, y el escenario es de no regresión. Techo: 17 sujetos o 14 $; si se supera, para y decides tú.
31. **Una pieza entra, otra sale**: entran `sdd-init` y el verbo `sdd init`; salen dos skills (dos `description` menos en todas las sesiones), tres plantillas, la pregunta del changelog de cliente y los documentos «PENDIENTES DE REVISIÓN».
32. **Entrada del changelog del kit**: `Changed` (una sola init), `Added` (`sdd init`), `Removed` (las dos init y las tres plantillas). La escribe el cierre.
33. **Art. V de la constitution** cambia solo la ruta de `migrations/`; no es un cambio de convención (Art. IV), sino de dónde vive el fichero.

### Hallazgos de la review

Dominio (Opus):

- **Aceptado** — Crítico: «escrito = aprobado» tomaba como aprobados un `PRODUCT.md` de impeccable o un `CLAUDE.md` y un `CHANGELOG.md` previos → lo aprobado se registra en `init.approved` de `sdd-kit.json` (decisiones 3, 4 y 5; ADDED «Una init interrumpida se retoma por su registro», escenario con `CLAUDE.md` previo).
- **Aceptado en parte** — Crítico: el template conservaba `version` `1.1.0` sobre documentos 3.0.0 → la init completa el template en la forma en que vienen sus documentos, y la `version` que trae lo dice: con documentos 2.x se queda la suya y el hook ofrece la migración (decisiones 3 y 13; MODIFIED del template). Pararla con un template 2.x, como proponía, rompía el caso más común del dev-lead (`sdd-project-template`, hoy en la 2.x).
- **Aceptado** — tramos sin retomar tras `sdd init` y antes del git, y con todo escrito sin marcador → `--finish` va tras el git, y con todo aprobado se sigue por el git; las respuestas de `sdd-config` se recuperan de `init.config` (decisiones 4 y 8).
- **Aceptado** — `mission.md` sin marcador era a la vez anterior a la v0.2.0 e init 2.x cortada → pregunta, con la migración recomendada (decisión 3(d); MODIFIED de `migration`); término y tabla alineados.
- **Aceptado** — «Dónde viven los datos» de `migration` perdía cláusulas → copiada entera con solo la ruta cambiada.
- **Aceptado** — textos vivos que quedaban falsos → MODIFIED de «`operations.md` dice cómo se ejecuta…» (campos de `## Frontend` sin nombrar la plantilla retirada) y de «La migración a v2.0.0 deja la configuración que deja la init»; el Propósito de `migration` y el Art. V entran en el Scope.
- **Aceptado** — git-flow recomendado en un repo con otra convención → con código se recomienda la convención observada (decisión 14; MODIFIED de ramas con escenario con código).
- **Aceptado** — nadie escribía `autoMemoryEnabled: false` tras el «sí» → `--memory-off` (decisión 16).
- **Aceptado** — faltaban las cinco reglas por nombre → «Reglas de la capacidad» en `onboarding` y en `cli`.
- **Aceptado** — filas que faltaban en la tabla del Art. I → añadidas (calcar sin copiar, solo claves respondidas, `channel: cli`, «no se detiene el desarrollo», versiones y bloqueos, tabla de patches, calibración vacía, reglas de producto deducidas).

Técnica (Sonnet):

- **Aceptado** — Crítico: la atomicidad no era verificable con el orden de escritura → se valida todo antes de escribir (decisión 17; escenarios por fichero).
- **Aceptado** — Crítico: la fusión de `settings.json` sin granularidad ni formato → por hoja, línea con la ruta con puntos y el valor JSON, tipo incompatible no fusionable (decisión 16; escenarios).
- **Aceptado** — `--config` ilegible, con `version`/`channel`/`updated`, y la fusión con un `sdd-kit.json` previo → decisiones 15 y 19 con escenarios. Las comillas de PowerShell no son del verbo: la skill pasa el JSON como un solo argumento.
- **Aceptado** — idempotencia contradictoria y `3.0.0` fijo → `updated` solo cambia con otra clave; el escenario usa la versión de `plugin.json` (decisión 19).
- **Aceptado** — `.gitignore` sin regla de comparación → decisión 18 con escenario de CRLF e inexistente.
- **Aceptado** — `--root` y `--ignore` inválidos → salida 2 (decisión 19).
- **Aceptado** — proyecto al día y lista de código del predicado → «ya está al día» sin tocar nada (decisión 3(c)); lista de manifiestos y extensiones (decisión 2).
- **Aceptado** — decisiones del cuerpo fuera de ✋ → decisiones 16, 17, 19 y 28; la entrada por `PRODUCT.md` sin `.docs/sdd/` deja de existir (el registro vive en `.docs/sdd/`).
- **Aceptado** — ficheros fuera del Scope → entran `.docs/sdd/constitution.md` (Art. V), `.docs/sdd/tech-stack.md` (líneas que nombran las init) y `tests/batteries/sdd-grilling/battery.md`; `.docs/sdd/roadmap.md` y `v1.0.0.md` van a «No entra» con motivo; `architecture.md` y `mission.md` del repo, solo árbol y glosario.
- **Aceptado** — bloque del README y paridad → marcador `<!-- sdd-init: settings -->` y claves literales en el `.ts` (decisión 20). El caso de «clave solo en la CLI» lo cubre la paridad, que ya falla si una clave de `**Escribe**:` no está en el corpus.

### Decisiones tomadas con el dev-lead

- Del prompt de arranque: `parent: 0144`, tras la 0144 (cerrada) y antes de la 0157; salda 0093 (`.claude/settings.json` completo), 0034 (`CLAUDE.md` dentro del gate, «init en curso», criterio de canal) y la pregunta de §Testing de la 0097; perfil `delegate`; al fusionar, `sdd merge --push` (2026-10-17)
- Review de la spec — «Dos, dominio en Opus (Recomendada)» (2026-10-17)
- Aprobación de la spec con el caso del template — «Apruebo (Recomendada)» (2026-10-17)
- Un template recién instanciado es greenfield aunque traiga código — «lo mas normal es que use el kit en greenfield sobre D:\code\git\sdd-project-template … terreno sin nada o template inicial los dos casos son greenfield por que el template maximo tendra el login y poco mas»; migrar la skill del template a `sdd-init` es suyo: «ese no es tu trabajo» (2026-10-17)

## Intent

Hoy el kit tiene dos init que comparten la mayor parte del texto y divergen en lo demás: greenfield pregunta y brownfield deduce, cada una con su lista numerada, y quien llega a un repo «casi sin código» elige una a ojo. Tres fallos de campo siguen abiertos: `CLAUDE.md`, el fichero que cargan todas las sesiones, se escribe sin aprobación (B4); una init cortada se reconstruyó del historial porque un fichero escrito no decía si estaba aprobado (B6); y la versión del marcador obliga a leer las migraciones de otra skill (A6). Además, el README pide al dev que añada a mano el marketplace del kit y `enabledPlugins` (0093), y nadie pregunta cómo se prueba el proyecto, de donde salen los cuatro reportes de gate de merge sin declarar (0097). El éxito: una sola skill, ningún documento escrito sin aprobar, una init cortada que se retoma por su registro, y un `settings.json` con el que un compañero que clona el proyecto tiene el kit sin tocar nada. En un repo con código, la init ahora pregunta también ramas, gestor de tickets y worktrees, recomendando la convención que ya usa.

## Scope

- Entra: `skills/sdd-init/` (`SKILL.md`, `references/structure.md`, `references/generation.md`, `references/migrations/` movida); borrar `skills/sdd-init-greenfield/` y `skills/sdd-init-brownfield/`; verbo `sdd init` en `cli/src/init/` con sus tests y su línea en `--help`; `cli/bin/session-start.js` y sus tests y fixtures (`cli/test/hook/`, `cli/test/fixtures/hook/`); `cli/test/capability/check.test.ts`; `skills/sdd-templates/SKILL.md` y borrar `mission-template.md`, `tech-stack-template.md` y `environments-template.md`; `skills/sdd-templates/templates/capability-template.md`; `skills/using-sdd/SKILL.md` (fila de init: sin `.docs/sdd/` o con `sdd-kit.json` en curso); los que nombran las init en `skills/` (`sdd-config`, `sdd-archive` y su `references/aprendizajes-skills.md`, `sdd-end-release`); `README.md` (catálogo, bloque de settings con su marcador y su párrafo, recuento de skills y plantillas); `CLAUDE.md` del repo («las 22 skills» pasa a 21); `.docs/workflow/` (guía de uso, greenfield, brownfield); en `.docs/sdd/`, solo las líneas que nombran las init: `architecture.md` (árbol), `mission.md` (glosario), `tech-stack.md` y `constitution.md` (Art. V, ruta de `migrations/`); los Pester que nombran las init o las plantillas retiradas (`AnchorTemplates`, `ArchiveSkill`, `Battery`, `CapabilitiesAtBirth`, `ControlProfiles`, `FeatureRename`, `FrontendVerification`, `HeadlessLauncher`, `LocalConfig`, `MigrationInitParity`, `NativeDefault`, `PlanEntry`, `SddConfig`, `TaskIds`, `UsingSdd`, `WordBudget`), `tests/headless/lib.sh`, `tests/batteries/sdd-archive/subject.sh` y `tests/batteries/sdd-grilling/battery.md`; batería nueva `tests/batteries/sdd-init/`; tramo `sdd-init` de `tests/batteries/using-sdd/`; las seis capacidades del delta, con el Propósito de `onboarding` y de `migration`
- No entra: `sdd-upgrade` y la migración v3.0.0 (0157); las skills que leen `mission.md`, `tech-stack.md` o `environments.md` de un proyecto (0152); la estructura del `.docs/sdd/` de este repo, que sigue en la 2.x hasta su migración; `.docs/sdd/roadmap.md` (sus filas son historia del trabajo); las ADR, specs, tickets, releases y campañas `tests/*.md` (son historia); `migrations/v0.4.0.md`, `v1.0.0.md` y `v2.0.0.md` (describen versiones pasadas); el changelog de cliente fuera de la init (0177)

## Approach

Una skill con un tronco y dos modos marcados (`With code:` / `Without code:`), como las marcas de carril de `sdd-archive`. El tronco: predicados de entrada → modo → inventario y cosecha (con código, o con ficheros previos) → entrevista con `sdd-grilling`, una tabla única con la columna de lo que se deduce con código → documentos uno a uno, cada uno escrito tras su «sí» y registrado con `sdd init --approved` → `sdd estimation log` → git → `sdd init --finish` → cierre. Lo determinista lo escribe `sdd init`, y la migración de la 0157 lo reutiliza.

## Dónde se prueba

- `sdd init` (las tres acciones, fusión por hoja, atomicidad, `.gitignore`, códigos de salida): Vitest en `cli/test/init/`, como los verbos de `cli/test/decisions/`; uno lento con un proyecto en un directorio temporal
- Bloque de settings del README igual a la constante de la CLI: un test Vitest que lee el bloque marcado del README
- Aviso del hook con la ruta y el texto nuevos, y sin aviso con `sdd-kit.json` en curso: `cli/test/hook/`, como hoy
- Conducta de la skill (gate de `CLAUDE.md`, init en curso, §Testing, primera pregunta): batería `tests/batteries/sdd-init/`, con `tests/headless/battery.sh`
- Enrutado de la init: tramo `sdd-init` de la batería de `using-sdd`
- Nombres retirados y paridad: los Pester del Scope, con `kit:test`

## Términos y ADR

- Términos resueltos: **init en curso** — un `.docs/sdd/sdd-kit.json` con la clave `init`; se evita «init a medias» en los textos del kit
- ADR candidatas: «El progreso de la init vive en `init` de `sdd-kit.json`, y `--finish` lo quita» — alternativa descartada: deducirlo de los ficheros en disco (`sdd-kit.json` el último como marca), que toma como aprobados los `PRODUCT.md`, `CLAUDE.md` o `CHANGELOG.md` que ya existían

## Tabla de reglas retiradas (Art. I)

| Regla de la skill retirada | Dónde vive ahora | Por qué se descarta |
| --- | --- | --- |
| G Overview: entrevista; cada documento se aprueba | `sdd-init` Overview | — |
| G ⛔ Sin entrevista no hay documentos; EN ESPERA en la primera pregunta | `sdd-init` ⛔ gate, en los dos modos (decisión 6) | — |
| G Estructura objetivo, no se rediseña | `sdd-init` + `references/structure.md` (3.0.0) | — |
| G 1 Entrevista con `sdd-grilling`; «no sé» / «no aplica»; lo existente como propuesta; lo que fijan las instrucciones no se pregunta | `sdd-init` paso de entrevista | — |
| G 1, preguntas 1–5 (problema, usuarios, módulos, fuera de alcance, términos) | tabla única → `PRODUCT.md` (módulos → `ROADMAP.md`) | — |
| G 1, preguntas 6–10 (cinco reglas de producto por nombre) | tabla única → constitution | — |
| G 1, pregunta 11 (stack, opciones y recomendación) | tabla única → `architecture.md`; abierto → fila de Next | — |
| G 1, pregunta 12 (innegociables) | tabla única → constitution | — |
| G 1, pregunta 13 (changelog) | tabla única → `CHANGELOG.md` | — |
| G 1, pregunta 14 (changelog de cliente) | — | la propuesta lo saca; la plantilla la retira la 0177 (decisión 11) |
| G 1, preguntas 15, 17 (gestor de tickets, worktrees) | tabla única → `CLAUDE.md`, en los dos modos (decisión 14) | — |
| G 1, pregunta 16 (ramas, git-flow recomendado) | tabla única → constitution y paso de git; con código, la convención observada (decisión 14) | — |
| G 1, pregunta 18 (entorno del worktree → `environments.md`) | tabla única → `operations.md` `## Entornos` | `environments.md` se retira (decisión 9) |
| G 1, pregunta 19 (`sdd-config`) | tabla única → `sdd init --config` | — |
| G 1, pregunta 20 (proyecto de referencia) | tabla única → constitution «Convenciones» | — |
| G 1, pregunta 21 (frontend → `tech-stack.md` §Frontend) | tabla única → `operations.md` `## Frontend` | `tech-stack.md` se retira |
| G 2 Generar documento a documento con gate | `sdd-init` paso de documentos, con el registro `init.approved` | — |
| G 3 Calcar de la plantilla sin copiar el `.docs/` del kit ni de otro proyecto; sin carpeta `templates/` | `sdd-init` + `references/structure.md` | — |
| G 3 `sdd-kit.json` con la mayor de `migrations/` | `sdd init --finish` con la versión de `plugin.json` | A6 (decisión 13) |
| G 3 Solo las claves respondidas; las preferencias no se preguntan aquí | `sdd init --config` (solo lo que pasa la skill) y cierre de `sdd-init` | — |
| G 3 Funcional aportado en `sources/`, literal | `sdd-init` paso de documentos; `PRODUCT.md` lo enlaza, `ROADMAP.md` cita su sección | — |
| G 3 `estimation-log.md` generado por la CLI | `sdd-init`, con `sdd estimation log` | — |
| G 3 `.claude/settings.json` (memoria, marketplace de superpowers, `marketplace add`) | `sdd init --finish` (bloque completo, 0093) + el `marketplace add` en la skill | — |
| G 3 `.gitignore` | `sdd init --finish` | — |
| G 3 `capabilities/` y `specs/` no se crean | `sdd-init`, con `changes/` y `decisions/` | — |
| G 4 `CLAUDE.md` corto | `sdd-init`, dentro del gate (decisión 7) | — |
| G 5 Git: `git init`; plan completo y «sí» sobre un repo existente; el remoto lo ejecuta el usuario | `sdd-init` paso de git | — |
| G 6 Cierre: resumen, partición y estimación, skills de nivel 2 | `sdd-init` cierre | — |
| G 6 Volcado inicial solo a petición, con partición y gate | `sdd-init` cierre, en los dos modos (decisión 23) | — |
| G `estructura.md`: `channel: "plugin"\|"cli"` | `sdd init --finish`, siempre `plugin` | la propuesta deja la distribución solo como plugin (decisión 13) |
| G red flag: mission o constitution sin entrevista | `sdd-init` red flags (`PRODUCT.md` o constitution) | — |
| G red flag: decidir MVP, rol o stack «como propuesta razonable» | `sdd-init` red flags | — |
| G red flag: `docs/`, `docs/superpowers/` o ADR sueltos | `sdd-init` red flags, sin «ADR sueltos» | la 3.0.0 tiene `decisions/` (decisión 28) |
| G red flag: estimation-log con filas o a mano | `sdd-init` red flags | — |
| G red flag: volcar sin petición o antes de la partición | `sdd-init` red flags | — |
| G racionalización: «el usuario no responde: asunciones documentadas» | `sdd-init` tabla | — |
| G racionalización: «todo como borrador pendiente» | `sdd-init` tabla | — |
| G racionalización: «ADR y glosario son más estándar» | — | la 3.0.0 tiene ADR (`decisions/`) y glosario (`## Terminology` de `PRODUCT.md`) (decisión 28) |
| G racionalización: «me niego a volcar» | `sdd-init` tabla | — |
| G racionalización: «el código es pequeño, vuelco y enseño al final» | `sdd-init` tabla | — |
| B Overview: no se detiene el desarrollo; la documentación mínima crece con cada tarea | `sdd-init` Overview | — |
| B No uses `/init` de Claude Code | `sdd-init` Overview | — |
| B Predicado: con `.docs/sdd/` se migra y nada más | `sdd-init` predicados (c) y (d) | `.docs/sdd/` con `sdd-kit.json` en curso es init en curso (decisión 3) |
| B Principio: estado real, no ideal | `sdd-init`, modo con código | — |
| B Principio: la constitution se propone | `sdd-init`, modo con código | — |
| B Principio: exploración barata con subagentes en repos medianos | `sdd-init`, modo con código | — |
| B 1 Inventario (stack, módulos, patrones, deuda, scripts de entorno) | `sdd-init` inventario; la deuda a `debt.md`, el entorno a `## Entornos` | — |
| B 1 y `generacion.md`: versiones exactas y bloqueos en `tech-stack.md` | versiones en los manifiestos; bloqueos a `debt.md` | `operations.md` no lleva versiones (decisión 9) |
| B 2 Cosecha del `CLAUDE.md` existente | `sdd-init`, en los dos modos y para cualquier fichero previo de la raíz (decisión 5) | — |
| B 3 Una pregunta o un documento por turno; PENDIENTES DE REVISIÓN sin usuario | `sdd-init`, sin el «PENDIENTES» | contradice que solo se escribe lo aprobado (decisión 6) |
| B 3, preguntas 1–5 (`sdd-config`, changelog, cliente, referencia, frontend) | tabla única, salvo el cliente | decisión 11 |
| B 4 Reglas de oro brownfield | `references/generation.md`, modo con código | — |
| B 5 Estructura (`ids`, settings, `.gitignore`, log, sin `templates/`, sin volcado) | `sdd init` + `sdd-init` | el «sin volcado aunque lo pida» pasa a la regla común (decisión 23) |
| B 6 `CLAUDE.md` como punteros + 3-5 reglas | `sdd-init`, dentro del gate | — |
| B 7 Cierre: discrepancias, preguntas pendientes, preferencias con `sdd-config`, skills de nivel 2/3 | `sdd-init` cierre | — |
| B red flag: copiar el `CLAUDE.md` viejo sin verificar | `sdd-init` red flags | — |
| B red flag: todo dentro del `CLAUDE.md` | `sdd-init` red flags | — |
| B red flag: constitution sin marcar como propuesta | `sdd-init` red flags | — |
| B red flag: ibas a lanzar `/init` | `sdd-init` red flags | — |
| B red flag: deuda en notas sueltas en vez de la tabla del roadmap | `sdd-init` red flags, con `debt.md` | — |
| B racionalización: «el CLAUDE.md ya lo dice» | `sdd-init` tabla | — |
| B racionalización: «reescribo el CLAUDE.md mejor» | `sdd-init` tabla | — |
| B racionalización: «el repo es pequeño, sin subagentes» | `sdd-init` tabla | — |
| B `generacion.md`: orden mission → tech-stack → architecture → constitution → roadmap | `references/generation.md`, orden de la decisión 9 | — |
| B `generacion.md`: reglas de producto deducidas del código como propuesta; lo no deducible, pendiente | `references/generation.md`, modo con código | — |
| B `generacion.md`: roadmap con deuda en tabla, bloqueos y tabla de patches vacía | deuda y bloqueos a `debt.md`; `ROADMAP.md` con la forma de `now-next-later-template.md` | la 3.0.0 no tiene tabla de patches |
| B `generacion.md`: `estimation.md` con la calibración vacía | `references/generation.md` | — |
| B `generacion.md`: `environments.md` si hay scripts de entorno | `operations.md` `## Entornos` | decisión 9 |

## Delta de comportamiento

### Capacidad: `onboarding`

> Propósito nuevo: «La inicialización de un proyecto con el kit (`sdd-init`): qué puede esperar un dev de la entrevista y de los documentos de anclaje que produce.»

**ADDED — Una sola init para proyecto nuevo y con código**
- GIVEN un repo con `package.json` y `src/app.ts`, y otro con solo un `README.md`
- WHEN el usuario pide «quiero trabajar con SDD en este proyecto»
- THEN en los dos se invoca `sdd-init`, y antes de la primera pregunta dice el modo en una línea: «con código» en el primero, «sin código» en el segundo
- AND con código, lo que el código muestra (stack, módulos, comandos, deuda) se presenta como propuesta para confirmar y no se pregunta en abierto; sin código, se pregunta
- AND si el usuario corrige el modo, sigue con el que dice

**ADDED — Cada documento se escribe solo tras su aprobación**
- GIVEN una init en la generación de documentos
- WHEN el agente presenta un documento
- THEN el borrador va en el chat y el fichero no se escribe hasta el «sí»; tras escribirlo, `sdd init --approved <ruta>` lo registra
- AND sin usuario, la init espera: su último mensaje es la primera pregunta o el primer documento por aprobar, y no ha escrito ningún documento

**ADDED — `CLAUDE.md` pasa por el gate**
- GIVEN una init con todos los demás documentos aprobados y un `CLAUDE.md` previo con «Usa `npm run dev` en el puerto 3000» y «Las fechas van en UTC»
- WHEN llega a `CLAUDE.md`
- THEN presenta el `CLAUDE.md` nuevo con el diff contra el previo y espera el «sí» antes de escribirlo
- AND «npm run dev en el puerto 3000», verificado en `package.json`, ha ido a `operations.md`; «las fechas van en UTC», sin verificar en el código, sale en la lista de discrepancias

**ADDED — Una init interrumpida se retoma por su registro**
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` = `{"init": {"approved": ["PRODUCT.md", ".docs/sdd/steering/constitution.md"], "config": {"ids": {"mode": "sequence"}}}}`, esos dos ficheros, un `CHANGELOG.md` previo, y la petición «sigue con la init»
- WHEN arranca `sdd-init`
- THEN dice que `PRODUCT.md` y la constitution están aprobados, no los vuelve a presentar y sigue por `operations.md`
- AND no aplica migraciones, no vuelve a preguntar el modo de ids, y trata `CHANGELOG.md` como fichero previo que se cosecha y pasa por su gate
- AND con todos los documentos en `init.approved`, sigue por el paso de git y `sdd init --finish`

**ADDED — Un fichero de la raíz que ya existe no decide nada**
- GIVEN un repo con un `PRODUCT.md` escrito por impeccable y sin `.docs/sdd/`
- WHEN el usuario pide «quiero trabajar con SDD en este proyecto»
- THEN es una init nueva, no una init en curso
- AND el `PRODUCT.md` se cosecha y su versión nueva se presenta con el diff antes del «sí»

**ADDED — La entrevista fija cómo se prueba el proyecto**
- GIVEN una init con código cuyo `package.json` tiene los scripts `test` (`vitest run`) y `e2e` (`playwright test`), y un CI que ejecuta `npm test`
- WHEN genera `operations.md`
- THEN `## Testing` propone las suites `unit` · `npm test` y `e2e` · `npm run e2e`, el gate de cierre y el de merge con esos comandos, y cada duración como `pendiente`
- AND sin código, pregunta «¿Cómo se prueba?» con la recomendación que sale del stack; con «no sé», cada campo sin respuesta queda `no declarado`

**ADDED — El marcador sale del kit y se escribe al final**
- GIVEN una init con el kit cargado cuyo `.claude-plugin/plugin.json` dice `3.0.0`
- WHEN termina
- THEN `sdd init --finish` escribe `.docs/sdd/sdd-kit.json` después del paso de git, con `version` `3.0.0`, `channel` `plugin`, `updated` del día y las respuestas de `sdd-config`, y sin la clave `init`
- AND la init no pregunta el canal

**MODIFIED — La entrevista fija las cinco reglas de producto** (antes: "una init greenfield o brownfield"; "las secciones «Qué es y qué no es» y «Dominio» de `mission.md`")
- GIVEN una init, con código o sin código, en su entrevista
- WHEN se cierra el bloque de producto
- THEN el agente ha preguntado por las cinco reglas por nombre (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto) —con código, deducidas del código como propuesta a confirmar— y la constitution propuesta lleva la sección «Reglas de producto» con las cinco: respondida, «pendiente» si el dev-lead no sabe o no se deduce, o «no aplica» si él lo dice
- AND una regla que difiere por capacidad se lista por capacidad dentro de su entrada
- AND el bloque de proceso ha decidido además el modo de ids del proyecto, que se escribe en `sdd-kit.json`
- AND sin código la entrevista incluye qué queda fuera de alcance y qué términos del dominio se fijan, y `## Capabilities and Constraints` y `## Terminology` de `PRODUCT.md` llevan la respuesta, o «pendiente» o el marcador de la plantilla si el dev-lead no sabe: con el dev-lead diciendo «no sé» a las dos, ninguna de las dos secciones lista un término ni una exclusión que él no dijo

**MODIFIED — La entrevista hace una sola pregunta por turno** (antes: "una init greenfield o brownfield")
- GIVEN una init en su entrevista
- WHEN el agente pregunta al usuario o le presenta un documento
- THEN pregunta con `sdd-grilling` ([`interviewing`](interviewing.md)): cada turno termina con una única pregunta de la lista de la entrevista, o con un único documento para aprobar
- AND convención de ramas, worktrees y entorno del worktree son preguntas distintas, en turnos distintos

**MODIFIED — La pregunta de ramas recomienda git-flow** (antes: "una init greenfield"; git-flow recomendado siempre)
- GIVEN una init que llega a la convención de ramas
- WHEN el agente la pregunta
- THEN sin código, o con código sin convención que se vea, la opción recomendada es git-flow: `main` estable, `develop` de integración y `feature/<id>` desde `develop`
- AND con código en un repo con `main` y ramas `feat/*` que salen de `main`, la recomendada es esa convención, y git-flow va como alternativa
- AND el usuario puede elegir otra, y se registra la que elija

**MODIFIED — Git sobre un repo existente** (antes: "una init greenfield")
- GIVEN una init sobre un repo que ya existe y cuyas ramas o remoto no siguen la convención acordada
- WHEN la init llega al paso de git
- THEN el agente presenta el plan completo (renombrados, ramas nuevas, rama por defecto del remoto, borrados) y espera la confirmación antes de ejecutar nada
- AND las operaciones sobre el remoto las ejecuta el usuario, con los comandos que le da el agente

**MODIFIED — La init calca cada documento de su plantilla** (antes: "`mission.md`, `constitution.md`, `tech-stack.md`, `architecture.md`, `roadmap.md`, `estimation.md` o `changelog.md`")
- GIVEN un `sdd-init` que crea `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md` o, en `.docs/sdd/steering/`, `constitution.md`, `operations.md`, `architecture.md`, `debt.md` o `estimation.md`
- WHEN escribe cada documento
- THEN su estructura es la de la plantilla correspondiente de `sdd-templates`, y el contenido sale de la entrevista (sin código) o del código confirmado (con código)
- AND ningún documento copia texto, secciones ni notas del `.docs/` del kit ni de otro proyecto
- AND las tablas que leen otras skills (Now, Next y Later de `ROADMAP.md`; las de `debt.md`; `## [Unreleased]` del changelog) tienen las columnas y cabeceras literales de la plantilla
- AND la init no crea `mission.md`, `tech-stack.md`, `environments.md` ni `.docs/sdd/roadmap.md`

**MODIFIED — La entrevista fija las claves de control** (antes: "una init greenfield o brownfield"; "en brownfield sin usuario, las preguntas quedan pendientes explícitas en el resumen de cierre y el proyecto funciona con los defaults")
- GIVEN una init con el usuario presente
- WHEN la entrevista llega a las claves del kit
- THEN el agente invoca `sdd-config`, que hace en turnos distintos las preguntas de su catálogo, cada una con su opción recomendada y su motivo: modo de ids, perfil (`delegate`), política de merge (rama de integración, `--no-ff`, el worktree lo borra una persona), push de la rama de integración tras el merge («sí» con git-flow), frenos (3 agentes; 8 y 20 minutos), método de ejecución (`auto`) y quién valida (`manual`; `field` solo sin pantalla ni uso que el dev-lead pueda probar al cerrar)
- AND `sdd init --config` guarda solo lo que el usuario responde y `--finish` lo sube a `sdd-kit.json`: «no sé» no escribe la clave y rige su default, y un «no» a la política de merge deja `merge` sin declarar
- AND si la rama de integración es la estable, la pregunta de merge no se hace y `merge` queda sin declarar; sin `merge` declarado, la de push tampoco se hace
- AND la pregunta de push recomienda «sí» solo si la convención de ramas es git-flow; con otra convención se hace sin opción recomendada
- AND la init no pregunta las preferencias personales: el resumen de cierre dice que se fijan con `sdd-config`
- REMOVED AND escribe en `sdd-kit.json` solo lo que el usuario responde: «no sé» no escribe la clave y rige su default, y un «no» a la política de merge deja `merge` sin declarar
- REMOVED AND en brownfield sin usuario, las preguntas quedan pendientes explícitas en el resumen de cierre y el proyecto funciona con los defaults

**MODIFIED — La init deja la memoria automática desactivada y los temporales ignorados** (antes: solo `autoMemoryEnabled` y `extraKnownMarketplaces.superpowers-marketplace`, sin el marketplace del kit, `autoUpdate` ni `enabledPlugins`)
- GIVEN un `sdd-init` sobre un proyecto cuyo `.claude/settings.json` es `{"permissions": {"allow": ["Bash(npm test)"]}}`
- WHEN ejecuta `sdd init --root <raíz> --finish`
- THEN `.claude/settings.json` conserva `permissions` y gana `"autoMemoryEnabled": false`, `extraKnownMarketplaces.sdd-kit` con la fuente `github` `pikachumetal/sdd-kit` y `extraKnownMarketplaces.superpowers-marketplace` con la fuente `github` `obra/superpowers-marketplace`, los dos con `"autoUpdate": true`, y `enabledPlugins` con `"sdd-kit@sdd-kit": true` y `"superpowers@superpowers-marketplace": true`
- AND `.gitignore` contiene las líneas `.playwright-mcp/`, `.superpowers/` y `.docs/sdd/sdd-kit.local.json` una sola vez cada una, y cada ruta de `--ignore`
- AND con `"autoMemoryEnabled": true` previo, la salida dice `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia` y el agente pregunta; con su «sí», repite `--finish` con `--memory-off` y la clave queda en `false`; con su «no», se queda en `true` y el resumen de cierre lo anota
- AND si `claude plugin marketplace list` no muestra `superpowers-marketplace`, el agente ejecuta `claude plugin marketplace add obra/superpowers-marketplace`

**MODIFIED — El log de estimación lo genera el script del kit** (antes: "un `sdd-init-greenfield` o un `sdd-init-brownfield`"; "`estimation-log.md`")
- GIVEN un `sdd-init`
- WHEN crea `.docs/sdd/steering/estimation-log.md`
- THEN lo genera `sdd estimation log` ejecutado desde el kit: la primera línea empieza por `<!-- AUTO-GENERADO por sdd estimation log (sdd-kit)` y la tabla no tiene filas
- AND el proyecto no contiene ninguna copia del script

**MODIFIED — La constitution nombra el proyecto de referencia** (antes: "que es la pregunta 20 de greenfield y la 4 de brownfield")
- GIVEN una init en su entrevista
- WHEN el agente pregunta si el proyecto replica los patrones de otro
- THEN la constitution lleva en «Convenciones» la entrada «Proyecto de referencia» con la ruta o el repositorio que el usuario dé, o «no aplica» si responde que no

**MODIFIED — La init sobre un template completa solo lo marcado** (antes: "`tech-stack.md`, `architecture.md` y `environments.md` completos"; "el usuario lanza `sdd-init-greenfield`")
- GIVEN un proyecto instanciado desde un template con código de arranque (`package.json`, un login), que trae `tech-stack.md`, `architecture.md` y `environments.md` completos, `mission.md`, `roadmap.md` y secciones de `constitution.md` con `<!-- sdd-template: pending -->`, y un `sdd-kit.json` con `"version": "1.1.0"`
- WHEN el usuario lanza `sdd-init`, directamente o desde la skill puente del template
- THEN la init va en modo sin código: el código del template no se inventaría ni se propone como estado del proyecto
- AND la entrevista no pregunta stack, convención de ramas ni worktrees, y `tech-stack.md`, `architecture.md` y `environments.md` quedan sin cambios
- AND `sdd-kit.json` conserva `"version": "1.1.0"` y gana `ids` y las claves que el usuario respondió, y el resumen de cierre dice que el proyecto se pone al día con la migración
- AND con un template de la forma 3.0.0 (`PRODUCT.md`, `ROADMAP.md` y `steering/`), completa los marcados en esos documentos igual
- AND el contrato con el template es el texto `sdd-template: pending`: su posición y su número los decide el template

**ADDED — Un template sin marcador se corrige en la línea del modo**
- GIVEN un repo recién instanciado de otro template, con `package.json` y un login, sin `sdd-template: pending` ni `.docs/sdd/`
- WHEN arranca `sdd-init`
- THEN la línea del modo dice «con código» y añade «si es un template recién instanciado, dímelo y sigo sin código»
- AND con «es un template», sigue en modo sin código: pregunta lo de una init sin código y no inventaría el código

**MODIFIED — El funcional aportado se guarda literal** (antes: "un `sdd-init-greenfield`"; "`mission.md` lo enlaza, y cada fila de módulo del roadmap")
- GIVEN un `sdd-init` en el que el usuario aporta un funcional (un documento, o texto pegado en el chat)
- WHEN la init escribe los documentos
- THEN el funcional está en `.docs/sdd/sources/` sin editar: con su nombre original si es un fichero, o como `<yyyyMMdd>-functional-brief.md` si llegó pegado
- AND `PRODUCT.md` lo enlaza, y cada fila del `ROADMAP.md` que sale de él cita su sección (`sources/<fichero> §<n>`)
- AND ninguna capacidad nace de él

**MODIFIED — La entrevista pregunta cómo se verifica el frontend** (antes: "la 21 de greenfield o la 5 de brownfield"; "`tech-stack.md` sale con `§Frontend`")
- GIVEN una init de un proyecto con interfaz web: sin código con un stack Angular + .NET, o con código cuyo inventario encuentra un framework de UI
- WHEN la entrevista llega al frontend
- THEN pregunta con qué se verifica (detector, runner E2E y cómo entra el agente en la aplicación), recomendando impeccable y Playwright
- AND `operations.md` sale con `## Frontend` calcada de `operations-template.md` y rellena con la respuesta, y si declara una ruta de sesión, `sdd init --finish --ignore <ruta>` la deja en `.gitignore` una sola vez
- AND en un proyecto sin interfaz no se pregunta y `operations.md` no lleva `## Frontend`

**MODIFIED — `operations.md` dice cómo se ejecuta y se verifica el proyecto** (antes: "`## Frontend` tiene los mismos campos que `tech-stack-template.md`")
- GIVEN `operations-template.md`
- WHEN se lee
- THEN tiene `## Comandos`, `## Testing`, `## Frontend` y `## Entornos`, y no tiene tabla de versiones ni «Decisiones abiertas»
- AND `## Testing` pide cada suite con su comando y su duración, el comando de lo afectado, el gate de cierre y el de merge, cómo entra el agente en la aplicación y si los tests usan el motor de producción
- AND `## Frontend` tiene los campos URL, Detector, Viewports, Runner E2E, Acceso, Temas, Pantalla de referencia y Skills de apoyo

**MODIFIED — `sdd-templates` ofrece las plantillas de los documentos de la 3.0.0** (antes: "`mission-template.md`, `tech-stack-template.md`, `environments-template.md`, `client-changelog-template.md` y `roadmap-template.md` siguen, marcadas «2.x»")
- GIVEN el skill `sdd-templates`
- WHEN se lista su índice de plantillas de documentos
- THEN tiene `PRODUCT-template.md` → `PRODUCT.md` en la raíz, `constitution-template.md` → `.docs/sdd/steering/constitution.md`, `operations-template.md` → `.docs/sdd/steering/operations.md`, `architecture-template.md` → `.docs/sdd/steering/architecture.md`, `estimation-template.md` → `.docs/sdd/steering/estimation.md`, `now-next-later-template.md` → `ROADMAP.md` en la raíz, `debt-template.md` → `.docs/sdd/steering/debt.md`, `changelog-template.md` → `CHANGELOG.md` en la raíz y `adr-template.md` → `.docs/sdd/decisions/`
- AND `client-changelog-template.md` y `roadmap-template.md` siguen, marcadas «2.x» con la feature que las retira (0177 la de cliente; 0157 la del roadmap), y `mission-template.md`, `tech-stack-template.md` y `environments-template.md` ya no existen

**Reglas de la capacidad**
- **Dónde viven los datos**: el funcional aportado, en `.docs/sdd/sources/`, literal y sin editar. El progreso de una init en curso, en la clave `init` de `.docs/sdd/sdd-kit.json` (`approved` y `config`), que `sdd init --finish` quita. El bloque de `.claude/settings.json` que escribe la init, en una constante de `cli/src/init/`, que el README reproduce.
- **Idioma de los nombres**: no aplica.
- **Límites**: un repo es «con código» si su raíz tiene `package.json`, `*.csproj`, `*.sln`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json` o `Gemfile`, o, fuera de `node_modules/`, `.git/` y `.docs/`, un fichero `.ts`, `.js`, `.cs`, `.java`, `.py`, `.go`, `.rs`, `.php`, `.rb`, `.kt` o `.swift`; si no, «sin código».
- **Avisos**: la init dice su modo en una línea antes de la primera pregunta, y con «con código» ofrece corregirlo si es un template; con `autoMemoryEnabled: true` pregunta antes de cambiarlo, y un «no» lo anota el resumen de cierre; tras un template 2.x, el resumen de cierre dice que el proyecto se pone al día con la migración.
- **Regla ante conflicto**: lo aprobado es lo que lista `init.approved`, no lo que hay en disco; un fichero previo de la raíz se cosecha y pasa por su gate; en `.claude/settings.json`, una hoja que ya existe con otro valor manda sobre la de la init.

### Capacidad: `capabilities`

**REMOVED — Brownfield no vuelca `capabilities/`**
- motivo: con una sola init, el volcado a petición sigue las mismas condiciones en los dos modos (partición aprobada antes de escribir, gate por capacidad, código leído entero); ver «El volcado inicial solo se hace a petición»

**MODIFIED — Ninguna init crea `capabilities/` vacía** (antes: "un `sdd-init-greenfield` o un `sdd-init-brownfield`"; "ni `specs/`")
- GIVEN un `sdd-init` sin petición de volcado
- WHEN crea la estructura de `.docs/sdd/`
- THEN no existe `capabilities/`, `changes/` ni `decisions/` al terminar, ni ningún `.gitkeep` en `.docs/sdd/`
- AND `capabilities/` aparece con la primera feature que declara una capacidad, y `changes/` con la primera feature o patch

**REMOVED — El volcado inicial es una excepción de greenfield**
- motivo: con una sola init el volcado vale en los dos modos; lo sustituye «El volcado inicial solo se hace a petición»

**ADDED — El volcado inicial solo se hace a petición**
- GIVEN un `sdd-init` sobre un proyecto con código, en el que el usuario pide generar las capacidades desde el código
- WHEN el agente atiende la petición
- THEN antes de escribir ningún fichero propone la partición (slugs en inglés kebab-case, sustantivos del dominio) y espera la aprobación
- AND presenta cada capacidad para su aprobación, como los documentos de anclaje
- AND ninguna capacidad lleva sección de historial
- AND si no puede leer el código entero en la sesión, lo dice y no vuelca
- AND el agente no propone el volcado si el usuario no lo pide

### Capacidad: `migration`

> Propósito nuevo: «La migración de un proyecto consumidor entre versiones del kit: cómo declara la versión que tiene, qué escribe cada release y qué hace «actualízame al kit». El procedimiento vive en `skills/sdd-init/references/migrations/README.md`.»

**MODIFIED — El proyecto declara la versión del kit que tiene** (antes: "inicializado con `sdd-init-greenfield` o `sdd-init-brownfield`")
- GIVEN un proyecto inicializado con `sdd-init`
- WHEN termina la inicialización
- THEN existe `.docs/sdd/sdd-kit.json` con `version` (la de `.claude-plugin/plugin.json` del kit que hizo la init), `channel` `plugin`, `updated` e `ids`, y sin la clave `init`

**MODIFIED — Cada release lleva su migración** (antes: "`skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md`")
- GIVEN una release del kit, cambie o no la estructura de `.docs/sdd/`
- WHEN se cierra la release
- THEN existe `skills/sdd-init/references/migrations/vX.Y.Z.md` con pasos verificables por predicado, o, si la release no cambia nada del proyecto, con la frase «sin cambios en el proyecto», su «Verificación» y su línea `**Escribe**:`
- AND la suite del kit falla si la `version` de `.claude-plugin/plugin.json` no tiene su fichero en esa carpeta

**MODIFIED — Una migración sin cambios solo avanza el marcador** (antes: "«ponme el proyecto al día con sdd-init-brownfield»")
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y el kit 2.1.0, cuyo `v2.1.0.md` dice «sin cambios en el proyecto»
- WHEN el usuario pide «ponme el proyecto al día con sdd-init»
- THEN `sdd-kit.json` queda con `version` `2.1.0` y la fecha del día, y ningún otro fichero del proyecto cambia
- AND hay un commit `chore(sdd): migrar al kit v2.1.0`

**MODIFIED — La sesión avisa cuando el proyecto tiene migraciones pendientes** (antes: "pide «ponme el proyecto al día con sdd-init-brownfield»")
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y una sesión de Claude Code que carga el plugin `sdd-kit` con `v2.1.0.md` como mayor migración en `skills/sdd-init/references/migrations/`
- WHEN arranca la sesión
- THEN el usuario ve «AVISO sdd-kit: el proyecto tiene aplicado el kit 2.0.0 (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la 2.1.0. Para aplicarlas, pide «ponme el proyecto al día con sdd-init».»
- AND el agente recibe el mismo aviso al principio de su contexto, y no arranca la migración si el usuario no la pide
- AND con el marcador en `2.1.0`, sin `sdd-kit.json`, con un `sdd-kit.json` en curso (sin `version`) o sin carpeta de migraciones en el kit cargado, no hay aviso, y el hook sigue inyectando `using-sdd`

**MODIFIED — Un proyecto ya inicializado se migra, no se re-inicializa** (antes: "un proyecto con `.docs/sdd/`"; "el agente invoca `sdd-init-brownfield`")
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` sin la clave `init`, o con `.docs/sdd/mission.md` y sin `sdd-kit.json`, y la petición «actualízame al kit»
- WHEN el agente invoca `sdd-init`
- THEN lee `sdd-kit.json` (o, sin él, pregunta si es un proyecto anterior a la v0.2.0, la recomendada, o una init de la 2.x que se cortó, y en el primer caso lo asume), aplica en orden las migraciones posteriores a esa versión hasta la mayor disponible, con gate por fichero, y escribe el marcador al final
- AND no regenera los documentos de anclaje ni vuelca `capabilities/`
- AND con la `version` igual a la del kit cargado, dice «el proyecto ya está al día con el kit <versión>» y no toca nada
- AND un `sdd-kit.json` con la clave `init` no se migra: es una init en curso ([`onboarding`](onboarding.md))

**MODIFIED — La migración a v2.0.0 deja la configuración que deja la init** (antes: "igual que tras una init")
- GIVEN un proyecto que migra a v2.0.0 sin `"autoMemoryEnabled": false` en `.claude/settings.json` o sin `.playwright-mcp/`, `.superpowers/` y `.docs/sdd/sdd-kit.local.json` en `.gitignore`
- WHEN se aplica `migrations/v2.0.0.md`
- THEN el proyecto queda con la clave y las tres líneas, las que dejaba la init de la 2.x, sin duplicar líneas ni tocar las demás claves
- AND si la clave estaba a `true`, el agente pregunta antes de cambiarla; si el usuario dice que no, se queda en `true` y el informe lo anota
- AND si ya estaban, el paso se salta y lo dice

**MODIFIED — Lo que escribe una migración lo reciben también las init** (antes: "no aparece literal en `sdd-init-greenfield` o en `sdd-init-brownfield`, contando su `SKILL.md`, sus `references/` y los documentos que estos enlazan")
- GIVEN una migración de `skills/sdd-init/references/migrations/` que escribe en `sdd-kit.json` u otro fichero del proyecto
- WHEN corre la suite del kit
- THEN la migración declara en su línea `**Escribe**:` cada fichero y cada clave que escribe
- AND la suite falla si una clave declarada no aparece literal en `sdd-init`, contando su `SKILL.md`, sus `references/` salvo `migrations/`, los documentos que estos enlazan, `sdd-config` incluido, y los `.ts` de `cli/src/init/`
- AND la suite falla si el texto de una pregunta del catálogo de `sdd-config` aparece en la init o en una migración, o si una de ellas no nombra `sdd-config`

**Reglas de la capacidad**
- **Dónde viven los datos**: las migraciones viven en `skills/sdd-init/references/migrations/vX.Y.Z.md`; la versión aplicada, en `.docs/sdd/sdd-kit.json` del proyecto; lo que escribe cada migración, en su línea `**Escribe**:`. La memoria automática, en `~/.claude/projects/<project>/memory/` (o en `autoMemoryDirectory` si el proyecto la redefine), una por repositorio y compartida por sus worktrees; cada entrada es un fichero de memoria indexado en `MEMORY.md`. El roadmap anterior a la migración a v2.3.0, en el commit que nombran el informe y el commit de la migración.

### Capacidad: `routing`

**MODIFIED — El router solo existe donde hay SDD** (antes: "`sdd-init-greenfield` y `sdd-init-brownfield`")
- GIVEN una sesión que arranca con el plugin instalado
- WHEN el directorio de trabajo no contiene `.docs/sdd/`
- THEN el hook no inyecta ningún contexto
- AND cuando sí lo contiene, inyecta el texto de la skill `using-sdd`, que es la única fuente de las puertas del kit y nombra `sdd-propose`, `sdd-explore`, `sdd-roadmap`, `sdd-end-release`, `sdd-config` y `sdd-init`

**ADDED — Una init en curso entra por `sdd-init`**
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` = `{"init": {"approved": ["PRODUCT.md"]}}`, con el hook de sesión activo
- WHEN el usuario escribe «Sigue con la init, se cortó ayer.»
- THEN la primera skill que se invoca es `sdd-kit:sdd-init`
- AND en un proyecto sin `.docs/sdd/`, «Quiero empezar a trabajar con SDD en este proyecto.» también invoca primero `sdd-kit:sdd-init`

### Capacidad: `cli`

**MODIFIED — La CLI se ejecuta con Node y sin dependencias** (antes: "(`capability index|check|merge`, … `ledger rulings`)", sin `init`)
- GIVEN el plugin instalado y Node 22.18.0 o posterior en el `PATH`, sin pnpm, moon ni proto
- WHEN se ejecuta `node "<raíz del plugin>/cli/bin/sdd.js" --help`
- THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish`, `id next`, `merge`, `estimation log`, `init`, `session tokens`, `watch subagent|command`, `hook session-start`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`) con una línea de ayuda, y sale con 0
- AND `cli/package.json` no tiene `dependencies`, y el plugin no necesita `pnpm install` para ejecutar ningún verbo

**ADDED — `sdd init` registra el progreso de la init**
- GIVEN un proyecto sin `.docs/sdd/sdd-kit.json`
- WHEN se ejecutan `sdd init --root <raíz> --approved PRODUCT.md`, `sdd init --root <raíz> --config '{"ids":{"mode":"sequence"},"version":"9.9.9"}'` y otra vez `--approved PRODUCT.md`
- THEN `sdd-kit.json` es `{"init": {"approved": ["PRODUCT.md"], "config": {"ids": {"mode": "sequence"}}}}`, sin `version` ni rutas repetidas
- AND la segunda llamada dice `version: la fija sdd init, se ignora`
- AND sin `--approved`, `--config` ni `--finish`, o con dos de ellos, sale con 2 y el uso

**ADDED — `sdd init --finish` escribe lo determinista de la init**
- GIVEN un proyecto sin `.claude/settings.json`, con un `.gitignore` con CRLF que tiene `node_modules/` y `.superpowers/`, y un `sdd-kit.json` en curso con `init.config` = `{"ids":{"mode":"sequence"},"control":{"profile":"delegate"}}`
- WHEN se ejecuta `sdd init --root <raíz> --finish --ignore .auth/`
- THEN `.claude/settings.json` tiene el bloque de la init (memoria desactivada, los dos marketplaces con `autoUpdate: true` y los dos plugins activados), igual al bloque marcado con `<!-- sdd-init: settings -->` del README
- AND `.gitignore` conserva `node_modules/` y `.superpowers/` una vez, gana `.playwright-mcp/`, `.docs/sdd/sdd-kit.local.json` y `.auth/` con CRLF, y termina en salto de línea
- AND `.docs/sdd/sdd-kit.json` tiene `version` igual a la de `.claude-plugin/plugin.json`, `channel` `plugin`, `updated` del día, `ids.mode` `sequence` y `control.profile` `delegate`, sin `init`, y es el último fichero que se escribe
- AND la salida tiene una línea por fichero con `creado` o `actualizado`, y sale con 0
- AND repetir el mismo comando deja los tres ficheros iguales y dice `sin cambios` en los tres
- AND sin `.gitignore`, lo crea con las líneas de la init
- AND con un `sdd-kit.json` de template que ya tiene `"version": "1.1.0"`, la conserva

**ADDED — `sdd init --finish` fusiona `settings.json` por hoja sin pisar**
- GIVEN un `.claude/settings.json` con `extraKnownMarketplaces.sdd-kit.source.repo` = `"otro/fork"`, `extraKnownMarketplaces.superpowers-marketplace.autoUpdate` = `false` y `enabledPlugins["sdd-kit@sdd-kit"]` = `false`
- WHEN se ejecuta `sdd init --root <raíz> --finish`
- THEN esas tres hojas no cambian, se añaden las que faltan del bloque, y la salida dice `extraKnownMarketplaces.sdd-kit.source.repo: se deja "otro/fork"`, `extraKnownMarketplaces.superpowers-marketplace.autoUpdate: se deja false` y `enabledPlugins.sdd-kit@sdd-kit: se deja false`
- AND con `"autoMemoryEnabled": true`, dice `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`, y con `--memory-off` la deja en `false`

**ADDED — `sdd init` no escribe nada si un fichero no se puede fusionar**
- GIVEN un proyecto con un `.gitignore` sin `.superpowers/` y, en un caso, un `.claude/settings.json` con `{"autoMemoryEnabled": false,` (JSON roto); en otro, un `sdd-kit.json` roto con un `settings.json` válido; en otro, `{"enabledPlugins": []}`
- WHEN se ejecuta `sdd init --root <raíz> --finish`
- THEN en los tres sale con 1, ningún fichero del proyecto cambia (tampoco `.gitignore`), y dice `.claude/settings.json no es JSON válido: no se toca`, `.docs/sdd/sdd-kit.json no es JSON válido: no se toca` o `.claude/settings.json no se puede fusionar: enabledPlugins no es un objeto`
- AND con `--root` inexistente, `--config '[1]'`, `--config '{'`, `--ignore ''`, `--ignore C:/x` o `--ignore ../x`, sale con 2 sin escribir nada

**Reglas de la capacidad**
- **Dónde viven los datos**: `sdd init` escribe `.claude/settings.json`, `.gitignore` y `.docs/sdd/sdd-kit.json` del proyecto; la versión, de `.claude-plugin/plugin.json` del kit; el bloque de settings, de su constante en `cli/src/init/`.
- **Idioma de los nombres**: las opciones y las claves en inglés; los mensajes, en castellano.
- **Límites**: `--ignore` relativo a la raíz, sin vacío, absoluto ni `..`; una acción por llamada.
- **Avisos**: `<clave>: la fija sdd init, se ignora`; `<ruta con puntos>: se deja <valor JSON>`; `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`; `<ruta> no es JSON válido: no se toca`; `<ruta> no se puede fusionar: <ruta con puntos> no es un objeto`.
- **Regla ante conflicto**: en `settings.json`, la hoja que ya existe manda sobre la de la init, salvo `autoMemoryEnabled` con `--memory-off`; en `sdd-kit.json`, `channel` y `updated` los fija la CLI, `version` la fija la CLI salvo que ya exista (la de un template), y en el resto gana el `--config`.

### Capacidad: `feature-ids`

**MODIFIED — La entrevista de init decide el modo de ids** (antes: "una init greenfield o brownfield en el bloque (d) de proceso")
- GIVEN una init en su entrevista, en el turno de las claves del kit
- WHEN el agente pregunta por el gestor de tickets
- THEN pregunta a continuación cómo se numeran las features: ids del gestor (`tracker`) o secuencia propia del proyecto (`sequence`)
- AND escribe la respuesta en `sdd-kit.json`; «no sé» deja `tracker`

### Capacidad: `archive`

**MODIFIED — Un hotfix se cierra en la rama estable solo con la frase del dev-lead** (antes: "con `skills/sdd-init-brownfield/references/migrations/`")
- GIVEN el repo del kit, con `skills/sdd-init/references/migrations/`, la rama `hotfix/0200-fix-login` salida de `main`, y el dev-lead que dijo «fusiona el hotfix del login en main, etiquétalo v3.0.1 y publícalo»
- WHEN se cierra
- THEN ejecuta `sdd merge --check --into main` en las comprobaciones previas, y antes de fusionar pregunta «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?»
- AND con la respuesta «sí, la clave `auth.sameSite`», escribe el paso en `migrations/v3.0.1.md` antes de etiquetar
- AND hace `git fetch` y ejecuta `sdd merge --branch hotfix/0200-fix-login --into main --tag v3.0.1 --order "fusiona el hotfix del login en main, etiquétalo v3.0.1 y publícalo" --push`
- AND si la frase no pide publicar, va sin `--push`, aunque `merge.push` sea `true`; sin ninguna frase del dev-lead, no fusiona en `main`
- AND en un proyecto sin esa carpeta de migraciones, el paso que pide el patch va al mensaje final como pendiente del dev-lead
- AND con `vuelta: conflicto en <ficheros>`, el cierre queda «No terminado»: una persona porta el arreglo a `develop` y relanza el hotfix

## Enmiendas

- 2026-10-17 — Delta: MODIFIED de `feature-ids` «La entrevista de init decide el modo de ids», cuyo GIVEN nombraba «una init greenfield o brownfield en el bloque (d)» — literal viejo que encontró el cierre, sin cambio de comportamiento — sin parada
- 2026-10-17 — Delta: el requisito renombrado «El volcado inicial es una excepción de greenfield» pasa a REMOVED + ADDED «El volcado inicial solo se hace a petición», y «La entrevista fija las claves de control» marca con `- REMOVED AND` las dos cláusulas que reescribe — forma que exige `sdd capability merge`, sin cambio de comportamiento — sin parada: no cambia ningún THEN

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-17 | aprobada: «Apruebo (Recomendada)» |
