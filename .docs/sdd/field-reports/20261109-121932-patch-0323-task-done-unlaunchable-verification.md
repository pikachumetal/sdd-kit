---
kit_version: 2.3.4
lane: patch
id: 20261109-121932-patch-0323-task-done-unlaunchable-verification
task: 0323
mode:
date: 2026-11-09
---

# Ticket para el kit — patch 0323: `sdd task done` rechaza un Vitest con lentos sin `--test-timeout`

## Contexto

- Carril y modo: patch (petición cerrada), perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-implement`, `sdd-tdd`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (CLI en TypeScript con Vitest, skills en Markdown), una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: claude-sonnet-5-5 (el reviewer del patch)
- Coste en reloj: 0,26 h frente a 0,57 h estimadas (0,5 h + 0,07 h del gate)
- Coste en tokens: 6.563.947 del hilo y 340.359 de subagentes, 3,61 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El triaje juntó como dos casos de una deuda dos fallos distintos, y uno no se había ejecutado

- **Qué pasó**: la fila de deuda «La «Verificación» del plan no se puede lanzar tal cual con `sdd task done`» contaba como sus dos casos el de la 0319 (tiempos de espera de `*.slow.test.ts`, reproducido) y el de la 0284 (`cd cli; …`, «Verificada: sin verificar»). Medido en `develop` antes de abrir el patch: `sdd task done <plan> 1 HEAD~1 -- cd cli` en PowerShell sale con 127 sin lanzar nada, porque `resolveCommand` no encuentra `cd` en el `PATH`. El caso de la 0284 ya fallaba antes de lanzar, así que salió del patch con un ruling y la mitad del alcance se cayó. Además, la fila nombraba `runInherited` como lo que lanza `task done`, y lo que lo lanza es `runToLog`.
- **Fuente**: `patch.md` de la 0323, §1 y §2 (salida `task-done: test command exited 127; Task 1 NOT recorded`); ticket de la feature 0284, §1, «Verificada: sin verificar (no lancé `cd cli;` por `sdd task done`)»; `cli/src/tasks/done.ts:8` y `:63` (`runToLog`); `dist/skills/sdd-roadmap/SKILL.md:112-113`.
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md`, triaje, «Nothing goes to «Lista» without being reproduced or without a second case» y la «Evidencia» de una fila «Lista».
- **Por qué el kit no lo evitó**: la regla acepta como evidencia «los enlaces a los dos casos» sin pedir que sean el mismo fallo ni que alguno esté ejecutado. Un caso con «Verificada: sin verificar» cuenta igual que uno reproducido.
- **Coste**: un ruling y la mitad del alcance del patch fuera; ~2 min de medida (`patch.md` §1). La petición ya pedía medir primero, y eso lo contuvo.
- **Propuesta**: en el triaje de `sdd-roadmap`, sustituir «or the links to the two cases» por «or the links to two cases of the same failure, at least one reproduced (its ticket's «Verificada» is «sí», or you ran it)». Un caso «sin verificar» que no se puede reproducir va a «En espera» con «Falta» `reproducirlo`, aunque haya otro caso.
- **Verificada**: sí — contrastado con `dist/skills/sdd-roadmap/SKILL.md:112-113` y reproducido con `node dist/cli/bin/sdd.js task done <plan> 1 HEAD~1 -- cd cli` en PowerShell (exit 127).
- **Criterio de aceptación**: GIVEN dos tickets, uno con un fallo reproducido y otro con un fallo distinto marcado «Verificada: sin verificar», WHEN `sdd-roadmap` los tría THEN el segundo no cuenta como segundo caso del primero: va a «En espera» con «Falta» `reproducirlo`, o a su propia fila tras reproducirlo.

## Lo que hice por iniciativa propia

- Medir cada caso de la petición con el binario real (`dist/`), un plan de prueba en el scratchpad y `HEAD~1` como base, antes de escribir nada. Dio el 127 del caso 1 y el verde del caso 2 en una máquina sin carga (209/209 en 48 s). Funcionó: decidió el alcance en dos comandos.
- En los tests, hacer de Vitest con un `node -e` que deja un fichero marca y recibe `vitest run <filtros>` como argumentos. Prueba que el comando no se lanza, sin depender de un Vitest real ni de la máquina.

## Funcionó, no tocar

- La regla del reviewer único en sonnet del patch (`patch-flow.md` paso 5): dio seis menores reales en 2 min y 0,33 $, entre ellos un falso pase (`--maxWorkers 8`) y un falso rechazo (`-t slow`).
- `sdd merge --check`, `--sync` y `--push`, más el gate con `--affected`: cierre sin fricción en 157 s de gate.

## Menores

- El requisito nuevo del delta salió con 826 caracteres; `sdd capability check` avisó del máximo aconsejado de 500 solo después de fusionarlo, y tuve que deshacer la fusión, acortar el delta y fusionar de nuevo (~3 min). — `skills/sdd-templates/templates/patch-template.md` §6, que no da el tope
- Los tiempos de espera de la 0319 no se reproducen con la máquina sin carga: dependen de la carga. El arreglo sigue valiendo, porque aplica la regla de `tech-stack.md` §Testing. — no localizado
- Escribí `Inicio:` en `patch.md` con una hora que no era la medida (11:46Z en vez de 11:58Z) y lo corregí al cerrar. — `skills/sdd-implement/references/patch-flow.md` paso 3
