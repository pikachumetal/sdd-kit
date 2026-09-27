# Evidencia RED — numeración de ids sin gestor de tickets (2026-09-20)

Baseline de la task [task-ids](../.docs/sdd/specs/20260920-202137-task-0001-task-ids/spec.md) (0001): con el kit v1.1.0, ¿qué id pone un agente a una task en un proyecto **sin gestor de tickets**, y qué hace al partir una task en dos?

## Método

Dos vías, según lo que había que medir.

**(a) Evidencia de campo reutilizada** — precedente T16 (un artefacto previo vale como baseline a coste cero). Verificado con fichero y línea antes de apuntarlo:

| Qué | Dónde | Estado con v1.1.0 |
| --- | --- | --- |
| El `<id>` es el ticket del gestor, `0000` si no hay | `skills/sdd-start-task/references/nombrado.md:7` | `0000` es el único valor posible sin gestor |
| Igual en la plantilla de spec y en la de patch | `skills/sdd-templates/templates/spec-template.md:3`, `patch-template.md:3` | idem |
| Igual en el carril patch | `skills/sdd-start-patch/SKILL.md:36` | idem |
| La rama sale del id | `skills/sdd-start-task/SKILL.md:34` (`feature/<ticket>`) | dos tasks sin ticket ⇒ misma rama |
| «Los ids de ticket no se inventan» sin vía alternativa | `skills/sdd-consult/SKILL.md:37`, `skills/sdd-start-release/SKILL.md:31,47,58`, `references/roadmap-fuente.md:5-6` | un proyecto sin gestor no tiene forma legítima de numerar |
| Numeración acordada a mano en un proyecto real | `sdd-project-template`: ids `0004`, `0005`, `0006a`, `0008` (acta v1.1.0, petición 38) | el dev-lead y el agente la acordaron fuera del kit; de ahí sale el sufijo `0006a` |
| Este mismo repo | las 16 tasks de la release 1.2.0 se numeraron **a mano** en el roadmap porque el kit las habría llamado todas `0000` | el kit no tiene el mecanismo que su propia release necesitaba |

**(b) Dos sujetos headless nuevos** para lo que la evidencia de campo no dice: qué hace un agente *en el momento* de arrancar.

- Fixture desechable (scratchpad, un molde sin `.git`, copia por run con `git init` + `main`/`develop`): proyecto `notas-cli`, CLI de notas en Node, `.docs/sdd/` con mission, constitution (Art. III `feature/<id>` desde `develop`), tech-stack («Sin gestor de tickets: el roadmap de `.docs/sdd/` es la única lista de trabajo… a veces abre dos worktrees para avanzar en paralelo»), roadmap con dos tasks **sin columna de id** y dos carpetas históricas `…-task-0000-…`, y `sdd-kit.json` v1.1.0 sin campo `ids`. Ninguna regla de la fixture menciona numeración: el baseline no se telegrafía.
- Lanzamiento: `claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' --plugin-dir <copia limpia del kit> --add-dir <copia limpia> --permission-mode acceptEdits --allowedTools "Bash(*)" "Agent" --max-turns 45 --output-format stream-json --verbose "<petición>" < /dev/null`, cwd en la copia de la fixture. La copia limpia lleva solo `skills/` y `.claude-plugin/`.
- Peticiones (neutras respecto al id; ceden los gates porque el dev-lead está ausente, si no el sujeto para y no mide):
  - **E1**: «Arranca la primera task de la release 0.3.0 del roadmap (exportar a Markdown). No estoy disponible en toda la sesión: toma tú las decisiones que hagan falta, listalas al final… Da por aprobados los gates que necesiten mi respuesta.»
  - **E2**: «La segunda task de la release 0.3.0 del roadmap (búsqueda por texto) es demasiado grande para una sola: pártela en dos y arranca la primera mitad. …»
- Verificación **en disco** (no el autoinforme): nombre de carpeta en `specs/`, ramas de `git branch -a`, `git status`, `git diff` del roadmap.

## Resultados

