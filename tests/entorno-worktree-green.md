# Evidencia GREEN — entorno por worktree (2026-09-08)

Mismos escenarios que [`entorno-worktree-red.md`](entorno-worktree-red.md) que fallaron, con la guidance escrita en `9d5ad2d` + `ed79c68` y la plantilla de `e9f91fb`. Sonnet, fixture "Ledgerly-env", copias frescas (`g2`, `g3`, `g4`), run `wf_a54014d6-ce6`. Estado verificado en disco.

## Veredicto por fallo del RED

### F1 — `sdd-start-task` no levantaba el entorno → **REPARADO (1/1)**

| | RED (`e2`) | GREEN (`g2`) |
| --- | --- | --- |
| Worktree creado | `feature/123` | `feature/0123` |
| `.sdd-env.json` en el worktree | **no existe** | **`state: active`** |
| `.tools/env-log.txt` | vacío | `setup 0123 …` |
| Tests | 2/2 | 2/2 |

`g2` lo narra en el orden que el paso 6 pide: *"Creado el worktree… Ejecutado `npm install` y `npm run env:setup -- 0123` en el worktree (existe `.docs/sdd/environments.md`): generado el marcador"*. Además invocó `superpowers:subagent-driven-development` como default, se topó con la misma limitación de T3 (un subagente de workflow no puede despachar) y lo dejó escrito como *ruling* en su ledger antes de ejecutar en línea — la skill gobierna la intención aunque el harness no dé la herramienta.

### F2 — `sdd-end-task` cerraba con el entorno vivo → **REPARADO (1/1)**

| | RED (`e3`) | GREEN (`g3`) |
| --- | --- | --- |
| `.tools/env-log.txt` | `setup` | `setup` → **`clean`** |
| `.sdd-env.json` | `active` | **`cleaned`** |
| Orden | — | `env:clean` **antes** de `finishing-a-development-branch` (paso 10) |
| Worktree | conservado | conservado (opción 3, decisión del dev-lead) |

El resto del Definition of Done es idéntico al control: pre-check, walkthrough, `estimation-log`, roadmap, merge dejado al dev-lead. El paso nuevo no desplazó ninguno.

### F3 — `sdd-init-brownfield` cosechaba el entorno como nota → **REPARADO (1/1)**

| | RED (`e4`) | GREEN (`g4`) |
| --- | --- | --- |
| `environments.md` | **no** (3 menciones sueltas a `env:setup` en otros docs) | **sí**, con el marcador citado 5 veces |
| Otros docs de anclaje | 7 | 7 + `environments.md` |

## No-regresión

A/B de las cinco skills editadas, control = `f0360eb`, tratamiento = `ed79c68`, en la misma tanda. Detalle en cada `-ab.md`:

| Skill | Escenarios | Veredicto |
| --- | --- | --- |
| `sdd-start-task` | A, B, L, E5 (Bookline) | 4/4 idénticos: rama, prefijo de carril, `plan.md` ausente, `src/` intacto, spike sin artefactos |
| `sdd-end-task` | task 104 con prisa (TimeTrack) | idéntico: walkthrough, 3 filas en `estimation-log`, sin merge, `draft` señalado |
| `sdd-end-patch` | patch 217 con prisa (Bookline) | idéntico: fix commiteado, `Fixed` en changelog, fila de patches en roadmap, sin merge, `patch.md` sin pendientes |
| `sdd-init-greenfield` | Bidly, usuario ausente | idéntico: **cero ficheros**, gate de entrevista intacto |
| `sdd-init-brownfield` | Ledgerly con derivas | idéntico: 8 docs PENDIENTES, sin `templates/`, derivas citadas; **ninguno crea `environments.md`** — correcto, esa fixture no tiene scripts de entorno, el predicado es falso |

**Sin degradación en 5/5.** El predicado solo actúa donde hay entorno que gestionar.

## Lo que sigue sin medir, y por qué no bloquea

- **`init-greenfield` con la pregunta nueva**: su gate detiene la entrevista en la primera pregunta con usuario ausente, así que el bloque (d) es inalcanzable. E4/g4 (brownfield) es el proxy; la pregunta se escribió como contraparte y así consta en el RED.
- **Dogfooding en el propio kit**: no usa worktrees ni tiene entorno; predicado falso. Alybo es el candidato natural y queda como residual del walkthrough, no como bloqueo.

## Recorte confirmado

E1 sigue sin necesitar skill: `g2` y `g3` demuestran que basta con que el flujo nombre el predicado. `sdd-env` no existe, y la `description` número doce no se carga en ninguna sesión.
