# RED — replanificar la release en curso (task 0029)

Baseline con el kit del working tree (`feature/0029`, antes de tocar `sdd-start-release`). Seis sujetos Sonnet headless a dos turnos, lanzados como en la task 0004 (`claude -p` + `--resume`), con la mensajería entre sesiones bloqueada. Molde, lanzadores y lo que produjo cada sujeto: [`red/`](../.docs/sdd/specs/20260922-154013-task-0029-release-replan/red/). Coste: 5,26 $.

## Origen

- `82c2b53`: el triaje de un ticket añadió trabajo a dos tasks (0012 y 0013) que se habían cerrado en `develop` mientras tanto.
- `f00195a` y ticket 0005 §2: triar un ticket editó la fila de una task en marcha y provocó un conflicto en su cierre.
- Ticket 0005 §1: dos worktrees partieron tasks el mismo día y tomaron los mismos ids.

## Molde

Proyecto `salas`, `ids.mode: sequence`, perfil `delegate`. Sección «Release 0.4.0» con tres tasks: `0005` cerrada (✅, con walkthrough), `0006` en marcha en `feature/0006` (worktree aparte) y `0007` pendiente. En su rama, la 0006 ya partió y reservó la fila `0008`, que no ha llegado a `develop`: `Get-NextSddId.ps1` ejecutado en `develop` devuelve `0008`.

Comprobación previa (`tech-stack.md`): el turno 1 nombra la skill y los seis streams la cargan; lo preexistente está en el commit base; `plugin.json` de la copia del kit, en 1.2.0 como el molde.

## Escenarios

| Ronda | Molde | Turno 1 (turno 2 fijo: «Sí, adelante con lo que propones.») |
| --- | --- | --- |
| r | `m1` | «Invoca la skill sdd-kit:sdd-start-release. Mete esto en la release en curso: que la reserva recurrente pueda terminar también por número de repeticiones, no solo por fecha; y que el aviso por correo salga también cuando se cancela una reserva. Y parte la 0007: exportar e importar van por separado.» |
| s | `m2` | «Invoca la skill sdd-kit:sdd-start-release. Tría en la release en curso las notas de uso de .docs/sdd/feedback/usage-notes.md.» Tres notas, una por task. El roadmap agrupa las peticiones por temática, como el del kit. La spec de la 0005 ya no dice «No entra: fin por número de repeticiones»: en `m1` esa línea daba una salida que el caso de campo no tenía. |
| u | `m3` | La petición de s, desde un worktree `replan` con base vieja, donde la 0005 sigue en 🔄. `develop` ya fusionó su cierre y está sacada en otro worktree (el caso de `82c2b53`). |

## Veredictos

| Frente | Qué se mira en disco | r1 | r2 | s1 | s2 | u1 | u2 | Fallan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E1 · fila cerrada | la nota de la recurrencia no amplía la 0005 | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | 2/6: solo con base vieja |
| E2 · task en marcha | ni la fila ni la spec de una task en marcha cambian | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | 3/6 |
| E3 · ids | ningún id nuevo repite el `0008` de `feature/0006` | ✅ | ❌ | ❌ | ❌ | — | — | 3/4 |
| E4 · reserva publicada | un commit solo de roadmap en `develop` antes de arrancar nada | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 6/6 |

- **E1**: con la fila visible en ✅, 4/4 abren una task nueva («0005 ya está cerrada… no reabro la 0005», r1). Con base vieja, u1 y u2 no miran `develop` (u1 solo ejecuta `git branch -a`) y amplían la 0005. Además **editan su spec aprobada**: u2 marca la fila «spec ampliada, pendiente reaprobación».
- **E2**: s1 escribe en la fila de la 0006, en marcha, «Amplía a: correo de confirmación al cancelar». Los que pasan crean una task nueva, y r2 y s2 la marcan dependiente de la 0006.
- **E3**: r1 es el único que lee el roadmap de `feature/0006` y se salta el `0008` («esa reserva ya está usada en la rama `feature/0006`»). r2, s1 y s2 dan el `0008` a una task nueva; s2 sin encontrar el script («siguiente entero tras el máximo usado»). En u no se crean ids.
- **E4**: 0/6 commitean. Los seis dejan `roadmap.md` modificado sin commit, y en r y s el segundo turno ya arranca `sdd-start-task` para la task nueva con la reserva sin publicar. En u, la edición se queda en el worktree `replan`, no en `develop`.

## Lo que no entra por este RED

- **Triaje agrupado con tabla hallazgo → destino** (punto 4 de la fila): en s y u, los cuatro sujetos triaron las tres notas en una pasada, con un destino por nota. No se reproduce el fallo; va a deuda como posible falso negativo.
- **Reordenar las olas por ficheros calientes** (punto 5): ningún escenario lo mide. Va a deuda sin evidencia.
- **Gate de la propuesta**: r1 editó el roadmap en el turno 1, sin proponer antes. La petición ya decidía qué entraba, así que no se cuenta como fallo.
