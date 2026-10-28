---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261028-192530-feature-0238-subject-lib-to-node
task: 0238
mode: full
date: 2026-10-28
---

# Ticket para el kit — feature 0238: la biblioteca del sujeto y los moldes de las baterías pasan a Node

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-start-feature`, `sdd-implement` (Native), `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit (plugin de Claude Code, CLI en Node, una persona y varias sesiones a la vez)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: eje Spec y re-revisión en Opus 5.5, eje Código en Sonnet 5.5
- Coste en reloj: 3,02 h frente a 6 h (4-8) estimadas
- Coste en tokens: 193.410.473 del hilo y 18.255.041 de 3 subagentes; 61,89 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un tope sacado de un ticket rechazaba el caso que el propio ticket daba por bueno

- **Qué pasó**: una ampliación de alcance pedía rechazar una carpeta de ejecución «de más de ~80 caracteres». Escribí 80 en la enmienda sin contrastarlo con la evidencia del mismo ticket, que daba por bueno un caso de unos 83 y por malo uno de unos 190. La revisión final lo hizo visible: con 80, el lanzador rechazaba el caso que funcionó. Subirlo a 100 fue un desvío de la spec aprobada, con parada para el dev-lead, una task nueva (Task 7) y el merge esperando mientras otra sesión aguardaba para sincronizar.
- **Fuente**: `.docs/sdd/specs/20261028-164955-feature-0238-subject-lib-to-node/spec.md`, `## Enmiendas` (las dos entradas del 2026-10-28) y `walkthrough.md` §3; commit `b14e2095`
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings» (la enmienda se escribe en su sitio de `spec.md`); `skills/sdd-propose/references/spec-writing.md` (los valores de ✋)
- **Por qué el kit no lo evitó**: ningún paso pide contrastar un umbral copiado de un ticket con los datos que el ticket trae
- **Coste**: una parada de desvío y una task más; la espera del dev-lead, sin respaldo
- **Propuesta**: un umbral que viene de un ticket se escribe con los valores medidos del ticket al lado («83 funcionó, 190 falló → 100»), y la enmienda o la línea de ✋ los cita
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un ticket que propone «~80» y cita un caso de 83 que funcionó y uno de 190 que falló, WHEN el agente fija el umbral en la spec o en una enmienda, THEN la línea cita los dos valores y el umbral deja pasar el de 83

### 2. La línea base del gate corrió sobre el árbol mientras se escribían los RED de la siguiente task

- **Qué pasó**: lancé la línea base sin filtro en segundo plano y seguí con la Task 1. El gate esperó 12 min el cerrojo de suites de otros worktrees y, al correr, encontró los RED de la Task 2 a medio escribir: 30 tests y el `tsc` en rojo. La línea base no valió y no se repitió; el «antes» de la medida salió del roadmap.
- **Fuente**: `.temp/sdd/plan/progress.md`, línea «Setup: Ruling: línea base sin filtro…», copiada en `tasks.md` §Rulings; la salida de `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test-min` («Esperando el cerrojo de suites: vas 3.º en la cola», y después `lib.test.ts (63 tests | 30 failed)`)
- **Dónde en el kit**: `skills/sdd-worktrees/SKILL.md`, paso 3 («Verify Clean Baseline»); `skills/sdd-implement/SKILL.md`, Setup paso 1
- **Por qué el kit no lo evitó**: el paso no dice si la línea base puede correr en segundo plano ni sobre qué árbol; con el cerrojo de suites, esperar en primer plano bloquea la sesión
- **Coste**: la línea base perdida (unos 13 min de máquina) y la medida del «antes» sin ejecutar en esta rama
- **Propuesta**: la línea base corre sobre un worktree desanclado en `HEAD`, como la revisión final, para que la sesión siga trabajando sin contaminarla
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una línea base que espera el cerrojo de suites, WHEN la sesión empieza a escribir los RED de la Task 1, THEN la línea base corre sobre el árbol del commit de apertura y su resultado no cambia con esos ficheros

### 3. Una propiedad del repo («sin bash») se verificó por la extensión de los ficheros

- **Qué pasó**: la verificación de la retirada fue `git ls-files '*.sh'` vacío. Se escapó un script de bash sin extensión: el `claude` que bloquea el `claude` anidado de un sujeto. El e2e lo lanzaba en Linux, en contra de la restricción «ningún test lanza bash». Lo encontró la re-revisión única, y su arreglo quedó como commit sin revisar en el cierre.
- **Fuente**: `.docs/sdd/specs/20261028-164955-feature-0238-subject-lib-to-node/plan.md`, Task 5 («**Verificación**: `git ls-files '*.sh' …` vacío»); `walkthrough.md` §1 y la línea ✋ «Sin revisar: el commit de cierre»
- **Dónde en el kit**: `skills/sdd-propose/references/plan-writing.md` (la «Verificación» de cada task)
- **Por qué el kit no lo evitó**: el plan no pide que la verificación compruebe la propiedad, y no un indicador de ella
- **Coste**: un hallazgo Important en la re-revisión y un arreglo fuera de ella
- **Propuesta**: cuando una task promete la ausencia de algo («sin bash», «sin PowerShell»), su verificación busca la propiedad (el shebang, el intérprete), además del nombre
- **Verificada**: sí — `git grep -l "^#!/usr/bin/env bash"` encontraba el fichero, y `git ls-files '*.sh'` no
- **Criterio de aceptación**: GIVEN un repo con un script de bash sin extensión, WHEN se escribe la verificación de una task que retira bash, THEN esa verificación falla con el fichero

## Lo que hice por iniciativa propia

- Para portar los 14 moldes sin cambiarlos, construí en seco cada escenario con la versión vieja (desde un worktree desanclado en el commit anterior) y con la nueva, y comparé el árbol del molde sin `.git` y el `state.txt` sin hashes. Funcionó: encontró que los `sed` de Git Bash dejaban las fixtures en LF, cosa que leyendo el código no se veía, y volvió a pasar tras la pasada de fix. Es candidato a la regla de cómo se porta una herramienta de test.
- Verifiqué la suite en Linux con el script de contenedor de otra sesión (`ubuntu:24.04` con `docker run`), antes del merge. Así se vieron dos rojos de Linux y se arreglaron antes del push, en vez de en el CI de `develop`.
- Acepté una ampliación de alcance que llegó por otra sesión con la frase del dev-lead, la registré como enmienda «transmitida por la sesión develop», y paré después por un desvío que salió de ella. El kit no dice qué vale una aprobación transmitida por otra sesión.

## Funcionó, no tocar

- La comprobación de la base antes de cada task vio a tiempo un CI de Linux nuevo y un `subject.sh` que había cambiado en `develop`; integrar la base antes de portarlo evitó portar la versión vieja.
- La re-revisión única con opus encontró lo que la pasada de fix rompió (un script de bash sin extensión, una función de 22 líneas) sin abrir otra ronda.
- La validación en campo cerró sin parar a pedir validación, con smoke real de los rechazos provocados con su entrada.

## Menores

- La fila del roadmap decía «13 moldes» y eran 14 (faltaba el de `using-sdd`) — no localizado (lo escribió `sdd-roadmap` al partir la 0216)
- `sdd ledger rulings` también devuelve la fila de la tabla del pre-flight que contiene «Ruling», y entra en `tasks.md` §Rulings como si fuera uno — `cli/` (verbo `ledger rulings`)
- Las plantillas de los encargos de revisión (`skills/sdd-verify/references/*-prompt.md`) tienen CRLF, y mi script para rellenarlas no encontraba el bloque `text` hasta normalizarlas — no localizado
