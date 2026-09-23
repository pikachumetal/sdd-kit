---
id: 20260923-143450-task-0040-close-push
task: 0040
title: Walkthrough — Final del cierre: push autorizado y aviso de terminado
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-23
---

# Walkthrough — Final del cierre: push autorizado y aviso de terminado

## 1. Cambios realizados

- **Clave `merge.push`** (`8843a37`): booleana, opcional dentro de `merge` y con default `false`. Se declara en la tabla de claves de `skills/sdd-start-task/references/control-profiles.md`. La tabla de gates tiene una fila nueva para el push de la rama de integración, y el perfil `unattended` la nombra. Es la pregunta 3 del bloque de claves de control (los frenos pasan a la 4), recomendada con git-flow y sin recomendación con otra convención. Las dos init renumeran su referencia. `migrations/v1.2.0.md` la pregunta con el bloque `merge` completo y la declara en «Escribe». `mission.md` recoge la excepción.
- **Push en el paso de rama** (`5e157eb`): sección `## Push` en `skills/sdd-end-task/references/merge-recipe.md`. Se decide en orden (`pair` presenta y espera; con `merge.push: true` se hace; si no, no). El push va al upstream y solo sale la rama destino, sin forzar. Si falla, no se reintenta y el comando se cita en un bloque. El paso 10 de `sdd-end-task` y el 6 de `sdd-end-patch` la enlazan.
- **Paso «Mensaje final»** (`b16db17`, REFACTOR `6c9d689` y `5f9315d`): paso 12 de `sdd-end-task` y 8 de `sdd-end-patch`. Reúne el disparador concretado, las decisiones sin el dev-lead (leyendo el walkthrough o `patch.md`), las instrucciones del dev-lead, lo pendiente y la oferta del ticket. Acaba con `**Terminado.** … puedes borrar el worktree <ruta>` o con `**No terminado.** …`. Un push fallido no cambia la línea, y el checkout principal no se ofrece para borrar (enmienda). El paso del ticket vuelve a decidir solo la oferta.
- **Fixes de la revisión de rama** (`1598afd`): las decisiones de un patch, el orden del push en la receta y el push añadido a un `merge` ya completo en la migración.
- **Tests**: anclas en `tests/ControlProfiles.Tests.ps1`; evidencia en `tests/close-push-red.md` y `tests/close-push-green.md`, con los lanzadores y las salidas en `red/` y `green/` de esta carpeta.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 2,1h — reloj del hilo, aproximado con las marcas de los commits (plan a las 17:26 locales, cierre a las 19:35). Spec y plan, con el RED previo y la review de spec: ~1,3h.
- Desviación: -0,4h (-16%)
- Modelo del hilo: Opus 5.5
- Tokens del hilo: no medido
- Tokens de subagentes: 391k en 4 despachos — revisor de spec dominio Sonnet 106k / 4 min; revisor de spec técnica Sonnet 102k / 3 min; revisor de rama Sonnet 170k / 7 min; re-revisión Sonnet 13k / 1 min
- Coste de sujetos: 15,29 $ en 44 sujetos Sonnet — RED 2,54 $; GREEN tanda 1 4,47 $; tanda 2 5,94 $; tanda 3 2,04 $; sujeto descartado ~0,3 $
- Review de spec: 2 revisores · hallazgos 12, aceptados 12

## 3. Desviaciones del plan

- El GREEN necesitó tres tandas y dos REFACTOR en lugar de una tanda. El techo de 14 $ se respetó (12,75 $).
- Enmienda aprobada por el dev-lead («si»): solo se ofrece borrar un worktree enlazado.

### Decisiones tomadas sin el dev-lead

