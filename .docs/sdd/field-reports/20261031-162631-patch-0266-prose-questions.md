---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261031-160126-patch-0266-prose-questions
task: 0266
date: 2026-10-31
---

# Ticket para el kit — patch 0266: las skills preguntan en prosa

## Contexto

- Carril: patch, petición cerrada, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-start-patch`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit, una persona
- Modelo del hilo: Opus 5.5
- Coste: 5,56 $ en 6 sujetos Opus; la sesión, con `sdd session tokens`

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Reescribir la frase del gate perdió la opción vecina, y la rúbrica no la miraba

- **Qué pasó**: con ««Apruebo (Recomendada)» first, «Cambios»», la opción de parar antes de la Task 1 cayó en 2/2; en el RED salía en 2/2. La fila G1 solo medía la forma, y lo vi leyendo el mensaje. Pasó con «A third option, in `delegate`…».
- **Fuente**: `patch.md` §4 de la 0266, casos 1 a 3; `skills/sdd-propose/SKILL.md` paso 4
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Baterías por skill»
- **Por qué el kit no lo evitó**: nada pide que la rúbrica cubra lo que la frase editada arrastra; `tech-stack.md` pide control tras editar, no antes
- **Coste**: 1,82 $ de una ronda GREEN descartada
- **Propuesta**: antes del RED de una edición de forma, la fila de la rúbrica lista cada opción o cláusula de la frase que se toca
- **Verificada**: sí — la fila ampliada separa las dos rondas
- **Criterio de aceptación**: GIVEN una edición que pierde una opción del gate WHEN se califica con la fila THEN sale rojo

### 2. `extract.mjs` descartó la evidencia de 4 de 6 sujetos: el gate los lleva a escribir el nombre de git de la máquina

- **Qué pasó**: `no se guarda g1-2.tools.txt: el stream sigue en …`. `extract.mjs` sale con 3 si la salida lleva `user.name`, y el sujeto lo escribe en el aviso del aprobador, porque el molde nombra a otra persona y `spec-template.md` pide `git config user.name`. Es la causa que el ticket de la 0224 §2 dejó sin localizar, en este escenario. El veredicto da `g1 · 1/2 · rojo` con la conducta correcta.
- **Fuente**: `tests/headless/extract.mjs`, líneas 62-66; `tests/headless/lib.mjs`, `saveExtract`; streams de `g1`
- **Dónde en el kit**: `tests/headless/lib.mjs` (identidad de git del sujeto) y `tests/batteries/sdd-propose/subject.mjs`
- **Por qué el kit no lo evitó**: el molde no fija una identidad de git que el sujeto vea, o el sujeto la lee de la máquina (sin verificar cuál)
- **Coste**: un script para leer los streams, y un veredicto de puerta inservible en las tres tandas
- **Propuesta**: que el sujeto lea la identidad del molde, y que el lanzador diga la causa del `no se guarda`
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `g1` con el aviso del aprobador WHEN el sujeto corre THEN `tools.txt` y `texts.txt` se guardan

### 3. `SUBJECT_CAP` cuenta toda la campaña de `RUNS_DIR`, y un sujeto no se lanzó sin error

- **Qué pasó**: en la segunda tanda, `PHASE=green2` con `SUBJECT_CAP=2` lanzó un sujeto y acabó `g1 · 1/2 · rojo · faltan 1`, porque la tanda anterior ya contaba. Hubo que lanzar el segundo con `run.mjs`, `SUBJECT=2`.
- **Fuente**: salida de `battery.mjs run`: «sujetos de la campaña: 2»
- **Dónde en el kit**: `tests/headless/campaign.mjs`
- **Por qué el kit no lo evitó**: `faltan 1` no dice que paró el techo. El ticket de la 0224 ya citaba un corte por `SUBJECT_CAP`: segundo caso
- **Coste**: ~5 min
- **Propuesta**: que `battery.mjs` diga `no lanzado: techo de <n> sujetos alcanzado`
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN el techo alcanzado WHEN acaba `run` THEN el veredicto nombra el techo, no solo `faltan`

## Lo que hice por iniciativa propia

- Toqué `sdd-start-feature` paso 7 y `sdd-archive` paso 1, que el prompt no nombraba: llevaban la misma excepción que la plantilla.
- Actualicé `capabilities/` y `mission.md`, que el prompt no listaba, porque describían la herramienta como norma.
- Reescribí la fila G1 tras ver el GREEN: «la recomendada, la primera», sin exigir «Apruebo». Un sujeto recomendó cambios por una spec del molde con huecos, igual que en el RED.

## Funcionó, no tocar

- El prompt con decisiones cerradas: ni una parada.
- `sdd capability merge` en una copia detectó que el delta valía antes de lanzar sujetos.

## Menores

- El prompt contaba 6 menciones; `grep` da 9. Las 3 de más prohíben la herramienta y no la piden.
- `g1` pasó a un paso propio, `gate`, para lanzarlo solo: `control` lanza más escenarios — `tests/batteries/sdd-propose/battery.md`.
- `KIT_DIR` y `RUNS_DIR` rechazados por su forma; sus mensajes dicen el arreglo — `tests/headless/campaign.mjs`.
- `.docs/sdd/tech-stack.md` y `tests/batteries/sdd-init/battery.md` siguen citando la herramienta como hecho del arnés; es correcto.
