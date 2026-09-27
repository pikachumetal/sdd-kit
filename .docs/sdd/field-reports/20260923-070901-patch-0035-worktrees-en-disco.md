---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: patch
id: 20260923-070901-patch-0035-worktrees-en-disco
task: 0035
mode:
date: 2026-09-23
---

# Ticket para el kit — patch 0035 (ampliación): el kit no dice cómo ampliar un patch ya cerrado y fusionado

## Contexto

- Carril y modo: patch, ampliación de un patch cerrado y fusionado el día anterior
- Skills del kit usadas: `sdd-end-patch`, `sdd-feedback`, `sdd-templates` (`Get-NextSddId.ps1`, `Build-EstimationLog.ps1`, `kit-feedback-template.md`), todas leídas del working tree
- Proyecto: el propio kit (repo de Markdown + scripts PowerShell con Pester), un dev-lead
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~15 min
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Ampliar un patch cerrado y fusionado no tiene forma escrita

- **Qué pasó**: el dev-lead pidió «añade al patch» sobre el 0035, que ya tenía `status: done`, `commit: 1c052eb`, `branch: feature/next-id` y estaba fusionado. Ninguna skill dice si una ampliación reabre el mismo `patch.md` o toma un id nuevo. Improvisé: mismo `patch.md`, la frase del dev-lead en §1, una viñeta «Ampliación» en §3, las filas 6 a 9 en §4, `commit: 1c052eb, 0a1ff14 (ampliación, rama feature/fix-01-2)` en el frontmatter y el tiempo sumado en §5. La entrada del changelog y la fila de la tabla de patches del roadmap las edité en su sitio, sin fila nueva.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 1 («commit hash real») y `skills/sdd-templates/templates/patch-template.md` (frontmatter `commit: <hash>` y `branch:` de valor único).
- **Por qué el kit no lo evitó**: la plantilla supone un patch, una rama y un commit de fix. No hay caso de segunda rama ni de segundo commit.
- **Coste**: bajo en esta sesión. El riesgo es que otra sesión elija lo contrario (id nuevo) y la misma causa raíz quede partida en dos patches, o que el `commit:` quede con un formato que ningún script lee.
- **Propuesta**: una línea en `sdd-end-patch` paso 1 que decida el caso. Por ejemplo: la ampliación de la misma causa raíz va al mismo `patch.md`, `commit:` lista los hashes y §5 suma el tiempo. Una causa raíz distinta toma id nuevo.
- **Criterio de aceptación**: GIVEN un patch con `status: done` ya fusionado y el dev-lead pide ampliarlo con la misma causa raíz, WHEN el agente lo cierra, THEN usa el mismo `patch.md`, lista los dos hashes en `commit:` y deja una sola fila en la tabla de patches del roadmap y una sola entrada en el changelog.

### 2. La receta de replanificar sigue leyendo solo las ramas `feature/*`

- **Qué pasó**: esta ampliación hace que `Get-NextSddId.ps1` lea el `roadmap.md` del disco de cada worktree de `git worktree list`. Así ve una reserva en *staged* sin commitear (ticket de la task 0019 §1). La receta manual de `sdd-start-release` no cambió: sigue leyendo «el roadmap de cada rama `feature/*`». Esta sesión no la ejecutó, así que el coste no está observado aquí.
- **Dónde en el kit**: `skills/sdd-start-release/SKILL.md`, pasos 1 y 3 de la replanificación.
- **Por qué el kit no lo evitó**: el patch arregló el script. Cambiar la skill exige su propio ciclo RED→GREEN.
- **Coste**: no observado en esta sesión. En la 0019 fueron dos ids casi repetidos en `develop`.
- **Propuesta**: que la replanificación tome el mínimo id del script en vez de repetir la lectura a mano, o que lea también los worktrees.
- **Criterio de aceptación**: el de la task 0019 §1. GIVEN un worktree con una partición en *staged* que reserva 0031 y 0032, y ninguna rama con ids por encima de 0030, WHEN otra sesión replanifica con `sdd-start-release`, THEN propone 0033 o mayor.

## Lo que hice por iniciativa propia

- Smoke del script sobre el repo real, que es bare y tiene cuatro worktrees (dos de ellos `locked` y en *detached HEAD*). Devolvió `0036`, correcto. No reproduje la colisión histórica de la 0019 con la receta de `tech-stack.md`: el estado en *staged* de aquel worktree ya no existe, así que el test con un worktree temporal es la única reproducción.
- En §5 escribí `Real: 0,75h (0,5h del patch y 0,25h de la ampliación)` y no `0,5h + 0,25h`, para que `Build-EstimationLog.ps1` lea una sola cifra. No comprobé qué habría leído con la suma.

## Funcionó, no tocar

- La regla 2 del `CLAUDE.md` del repo. La sesión no salió de `Start-KitSession.ps1`: el listado de skills del harness traía las `sdd-kit:*` del plugin publicado, y entre ellas no estaba `sdd-feedback`. Leí `sdd-end-patch` y `sdd-feedback` del working tree antes de ejecutarlas, y no hubo desvío.
- El pre-commit que pasa la suite completa: los dos commits del cierre salieron con 353 pasan y 0 fallan.

## Errores míos, no huecos del kit

- `git commit -F -` con el here-string como argumento en PowerShell. git lo tomó como pathspec y falló sin commitear. Con el here-string por tubería funcionó.
