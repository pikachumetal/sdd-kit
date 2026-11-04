---
kit_version: 2.3.4
lane: feature
id: 20261104-102149-feature-0302-annotated-copies
task: 0302
mode: full
date: 2026-11-04
---

# Ticket para el kit — feature 0302: la maquinaria de las copias anotadas contra su fuente

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo. Se partió al arrancar: la 0302 hizo la maquinaria, y aplicarla a las copias quedó para la 0312.
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-parallel-agents`, `sdd-implement` (Native), `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `add-to-changelog` y `sdd-feedback`.
- Proyecto: el repo del kit (CLI en TypeScript sin build, Vitest, moon).
- Modelo del hilo: Opus 5.5, en todas las fases.
- Modelos de los subagentes:
  - revisores de la spec: dominio en Opus y técnica en Sonnet;
  - revisión final en ejes: Spec y Arquitectura en Opus, Código en Sonnet, con effort high;
  - re-revisión en Opus.
- Coste en reloj: 2,05 h, frente a 3 h estimadas de implementación.
- Coste en tokens: 141,5 M del hilo y 13,9 M de subagentes. En total 56,31 $: 47,39 $ del hilo y 8,93 $ de subagentes.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La rúbrica de la review de spec dio «ninguna» a una spec que fija un contrato para otras features, y salieron 3 Critical

- **Qué pasó**: la rúbrica contó 2 señales (contrato público y área no explorada) y dio «ninguna». El dev-lead tuvo que preguntar dos veces («has auditado el spec?», «has hecho dom opu / tec sonnet?»).
  - Antes de despachar nada, el repaso de coherencia completo encontró 13 errores en la spec.
  - Los dos revisores encontraron 20 hallazgos, 3 de ellos Critical. Uno (A+C se esquivaba con `…` y daba rojo con cualquier cambio de media línea) obligó a rediseñar la decisión central.
  - Esa spec fija la gramática de la marca y la forma de `upstream.json`, que van a rellenar la 0312 y la 0296.
- **Fuente**: «Hallazgos de la review» de la spec de la 0302 (`.docs/sdd/specs/20261103-201153-feature-0302-annotated-copies/spec.md`); `skills/sdd-propose/references/review-spec.md:20` → «**Por defecto, ninguna.** 0–3 señales no proponen review.».
- **Dónde en el kit**: `skills/sdd-propose/references/review-spec.md`, §2 «Decide si recomiendas review».
- **Por qué el kit no lo evitó**: la señal «Contrato público» pesa lo mismo cuando la consume otro módulo hoy que cuando la van a rellenar varias features después. Además, el umbral de «ninguna» llega hasta 3 señales. El repaso de coherencia que hice antes de presentar la spec fue parcial: lo reconocí cuando el dev-lead preguntó.
- **Coste**: dos paradas del dev-lead, unos 2,2 $ de los dos revisores y la reescritura de la spec, en su mayor parte la decisión 3 (spec, «Hallazgos de la review»).
- **Propuesta**: sustituir «0–3 señales no proponen review» por una regla que cuente aparte un contrato que otras filas del roadmap van a rellenar. Si el delta fija un formato que nombran filas posteriores, un revisor como mínimo, aunque haya menos de 4 señales. Sustituye la frase; no se añade una excepción al lado.
- **Verificada**: sí — contrastado con `skills/sdd-propose/references/review-spec.md:20`.
- **Criterio de aceptación**: GIVEN una spec con 2 señales, una de ellas un formato de fichero que nombran dos filas posteriores del roadmap WHEN el agente aplica la rúbrica THEN propone al menos un revisor.

### 2. El repaso de coherencia sigue sin buscar los tests que fijan la regla que se retira (segundo caso)

