---
kit_version: 2.3.4
lane: patch
id: 20261102-194351-patch-0293-precommit-clean-git-env
task: 0293
mode:
date: 2026-11-02
---

# Ticket para el kit — patch 0293: el pre-commit lanza el gate sin las variables locales de git

- Contexto: patch por petición cerrada, perfil `delegate`, Opus 5.5, sin subagentes
- Coste: 0,06 h frente a 0,5 h + 0,07 h estimadas; 1.509.548 tokens, 1,69 $
- Por iniciativa propia: reproducir el incidente en un worktree enlazado de un repo temporal, con el `moon` real; así salió `core.bare = true` en el RED

## Menores

- El test del hook vive en `hooks.slow.test.ts`, como pide `tech-stack.md` para los tests que crean repos, y el gate de cierre no lo corre: un cambio futuro en `.githooks/pre-commit` solo lo comprueba al cortar la release — `skills/sdd-archive/SKILL.md`, paso 1, «The suite»
- `isolatedEnv` y `cleanGitEnv` limpian 5 variables frente a las 15 de `git rev-parse --local-env-vars`; quedó fuera de alcance — no localizado en el kit
- Escribí en §5 de `patch.md` una causa del desvío sin respaldo y la quité con un `--amend` del commit de cierre antes de publicarlo — `skills/sdd-archive/SKILL.md`, paso 2, «Real time»
