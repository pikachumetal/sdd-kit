---
id: 20260923-145338-task-0042-merge-script
task: 0042
title: Walkthrough — La receta de merge del cierre como script con cerrojo
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-23
date: 2026-09-23
---

# Walkthrough — La receta de merge del cierre como script con cerrojo

## 1. Cambios realizados

- **Script** `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`. Toma un cerrojo `sdd-merge.lock` en `git rev-parse --git-common-dir`, que se crea con `CreateNew` y guarda un JSON con el dueño. Si el cerrojo está cogido, espera y dice quién lo tiene; si el dueño es un proceso muerto de la misma máquina, lo toma. Después hace `fetch` e integra la base del remoto, fusiona `--no-ff` en `merge-<id>` junto a los demás worktrees y regenera `estimation-log.md` si choca. Ejecuta `-VerifyCommand` y, con `-Push`, empuja la rama destino por su nombre. Un fallo desde el merge devuelve la rama destino al commit anterior; el `finally` retira el worktree y suelta el cerrojo. Commits `7bd8aa2` y `d0cbb93`; el segundo hace fallar `-Push` sin remoto y pone la hora en ISO.
- **Contrato** `tests/Invoke-SddMerge.Tests.ps1`. Son 16 tests Pester sobre un remoto bare, un clon bare y un worktree por rama, bajo `Fusión ñ …`. Cubren dos procesos que compiten por el cerrojo, el tiempo de espera agotado, el cerrojo huérfano, la base adelantada, el conflicto del log y otro conflicto cualquiera, el push y el no push, la verificación en rojo, el push rechazado, `-Push` sin remoto, la ruta del temporal, el destino sacado sucio y limpio, `GIT_INDEX_FILE` heredado y la falta de política.
- **Receta** `skills/sdd-end-task/references/merge-recipe.md`. Pasa a ser la invocación del script, más qué hacer si falla: qué pasos se reintentan una vez y cuáles resuelve una persona. Conserva «Merge denegado por el entorno». También cambian el paso 10 de `sdd-end-task`, el paso 6 de `sdd-end-patch` y la tabla de scripts de `sdd-templates`. Commits `529fcab` y `1bedf7b`; el segundo restaura los literales que había comido un here-string.
- **Anclas** en `tests/ControlProfiles.Tests.ps1`: la receta y los dos pasos nombran el script, `-Push` va solo con el push confirmado y ningún `.md` de `skills/` lleva caracteres de control.
- **Evidencia** del Art. I: `tests/merge-script-red.md` y `tests/merge-script-green.md`. El molde, el lanzador y las salidas están en `red/` y `green/`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 1,6h — reloj del hilo, aproximado con las marcas de los commits: del plan (17:29) al cierre (≈ 19:05). La spec y el plan llevaron ≈ 0,8h, frente a 1h estimada.
- Desviación: −1,4h (−47 %)
- Causa de la desviación: la campaña RED/GREEN corrió en paralelo con el implementador de la Task 1, en vez de ir después. Además, el molde se reutilizó del RED de la 0009 sin copiarlo, y cada sujeto era de un turno. Es el sesgo del tercer aviso de `estimation.md`: una campaña headless no suma al reloj.
- Modelo del hilo: claude-opus-5-5
- Tokens del hilo: no medido
- Tokens de subagentes: 662k en 4 despachos — implementador Sonnet 278k / 47 min (con tres reanudaciones); revisor de task Sonnet 129k / 7 min; revisor final Sonnet 182k / 6 min; re-revisión Sonnet 73k / 1 min
- Coste de sujetos: 1,43 $ en 5 sujetos Sonnet — RED 0,63 $; GREEN 0,80 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Los tests del contrato no se commitearon antes de despachar.** El hook `pre-commit` ejecuta la suite y rechaza un test en rojo, así que el test viajó en el commit del script, como en la 0009.
- **Se añadió un requisito técnico durante la ejecución: limpiar `GIT_*` del entorno**, en el test y en el script, más un test que lo comprueba. Motivo: el primer commit del plan disparó el hook con el test ya en `tests/`, y la fixture escribió en el índice real del worktree a través de `GIT_INDEX_FILE`. Se reparó con `git read-tree HEAD`, y las ramas y los reflogs quedaron intactos.
- **La revisión final abrió un fix wave**: dos Important (la receta corrupta y `-Push` sin remoto) y un Minor (la hora con la cultura del sistema). Hubo una sola re-revisión acotada, y los tres quedaron resueltos.

### Decisiones tomadas sin el dev-lead

- Los tests RED de la Task 1 viajan en el commit de la implementación y no antes del despacho. El pre-commit rechaza una suite en rojo, y nunca se usa `--no-verify`. Coste si está mal: ninguno, el contrato es el mismo fichero.
- Los tests del hilo limpian `GIT_DIR`, `GIT_INDEX_FILE` y el resto de `GIT_*`, porque dentro del hook la fixture escribía en el índice real. Coste si está mal: ninguno.
- El hilo corrigió dos bugs de su propio test: `SetEnvironmentVariable($null)` deja la variable en `""` en vez de borrarla, y `return @(x)` se desenrolla, así que `[0]` indexa un carácter. El implementador los detectó y no tocó el contrato. Coste si está mal: ninguno, 15/15 con el script.
- Con `merge.noFf: false` y una feature adelantada, git hace fast-forward y no hay commit `merge: <rama> en <destino>`. Se deja así, porque es lo que pide esa política; el título aplica cuando hay commit de merge. Coste si está mal: un proyecto con `noFf: false` no tiene commit de merge titulado.
- El arreglo de la receta restaura el literal que se quería y no repite RED→GREEN. Coste si está mal: la frase de reintento no se ha medido con sujetos, porque el GREEN no pasó por ese camino.

