---
kit_version: 3.0.4
lane: feature
id: 20261123-111129-feature-0718-cifras-filas-plegadas
task: 0718
mode: full
date: 2026-11-23
---

# Ticket para el kit — feature 0718: la gate de cierre se repitió tres veces con la base en movimiento

## Contexto

- Carril y modo: feature full, perfil `delegate` (del proyecto), validación `manual`
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-spec-writing`, `sdd-spec-review`, `sdd-spec-approval`,
  `sdd-plan-writing`, `sdd-implement`, `sdd-implement-native`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`,
  `sdd-archive`, `sdd-retro`, `sdd-agent-writing` y `sdd-feedback`; `sdd-archive` corrió desde la caché 3.0.3 del
  plugin y `sdd-retro` y `sdd-agent-writing` desde la 3.0.4
- Proyecto: aplicación web con backend .NET, frontend React y un editor de documentos con plugins; Windows sin Docker,
  con un motor de editor y un clúster de base de datos compartidos por máquina; equipo pequeño
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus (revisión final, ejes Spec y Arquitectura, re-revisión), Sonnet (revisión de spec y
  eje Código) y Haiku (investigación)
- Coste en reloj: 3,89 h de esfuerzo frente a 3 h estimadas (+30 %), sin contar el cierre del 2026-11-23
- Coste en tokens: 199.140.506 en el hilo y 21.694.357 en 10 despachos de subagentes

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La gate de cierre se repite entera cada vez que la base se mueve antes del merge

- **Qué pasó**: la gate corrió una vez sobre la base integrada. Antes de fusionar, la base avanzó 120 commits; se
  integró y, como traía ficheros de «Sin filtro» (manifiestos del backend), la gate se repitió entera. Durante esa
  pasada y el contraste de sus rojos, la base avanzó otros 55 commits, también con un manifiesto (`package.json`), y la
  gate se repitió entera otra vez. Antes del merge ya llevaba 23 más. Las instrucciones del proyecto dicen que la gate
  pasa una sola vez sobre la base integrada y que no se repite tras mergear la base. El kit y el proyecto se
  contradicen, y el agente siguió al kit dos veces antes de aplicar la regla del proyecto.
- **Fuente**: `git rev-list --count HEAD..origin/dev` → `120`, `55` y `23` en los tres momentos; los resúmenes de cada
  pasada en el scratchpad de la sesión (segunda: `backend:test` 318 s, `backend:test-docbuilder` 220 s,
  `frontend:check` 1108 s; tercera: 21 s, 280 s, 60 s y 785 s, más ~5 min de E2E cada una);
  `skills/sdd-archive/references/closing-suite.md`, «After the sync merge», «A file of «Sin filtro» from the base runs
  the gate without `--affected`».
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md`, paso 6 («The suite on the sync merge»), y
  `skills/sdd-archive/references/closing-suite.md`, «After the sync merge».
- **Por qué el kit no lo evitó**: la regla no tiene tope ni mira si el proyecto declara una sola pasada de gate. Con
  una base que recibe varios merges por hora, cada integración trae un manifiesto y la gate no alcanza nunca a la base.
- **Coste**: ~55 min de reloj en dos pasadas de más, sin contar el contraste del hallazgo 2.
- **Propuesta**: leer en `operations.md` §Testing si el proyecto declara pasada única. Con pasada única, o desde la
  segunda integración tras una gate verde, la integración siguiente pasa solo las suites unitarias más las tareas que
  la rama y la base cruzan; o se delega en `sdd merge --verify`, que ya reintegra y verifica lo que se cruza bajo el
  cerrojo.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una gate de cierre verde y una base que, tras la integración, trae un manifiesto,
  y un proyecto que declara pasada única de gate, WHEN el cierre integra esa base, THEN corre solo las suites unitarias
  y lo que cruza, y el `Gate:` del mensaje final nombra el resto como `saltada (pasada única del proyecto)`.

### 2. El contraste de un rojo «a la vez en un worktree de la base» no cabe en un entorno compartido por máquina

- **Qué pasó**: 11 E2E cayeron en la gate. La receta pide crear un worktree detached de la base, prepararlo con su
  `env:setup` y correr el fichero que falla en la rama y en ese worktree a la vez. Con el motor nativo del proyecto,
  el editor de documentos es uno por máquina: dos entornos no pueden validar a la vez (lo dice una fila de la deuda del
  proyecto). El agente lo hizo en serie, en el mismo worktree, con `git switch --detach <base>`: volvió a compilar el API, pasó
  los mismos 9 ficheros solos con el mismo entorno y sin limpiar nada, y volvió a la rama.
- **Fuente**: `skills/sdd-archive/references/merge-recipe.md:18-19` («Create a detached temporary worktree…», «on the
  branch and in that worktree at once»); los resúmenes del contraste en el scratchpad (9 ficheros, ~9,5 min por lado,
  más ~3 min de compilación).
- **Dónde en el kit**: `skills/sdd-archive/references/merge-recipe.md`, «A red suite», pasos 1 y 2.
- **Por qué el kit no lo evitó**: la receta da por hecho que cada worktree tiene su entorno aislado; `§Entornos` del
  proyecto declara recursos compartidos y la receta no lo lee.
- **Coste**: ~22 min de contraste, más el tiempo de decidir cómo hacerlo.
- **Propuesta**: si `§Entornos` declara un recurso único por máquina, el contraste corre en serie en el mismo
  worktree, detached en la base, con el árbol limpio y la vuelta a la rama como último paso; el registro dice «en
  serie: entorno compartido».
- **Verificada**: sí; hecho así en esta sesión: los 11 cayeron igual en la rama y en la base.
- **Criterio de aceptación**: GIVEN un proyecto cuyo `§Entornos` declara un servicio único por máquina y un E2E en
  rojo en la gate, WHEN el cierre contrasta el rojo, THEN no crea un segundo entorno; corre el fichero en la rama y
  después en la base en el mismo worktree, y deja el worktree en la rama.

### 3. Una sonda ignorada por git se coló en la suite de cierre

- **Qué pasó**: durante la investigación, el agente escribió dos sondas de Playwright en la carpeta de los E2E, con un
  nombre que el `.gitignore` del proyecto ignora (`e2e/probe-*`); una apuntaba a un entorno compartido de
  preproducción. El plan decía borrarlas «al acabar». El paso 0 del cierre usa `git status --porcelain`, que no ve lo
  ignorado, y el E2E de la gate las recogió. El agente lo vio en la salida y paró la pasada; solo habían corrido los
  `setup` locales.
- **Fuente**: `skills/sdd-archive/SKILL.md:21` (`git status --porcelain` en el paso 0.1); `git check-ignore -v` →
  `apps/frontend/.gitignore:33:e2e/probe-*`.
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md`, paso 0.1, y `skills/sdd-archive/references/closing-suite.md`
  («The suite on the deleted tree»).