| | E1 (arranque normal) | E2 (task partida) |
| --- | --- | --- |
| Carpeta creada | `20260920-204929-task-0000-export-markdown` | `20260920-204620-task-0000-busqueda-nucleo` |
| `task:` del frontmatter | `0000` | `0000` |
| Rama | no la creó; **propuso** `feature/0000-export-markdown` y trabajó en `develop` | `feature/0000-busqueda-nucleo` (creada) |
| Sufijo tipo `0006a` | — | **no**: usó slug + «1/2» en el título |
| Id para la segunda mitad | — | **ninguno**; «2/2» solo como prosa en spec y plan |
| Roadmap actualizado con la partición | — | **no** (`git diff` del roadmap vacío): la relación entre mitades no queda en ningún registro fuera de la spec |
| Coste / turnos | 1,46 $ · 56 turnos · 14,0 min | 1,80 $ · 57 turnos · 12,8 min |

### Racionalización citada (E1, `spec.md` decisión 11)

> «**Rama** — propongo `feature/0000-export-markdown`. El Art. III dice `feature/<id>` y sin ticket el id es `0000`; **sin slug chocaría con la task de búsqueda, que puede ir en un segundo worktree** (tech-stack).»

El sujeto **vio la colisión** que el ticket de campo predijo y la parcheó por su cuenta añadiendo el slug a la rama. Es el fallo en su forma más clara: el kit no da id, el agente improvisa una convención distinta en cada sesión y la colisión sigue viva en la carpeta (`task-0000-…` dos veces) y en el `<id>` del changelog.

## Veredicto por requisito de la spec

| Requisito del delta | ¿Falla el baseline? | Evidencia |
| --- | --- | --- |
| El proyecto declara cómo numera su trabajo | **Sí** | `sdd-kit.json` v1.1.0 no tiene campo `ids`; ninguna skill lo consulta |
| Un proyecto sin campo `ids` numera como hasta ahora | No aplica (es la conducta actual) | Se verifica en el GREEN como no-regresión |
| La entrevista de init decide el modo de ids | **Sí** | El bloque (d) de `sdd-init-greenfield:24` pregunta por el gestor y nada más; no hay dónde guardar la respuesta |
| Tasks y patches comparten una sola secuencia | **Sí** | Sin secuencia, tasks y patches son todos `0000` (`only-zeros` es el estado real de este repo antes de la 1.2.0) |
| En modo secuencia el id lo reserva el hilo al planificar | **Sí** | `roadmap-fuente.md:5-6` deja la numeración «acordada con el usuario», sin forma ni sitio; el roadmap de la fixture no tiene columna de id y ninguno de los dos sujetos la creó |
| Una task no planificada obtiene su id con un script | **Sí** | No existe script; 2/2 sujetos pusieron `0000` |
| El script avisa de id duplicado / de modo `tracker` | **Sí** | No existe script |
| La rama reserva el id del trabajo no planificado | **Sí** | E1 dejó el trabajo en `develop` sin rama; E2 creó `feature/0000-…` **después** de la carpeta |
| Una task partida toma el siguiente id, no un sufijo | **Parcial** | Ningún sujeto usó sufijo (lo respalda la evidencia de campo: `0006a` en `sdd-project-template`), pero **2/2 fallan lo importante**: la mitad nueva no recibe id propio y la relación no se registra fuera de la prosa |
| En modo gestor el id es el del ticket | No | Conducta actual correcta; se conserva sin cambios |
| En modo secuencia el id sale de la reserva o del script | **Sí** | Sin mecanismo, «no inventar ids» deja al proyecto sin salida legítima |

## Recorte de alcance que impone este RED

El requisito **«Una task partida toma el siguiente id, no un sufijo»** no se apoya en estos sujetos: 0/2 usaron sufijo. Se mantiene porque lo respalda la evidencia de campo (`0006a` real, con el dev-lead pidiendo por escrito que no se repita), pero la guidance se escribe donde el baseline **sí** falla: el id propio de la mitad nueva y el registro de la relación (`parent:` en el frontmatter y fila del roadmap). La prohibición del sufijo viaja como una frase dentro de ese requisito, no como guidance con tabla de racionalizaciones propia.

## Hallazgo lateral (fuera del alcance de esta task)

E1 no creó la rama: «`git switch -c` requiere aprobación y la sesión no es interactiva», y dejó el trabajo en `develop` sin commitear. Es un fallo del paso 3 del carril con dev-lead ausente, no de la numeración. Queda anotado para la task 0008 (usuario ausente), que es quien lo cubre.

GREEN en [task-ids-green.md](task-ids-green.md).