## 4. Verificación

### 4.1 Builds

- `Parser::ParseFile` del script: sin errores (implementador).
- Hook `pre-commit` (suite completa) en cada commit de la rama: la última, en `1bedf7b`, dio 409 en verde, 0 fallos y 6 omitidos.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-23 · «ya sabes como va, pruebas en diferido en uso del kit, merge y push» · disparador: el primer cierre de task o patch del kit que fusione con `Invoke-SddMerge.ps1` después de esta task, a cargo del dev-lead.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `Invoke-Pester -Path tests/Invoke-SddMerge.Tests.ps1` (hilo, primer plano) | 16/16 en verde, 191 s |
| 2 | Smoke manual: dos `pwsh` reales a la vez en `Smoke Fusión ñ`, `-Push` | B imprime «Esperando el cerrojo de merge: lo tiene feature/0101…» y fusiona encima de A; local y remoto en `6bfc3cc`; sin temporal ni cerrojo |
| 3 | RED de la receta (kit de `develop`), 2 sujetos | 2/2 sin `fetch` antes del merge; 2/2 con el push rechazado; 1/2 con `develop` divergida sin publicar |
| 4 | GREEN de la receta (kit de la rama), 2 sujetos | 2/2 invocan el script con `-Push` y la suite; local igual a remoto; 0/2 rehacen nada a mano |
| 5 | Control de denegación (d1), 1 sujeto | cita el comando, el texto y el hash; no reintenta |
| 6 | Revisión de task y revisión final de rama | aprobada; fix wave con los 3 hallazgos resueltos en la re-revisión |

### 4.3 Residuales / deuda generada

- Un worktree `merge-<id>` que queda huérfano si alguien mata el proceso entre su creación y el `finally`: la siguiente ejecución lo toma por destino sacado. Pasa a la deuda del roadmap.
- `Invoke-GitUtf8` descarta el stderr de git, así que ningún mensaje de fallo lleva el motivo que da git (por ejemplo, un push rechazado y un fallo de red se ven igual). Pasa a la deuda del roadmap.
- Minors sin impacto: falta `@(...)` en `Find-BranchWorktree`; los warnings se suprimen dos veces al llamar a `Build-EstimationLog`; no hay test propio para un conflicto ajeno en el paso `base`; falta una línea en blanco en el test. Van en la misma fila de deuda.
- La task 0040 (`merge.push`) construye sobre el `-Push` de este script, y su worktree comparte con esta task `sdd-end-task` paso 10 y la receta: la 0040 integra `develop` antes de seguir.

## 5. Aprendizajes

- En PowerShell, `[Environment]::SetEnvironmentVariable($name, $null)` no borra la variable: el `$null` llega como `""`. Con `GIT_DIR=""` git falla. Se borra con `Remove-Item Env:\<nombre>`. → `tech-stack.md`
- Un test que ejecuta git en fixtures corre también dentro del hook `pre-commit`, que exporta `GIT_INDEX_FILE`. Heredada, la fixture escribe en el índice del repo que se está commiteando. Se limpia `GIT_*` al empezar. → `tech-stack.md`
- `return @(x)` de un elemento se desenrolla y `[0]` indexa un carácter: hay que indexar con `@(f)[0]` en quien llama. → `tech-stack.md`
- La trampa (6) de los backticks en un here-string con comillas dobles volvió a morder, esta vez en la receta. Ahora la vigila un test (`ControlProfiles.Tests.ps1`). → `tech-stack.md`, en el punto (6)
- El delta de `control-profiles` se fusiona en la capacidad: 4 ADDED. → `capabilities/control-profiles.md`
- Revisión de skills: este repo no tiene `.claude/skills/` (lo he comprobado: en `.claude/` solo está `settings.json`). Las skills del kit que el trabajo desmentía (`sdd-end-task`, `sdd-end-patch` y `sdd-templates`) ya las cambió la Task 2, con RED→GREEN. → no aplica

## 6. Adendas

- 2026-09-23 — **Los tests de `Invoke-SddMerge.Tests.ps1` salen del hook.** Con ellos, el `pre-commit` pasó de ~50 s a ~200 s por commit, y el dev-lead lo paró («¿llevas 3m o más para un commit?»). Los cinco `Describe` llevan `-Tag 'Slow'`, y `.githooks/pre-commit` ejecuta `Invoke-Pester -Path tests -ExcludeTagFilter Slow`. La suite completa queda para la validación final. Se documenta en `tech-stack.md` (línea del «CI» local) y en el `README`. — dev-lead: «pon los tests lentos fuera del hook»
- 2026-09-23 — **Corrección de §3 y §5.** Dos cosas que en esta task se trataron como descubrimientos ya estaban en `tech-stack.md`, y no se leyeron porque el paso 1 de contexto buscó por palabras en vez de leer el documento entero. Una es la regla «Dentro de un hook de git, `git -C` no basta». La otra, que los tests RED del hilo se aparcan en la carpeta de la spec y el implementador los mueve con `git mv`. El aprendizaje de §5 sobre `GIT_INDEX_FILE` no es nuevo: el punto (8) de las trampas de `tech-stack.md` queda como remisión a esa regla, sin duplicarla. — agente, a raíz de la pregunta del dev-lead «¿cuándo pusimos eso?»
