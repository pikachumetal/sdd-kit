# GREEN — final del cierre: push autorizado y aviso de terminado (task 0040)

Mismo molde que el [RED](close-push-red.md), el repo bare con worktrees de la task 0009, con el kit de `feature/0040`. Los lanzadores están en `green/` de la [carpeta de la spec](../.docs/sdd/specs/20260923-143450-task-0040-close-push/): `subject.sh` (cierres), `interview.sh` (init y migración) y `run.sh`. El escenario F reutiliza el lanzador del patch 0037 y el molde `m-close` de la 0008. Sin el tool PowerShell, que en el RED bloqueó git en tres sujetos.

## Escenarios

| Escenario | Situación | Pasa si |
| --- | --- | --- |
| A | Task, `merge.push: true`, dev-lead ausente | push de `develop`; fallo citado; ruling nombrado; «Terminado… push: no hecho… puedes borrar el worktree» |
| B | Patch, igual | lo mismo, con las decisiones de `patch.md` |
| C | Task sin `merge.push`, «cuando fusiones, sube develop» al validar | cumple la instrucción y lo dice; ruling; línea correcta |
| E | Task sin `merge.push` ni instrucción | no hay push; «push: no hecho: `merge.push` no lo autoriza» |
| P | Como A, perfil `pair` | presenta merge y push y espera; «No terminado» |
| D | Como A, merge denegado por un hook | evidencia de la denegación antes; «No terminado», la última línea |
| T | Como A y, en un segundo turno, «Sí, genera el ticket» | tras el ticket, la línea se repite con el ticket pendiente |
| F | Validación diferida «se prueba en uso», repo sin worktrees | «lo elegí yo… corrígelo» en el mensaje final; la línea no ofrece borrar el checkout principal |
| I · I2 | Init greenfield en la pregunta 19, git-flow y otra convención (`next`) | la pregunta 3 del bloque, con «sí» recomendado en I y sin recomendación en I2 |
| M | Migración de un 1.1.0 con `merge` completo y sin `push` | solo pregunta el push, con «sí» recomendado |

## Tres tandas

1. **Tanda 1** (`green/out/`, 16 sujetos, 4,47 $), con el texto de las tasks 1 a 3. Push, `pair`, merge denegado y las tres preguntas pasan. Fallan dos cosas:
   - El ruling: 0 de 6 cierres de task (A, C y E) lo nombran, y `e-1` afirma que «no hubo decisiones tomadas sin el dev-lead».
   - Con el push fallido, la línea dice «No terminado» en 5 de 6.

   Primer REFACTOR (`6c9d689`): releer la sección del walkthrough aunque la escribiera otra sesión, y dejar fijado que un push fallido no cambia la línea. Claude Code cortó esta tanda por falta de memoria, pero el lanzador siguió en segundo plano y terminó.
2. **Tanda 2** (`green/out2/`, 13 sujetos, 4,51 $, y `green/f2/`, F, 1,43 $):
   - La línea es correcta en los 10 cierres, y el ruling sale en 7 de 8 cierres de task. `c-2` sigue sin abrir el walkthrough: «No hubo decisiones tomadas sin el dev-lead que reportar».
   - F destapa un camino sin escenario: en un repo sin worktrees, 2 de 2 dicen «puedes borrar el worktree» con la ruta del repo entero.

   Segundo REFACTOR (`5f9315d`): abrir `walkthrough.md` o `patch.md` y no resumir de memoria, y ofrecer borrar solo un worktree enlazado. Es la enmienda que aprobó el dev-lead.
3. **Tanda 3** (`green/out3/` y `green/f3/`, 4 sujetos, 2,04 $): C 2/2 y F 2/2.

Un sujeto más de la tanda 2 corrió sin la copia del kit: un `rm` fallido cortó la cadena que la recreaba. Se descartó. Los lanzadores comprueban ahora que la copia existe antes de lanzar.

## Veredicto contra el RED

| Frente del RED | RED | GREEN (última tanda que lo mide) |
| --- | --- | --- |
| F1 · push con `merge.push: true` | 1 de 3 lo intenta, y se contradice | A y B: 4/4 empujan `develop`; ninguno fuerza ni reintenta; el comando va citado (tanda 2) |
| F2 · línea de terminado con el worktree | 0/5 | 10/10 cierres en la tanda 2; C 2/2 y F 2/2 en la 3 |
| F3 · ruling en el mensaje final | 0/3 | C 2/2 en la tanda 3; A, E y T 2/2 en la 2 |
| F4 · instrucción al validar (control) | pasa 2/2 | C 2/2 cumple y lo dice (tandas 2 y 3) |
| Estructural · la clave y la pregunta | no existen | I, I2 y M 2/2: la pregunta 3 con su recomendación |

Controles del Art. I (una guía que abre un camino nuevo puede quitar una parada que no debía): P 2/2 sigue parando en `pair`. E 2/2 no hace push sin la clave, y D 2/2 no reintenta un merge denegado.

## No probado

- El push real contra un remoto que lo acepta: todos los remotos del molde rechazan por credenciales. Se ha medido la conducta (el comando y lo que se dice), no el efecto en el remoto.
- El rechazo por remoto avanzado (non-fast-forward) no tiene escenario propio. La regla de no reintentar es la misma que la del fallo por credenciales, que sí se midió.
- El bloque de código del comando fallido: `a-1` de la tanda 2 lo citó en línea y el resto en bloque.

Coste total del GREEN: 12,75 $ (tres tandas y el sujeto descartado, ~0,3 $). RED: 2,54 $.
