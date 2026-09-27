---
kit_version: 1.1.0
superpowers_version: 6.4.2
lane: feature
id: 20260927-142148-feature-0085-post-final-review
task: 0085
mode: full
date: 2026-09-27
---

# Ticket para el kit — feature 0085: el cierre no sabe de la re-revisión del tramo, y un paso que resume una regla pierde sus condiciones

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native
- Skills del kit usadas: `sdd-start-feature`, `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`, `sdd-templates` (scripts `Get-CapabilityIndex.ps1`, `Test-Capabilities.ps1`, `Build-EstimationLog.ps1`, `Measure-SessionTokens.ps1`)
- Proyecto: el repo del propio kit (skills en Markdown, Pester, campañas de sujetos headless), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (revisor final, `sdd-kit:effort-high`); 32 sujetos Sonnet en las campañas
- Coste en reloj: ~1,5 h de sesión (1,4 h de implementación)
- Coste en tokens: 32,5 M del hilo y 1,3 M del revisor final; 12,39 $ de sesión y 23,14 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un paso que resume una regla y remite a su referencia pierde las condiciones que no copia

- **Qué pasó**: el umbral de «revisado en el hilo» vivía entero en «Ruling» de `control-profiles.md`, y el paso 6 lo resumía como «commit pequeño de solo docs». En el primer GREEN de la Task 2, 1 de 2 sujetos no abrió la referencia y leyó en el hilo un commit de 26 líneas, que era justo el control. Con el tamaño y `numstat` en el paso, 2/2. La revisión final encontró dos condiciones más que seguían solo en la referencia: qué ficheros cuentan como docs y cómo se cuenta un merge. En la pasada de fix, uno de los sujetos GREEN sacó `--remerge-diff` del paso sin abrir la referencia.
- **Dónde en el kit**: la anatomía de una skill en `.docs/sdd/architecture.md` y el Art. I de la constitution no dicen qué puede resumir un paso y qué no. `skills/sdd-start-feature/SKILL.md` sigue el patrón «resumen + Detalle: [referencia]» en muchos sitios.
- **Por qué el kit no lo evitó**: la convención de no duplicar (Art. VIII, y el Pester que escribí, «el paso 6 no copia el umbral») empuja a dejar las condiciones en la referencia, y un sujeto con el paso delante no siempre abre el enlace.
- **Coste**: una tanda GREEN de más (2,02 $) y una pasada de fix con dos tandas más (2,29 $).
- **Propuesta**: una regla de redacción de skills: cuando un paso resume una regla de una referencia, el resumen lleva todas las condiciones que deciden (umbrales, qué entra y qué no); la referencia se queda con el porqué y el detalle.
- **Criterio de aceptación**: GIVEN un paso que resume una regla con tres condiciones y remite a la referencia WHEN 2 sujetos lo aplican a un caso que solo decide la tercera condición THEN con las tres en el paso deciden bien 2/2. RED de hoy: con una sola en el paso, 1/2 (`tests/post-final-review-green.md`, Task 2, tanda 1).

### 2. El paso 9 de `sdd-end-feature` contradice la re-revisión del tramo

- **Qué pasó**: en el GREEN de la Task 1, un sujeto al que el dev-lead dijo «cierra la feature» entró directo por `sdd-end-feature`. Re-revisó el tramo porque leyó la frase nueva de «Ruling», pero lo hizo después de escribir el walkthrough, el roadmap y el changelog. El paso 9 le decía lo contrario: «No lances otra: duplicaría la revisión de rama».
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 9. La spec de la 0085 lo dejó fuera por acotación del dev-lead (decisión 6).
- **Por qué el kit no lo evitó**: el paso 9 solo pregunta si hubo revisión final, no si `HEAD` avanzó desde ella. Tampoco cubre los commits hechos durante el propio cierre (ticket template 0007 §5).
- **Coste**: riesgo. Un cierre documenta y fusiona antes del veredicto de la re-revisión.
- **Propuesta**: el paso 9 compara `HEAD` con el sha de la línea `Revisión final:` (o con la última `Re-revisión:`). Si avanzó con commits que no son de «revisado en el hilo», despacha la re-revisión del tramo antes de escribir la documentación de cierre.
- **Criterio de aceptación**: GIVEN `tasks.md` con `Revisión final: …, sobre a1b2c3d` y un commit posterior en `src/` WHEN el agente entra por `sdd-end-feature` THEN despacha la re-revisión antes del paso 1 (walkthrough). RED de hoy: `p2-1` del GREEN de la 0085 la despacha después del changelog.

