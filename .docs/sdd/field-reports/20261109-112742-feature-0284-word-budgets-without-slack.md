---
kit_version: 2.3.4
lane: feature
id: 20261109-112742-feature-0284-word-budgets-without-slack
task: 0284
mode: full
date: 2026-11-09
---

# Ticket para el kit — feature 0284: topes de palabras sin el margen del 25 %

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo, Native
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-rubber-duck`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (revisor de la spec, eje Código) y Opus 5.5 (eje Spec)
- Coste en reloj: 0,38 h frente a 0,3 h de implementación estimada (walkthrough §2)
- Coste en tokens: 9,42 $ de sesión (hilo 8,05 $ + subagentes 1,36 $); sin sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El plan escribió una «Verificación» con `cd cli;` que `sdd task done` no puede lanzar

- **Qué pasó**: la Task 1 del plan llevaba `cd cli; pnpm exec vitest run test/kit/word-budget.test.ts`. `sdd task done` recibe el comando como argumentos tras `--`, sin shell, así que lo lancé como `pnpm --dir cli exec vitest run …` y lo apunté como ruling.
- **Fuente**: `plan.md` de la 0284, Task 1, «Verificación»; `dist/skills/sdd-implement-native/SKILL.md:211` → `sdd task done <plan> <n> <base> -- <command…>`; `tasks.md` de la 0284, `## Rulings`, primera línea.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md:150`, el hueco «Verificación».
- **Por qué el kit no lo evitó**: el hueco pide los comandos con su línea de resumen, pero no dice que el primero es el que lanza `sdd task done`, como un solo comando sin `cd` ni `;`.
- **Coste**: un ruling y una llamada (walkthrough §3).
- **Propuesta**: en el hueco «Verificación», sustituir «los comandos de esas superficies» por «los comandos de esas superficies, cada uno lanzable sin shell (`pnpm --dir cli …`, no `cd cli; …`): el primero lo corre `sdd task done`».
- **Verificada**: sin verificar (no lancé `cd cli;` por `sdd task done`).
- **Criterio de aceptación**: GIVEN un repo cuyos tests corren desde una subcarpeta WHEN el agente escribe la «Verificación» de una task THEN es un comando sin `cd` ni `;`, y `sdd task done … -- <ese comando>` lo corre sin ruling.

### 2. Ninguna regla dice si el commit de cierre entra en la revisión

- **Qué pasó**: tras la revisión final limpia sobre `470dae16` no hubo commits; el commit de cierre `3f6e4f8f` cambió 7 ficheros, 196 líneas, todo en `.docs/`. La regla de «Every commit of yours» deja sin revisar solo un commit de menos de 20 líneas de documentación; decidí, sin regla, que el cierre queda fuera porque solo son registros.
- **Fuente**: `git show --stat 3f6e4f8f`; `dist/skills/sdd-implement/SKILL.md:62`; `dist/skills/sdd-archive/references/final-review-check.md`, punto 2.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings», último punto; `skills/sdd-archive/references/final-review-check.md`.
- **Por qué el kit no lo evitó**: la comprobación de la revisión corre antes de que el cierre escriba, y la regla de los commits no nombra el de cierre.
- **Coste**: una decisión sin respaldo de una regla; ninguna parada.
- **Propuesta**: en el punto «Every commit of yours», sustituir «other than one under 20 lines that only changes documentation…» por «other than one under 20 lines that only changes documentation…, or the closing commit of `sdd-archive`, which only carries its records».
- **Verificada**: sí — contrastado con `dist/skills/sdd-implement/SKILL.md:62`.
- **Criterio de aceptación**: GIVEN una revisión final limpia y un commit de cierre de 196 líneas en `.docs/` WHEN el hilo llega al merge THEN no lanza re-revisión ni lo apunta como `sin revisar`, citando la regla.

## Lo que hice por iniciativa propia

- Medir con un script propio, con el conteo del test, antes de escribir la spec, y clasificar cada fichero como copia o propio por `upstream.json`: dio las 15 cifras exactas que el test sin margen puso luego en rojo, sin ninguna sorpresa.
- Buscar con `git show <sha>:<fichero> | wc -w` el commit que pasó cada documento de anclaje de su tope, para dar un motivo por documento (hallazgo del revisor de la spec).

## Funcionó, no tocar

- La regla de `review-spec.md` de un revisor con Scope corto: diez hallazgos, seis aceptados, en 1 min y 273.274 tokens de Sonnet (`sdd session tokens`), sin duplicados.
- El delta probado sobre una copia con `sdd capability merge` antes del gate: la fusión del cierre salió igual.

## Menores

- `N=1 node tests/headless/battery.mjs plan tests/batteries/sdd-end-release/battery.md` en PowerShell, sobre una skill sin batería, sale con traza de Node (`Error: ENOENT: no such file or directory, open '…\tests\batteries\sdd-end-release\battery.md'`) en vez de un mensaje — `tests/headless/battery.mjs`.
- La rúbrica de `review-spec.md:11` no dice si cambiar una entrada de «Reglas de la capacidad» cuenta como señal `MODIFIED`; lo decidí como «no» y lo escribí en el bloque — `skills/sdd-propose/references/review-spec.md`.
- `architecture.md:83` dice que `estimation.md` tiene tope de palabras y `word-budget.test.ts` no lo mide — documento del repo del kit, no localizado en una skill.
