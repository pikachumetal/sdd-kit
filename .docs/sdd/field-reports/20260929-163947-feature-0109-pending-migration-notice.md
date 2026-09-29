---
kit_version: 2.0.0 (marcador del repo; skills del working tree, plugin.json 2.1.0)
superpowers_version: 6.4.2
lane: feature
id: 20260929-163947-feature-0109-pending-migration-notice
task: 0109
mode: full
date: 2026-09-29
---

# Ticket para el kit — feature 0109: aviso de migraciones pendientes, sin fricción grave

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native
- Skills del kit usadas: `sdd-start-feature`, `sdd-templates` (índice de capacidades, `Get-NextSddId.ps1`, `Watch-SubagentSilence.ps1`, `Test-Capabilities.ps1`, `Measure-SessionTokens.ps1`, `Build-EstimationLog.ps1`, `Invoke-SddMerge.ps1`), `sdd-end-feature`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans`, `executing-plans`
- Proyecto: el propio kit (skills en Markdown, scripts PowerShell con Pester, un hook bash), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: revisor final Opus 5.5 (`sdd-kit:effort-high`); sujetos Sonnet y Haiku
- Coste en reloj: ~1,1 h (spec y plan ~0,5 h, implementación y cierre ~0,6 h)
- Coste en tokens: hilo 24.045.030, subagentes 945.250 (9,25 $); sujetos 0,52 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La plantilla del plan no tiene la sección «Review Focus» que `writing-plans` exige

- **Qué pasó**: `writing-plans` 6.4.2 pide en la cabecera de todo plan una sección `## Review Focus` (las cinco entradas o fallos que la spec implica y ningún test ejercita) y su self-review la comprueba; `executing-plans` la pasa literal al revisor final. El plan, calcado de `plan-template.md`, salió sin ella porque la plantilla no tiene hueco. Al despachar al revisor final escribí el Review Focus a mano en el encargo; el revisor comprobó las cinco entradas y de ellas salieron dos de sus Minors.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md` (entre «Restricciones globales» y «Phase -1») y la sección «Revisor final» de `skills/sdd-start-feature/references/encargo-revision.md`, que no nombra el Review Focus.
- **Por qué el kit no lo evitó**: el kit sobreescribe la forma del plan de superpowers (Art. IX, regla 2), y la plantilla es anterior a la sección de 6.4.2; `SuperpowersCompat.Tests.ps1` no compara las secciones que `writing-plans` exige con las de la plantilla.
- **Coste**: bajo en esta sesión (el hilo lo improvisó); en otra, el revisor final sale sin las entradas que los tests no cubren, que es justo lo que `executing-plans` quiere que mire a propósito.
- **Propuesta**: sección `## Review Focus` en `plan-template.md` con la ayuda de superpowers resumida, y una línea en «Revisor final» de `encargo-revision.md`: el encargo copia literal el Review Focus del plan.
- **Criterio de aceptación**: GIVEN una feature full con `superpowers` 6.4.2, WHEN el sujeto escribe `plan.md` con `plan-template.md` y despacha el revisor final, THEN el plan tiene `## Review Focus` con al menos una línea y el encargo del revisor la lleva literal (hoy 0 de 1: esta sesión).

### 2. El repaso de coherencia no contrasta con el repo un dato que la spec copia de un documento

- **Qué pasó**: la decisión 7 de la spec decía «el marcador del repo está en `1.1.0`», copiado de un pendiente del roadmap que estaba desfasado: `sdd-kit.json` decía `2.0.0`. Lo cazó el revisor final en su «Declined to judge»; la spec y el plan se corrigieron en la pasada de fix.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 4, «Repaso de coherencia» (contrasta cada literal con las decisiones y los escenarios de la spec, y los `MODIFIED` con el código, pero no un dato de estado copiado de un doc).
- **Por qué el kit no lo evitó**: el repaso busca contradicciones internas y dónde se implementa un `MODIFIED`; un valor de estado del repo (una versión, un contador) sacado del roadmap no se contrasta con su fichero fuente.
- **Coste**: bajo (dos líneas corregidas); con el valor usado en un THEN habría sido un escenario falso aprobado.
- **Propuesta**: una frase en el repaso: un dato del estado del repo que la spec cita (una versión, un marcador, un recuento) se lee de su fichero fuente, no del roadmap ni de otro doc.
- **Criterio de aceptación**: GIVEN un roadmap que dice «el repo está en 1.1.0» y un `sdd-kit.json` en `2.0.0`, WHEN el sujeto escribe una spec que menciona el marcador del repo, THEN la spec dice `2.0.0` o señala la discrepancia.

## Lo que hice por iniciativa propia

- **Reproducir un hallazgo de la revisión final sin sujeto**: el Minor re-graduado afirmaba un fallo de un comando git (`git diff --stat HEAD~1` en una migración encadenada). Lo reproduje en un repo simulado de tres commits en el scratchpad (RED: lista el `.gitignore` de la migración anterior; GREEN: `git status --short` solo lista el marcador), en segundos y sin coste, y después un solo sujeto de control confirmó que la migración seguía igual. Funcionó; candidato a frase en «Reproducir antes de arreglar»: si el hallazgo es sobre un comando determinista, el RED puede ser el comando en un molde mínimo, sin sujeto.
- **El GREEN del hook midió también qué no hace el agente**: la sesión headless no solo comprobó el `systemMessage`, sino que el agente, con el aviso delante y una pregunta que no era migrar, no arrancaba la migración (1 turno, sin tool calls). Funcionó a 0,03 $.
- **Reusar el `subject.sh` del RED con `PHASE=green`** en vez de copiarlo a `green/`: el lanzador ya separa las salidas por fase.

## Funcionó, no tocar

- La primera pregunta de `sdd-start-feature` con carril, modo, perfil y recuento de tasks en una sola pregunta: una respuesta y a trabajar.
- La regla del dev-lead de rebatir cuando hay una opción mejor encajó con la entrevista: rebatí «lo escribe `sdd-end-release`» (skill de consumidores sin `migrations/`) con una pregunta cerrada y la alternativa de un test Pester; el dev-lead eligió la alternativa y el cierre de release queda garantizado sin tocar ninguna skill.
- La re-graduación por efecto de `executing-plans`: el revisor dejó como Minor un fallo falso que el agente habría reportado a un dev-lead; subirlo a Important costó una línea.
- La validación diferida con disparador vago («las pruebas van en el uso»): la regla de concretarlo con dueño evitó una pregunta más.
- El revisor final en segundo plano y anclado en un worktree desanclado: el hilo escribió los borradores y corrió el gate completo (377 s) mientras revisaba.

## Errores míos, no huecos del kit

- En PowerShell pasé el mensaje del commit de cierre como `git commit -F - @'…'@`: el here-string entró como argumento, no por stdin, el commit falló y lo tapó un `Select-String` que filtraba la salida; al repetirlo para ver el error, un `git commit -m "tmp"` sí se creó y hubo que enmendarlo. Lo correcto era `-m @'…'@` o `-F <fichero>`.
- Dos veces escribí ediciones con `python` y cadenas con `\|` o `\\` que dieron `SyntaxWarning` o un `assert` fallido; con `Edit` sobre el fichero CRLF fue directo.
