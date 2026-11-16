---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261031-165052-feature-0177-release-cut-now-to-changelog
task: 0177
mode: full
date: 2026-10-31
---

# Ticket para el kit — feature 0177: el corte de release sale de Now al changelog

## Contexto

- Carril y modo: feature full
- Skills del kit usadas: sdd-propose, sdd-start-feature, sdd-implement, sdd-tdd, sdd-verify, sdd-parallel-agents, sdd-archive, sdd-feedback
- Proyecto: el propio kit, skills en Markdown y CLI en Node
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 y Sonnet 5.5 (revisión); Sonnet (sujetos)
- Coste en reloj: 1,07 h frente a 3 h estimadas
- Coste en tokens: 19.850.433 del hilo y 2.812.435 de subagentes; 13,29 $ de sesión y 7,34 $ de 32 sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una sustitución por script dañó tres ficheros, y un commit afirmó lo que no había pasado

- **Qué pasó**: en la pasada de fix, un `foreach` de PowerShell sobre una tabla con parejas `@(@('a','b'))` aplanó las de un solo elemento y cambió letras sueltas en tres ficheros (`proyecto` → `pro ecto`). Al repetirlo con una función `R`, PowerShell la resolvió como alias de `Invoke-History`: `A positional parameter cannot be found`. Las sustituciones no se aplicaron, y aun así hice un commit cuyo cuerpo decía que sí; lo vi al leer la salida, ya dentro de `sdd-archive`.
- **Fuente**: salida de la herramienta PowerShell en la sesión; `git diff --stat`, 134 líneas de `.docs/workflow/brownfield.md` cambiadas antes de restaurar.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Un script de Python en un heredoc…»; `skills/sdd-implement/SKILL.md`, completion contract.
- **Por qué el kit no lo evitó**: la regla existía para texto con escapes («se escribe con las herramientas de edición») y no la apliqué, porque el texto no llevaba escapes: la excepción que me di no estaba cerrada. Y encadené el commit en la misma llamada que las sustituciones, sin leer su resultado.
- **Coste**: unos 10 min y dos vueltas de la pasada de fix (commit juntado en el cierre del walkthrough de la 0177).
- **Propuesta**: en `tech-stack.md`, ampliar la regla a toda sustitución en varios ficheros: con Edit, o con un script que aborte al primer literal no encontrado y sin commit en la misma llamada.
- **Verificada**: sí — reproducido con esa tabla en PowerShell 7 en la sesión.
- **Criterio de aceptación**: GIVEN una pasada que cambia una frase en cinco ficheros WHEN el agente la aplica THEN usa Edit, o su script para ante un literal que no encuentra, y `git diff --stat` se lee antes del commit.

### 2. Conté mal la evidencia del escenario que no medí

- **Qué pasó**: escribí en la evidencia que el molde `a4` había dejado dos filas en Now. Era falso: las quitó, y el sujeto publicó esas dos desde sus carpetas de `changes/`. La re-revisión lo cazó. La parada «nada que publicar» queda sin ninguna medida a favor, y sin sujetos en el techo para relanzarla.
- **Fuente**: `green/out/a4-1.tools.txt:25` y `green/out/a4-1.texts.txt:24` de la carpeta de la spec.
- **Dónde en el kit**: `skills/sdd-verify/SKILL.md`, «The Gate Function».
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: inferí la causa de la salida final sin abrir las tools del sujeto.
- **Coste**: un Important de la re-revisión; una regla de la skill sin medir.
- **Propuesta**: en `tech-stack.md`, «Comprobación previa de cada escenario», añadir que el molde con `DRY_RUN=1` se inspecciona contra lo que el escenario quita, no solo contra el validador, y que el veredicto de un sujeto se contrasta con su `tools.txt`. Y relanzar `a4` sin carpetas ni «entra todo lo hecho» en el humo de la 0152.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN Now con solo una 🧪 ya publicada, `[Unreleased]` vacío y sin carpetas sueltas WHEN se ordena el corte THEN el sujeto dice que no hay nada que publicar y no sella.

### 3. «Un frente limpio se saca de la spec» no vale si el texto que lo consigue se reescribe

- **Qué pasó**: el frente de la herencia salió limpio en el RED. Lo dejé en la spec por ser alcance del dev-lead, sin guía nueva; al reescribir, `d-1` dejó de rescatar la 0007. Solo se vio porque el GREEN lo midió. Con la regla literal, el frente habría salido de la spec y de la tanda.
- **Fuente**: `red/out/d-1.texts.txt` y `green/out/d-1.tools.txt` de la carpeta de la spec.
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md`, forma del prompt de arranque; constitution, Art. I (renombrar o retirar lleva tabla, reescribir no).
- **Por qué el kit no lo evitó**: la tabla «regla retirada → dónde vive ahora» del Art. I solo se exige al retirar o renombrar, no al reescribir una skill.
- **Coste**: un sujeto y una ronda (0,4 $); habría sido un fallo en campo.
- **Propuesta**: que una reescritura lleve esa tabla, y que un frente limpio siga en el GREEN como control.
- **Verificada**: sí — contrastado con `.docs/sdd/constitution.md`, Art. I.
- **Criterio de aceptación**: GIVEN una spec que reescribe una skill WHEN un frente sale limpio en el RED THEN sale de lo que se arregla y sigue entre los controles del GREEN.

## Lo que hice por iniciativa propia

- Molde único con un escenario por frente en `red/subject.mjs`, sobre `lib.mjs`: 9 sujetos por 2,58 $. Funcionó y salió más barato que lo previsto.
- Probar un molde con `DRY_RUN=1` más `sdd roadmap check`, antes de gastar: cazó que rc1 y rc2 fallaban por un id `B1`.

## Funcionó, no tocar

- La re-revisión única con Opus: encontró el hallazgo 2 y `greenfield.md`, que ni el grep de la Task 3 ni el eje Spec habían visto entero.
- La orden literal en la skill frente a la condición en prosa (`d-1` contra `d-2`).

## Menores

- La estimación contó la espera de los sujetos a ~4 min cada uno y el real fue 0,5-1 min: desviación del -64 % — `skills/sdd-propose/references/plan-writing.md`, no localizado el precio en tiempo.
- Los sujetos repiten el aviso «el kit cargado es el 2.3.4 y el proyecto pide el 3.0.0», porque `plugin.json` va por detrás de las migraciones durante la release — ya apuntado en `tech-stack.md`.
- La `sdd-archive` cargada por el harness traía el texto de arranque tras editarla; contrastado con el working tree como pide `CLAUDE.md` regla 1.