- Integrar `develop` (task 0006) antes de implementar y adaptar el plan a la plantilla nueva (superficies y verificación por task). Sin conflictos. Coste si está mal: ninguno, los ficheros no se solapan.
- Lanzar el GREEN sin el tool PowerShell, porque en el RED el harness bloqueaba git en el worktree desde ese tool. Coste si está mal: no se mide la conducta con PowerShell, que en campo usa el dev-lead.
- Pasar los mensajes de commit por fichero: el hook `block-dangerous-git.js` casa `--force` dentro del texto del mensaje.
- Limpiar de la evidencia de esta task las rutas locales con el usuario de la máquina. No reescribo el historial de la rama (los primeros commits las llevan), y la carpeta de la 0009 queda a deuda. Coste si está mal: el usuario de Windows del dev-lead queda en el historial público.
- Las anclas Pester de la enmienda y del orden del push se escribieron después del texto (regresión, no RED).
- Re-revisión acotada al commit de fixes con el mismo revisor de rama, en vez de un revisor nuevo.
- En el cierre, `merge.push` no se escribe en el `sdd-kit.json` de este repo: el dev-lead pidió «merge a develop», sin push.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`: 402/0 (6 skipped), en el pre-commit de `1598afd`.

### 4.2 Smoke / tests

Verificado por el agente, con sujetos headless (detalle en `tests/close-push-green.md`):

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Push con `merge.push: true` (task y patch) | 4/4 empujan `develop`, citan el fallo de credenciales y no reintentan |
| 2 | Sin `merge.push` ni instrucción | 2/2 sin push, «push: no hecho: `merge.push` no lo autoriza» |
| 3 | Perfil `pair` | 2/2 presentan merge y push y esperan |
| 4 | Merge denegado por el entorno | 2/2 evidencia antes y «No terminado» la última |
| 5 | Línea de terminado con el worktree que se puede borrar | 10/10 cierres (tanda 2); C y F 2/2 (tanda 3) |
| 6 | Ruling del walkthrough en el mensaje final | 7/8 (tanda 2) → C 2/2 tras el segundo REFACTOR |
| 7 | Ticket aceptado después de la línea | 2/2 repiten la línea con el ticket pendiente |
| 8 | Disparador vago concretado (control del patch 0037) | 2/2 «lo elegí yo… corrígelo» |
| 9 | Pregunta del push en init (git-flow y `next`) y migración | 2/2 cada una, con la recomendación correcta |
| 10 | Instrucción del dev-lead al validar (control) | 2/2 la cumplen y lo dicen |

No probado: un push real que el remoto acepte, el rechazo non-fast-forward y `pair` con `merge.push` a `false` (el texto ya lo resuelve en orden).

Validación diferida: 2026-09-23 · «pues merge a develop y cierro el worktree» · disparador: el primer cierre de task o patch de este repo con el kit 1.2.0, a cargo del dev-lead. El dev-lead no probó nada. Se le ofrecieron dos opciones: cerrar ahora con la validación diferida a un cierre, o dejarlo; eligió cerrar sin push. El disparador lo concreté yo, porque su frase no lo nombraba.

### 4.3 Residuales / deuda generada

- Rutas locales con el usuario de Windows en los `state.txt` de la task 0009 y en el historial de los primeros commits de esta rama → fila de deuda.
- Sin escenario para `pair` con `merge.push` a `false`, para el rechazo non-fast-forward ni para un push real → fila de deuda como posible falso negativo.
- `t-1` de la tanda 1: la receta del merge no fija `-m`, y sin editor el merge puede quedar colgado → fila de deuda (una sola observación).

## 5. Aprendizajes

- En headless, el tool PowerShell pide aprobación para git en un worktree cuyo `.git` apunta fuera del árbol, y el sujeto no llega al merge (3 de 8 en el RED). Se lanza con `--disallowedTools PowerShell` → `tech-stack.md`, «Sujetos headless».
- Claude Code puede matar un comando en segundo plano por falta de memoria, y los procesos hijos (los `claude -p` de una campaña) siguen vivos: antes de relanzar, se buscan con `Get-CimInstance Win32_Process` → `tech-stack.md`, «Sujetos headless».
- Un `rm -rf a b && <recrear a>` que falla en `b` deja `a` borrado y la cadena cortada. El lanzador comprueba que la copia del kit existe antes de lanzar → `tech-stack.md`, «Sujetos headless».
- El `sed` que oculta la ruta de la campaña tiene que cubrir la forma Windows (`cygpath -m`), no solo la de Git Bash → `tech-stack.md`, «Sujetos headless».
- El paquete de revisión sin evidencia se genera con `git diff -- . ':(exclude,glob).docs/sdd/specs/**/red/**'`: sin `glob`, el `*` no cruza `/` y no excluye nada (423 KB frente a 94 KB) → `tech-stack.md`, «Sujetos headless».
- Lo que el mensaje final tiene que decir, el agente lo lee de su memoria si no se le pide abrir el fichero: «relee» dio 7/8, y «abre ahora y no lo resumas de memoria» 2/2 → `tech-stack.md`, «Sujetos headless» (junto al aprendizaje del patch 0037).
- El delta de la spec se fusiona en `capabilities/control-profiles.md`, `onboarding.md` y `migration.md`.

## 6. Adendas

- _Ninguna_
