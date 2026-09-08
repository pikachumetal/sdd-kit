# Evidencia RED — entorno por worktree (2026-09-08)

Baseline de la task [entorno-por-worktree](../.docs/sdd/specs/20260908-135025-task-0000-entorno-por-worktree/spec.md) (T4). Sonnet, fixture desechable "Ledgerly-env", 4 runs en paralelo (`wf_25a85157-9e8`). Estado final verificado en disco.

## Fixture

Proyecto Node 22 con `.docs/sdd/` completo (constitution con git-flow `feature/<ticket>` desde `develop` en worktree propio) y **`environments.md` calcado de Alybo en corto**: dos tipos de entorno, marcador `.sdd-env.json` con `state: active|cleaned`, entradas `env:setup` / `env:clean` / `env:preflight`, y la regla "usar los orquestadores, `env:clean` siempre antes de borrar el worktree". Las tres entradas son **stubs con rastro**: escriben el marcador y una línea en `.tools/env-log.txt` — lo medido es si el agente las invoca y cuándo, no qué hacen. Spec y plan de una task trivial (ticket 123) aprobados. Molde sin `.git`.

| Copia | Montaje |
| --- | --- |
| `e1` | worktree `feature/123` ya creado (simula Orca), sin marcador, **sin ninguna skill del kit en el encargo** |
| `e2` | `develop` limpio; `sdd-start-task` vigente (`f0360eb`) |
| `e3` | worktree `feature/123` con la task implementada y el entorno `active`; `sdd-end-task` vigente |
| `e4` | brownfield: sin `.docs/sdd/`, con `CLAUDE.md` monolítico que menciona `env:setup`/`env:clean` y los scripts en `.tools/`; `sdd-init-brownfield` vigente |

## E1 — el escenario que decidía la skill → **el baseline acierta: `sdd-env` NO se escribe**

Petición: «Acabo de abrir este worktree desde Orca para el ticket 123. Prepárame el entorno.»

| Comprobación | Resultado |
| --- | --- |
| Leyó `.docs/sdd/environments.md` | ✅ (*"el flujo documentado tras crear el worktree es `npm install` + `npm run env:setup`"*) |
| Ejecutó `npm install` y `npm run env:setup` | ✅ en ese orden |
| `.sdd-env.json` | ✅ `state: active`, `ticket: 123` |
| `.tools/env-log.txt` | ✅ `setup 123 2026-09-08T14:24:09.140Z` |
| Tocó la spec/plan del ticket | ✅ no: los citó como siguiente paso sin ejecutarlos |
| Recordó `env:clean` antes de borrar | ✅ *"Recordatorio del propio doc: antes de borrar este worktree, ejecutar `npm run env:clean`"* |

Sin ninguna skill cargada, con el fichero del proyecto delante, el agente hace exactamente lo que la skill `sdd-env` habría prescrito. Guidance sin baseline que la respalde → **prohibida por el Art. I**. El 50/50 del dev-lead (skill nueva vs plantilla + predicado) queda resuelto por evidencia, no por opinión: **plantilla + predicado**.

Lo que este positivo enseña: el disparador no es una `description` de skill, es **que el fichero exista y esté bien escrito**. La inversión va a la plantilla.

## Fallos observados

### F1 — `sdd-start-task` crea el worktree y no levanta el entorno (E2)

`e2` siguió el flujo completo: leyó la skill y sus `references/`, creó `../e2.worktrees/feature/123` con `git worktree add` (Art. I de la fixture), hizo TDD, implementó, commiteó, cerró con `sdd-end-task` y `finishing-a-development-branch` — todo correcto. **En ningún momento ejecutó `env:setup`**: sin `.sdd-env.json`, `.tools/env-log.txt` vacío. `tech-stack.md` de la fixture dice *"cada worktree levanta la suya en un puerto propio — ver `environments.md`"* y no bastó: el paso 6 de la skill no lo nombra y el agente no lo busca por su cuenta cuando tiene un checklist delante.

Contraste con E1: el mismo modelo, el mismo fichero, **sin skill lo lee y con skill no**. La skill sustituye la exploración libre por su checklist — es su función — y por eso el predicado tiene que estar en el checklist.

### F2 — `sdd-end-task` cierra con el entorno vivo (E3)

`e3` ejecutó el Definition of Done entero y correcto (pre-check, walkthrough, estimation-log, roadmap, `finishing-a-development-branch`, merge dejado al dev-lead, opción "mantener la rama"). **`env:clean` no aparece**: marcador sigue `active`, log solo tiene el `setup` del montaje. Ni lo ejecutó ni lo mencionó como pendiente. Si el usuario hubiera elegido "borrar el worktree" en `finishing-a-development-branch`, el contenedor quedaría huérfano — el caso exacto que `environments.md` de la fixture advierte en negrita.

### F3 — `sdd-init-brownfield` cosecha el entorno como nota, no como contrato (E4)

`e4` generó siete documentos de anclaje (`architecture`, `constitution`, `estimation`, `estimation-log`, `funcional`, `mission`, `roadmap`, `tech-stack`) y **mencionó `env:setup` tres veces** en ellos — cosechó el `CLAUDE.md` heredado como manda la skill. Pero **no existe `environments.md`**: el conocimiento del entorno quedó repartido en notas de `tech-stack.md`, donde ningún predicado lo va a leer. El paso 5 de la skill enumera qué ficheros crea y `environments.md` no está en la lista.

## Positivos que NO requieren guidance

- **E1 entero** (arriba).
- **`init-greenfield` no se midió**: su gate detiene el flujo en la primera pregunta de la entrevista, así que el bloque (d) de proceso —donde iría la pregunta del entorno— es inalcanzable con un usuario ausente. E4 (brownfield) es el proxy: la pregunta de greenfield se escribe como la contraparte de la cosecha de brownfield, y se declara aquí que no tiene baseline propio.
- **El resto de las dos skills de flujo aguanta**: gates, TDD, cierre honesto, merge al dev-lead.

## Conclusión — qué guidance queda respaldada

| Guidance candidata | Veredicto |
| --- | --- |
| Skill `sdd-env` | **NO se escribe** (E1 pasa) |
| `sdd-start-task` paso 6: `env:setup` tras el worktree si existe `environments.md` | **Se escribe** (F1) |
| `sdd-end-task` / `sdd-end-patch`: `env:clean` antes de `finishing-a-development-branch` | **Se escribe** (F2) |
| `sdd-init-brownfield`: cosechar el entorno en `environments.md` | **Se escribe** (F3) |
| `sdd-init-greenfield`: pregunta de entorno en la entrevista | Se escribe como contraparte de F3, **sin baseline propio** (gate de entrevista); declarado |
| Fila del override `using-git-worktrees` | Se escribe en todo caso: corrige la contradicción con el default de T3, no añade guidance |
