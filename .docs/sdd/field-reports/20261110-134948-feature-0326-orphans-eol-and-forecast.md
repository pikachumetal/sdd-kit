---
kit_version: 2.3.4
lane: feature
id: 20261110-134948-feature-0326-orphans-eol-and-forecast
task: 0326
mode: full
date: 2026-11-10
---

# Ticket para el kit — feature 0326: el lanzador, `kit:copies` y «Previsto»; la Task 3 iteró cuatro tandas sobre un escenario que no podía medir

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native
- Skills del kit usadas: `sdd-propose`, `sdd-implement`, `sdd-implement-native`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (plugin de Claude Code; Node, Vitest, moon), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: opus (revisión de la enmienda, eje Spec, re-revisión), sonnet (eje Código, sujetos)
- Coste en reloj: 3,3 h aproximadas con los commits frente a 2 h estimadas (+65 %)
- Coste en tokens: no medido (la sesión trabajó desde el checkout de `develop`)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Cuatro tandas de pago sobre un escenario que no podía distinguir la conducta, antes de revisar el escenario

- **Qué pasó**: el RED de la Task 3 (la celda «Tope propuesto» debe decir de dónde sale lo previsto) usó `co2`, cuyo cambio previsto son 2 palabras que se aciertan a ojo, con una rúbrica que buscaba la etiqueta «borrador». Tras el RED 0/2 corrieron green 0/2, green2 0/2 y green3 1/2, cambiando la redacción de la plantilla entre tandas; ningún sujeto de green3 contó un borrador. Solo cuando el dev-lead exigió arreglarlo «sin deuda», una revisión Opus de la enmienda vio que la rúbrica no podía distinguir un conteo de una etiqueta y que `co2` se acierta a ojo. Con el escenario nuevo `co2p` (42 palabras) y una celda que pide el comando, RED 0/2 → GREEN 2/2 a la primera. El dev-lead paró: «llevas todo el dia?!?!?! eran 3 patches.. que haces?».
- **Fuente**: `walkthrough.md` §2 (coste de sujetos) y §3; `spec.md` «Enmiendas» (tres enmiendas, aprobadas «1»); `tests/sdd-templates-0326-red.md` §«Campañas anteriores sobre `co2`».
- **Dónde en el kit**: `skills/sdd-propose/references/review-spec.md` (los revisores no miran si el escenario del RED puede fallar por la conducta y no por la forma) y el bucle de tasks de `skills/sdd-implement-native/SKILL.md` (un GREEN rojo se resuelve cambiando el texto y relanzando).
- **Por qué el kit no lo evitó**: ninguna regla pide comprobar, antes de gastar en sujetos, que la rúbrica mide lo que hace el agente (un comando en `tools.txt`) y no la palabra que escribe, ni que el escenario no se acierte sin la conducta. Tras un GREEN rojo, nada pide revisar el escenario antes de redactar otra vez.
- **Coste**: 3,40 $ en 8 sujetos que no midieron (spec, «Previsión de coste»), dos enmiendas con parada y ~2 h de reloj (sin respaldo de `Esperas y huecos`: `sdd session tokens` no midió).
- **Propuesta**: en `review-spec.md`, una pregunta para el revisor de dominio cuando la spec edita una skill con batería: «¿la fila de rúbrica falla por la conducta (lo que el agente hace) o por una palabra?, ¿el escenario se acierta sin la conducta?». Y en el bucle de una task con sujetos: un GREEN rojo dos veces sobre el mismo escenario para y revisa el escenario y la rúbrica antes de otra redacción.
- **Verificada**: sí — contrastado con esta campaña: la misma regla salió 1/2 con `co2` y su rúbrica de etiqueta, y 2/2 con `co2p` y su rúbrica de comando.
- **Criterio de aceptación**: GIVEN una spec cuyo RED busca una etiqueta escrita en un escenario de +2 palabras · WHEN la revisan los dos revisores de `review-spec.md` · THEN uno lo marca como hallazgo («la rúbrica no distingue la conducta»). Y GIVEN dos GREEN rojos seguidos sobre el mismo escenario · WHEN el hilo va a lanzar el tercero · THEN para y revisa escenario y rúbrica.

### 2. Nombres internos en los mensajes al dev-lead

- **Qué pasó**: los mensajes de la sesión nombraban el escenario por su id (`co2p`), las filas de rúbrica (`CO2P-C`) y términos del lanzador sin explicarlos. El dev-lead paró: «que coño es co2p, te crees que se idioma retrasado - espñol?».
- **Fuente**: los mensajes de la sesión; el `CLAUDE.md` del repo, regla 3 («explicando antes los términos que das por sabidos»).
- **Dónde en el kit**: `skills/sdd-rubber-duck/SKILL.md` (el párrafo 🦆 de una parada) y `skills/sdd-propose/references/control-profiles.md` (paradas en `delegate`).
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: solo cubre el párrafo 🦆 de una parada, no los mensajes de progreso ni las preguntas de dinero, donde aparecieron los ids.
- **Coste**: una parada del dev-lead.
- **Propuesta**: que la regla de explicar los términos valga para todo mensaje al dev-lead que nombre un escenario, una fila de rúbrica o un id de herramienta: primero qué es, en una frase, y el id después, si hace falta.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una parada por dinero de una task con sujetos · WHEN el hilo la presenta · THEN la pregunta se entiende sin conocer los ids de la batería.

## Lo que hice por iniciativa propia

- Antes de gastar en la enmienda, una revisión Opus independiente de la propia enmienda: encontró la rúbrica no comprobable y el escenario acertable a ojo. Funcionó; costó una llamada.
- Para probar que los tests nuevos de `i/crlf` pueden fallar, mutar `eolVerdict` y verlos en rojo antes de deshacer la mutación. Funcionó.

## Funcionó, no tocar

- La celda que pide citar la salida de un comando, como la «Previsión de coste»: 0/2 → 2/2.
- La revisión final en dos ejes: los dos vieron, por separado, un test de `i/crlf` que no podía fallar.
- `sdd merge --check` y `--sync` antes de escribir.

## Menores

- `tech-stack.md` decía que `tools.txt` guarda solo la primera línea de cada comando; guarda el comando entero (`tests/headless/extract.mjs:113`). El eje Spec se apoyó en esa frase; corregida en el cierre — no localizado en el kit.
- `sdd session tokens` da «no medido» cuando la feature se ejecuta desde la sesión de otro checkout (el de `develop`): el tiempo y los tokens quedan sin medir — `cli` (`session tokens`).
- El ledger de la Task 1 no guardó la salida del RED, y el eje Spec lo dio por «no verificado»; lo reproduje al cerrar — `skills/sdd-implement-native/SKILL.md`, línea `complete` del ledger.
- `co2p` no prueba `sin medir`, el caso de la 0311 (un texto aún sin escribir) — `tests/batteries/sdd-propose/battery.md`.
