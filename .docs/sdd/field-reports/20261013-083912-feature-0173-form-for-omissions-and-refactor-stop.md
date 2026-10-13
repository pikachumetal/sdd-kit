---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261013-083912-feature-0173-form-for-omissions-and-refactor-stop
task: 0173
mode: full
date: 2026-10-13
---

# Ticket para el kit — feature 0173: un RED calificado a ojo sacó una regla que el RED pedía

## Contexto

- Carril y modo: feature full, Native, perfil delegate, validación en campo
- Skills del kit usadas: sdd-propose, sdd-grilling, sdd-implement, sdd-worktrees, sdd-end-feature, add-to-changelog, sdd-feedback
- Proyecto: el propio kit (plugin de Claude Code: skills en Markdown, CLI en TypeScript, Pester), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 effort high (revisión final); 14 sujetos headless Sonnet
- Coste en reloj: 1,6 h frente a 2,5 h estimadas (walkthrough §2)
- Coste en tokens: hilo 48,7 M, subagentes 1,4 M; 19,70 $ de sesión más 3,52 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El hilo calificó los sujetos a ojo, con una rúbrica escrita delante

- **Qué pasó**: la rúbrica `O1` de la batería de `sdd-implement` decía que la ronda pasa si el paso «manda enviar una línea o un bloque literal con un marcador de la ruta». El hilo contó como plantilla dos recetas en prosa («one line that carries the path… naming the file as `notas/<slug>.md`»). Con ese recuento, el RED de `o1` salió limpio entre los sujetos que leyeron la regla, y una enmienda sacó la fila del Art. II que la spec aprobada hacía entrar si el RED fallaba. El GREEN de `o2` quedó en 1/2, contado como 2/2. Lo cazó la revisión final (Important 1). Recalificado con la rúbrica literal: RED `o1` 3/4, y la fila volvió.
- **Dónde en el kit**: en este repo, `tech-stack.md`, «Baterías por skill» («Dos veredictos»: el de la conducta lo da quien lanza la batería, leyendo con la rúbrica); `tests/headless/battery.sh` solo da el veredicto de la puerta.
- **Por qué el kit no lo evitó**: nada pide citar la línea de la rúbrica sujeto por sujeto antes de dar el veredicto, y el veredicto automático de `battery.sh` («verde») se lee como si fuera el de la conducta. La regla existía (calificar con la rúbrica) y no la apliqué literal.
- **Coste**: una enmienda de la spec que hubo que corregir, una tanda de GREEN de más (~1 $, 4 sujetos) y ~30 min (walkthrough §3, ledger «Final: Ruling: Important 1»).
- **Propuesta**: aplicada en el cierre como aprendizaje en `tech-stack.md` («Cada sujeto se califica con la rúbrica escrita, literal, y fila por fila»). Falta probar si basta: que el veredicto de la conducta se escriba en una tabla sujeto × fila de la rúbrica, con la cita que la decide, antes de cualquier enmienda que dependa de él.
- **Verificada**: sí — recalificar los 10 sujetos con la rúbrica literal reproduce el veredicto del revisor (RED `o1` 3/4, GREEN `o2` 1/2).
- **Criterio de aceptación**: GIVEN un RED cuya rúbrica exige «una línea literal con un marcador» y un sujeto que escribe «one line that carries the path», WHEN el hilo da el veredicto, THEN lo cuenta como fallo citando la línea de la rúbrica, antes de proponer ninguna enmienda.

### 2. La skill de desarrollo del repo ya tenía la regla, y nada pide cargarla

- **Qué pasó**: `.agents/skills/writing-skills/SKILL.md:469` (la skill de desarrollo que fija `skills-lock.json`) ya trae «Omits a required element → REQUIRED field or slot in the template». En la 0166 el hilo no la cargó al escribir dos rondas de REFACTOR en prosa, y esta feature midió y trajo esa fila al Art. II. Ni `CLAUDE.md` ni `tech-stack.md` piden cargar `writing-skills` al editar una skill.
- **Dónde en el kit**: `CLAUDE.md` del repo y `tech-stack.md` (método de pruebas); no localizado en una skill del kit.
- **Por qué el kit no lo evitó**: la skill está instalada pero ningún paso la nombra.
- **Coste**: la feature 0173 entera (~1,6 h y 3,52 $) midió una regla que la skill de desarrollo ya traía; sin respaldo de que cargarla la habría evitado.
- **Propuesta**: que la frase nueva de `sdd-implement` (leer la regla de forma de la constitution antes de la ronda) baste, o que `CLAUDE.md` pida cargar `writing-skills` al editar una skill.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una sesión de este repo que edita una skill tras un humo en rojo, WHEN escribe la ronda, THEN `tools.txt` muestra la lectura de `writing-skills` o de la regla de forma de la constitution antes del primer `Edit`.

## Lo que hice por iniciativa propia

- `form_rules` en el `subject.sh` de la batería de `sdd-implement`: el molde recibe el Art. II y la regla de parada de la copia del kit que se prueba (`$KIT/.docs/sdd/`), así que el mismo escenario es RED y GREEN sin copiar texto a mano. Funcionó en las tres fases. Candidato a regla: un escenario que mide una regla de los documentos del kit la lee del `KIT_DIR`, no de un fixture.
- Separar a los sujetos por si leyeron la regla (`grep constitution` en `tools.txt`) antes del veredicto. Así se vieron dos causas distintas: no leer la regla y leerla y quedarse en una receta en prosa.

## Funcionó, no tocar

- La revisión final con Opus y effort high: encontró el error de calificación que cambió el resultado de la feature.
- La pregunta de alcance ante la causa nueva: el dev-lead eligió meterla, y la enmienda con su texto literal se aprobó en una sola pregunta.
- `sdd merge --push` y el pre-commit, sin intervención.

## Menores

- La sesión retomada cargó el plugin de la caché (anterior, sin `sdd-implement`, `sdd-tdd` ni `sdd-worktrees`); el aviso del hook `SessionStart` lo dijo y se siguieron las de la rama con `Read` — `CLAUDE.md`, regla 1.
- Un `node -e` entre comillas dobles en Git Bash ejecutó los backticks del texto y dejó en blanco los nombres de la Task 3 del plan; se rehízo con la herramienta de edición (~3 min) — `tech-stack.md`, trampa (6), que solo nombra el here-string de PowerShell.
- Los sujetos de `o1` y `o2` lanzaron su propio `claude -p` para relanzar el humo, fuera de `COST_CAP` — `tests/headless/run.sh` (fila de deuda abierta en el cierre).