### 3. El paso 7 no distingue la pasada de fix de la revisión final de un commit posterior

- **Qué pasó**: la revisión final devolvió cuatro Important, y la pasada de fix commiteó después de ella. Por la letra del paso 7 nuevo («si `HEAD` avanzó desde el commit de la línea `Revisión final:`»), eso abre una re-revisión. `executing-plans` dice «Do not dispatch a re-review» para la pasada de fix. Lo resolví con un ruling: la pasada es el bucle de fix de la propia revisión.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 7.
- **Por qué el kit no lo evitó**: la regla se escribió pensando en commits ajenos a la revisión (una pregunta del dev-lead), no en su propia ronda de fix.
- **Coste**: una decisión sin respaldo escrito. Si se aplica la letra, cuesta un revisor Opus de más por feature con hallazgos.
- **Propuesta**: «la pasada de fix de la propia revisión final no abre la re-revisión: la verifica su TDD; sí la abre un commit posterior a esa pasada».
- **Criterio de aceptación**: GIVEN una revisión final con un Important y su pasada de fix commiteada con su test RED→GREEN WHEN el agente va a presentar la validación THEN no despacha re-revisión y lo dice; GIVEN además un commit del hilo después de la pasada THEN sí la despacha.

### 4. `Measure-SessionTokens.ps1` no encuentra los transcripts si la sesión usa otra carpeta de configuración

- **Qué pasó**: la primera ejecución del paso 2 de `sdd-end-feature` dio «no medido» en las tres líneas. La sesión corría con `CLAUDE_CONFIG_DIR` en `~/.claude-gco`, y el script busca por defecto en `~/.claude/projects`. Con `-ProjectsRoot` apuntando a la carpeta real midió 12,39 $.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Measure-SessionTokens.ps1`, valor por defecto de `-ProjectsRoot`; el paso 2 de `skills/sdd-end-feature/SKILL.md` no pasa el parámetro.
- **Por qué el kit no lo evitó**: el valor por defecto no mira `CLAUDE_CONFIG_DIR`.
- **Coste**: un «no medido» falso que el paso manda pegar sin retocar; lo vi porque sabía dónde estaban los transcripts.
- **Propuesta**: que el valor por defecto sea `$env:CLAUDE_CONFIG_DIR/projects` si la variable existe. Queda como fila de deuda técnica.
- **Criterio de aceptación**: GIVEN `CLAUDE_CONFIG_DIR` apuntando a una carpeta con transcripts de la rama WHEN se ejecuta el script sin `-ProjectsRoot` THEN mide los tokens; test Pester con una fixture en esa carpeta.

## Lo que hice por iniciativa propia

- **Un `PreToolUse` que deniega `Agent` y guarda su `prompt`** junto al molde, fuera de su git (`red/deny-agent.mjs`). Midió el despacho y el encargo de 32 sujetos sin pagar un revisor Opus por sujeto (23,14 $ la campaña entera). Funcionó; candidato a `tests/headless/`, porque `extract.mjs` solo guarda la descripción del `Agent`.
- **Un escenario más duro en la pasada de fix** (`s3`: el merge de `develop` trae código de otra feature) para medir el Important de la revisión final antes de arreglarlo. Salió limpio en RED, y aun así mantuve el arreglo, con ruling, porque la conducta venía de la referencia que otro sujeto no abrió.
- **Un merge de sincronización antes del primer RED** para usar el lanzador del patch 0084, recién fusionado.

## Funcionó, no tocar

- `tests/headless/run.sh` con `SUBJECT=1` y `SUBJECT=2` en paralelo y una carpeta por fase (patch 0084): cuatro sujetos en ~5 min por fase.
- `SUPERPOWERS_DIR` aísla al sujeto de la configuración del dev-lead: los sujetos citaron el kit de la copia, no la caché.
- Reusar los moldes de las 0044 y 0057 con `.` en vez de copiarlos.
- El ledger de `executing-plans` y `tasks.md`: las tres tasks se cerraron con `task-done` y los rulings quedaron en un solo sitio para el walkthrough.

## Errores míos, no huecos del kit

- Edité el molde con un `python` sobre heredoc sin raw string: `\1` se convirtió en `\x01` y «tamaño» se codificó dos veces. Costó cuatro intentos.
- El primer `other_feature_code` usó `$room` dentro de un `echo` con `set -u` y cortó el molde en seco.
- El test de la errata usó `-Match`, que en PowerShell no distingue mayúsculas; hizo falta `-MatchExactly`.
