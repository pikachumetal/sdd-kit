---
kit_version: 2.3.4
lane: feature
id: 20261102-161407-feature-0287-heredoc-guard
task: 0287
mode: lite
date: 2026-11-02
---

# Ticket para el kit — feature 0287: el hook que para el código escrito con heredoc, y su pasada de fix

## Contexto

- Carril y modo: feature lite
- Skills del kit usadas: sdd-propose, sdd-implement, sdd-worktrees, sdd-tdd, sdd-verify, sdd-archive, sdd-feedback
- Proyecto: el propio kit, Node y Markdown, una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: claude-opus-5-5 (eje Spec y re-revisión), claude-sonnet-5-5 (eje Código)
- Coste en reloj: 0,45 h frente a 1,5 h estimadas
- Coste en tokens: 8.581.702 del hilo y 2.267.314 de subagentes; 8,37 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una clasificación por forma se presentó como medida de falsos positivos, y no podía detectarlos

- **Qué pasó**: la spec prometía mirar a mano cada parada del barrido por transcripts. Salieron 520 y las clasifiqué por forma: «465, 55, 0 de otra forma». El eje Spec señaló que el «0» no prueba nada: toda parada es de una de las dos formas por construcción. Lo cambié en el walkthrough por lo que se miró de verdad, y los falsos positivos quedan sin censo.
- **Fuente**: `.docs/sdd/specs/20261102-145840-feature-0287-heredoc-guard/spec.md`, decisión 9, y su `walkthrough.md`, §4.2.
- **Dónde en el kit**: `skills/sdd-verify/SKILL.md`, «Requirements» y la tabla «Common Failures»: no nombran una medida que no puede dar otro resultado.
- **Por qué el kit no lo evitó**: la regla de evidencia pide un comando y su salida, y esto los tenía. Lo cazó la revisión, no una regla.
- **Coste**: parte del eje Spec, que rehízo su barrido; sin desglose, sin respaldo.
- **Propuesta**: ninguna en el texto: un caso. Se queda en el ticket por si aparece un segundo.
- **Verificada**: sí — contrastado con `.claude/hooks/heredoc-guard.mjs`, `targetOfPipeline`, que solo tiene esas dos ramas de parada.
- **Criterio de aceptación**: GIVEN una medida en el walkthrough WHEN el código no puede dar otro resultado que el observado THEN el walkthrough no la presenta como evidencia.

### 2. Escribí los RED antes del commit de apertura, y el pre-commit lo paró

- **Qué pasó**: con la spec aprobada escribí los RED antes de commitear la apertura; el pre-commit dio `Commit bloqueado: fallan las comprobaciones del kit`. Los aparté y repetí el commit.
- **Fuente**: salida de `git commit` en Git Bash; `git log` de la rama.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Before each task», punto 2, «with the opening already in its commit»; `references/commit-milestones.md`.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué, con la spec en la misma tanda de herramientas que los tests.
- **Coste**: unos 2 min.
- **Propuesta**: ninguna: la regla ya está en su paso.
- **Verificada**: sí — contrastado con `skills/sdd-implement/references/commit-milestones.md`, fila «Apertura».
- **Criterio de aceptación**: GIVEN una spec lite aprobada WHEN se escriben los RED THEN el commit de apertura ya existe.

## Lo que hice por iniciativa propia

- Pasé el hook por los comandos Bash de los transcripts locales de este repo, ~15.000. Funcionó: tras un arreglo que pasaba sus tests, las paradas de intérprete bajaron de 55 a 39 y el barrido destapó un anclaje demasiado estricto. Candidato a método para una comprobación que para sesiones.
- Un mutante del `throw` para ver en rojo el test de punta a punta, que no había visto fallar antes de implementar.

## Funcionó, no tocar

- La revisión final en dos ejes en un lite: el eje Spec encontró el único Important (`2>&1` dejaba pasar los intérpretes), y el eje Código no lo vio.
- `sdd merge --sync` y `--verified-at` con la base al día: ni segunda suite ni fricción.

## Menores

- La spec prometió «miro a mano cada parada» sin saber cuántas eran — `skills/sdd-propose/references/spec-writing.md`.
- El barrido por transcripts dio una regresión que la suite no vio; el arreglo quedó fuera de la re-revisión de partida solo por haberse hecho antes de lanzarla — no localizado.
- Cuatro Minor de la re-revisión quedaron adjudicados, uno con un test que no discrimina (`<<\EOF`), porque no hay segunda pasada — `skills/sdd-verify/SKILL.md`, «What it leaves open».
