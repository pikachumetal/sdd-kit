---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261101-164724-feature-0116-session-start-and-resume
task: 0116
mode: full
date: 2026-11-01
---

# Ticket para el kit — feature 0116: aviso de kit no cargado y puerta para retomar

## Contexto

- Carril y modo: feature full, perfil `delegate`, Native
- Skills del kit usadas: `sdd-propose`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: ejes Spec, Arquitectura y re-revisión en Opus; Código en Sonnet; sujetos en Sonnet y smokes en Haiku
- Coste en reloj: 1,02 h frente a 3 h estimadas
- Coste en tokens: hilo 27.243.125; subagentes 3.137.229, 16,54 $, más 10,69 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El repaso de coherencia no ve una capacidad que cambia sin `MODIFIED`

- **Qué pasó**: la spec declaró `routing`, `onboarding` y `migration`, pero el Scope añadía una opción a `sdd upgrade` y un fichero a `sdd init --finish`, que `capabilities/cli.md` describe. Los ejes Spec y Arquitectura lo hallaron como Important y el dev-lead tuvo que parar a aprobar una enmienda.
- **Fuente**: `spec.md` de la feature, §Enmiendas; `capabilities/cli.md:89` y su regla «Dónde viven los datos».
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4, «Coherence pass».
- **Por qué el kit no lo evitó**: el repaso parte de cada `MODIFIED` y de lo que se retira. Un verbo nuevo o un fichero de más en el Scope no sale de ninguno, y `sdd capability merge` solo prueba lo declarado.
- **Coste**: una parada del dev-lead, tras dos revisores que lo señalaron; causa en el walkthrough, §3.
- **Propuesta**: que el repaso cruce cada verbo, opción o fichero del Scope con el índice de capacidades, sustituyendo otra frase del paso para no alargarlo.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec cuyo Scope añade `--project-hook` a un verbo de la CLI y un delta sin `cli` WHEN el agente hace el repaso THEN añade `cli` al delta antes del gate.

### 2. Una regla de entrada con su evidencia de campo no se reproduce, y la spec sigue

- **Qué pasó**: el fallo del ticket 0010b (retomar a mano, sin skill) salió limpio en 6 de 6: lo medido fue un rodeo por `sdd-propose` en 4 de 4 con «retoma». El arreglo redujo el rodeo a 0 de 6.
- **Fuente**: `tests/session-start-resume-red.md`; `tests/session-start-resume-green.md`.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Un baseline limpio no reproduce…»; no localizado en una skill.
- **Por qué el kit no lo evitó**: la batería puntúa la primera skill, y el criterio «frente limpio» no distingue si el sujeto llegó al sitio correcto por otro camino.
- **Coste**: sin coste extra; lo decidió la spec, con el dev-lead al tanto.
- **Propuesta**: que la fila de batería diga qué mide cuando la puerta y la conducta pueden divergir.
- **Verificada**: sí — `red/out/` y `green/out/` de la feature
- **Criterio de aceptación**: GIVEN un escenario con primera skill distinta y conducta correcta WHEN se lee el veredicto THEN la tabla separa rodeo de fallo.

## Lo que hice por iniciativa propia

- Sondeo con tres sesiones Haiku antes de escribir la spec: cambió el diseño, porque el hook pedido no podía avisar. Barato y decisivo.
- Mover el eje Arquitectura a después de los otros dos, para no paralelizar lo que la línea de modelos no nombraba.
- Generar los encargos de los ejes con un script desde las plantillas, para no pegarlos en el contexto del hilo.

## Funcionó, no tocar

- La revisión en ejes: Spec y Arquitectura coincidieron en lo grave, y la re-revisión cazó un Important que introdujo el propio fix.
- El smoke real del hook: destapó que el kit sin superpowers no carga y que `--continue` etiqueta los hooks con ids distintos en el stream.
- `sdd merge --sync` y `sdd merge --push`: a la primera, con 11 commits de base por delante.

## Menores

- `SUBJECT_CAP` cuenta lo ya lanzado en la spec: el segundo tramo salió con `techo de 6 sujetos alcanzado` y «sin evidencia», sin gastar — `tests/headless/campaign.mjs`.
- `battery.mjs` no filtra por escenario, solo por paso: hubo que partir `retomar` en dos pasos para relanzar `rp1` — `tests/headless/battery.mjs`.
- `readFileSync(0)` en `runSessionStart` colgó el worker de Vitest unos 8 min, hasta verlo en el test existente — ya en `tech-stack.md`.
- Primer smoke sin superpowers: aviso falso aparente; la regla ya estaba en `tech-stack.md` y no la apliqué — `.docs/sdd/tech-stack.md`, smoke de un cambio del hook.
- La línea `Política de modelos:` no nombró el eje Arquitectura porque el plan aún no existía — `skills/sdd-templates/templates/spec-template.md`.
- Los smokes del hook no guardaron salida: el eje Spec no pudo verificarlos — no localizado.
