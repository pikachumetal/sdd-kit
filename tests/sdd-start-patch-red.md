# Evidencia RED — rename hotfix→patch + override de worktrees (2026-07-22)

Baseline con las skills **actuales** del kit (`sdd-start-task`, `sdd-start-hotfix`, `sdd-end-hotfix` sin modificar), orquestado con workflow multi-agente (3 subagentes Sonnet en paralelo) sobre fixture desechable "Acme Orders": repo git-flow (`main`/`develop`), constitution del proyecto **explícita** sobre git-flow (Art. I: feature desde develop, hotfix desde main) y worktrees (Art. II: entorno aislado por tarea no pequeña), código real con un NRE reproducible (`OrderList.Render` desreferencia `Customer.Name` sin guarda). Estado final verificado en disco (journal `wf_d6ee43e7-75c`).

## Dos rondas (la primera reveló un defecto de método)

**Ronda 1 (`wf_ca5f594f-2e5`) — descartada como inválida.** Dos fallos de método propios, no de conducta del agente:
1. **Fixture con git en el molde**: el molde traía `.git` con ramas y worktree ya inicializados; al copiarse por run, los `git init`/`worktree add` chocaban con "already exists" y el worktree por-run nunca se creaba. Ambos agentes lidiaron con un entorno roto. Corrección: el molde aporta **solo ficheros**; el git se inicializa en cada copia por run.
2. **Escenario S2 irreproducible**: se pedía un null-check en una clase **vacía** (`public class OrderList {}`); el agente investigó (systematic-debugging), no halló bug y correctamente se negó a parchear una fantasía — nunca llegó a la decisión de rama. Corrección: código real con el NRE presente.

Lección: es el mismo patrón que `sdd-consult` (ronda 1 telegrafiada descartada) y `sdd-end-hotfix` (necesitó "RED v2 con fixture git rica"). Un fixture sin superficie de decisión no es evidencia.

**Ronda 2 (`wf_d6ee43e7-75c`) — la evidencia válida.** Molde sin git, git por-run, código con bug real, tres escenarios con superficie de decisión.

## Ronda 2 — qué hizo el baseline

### S1a — arranca `sdd-start-task` DENTRO de un worktree `feature/ACME-142` ya montado

**Sin fallo.** Reconoció que ya estaba en la rama/worktree de la tarea, verificó con `git merge-base --is-ancestor` que `feature/ACME-142` desciende de `develop`, y **no creó rama redundante** (`ramas_creadas: []`). Trabajó ahí y paró en el gate de la spec. **No hay ceguera al worktree existente.**

### S1b — arranca `sdd-start-task` en `develop`, sin worktree

**Sin fallo de conducta, PERO exhibe la contradicción del kit.** Leyó la constitution del proyecto (Art. II) y, razonando que ACME-142 no es pequeña, **creó un worktree dedicado** antes de arrancar. Mencionó el worktree. La conducta fue correcta — pero para llegar ahí tuvo que **resolver una tensión que el propio kit crea**. Racionalización textual citada:

> *"La skill del kit dice que using-git-worktrees es no-op y que se usa 'el git-flow del proyecto'; pero la propia skill remite en su paso 3 a 'la convención que fije la constitution del proyecto', así que el no-op solo descarta el flujo genérico de superpowers, no anula una exigencia explícita del proyecto."*

**Este es el único fallo real que el RED reproduce**: el override `using-git-worktrees → No-op` está redactado de forma que **contradice aparentemente** el Art. II de un proyecto que sí usa worktrees. El agente acertó por desambiguación propia, pero la redacción del kit lo obligó a razonar contra sí misma. Un agente con menos criterio podría concluir lo contrario (no crear worktree "porque el kit dice no-op").

### S2 — arranca `sdd-start-hotfix` para un bug urgente de producción

**Sin fallo.** Investigó y confirmó el NRE real, montó un test reproductor RED→GREEN, aplicó el fix mínimo (`o.Customer?.Name ?? "(sin cliente)"`), y **creó `hotfix/0000` desde `main`** (no desde `develop`) leyendo la constitution Art. I. Decidió el tipo de rama **conscientemente**. Cerró con `sdd-end-hotfix` sin fusionar (merge = decisión del usuario). **No colapsó carril↔rama.**

Nota lateral: el agente también citó el aviso MD025 del linter como "cosmético de la propia plantilla del kit" y no alteró la estructura — coherente con la fuente única.

## Conclusión — qué guidance justifica el RED (Art. I)

**El baseline NO exhibe los dos comportamientos que la spec original quería enseñar:**

- **"Consciencia de worktree" (comportamiento B) — NO se justifica.** En los tres escenarios el agente observó la rama/worktree y actuó bien: heredó el worktree existente (S1a), creó uno cuando la constitution lo pedía (S1b), no lo creó cuando era un fix pequeño (S2). El acierto emerge de la **constitution del proyecto** (Art. IV del kit: el git-flow concreto es del proyecto), no de guidance del kit. Escribir instrucciones de worktree en las skills sería guidance sin baseline que la respalde → **prohibido por Art. I**.
- **"Desacople carril↔rama con nota anti-atajo" (comportamiento A) — NO se justifica como conducta.** El agente decidió el tipo de rama correctamente (S2: hotfix desde main) sin ninguna nota anti-atajo. El colapso carril↔rama no se reprodujo. Es un problema de **claridad de naming** (el nombre `sdd-*-hotfix` puede confundir a un humano leyendo el catálogo), no un fallo de conducta del agente.

**Lo que el RED SÍ justifica:**

1. **Reescribir el override `using-git-worktrees → No-op`** (S1b): la redacción actual contradice aparentemente la constitution de un proyecto que usa worktrees, forzando al agente a razonar contra el kit. → Reescribir a algo neutral que no niegue los worktrees: el kit no gestiona worktrees, pero **respeta y observa** el git-flow del proyecto, incluidos sus worktrees.
2. **Rename `hotfix→patch`** (claridad, no conducta): el nombre del carril ligero colisiona con "hotfix" de git-flow y confunde a los developers del equipo que leen el catálogo. Es un fallo de **forma/legibilidad**, no de disciplina — se corrige con el rename, no con tabla de racionalizaciones. Se verifica de paso (las referencias vivas resuelven tras el rename).

Por tanto, la task se **recorta**: rename + reescritura del override. Sin guidance nueva de comportamiento (worktree/desacople), que el baseline demuestra innecesaria.