- **Qué pasó**: la spec reclasificaba `sdd-grilling` y `sdd-rubber-duck` como propias, y su tabla «Lo que se retira o cambia de forma» no nombraba `cli/test/kit/skills.test.ts:118` («toda skill adaptada de otra fuente lleva NOTICE»). El pre-commit de la Task 2 se paró en él. La enmienda de las marcas dentro de una valla tampoco nombraba `cli/test/kit/dist.test.ts:42`, que fijaba la regla vieja, y salió en rojo en la Task 5.
- **Fuente**: el log del pre-commit de la Task 2 (`× toda skill adaptada de otra fuente lleva NOTICE`); el ruling de la Task 5 en `tasks.md` §Rulings; `skills/sdd-propose/SKILL.md`, paso 4: «search each name and each id in `capabilities/`, the project's documents and, in a skills kit, `skills/`».
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md`, paso 4, «Coherence pass».
- **Por qué el kit no lo evitó**: la lista de carpetas del paso no incluye los tests. Es el mismo hallazgo del ticket de la feature 0300, §1, que ya tiene fila (0306). Este es su segundo caso.
- **Coste**: un commit bloqueado, un test que salió en rojo y un cambio de texto en dos skills («Adapted from» pasa a «Inspired by»), que la decisión 15 de la spec no fijaba: unos 10 min.
- **Propuesta**: la del ticket de la 0300: «en todo el repo con `git grep`, salvo las carpetas de evidencia, con cada forma del literal». Sustituye la lista de carpetas.
- **Verificada**: sí — contrastado con el paso 4 de `skills/sdd-propose/SKILL.md`.
- **Criterio de aceptación**: GIVEN una spec que retira «un `<!-- kit:` dentro de un bloque de código se copia tal cual» y un test que lo asserta WHEN el agente hace el repaso de coherencia THEN la tabla lista ese test con su línea.

### 3. `sdd merge --check` ve como sucio un fichero que solo cambió de stat

- **Qué pasó**: el cierre se paró con «destino sacado: el checkout de 'develop' … tiene cambios sin commitear». Lo único que había era `dist/hooks/hooks.json`, con `i/lf w/lf` y `git diff` vacío: un `kit:build` lo había reescrito con los mismos bytes en LF, y con `core.autocrlf=true` git lo marcaba modificado por stat. La sesión de coordinación lo limpió con un `git add` que no deja nada staged. En esta rama se cortó la causa con `dist/** text eol=lf`.
- **Fuente**: la salida de `node dist/cli/bin/sdd.js merge --check --project-root .`; `git ls-files --eol dist/hooks/hooks.json` → `i/lf w/lf attr/`.
- **Dónde en el kit**: `cli/src/merge/` (`sdd merge --check`, la comprobación del destino) y `skills/sdd-archive/SKILL.md`, paso 0.2.
- **Por qué el kit no lo evitó**: la comprobación lee el estado de git, que con `autocrlf` cuenta un cambio de stat como modificación, aunque el contenido sea el mismo.
- **Coste**: una parada del cierre y una acción de la sesión de coordinación, unos 10 min.
- **Propuesta**: que `--check` distinga un fichero sin cambio de contenido (`git diff --quiet -- <fichero>` en 0) de uno con cambios, y que solo pare con los segundos.
- **Verificada**: sí — reproducido con `git status --porcelain` y `git diff --stat` en Git Bash, en los dos checkouts.
- **Criterio de aceptación**: GIVEN el checkout destino con un fichero que solo cambió de stat WHEN corre `sdd merge --check` THEN da «listo» y no «destino sacado».

### 4. El push del merge falló de forma intermitente, y nada del kit dice qué hacer

- **Qué pasó**: el push por SSH empezó a fallar a mitad de sesión y fue intermitente: `git ls-remote origin develop` dio 0, 128 y 0 en tres intentos seguidos. El SSH de Windows entraba («Hi <usuario>!»); el que trae Git for Windows no.
  - `sdd merge --push` falló cuatro veces: con «push: no se pudo publicar 'develop' en 'origin'» y con «base: no se pudo hacer fetch de 'origin'». Deshizo el merge cada vez, como debe.
  - Salió por HTTPS con el token de `gh`, pasando `url.https://github.com/.insteadOf` y `credential.helper=!gh auth git-credential` por `GIT_CONFIG_*`, solo en el entorno del comando.
- **Fuente**: los comandos de la sesión en Git Bash; `gh auth status` → «Git operations protocol: ssh»; la salida de `sdd merge` en cada intento.
- **Dónde en el kit**: `skills/sdd-archive/references/merge-recipe.md` («Denied by the environment»), que habla de un permiso denegado y no de una autenticación que falla.
- **Por qué el kit no lo evitó**: la receta dice «no reintentes» ante una denegación del entorno, pero no cubre un remoto que rechaza la clave de forma intermitente. Reintenté tres veces antes de buscar otra salida.
- **Coste**: unos 20 min y dos turnos del dev-lead para entender el error.
- **Propuesta**: una línea en la receta: con `Permission denied (publickey)`, prueba `ssh -T` con el SSH del sistema y `gh auth status`, y si `gh` tiene sesión, lanza el comando con el remoto por HTTPS y el token de `gh` en `GIT_CONFIG_*`, sin tocar la configuración del usuario.
- **Verificada**: sí — `sdd merge --push` publicó `develop` en `origin` así (`40356e75`).
- **Criterio de aceptación**: GIVEN `sdd merge --push` que falla con `Permission denied (publickey)` y `gh auth status` con sesión WHEN el agente sigue la receta THEN publica por HTTPS sin editar `~/.ssh` ni `.gitconfig`.

## Lo que hice por iniciativa propia

- **Medí cada copia con frases de 6 palabras** antes de proponer la spec, en dos sentidos: qué parte del kit sale del original y qué parte del original conserva el kit. La medida cambió el alcance que traía el prompt:
  - `sdd-rubber-duck` es propia (0 % de `teach`);
  - el registro no nombraba dos originales de `sdd-agent-writing`;
  - OpenSpec y `code-review` de mattpocock son conceptos.

  Funcionó: sin la medida, la 0312 habría anotado una copia que no lo es.
- **Escribí un borrador de anotación automático** (`real-copies/` de la spec) para la prueba real de la decisión 12. Probó la gramática en las 15 copias, no solo en una, y encontró tres fallos que los fixtures no veían:
  - las vallas;
  - las líneas en blanco tras un bloque;
  - los falsos A+C.

  Funcionó, y le deja a la 0312 la anotación casi hecha.

## Funcionó, no tocar

- La prueba real antes del cierre (decisión 12 de la spec) encontró lo que ningún fixture encontraba, y el desvío paró como debía: una parada con 🦆, ✋ y la enmienda ya escrita.
- La revisión final en tres ejes dio hallazgos distintos, sin pisarse. La re-revisión única cazó dos roturas que había metido la pasada.
- El mensaje de la sesión de coordinación sobre superpowers v7.0.2 llegó a mitad de la revisión. Se aplicó como una enmienda «sin aprobar» que aplica tal cual una decisión del dev-lead, sin parar.

## Menores

- `spec-writing.md` pide las secciones de diseño también en `delegate`, y la regla 3 del `CLAUDE.md` del repo dice «sin preguntas intermedias». Seguí el `CLAUDE.md` y lo dejé en ✋. — `skills/sdd-propose/references/spec-writing.md`, «Design by sections»
- Un `node -e` con comillas invertidas dentro de comillas dobles hizo que Git Bash ejecutara su contenido: lanzó un `vitest` y dejó a medias una sección del plan. Se rehízo con Write. — no localizado (reglas del repo, no del kit)
- Los vigías de silencio lanzados con `&` dentro de un solo Bash en segundo plano no dejaron salida, y los relancé uno por uno. — `skills/sdd-propose/references/control-profiles.md`, «Vigía de silencio»
