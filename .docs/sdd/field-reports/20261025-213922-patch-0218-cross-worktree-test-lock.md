---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261025-213922-patch-0218-cross-worktree-test-lock
task: 0218
mode:
date: 2026-10-25
---

# Ticket para el kit — patch 0218: cerrojo común del clon para las suites lentas

- Contexto: patch de petición cerrada, perfil `delegate`, validación en campo, Opus 5.5 en el hilo, sin subagentes
- Coste: 0,45 h frente a 1,5 h estimadas (`sdd session tokens`, línea `Esfuerzo real`); 10.117.069 tokens del hilo, 3,88 $
- Por iniciativa propia: el criterio de aceptación pedía dos worktrees del clon; lo reproduje con un worktree temporal en el scratchpad que sujetaba el cerrojo 60 s con `sdd lock run`, mientras el gate de cierre corría en el de la rama. El aviso «Esperando el cerrojo de suites: lo tiene …» salió en `kit:test`, y el gate pasó entero después. Funcionó, y costó un `git worktree add` y una copia de tres ficheros

## Menores

- El delta del `patch.md` llevaba huecos `<rama>`, `<fecha>` en un THEN; lo rechazó `sdd capability merge` en el cierre («`<fecha>` es un hueco de la plantilla»), no al abrir el patch. Para la spec, el paso 4 de `sdd-propose` prueba el delta en una copia de `.docs/sdd` antes del gate; `sdd-start-patch` paso 3 no lo pide — `skills/sdd-start-patch/SKILL.md` paso 3
- Lancé el gate de cierre entero sin pasar antes el conjunto rápido de la CLI; `cli:test` falló a los 6 s por una convención de `usage` (`uso:`) que comprueba `cli/test/cli.test.ts`, y moon esperó al `kit:test` en vuelo, que tuve que parar por PID. Unos 6 min — `skills/sdd-start-patch/SKILL.md` paso 4 («Verificar que el build del proyecto pasa»), que no dice qué correr antes del gate de cierre
