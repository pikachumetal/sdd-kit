---
kit_version: 1.1.0
superpowers_version: 6.4.2 (superpowers-marketplace)
lane: patch
id: 20260927-130155-patch-0084-headless-phase-mold
task: 0084
mode:
date: 2026-09-27
---

# Ticket para el kit — patch 0084: molde por fase en el lanzador headless, y una fila de deuda que no era un fallo

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback` (con `superpowers:systematic-debugging`)
- Proyecto: el propio repo del kit (plugin de Claude Code, PowerShell y Bash, tests Pester), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~0,6 h hasta el fix, más ~20 min de cierre
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un ticket de campo dio como hecho un total que dependía de una suposición sin verificar

- **Qué pasó**: el ticket del patch 0080 §3 afirmaba «informó de 6,69 $ cuando el total era 10,00 $». Los 10,00 $ salían de suponer que el `total_cost_usd` del turno con `--resume` es solo de ese turno. El propio ticket lo decía como no verificado en «Por qué el kit no lo evitó», pero no en «Qué pasó» ni en «Coste» («un 33 % por debajo»). La fila de deuda heredó el impacto «Medio» y la propuesta de sumar todas las líneas `RESULTADO`. En los 10 streams crudos de esa campaña, el coste del turno reanudado es acumulado: su `modelUsage` suma los `usage` de los dos turnos. El total real eran los 6,69 $. El fix propuesto habría contado dos veces el primer turno y habría hecho saltar `COST_CAP` antes de tiempo. Lo paró la frase del dev-lead en la petición («verifica antes…»), no una regla del kit.
- **Dónde en el kit**: `skills/sdd-feedback/SKILL.md`, reglas, y `skills/sdd-templates/templates/kit-feedback-template.md` (campos «Qué pasó» y «Coste»).
- **Por qué el kit no lo evitó**: la plantilla pide evidencia y criterio de aceptación, pero no separa la cifra medida de la cifra derivada de una suposición. Una suposición escrita en un campo no llega a los demás, y quien triaja al roadmap copia «Qué pasó» y «Coste».
- **Coste**: una fila de deuda con impacto y propuesta equivocados, decidida para antes del corte, y un patch que casi introduce el fallo que decía arreglar.
- **Propuesta**: una regla en `sdd-feedback`: una cifra que depende de algo no verificado lleva la suposición al lado, en el mismo campo («10,00 $ si el coste reanudado es solo de ese turno; sin verificar»). La propuesta queda condicionada a verificarla.
- **Criterio de aceptación**: GIVEN una sesión cuyo coste total depende de si un campo es acumulado o por turno, sin comprobarlo, WHEN el sujeto escribe el ticket con `sdd-feedback`, THEN «Qué pasó» y «Coste» nombran la suposición junto a la cifra, y la propuesta empieza por verificarla. Hoy falla por construcción: el ticket del 0080 es el RED.

### 2. El primer intento de `Invoke-SddMerge.ps1` dejó una carpeta vacía que bloqueó el relanzamiento

- **Qué pasó**: el primer intento falló con `merge: conflicto en .docs/sdd/estimation-log.md, .docs/sdd/roadmap.md`, porque develop había avanzado con otro patch. Seguí «Conflicto solo en los registros» y relancé una vez, como dice la receta. El relanzamiento falló con `destino sacado: ya existe 'D:\code\.worktrees\sdd-kit\merge-0084-headless-phase-mold'`. La carpeta estaba vacía y no salía en `git worktree list`. `Remove-MergeWorktree` había quitado el registro del worktree, pero no la carpeta. No lo reproduje: sospecho de un handle abierto en Windows. Borré la carpeta vacía y el tercer intento fusionó y publicó.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`, `Remove-MergeWorktree` y la guarda `if (Test-Path -LiteralPath $path)` de `Resolve-DestinationWorktree`. También `skills/sdd-end-feature/references/merge-recipe.md` § «Conflicto solo en los registros», paso 7.
- **Por qué el kit no lo evitó**: la limpieza no comprueba que la carpeta desaparezca, y la guarda trata igual una carpeta vacía y huérfana que un worktree vivo. El paso 7 de la receta solo contempla que el relanzamiento vuelva a fallar con `merge:`. Otro fallo no está previsto, y el tercer intento fue decisión mía.
- **Coste**: un intento de más y una decisión sin respaldo escrito. Bajo, pero se repite en cada cierre con conflicto de registros si el síntoma es sistemático.
- **Propuesta**: en la guarda, si la ruta existe, está vacía y no figura en `git worktree list`, borrarla y seguir. Si tiene contenido o está registrada, fallar como hoy. Opcional: tras `worktree remove`, borrar la carpeta si quedó vacía.
- **Criterio de aceptación**: GIVEN una carpeta vacía `merge-<id>` junto a los worktrees, no registrada, WHEN se lanza `Invoke-SddMerge.ps1`, THEN fusiona sin `destino sacado:`. Y GIVEN esa carpeta con un fichero dentro, THEN falla como hoy (test Pester en `tests/`).

## Lo que hice por iniciativa propia

- **Dos filas en una petición, una reproducida y otra no.** `sdd-start-patch` paso 1 solo describe el caso de una fila: si no se reproduce, STOP sin abrir el patch. Con dos filas, abrí el patch para la reproducida. La otra quedó re-medida con sus celdas reescritas, como pide `sdd-end-patch` paso 4, y la contaba el `patch.md` en su §1 y §2. Funcionó: un solo id, una rama, y la fila falsa corregida en el mismo cierre. Candidato a una línea en el paso 1.
- **Verificar con los streams crudos que quedaban en el scratchpad de otra sesión** antes de gastar en un experimento con `claude -p`. Coste cero y evidencia en 10 de 10 streams. Candidato a nota en `tech-stack.md` (Sujetos headless): mirar antes los `.jsonl` de la campaña de origen si su scratchpad sigue en disco.
- **Test en secuencia en lugar de dos `run.sh` a la vez**, como proponía la fila. Comprueba lo mismo (dos moldes distintos) sin depender de tiempos.

## Funcionó, no tocar

- `sdd-start-patch` paso 1 (reproducir antes de abrir) y `sdd-end-patch` paso 4 (reescribir las celdas re-medidas): juntos convirtieron una fila falsa en una corrección documentada, sin fix.
- La opción «Diferir» con disparador y dueño en la pregunta de validación: elegida sin texto, sin otro turno (tercera vez seguida).
- `Get-NextSddId.ps1 -Reserve`, y el renombrado de rama antes del primer commit.
- La receta de conflicto solo en los registros, en sus pasos 1–6: dos filas nuevas contiguas entraron las dos y el log se regeneró.

## Errores míos, no huecos del kit

- `git commit -F -` con un here-string de PowerShell por tubería no le llega a git como stdin: «pathspec … did not match». Se repitió con `-m`.
- Dos `Edit` fallaron con «classifier gave no verdict» del modo auto: es del entorno, no del kit. Paré y lo dije, como pide el error.
