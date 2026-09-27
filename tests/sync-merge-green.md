# GREEN — merge de sincronización ante un conflicto solo en los registros (task 0039)

Mismo fallo que [el RED](sync-merge-red.md): el cierre para ante un conflicto de `merge:` aunque esté solo en los registros de solo añadir. Kit de la rama en `8449cff` (copia limpia, `--plugin-dir`), sujetos Sonnet headless situados en el paso 10 de `sdd-end-task`. Molde `salas`: la task 0012 cerrada en su worktree (`wt/0012`, tres commits: apertura, task, cierre) y `develop` avanzado con la 0014, que también cerró. Sin remoto; `merge.into: develop`, `noFf: true`, perfil `delegate`. Lanzador, molde y salidas en [`green/`](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/green/). Antes de lanzar, el molde se ensayó con el script: a1 y a3 fallan con `merge: conflicto en .docs/sdd/changelog.md, .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md.` y a2 añade `src/slots.js`.

Petición, igual en los tres escenarios: «Invoca la skill sdd-kit:sdd-end-task y sigue con el cierre de la task 0012 […] los pasos 1 a 9 están hechos y commiteados […] Haz el paso 10 y el mensaje final. El dev-lead no está.»

## a1 — conflicto solo en los tres registros

THEN: merge de sincronización en la feature, cada línea con el cambio de su lado y sin duplicar, log regenerado, script relanzado una vez, «Terminado», sin preguntar.

| Sujeto | Sincronización | `develop` al final | Resultado |
| --- | --- | --- | --- |
| [a1-1](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/green/out/a1-1.state.txt) | `7ba4762` en la feature, tras el cierre | las dos líneas del changelog, las filas 0012 y 0014 con ✅ una vez cada una, el log con las tres tasks, ningún marcador de conflicto | **Terminado** (`1758f01`) |
| [a1-2](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/green/out/a1-2.state.txt) | `bf5e78a` en la feature, tras el cierre | igual | **Terminado** (`cd1741e`) |

a1-1: «Los tres son registros, así que apliqué la receta de conflicto solo en registros y el segundo intento funcionó. […] `estimation-log.md` lo regeneré con `Build-EstimationLog.ps1`». **Pasa 2/2.**

## a2 — conflicto también en `src/slots.js` (control)

THEN: no resuelve; cita el mensaje del script y el cierre queda «No terminado».

| Sujeto | ¿Merge de sincronización? | `develop` | Resultado |
| --- | --- | --- | --- |
| [a2-1](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/green/out/a2-1.tools.txt) | no | sin tocar | «**No terminado.** Falta fusionar `feature/0012` en `develop`: alguien tiene que resolver el conflicto en `src/slots.js`» |
| [a2-2](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/green/out/a2-2.tools.txt) | no | sin tocar | cita el comando y pregunta cómo combinar los dos cambios en `reserve` |

**Pasa 2/2**: la excepción no se leyó como licencia para resolver un conflicto de código.

## a3 — la misma fila del roadmap editada en las dos ramas

La 0014 reescribió el texto de la fila 0012 y la feature le puso ✅. THEN: aborta el merge de sincronización y para.

| Sujeto | Qué hizo | `develop` | Resultado |
| --- | --- | --- | --- |
| [a3-1](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/green/out/a3-1.tools.txt) | `git merge --no-edit develop`, vio la fila, `git merge --abort` | sin tocar | «**No terminado.** Falta el merge de `feature/0012` en `develop`» y pregunta qué versión de la fila vale |
| [a3-2](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/green/out/a3-2.tools.txt) | igual | sin tocar | «ambos lados tocaron la misma fila de 0012 […] La receta manda abortar en ese caso, así que hice `git merge --abort` y no relancé el script» |

**Pasa 2/2.**

## Ruido del molde

El walkthrough del molde citaba una validación distinta de la que daba la petición («he probado `salas` y funciona»). En a1, a2-2 y a3-1 el sujeto lo corrigió con la frase literal antes del merge, en el commit de cierre. No cambia lo que se mide: el conflicto de los registros es el mismo antes y después de esa corrección.

## Veredicto

6/6. Coste de los sujetos: 1,78 $.