- **Por qué el kit no lo evitó**: ninguna regla mira lo ignorado dentro de las carpetas de las suites. El error fue
  del agente (no borró las sondas antes de la gate), y una regla del kit lo habría evitado.
- **Coste**: una pasada del E2E abortada (~1 min) y el riesgo de escribir en un entorno compartido.
- **Propuesta**: el paso 0 lista también lo ignorado dentro de las carpetas de las suites de «Suites»
  (`git status --porcelain --ignored -- <carpetas>`), y pregunta por cada fichero de test antes de la gate.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: RED: con un `e2e/probe-x.spec.ts` ignorado por git en el worktree, hoy el cierre llega a
  la gate sin nombrarlo; GREEN: el paso 0 lo nombra y para antes de la suite.

### 4. Las líneas que el kit manda pegar sin tocar rompen el MD013 del proyecto, otra vez

- **Qué pasó**: el commit de cierre lo rechazó dos veces el pre-commit por MD013 (200 columnas): la línea de
  `session tokens` pegada sin cambios en el walkthrough (706 caracteres) y 15 líneas de rulings de `tasks.md` (hasta 567). Hubo
  que partirlas a mano con un script. Los tickets de la 0000 y de la 0034 de este proyecto ya lo reportaron.
- **Fuente**: la salida de markdownlint en el pre-commit: `walkthrough.md:44:201 error MD013/line-length … [Expected:
  200; Actual: 706]` y `tasks.md:57:201 error MD013/line-length … [Expected: 200; Actual: 567]`;
  `skills/sdd-archive/SKILL.md`, paso 2 («paste its lines unchanged»).
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md`, paso 2, y la salida de `sdd session tokens` y `sdd ledger
  rulings`.
- **Por qué el kit no lo evitó**: la CLI escribe cada línea entera y la regla dice pegarla sin cambios.
- **Coste**: ~5 min y dos commits rechazados; repetido en tres tickets.
- **Propuesta**: `session tokens` y `ledger rulings` parten su salida a 120 columnas con sangría de continuación, o
  aceptan `--wrap <n>`.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN 10 despachos de subagentes WHEN `sdd session tokens` imprime la línea de
  subagentes THEN ninguna línea pasa de 120 columnas y `estimation log` la sigue leyendo.

## Lo que hice por iniciativa propia

- Leí el script de limpieza del entorno antes de ejecutarlo, para saber si borraba recursos compartidos por máquina:
  solo borraba los del worktree. Funcionó.
- Tras la tercera integración, como la base tocaba la misma regla que la rama, pasé solo los unitarios del backend con
  analizadores (3635/3635) en vez de la gate entera. Funcionó.
- Hice el contraste de rojos en el mismo worktree, detached en la base (hallazgo 2). Funcionó.

## Funcionó, no tocar

- `capability merge` y `capability check`, `decision check`, `roadmap check` y `estimation log`, sin retoques.
- La reescritura de los sha citados antes de juntar el cierre (`references/records.md`, «History»).
- `sdd merge --sync`: tres integraciones de una base muy activa sin ningún conflicto.
- `sdd merge --push`: fusionó y publicó a la primera.

## Menores

- Las palabras mal escritas de la frase literal de validación necesitan un `cspell:ignore` en el walkthrough y en
  `tasks.md` — no localizado en el kit.
