---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261029-123236-patch-0252-watch-command-runs-command
task: 0252
mode:
date: 2026-10-29
---

# Ticket para el kit — patch 0252: `sdd watch command` lanza el comando y termina con él

## Contexto

- Carril y modo: patch (petición cerrada)
- Skills del kit usadas: `sdd-propose`, `sdd-start-patch`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (CLI en TypeScript con Vitest, skills en Markdown), una persona con varias sesiones en paralelo
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica
- Coste en reloj: 0,28 h frente a 1,2 h estimadas (1 h + 0,2 h del gate de cierre)
- Coste en tokens: 4,27 $ (hilo)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La coordinación agrupó en otra fila un patch que ya estaba en vuelo

- **Qué pasó**: la sesión del patch arrancó a las 12:13Z sobre `cfc2a741`. A las 12:20Z, la sesión de coordinación commiteó `0491da49` («juntar los patches de Próximo en cinco filas»), que dejaba la fila 0252 en `⏸️ aparcada: absorbida por la 0247` y movía su deuda a «Actuar → 0247». Ya existían las ramas y los worktrees de la 0252 y la 0247, y esta última llevaba 16 min abierta. Nadie avisó a ninguna de las dos. El patch acabó entero, y `sdd merge --push` paró con `merge: conflicto en .docs/sdd/roadmap.md.`: un mismo «Estado» con dos valores (`✅` y `⏸️ aparcada`), que no es un conflicto que el agente resuelva. Paré y pregunté. El dev-lead: «a ver que narices os ha pasado a 247 y252. Hablad entre vosotros». Las tres sesiones se coordinaron con `SendMessage`: la 0252 fusiona tal cual, y la 0247 deshace su absorción en su propia fila. La sesión de coordinación lo reconoció: «0491da49 agrupó dos filas que ya estaban en vuelo».
- **Fuente**: `git show 0491da49 --format='%ci %s'` → `2026-10-29 13:20:52 +0100 docs(roadmap): juntar los patches de Próximo…`; `sdd session tokens` → `reloj de la sesión 0,30 h desde 2026-10-29T12:13Z`; `ListAgents` → `patch/0247-ledger-rulings-and-done-count · started 16m ago`; la salida de `node cli/bin/sdd.js merge --project-root . --push --verified-at ee719d8a` en PowerShell; el mensaje de la sesión `develop`.
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md`, la rama de reordenar y juntar filas («reordena», «la X va tras la Y»). No mira qué filas tienen ya rama o worktree.
- **Por qué el kit no lo evitó**: el roadmap no distingue una fila `⏳` en vuelo de una sin empezar, y `sdd-roadmap` no consulta `git branch --list 'feature/<id>-*' 'patch/<id>-*'` ni `git worktree list` antes de reescribir una fila.
- **Coste**: ~12 min de reloj, entre el conflicto, la parada, los mensajes entre sesiones y la segunda resolución, más una parada del dev-lead con enfado. Respaldo: el commit de merge `e7f7a3c3`, con su línea «Conflicto de la base resuelto por el agente». El trabajo duplicado no llegó a pasar: la 0247 aún no había tocado el vigía.
- **Propuesta**: antes de juntar, mover o aparcar una fila, `sdd-roadmap` lista las ramas `feature/<id>-*` y `patch/<id>-*` de esos ids, locales y del remoto. Una fila con rama no se reescribe: se pregunta al dev-lead, o se avisa por `SendMessage` a la sesión de esa rama si `ListAgents` la lista.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN las filas 0247 y 0252 en `⏳` con ramas `patch/0247-*` y `patch/0252-*` abiertas, WHEN el dev-lead pide en `sdd-roadmap` juntar los patches de Próximo, THEN el resultado no reescribe ninguna de las dos filas y nombra las dos ramas en vuelo.

## Lo que hice por iniciativa propia

- Al dar `SILENCIO:`, el vigía para el comando que lanzó, con todo su árbol (`taskkill /T` en Windows, el grupo de procesos en POSIX). La fila no lo pedía, pero sin eso el proceso del vigía no acaba. Lo cubre un test; el paro en POSIX solo lo verá la CI de Linux.

## Funcionó, no tocar

- La regla de `sdd-archive` paso 6 de no resolver un conflicto con el mismo valor puesto de dos formas: paró a tiempo y no pisó la decisión de la coordinación.
- `sdd merge --push` avisó de que también publicaba un commit de `develop` que no era de la rama (`9c84384f`).

## Menores

- La pregunta del conflicto metía todo el contexto en un solo `AskUserQuestion`. El dev-lead la rechazó para aclarar y acabó pidiendo coordinación entre sesiones, que la pregunta no ofrecía — `skills/sdd-archive/SKILL.md` paso 6 (no dice que, con otra sesión implicada, se le escriba antes de preguntar)
