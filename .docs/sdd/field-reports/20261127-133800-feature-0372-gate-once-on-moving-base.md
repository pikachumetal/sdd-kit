---
kit_version: 3.0.5
lane: feature
id: 20261127-133800-feature-0372-gate-once-on-moving-base
task: 0372
mode: full
date: 2026-11-27
---

# Ticket para el kit — feature 0372: el pre-commit dejó pasar `skills/` sin su `dist/`, y la primera redacción de la regla no se siguió

## Contexto

- Carril y modo: feature full, perfil `delegate` (del proyecto), validación `field`
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-spec-writing`, `sdd-grilling`, `sdd-spec-approval`, `sdd-spec-review`, `sdd-parallel-agents`, `sdd-plan-writing`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-validate`, `sdd-verify`, `sdd-archive`, `sdd-retro` y `sdd-feedback`, desde el working tree
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript, baterías headless); una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus (revisor de dominio de la spec, eje Spec, re-revisión) y Sonnet (revisor técnico, segunda ronda de spec, eje Código); sujetos de batería en Sonnet
- Coste en reloj: 1,33 h frente a 1,5 h estimadas (walkthrough §2)
- Coste en tokens: 51.942.880 en el hilo y 5.475.729 en 6 despachos; 20,41 $ de sesión y 4,65 $ en 10 sujetos (walkthrough §2)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La primera redacción de la regla, en negativo y sin contraejemplo, dio GREEN 0/2

- **Qué pasó**: la regla nueva del paso 6 de `sdd-archive` se escribió primero como «A file of «Sin filtro» from the base doesn't run the gate whole: it counts for the crossing like any other file.». En el GREEN, los dos sujetos de g8 corrieron tareas por el `package.json` de la base («`package.json` es un manifiesto («Sin filtro»), así que el gate corre entero») y av2 sacó su rojo con la gate sin `--affected`. Reescrita como predicado con su contraejemplo («runs only a task whose inputs hold it and that the branch touches; «it changes the build» isn't a reason»), dio 2/2 y 1/1.
- **Fuente**: `.docs/sdd/changes/20261127-130616-feature-0372-gate-once-on-moving-base/green/summary.md`; `green/out/g8-2.texts.txt` («Corrió entero porque la base trajo `package.json`»); `green2/out/`.
- **Dónde en el kit**: la regla de la forma de la guía (Art. II de la constitution: «Una excepción de la guía lleva su contraejemplo») y `skills/sdd-agent-writing/SKILL.md`, que la aplica al escribir texto de skill.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué en la primera redacción. Lo que la hizo fallar es que el nombre del campo, «Sin filtro», invita a correrlo todo: una excepción a lo que el nombre sugiere es una excepción sin contraejemplo.
- **Coste**: una tanda de GREEN de más (1,36 $ en 3 sujetos) y la repetición de av2 (0,53 $), respaldado en `green/summary.md`.
- **Propuesta**: en `sdd-agent-writing`, al editar una regla cuyo efecto contradice el nombre de un campo o de una etiqueta del kit, escribirla como predicado y con el motivo que no vale, antes del primer GREEN.
- **Verificada**: sí — g8 0/2 con la redacción negativa y 2/2 con la reescrita (`green/` y `green2/`).
- **Criterio de aceptación**: GIVEN una edición de skill que invierte lo que sugiere el nombre de un campo («Sin filtro» de la base que no quita el filtro) WHEN el hilo redacta la regla THEN la escribe como predicado observable con el contraejemplo en la misma frase, y el primer GREEN de su escenario pasa.

### 2. El pre-commit dejó pasar un commit de `skills/` sin su `dist/`

- **Qué pasó**: el commit de la Task 2 (`ef255ccf5`) llevaba `skills/` y no `dist/`. El pre-commit pasó en verde porque `dist/` estaba reconstruido en el árbol de trabajo, sin añadir al índice. Lo cazó la revisión final (eje Spec, Important, ADR 0023).
- **Fuente**: `git show --stat ef255ccf5` (sin ficheros de `dist/`); `cli/test/kit/dist.test.ts:168` compara `readFileSync(join(out, path))` con `readFileSync(join(dist, path))`, el árbol de trabajo; `tasks.md` de la feature, «Revisión final».
- **Dónde en el kit**: `cli/test/kit/dist.test.ts` y el pre-commit de `.githooks/`.
- **Por qué el kit no lo evitó**: el test compara el `dist/` del disco con el build, no el del índice; la CI de la rama sí lo habría cazado, pero después del push.
- **Coste**: un Important de la revisión final y su arreglo en la pasada de fix, ~10 min (`tasks.md`, «Pasada de fix»).
- **Propuesta**: que el pre-commit compare el build con el `dist/` del índice (`git show :<ruta>`), o que falle si `git diff --name-only -- dist` no sale vacío con `skills/` staged.
- **Verificada**: sí — contrastado con `cli/test/kit/dist.test.ts:168`.
- **Criterio de aceptación**: GIVEN un cambio en `skills/` staged y `dist/` reconstruido sin añadir al índice WHEN se commitea THEN el pre-commit falla nombrando los ficheros de `dist/` sin staged.

## Lo que hice por iniciativa propia

- Medí las dos propuestas del ticket de la 0718 contra el clon del proyecto de campo, con `moon query tasks --affected` sobre los rangos de cada integración, antes de elegir. Funcionó: dio la cifra (~40 de ~55 min) y descartó la delegación en `--verify` (el proyecto no declara «Gate de merge»).
- Con `destino sacado:` en `merge --check` por un ticket que la sesión de coordinación estaba commiteando, repetí la comprobación cada 30 s hasta 3 min en vez de parar; quedó listo en el primer reintento.

## Funcionó, no tocar

- La regla 1 del `CLAUDE.md` (contrastar con `dist/` una skill que la sesión editó): el harness sirvió el paso 6 de `sdd-archive` y «Running a gate» con el texto del arranque, y el cierre siguió el de `dist/`.
- La segunda ronda de la review de la spec tras dos Críticos aceptados encontró cinco ajustes más que sí cambiaron la rúbrica (G8c, el AND de `--verified-at`).

## Menores

- `battery.mjs run` pide `BATTERY`, `COST_CAP` y `SUBJECT_CAP` de uno en uno: tres lanzamientos fallidos hasta dar con ellos; y no lee la fila «Suma» de la previsión cuando lleva texto entre paréntesis («8 sujetos (12 con la contingencia)») — `tests/headless/battery.mjs`.
- `sdd workspace <plan>` imprime la ruta y sale con código 1 — `cli/src/` (verbo `workspace`), no localizado más fino.
- En g8, un sujeto repitió la gate de cierre sobre el árbol de cierre antes de `--sync`, contra «Before the close» de `skills/sdd-archive/references/closing-suite.md`; un caso.
