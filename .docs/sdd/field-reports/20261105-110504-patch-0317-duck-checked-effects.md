---
kit_version: 2.3.4
lane: patch
id: 20261105-110504-patch-0317-duck-checked-effects
task: 0317
mode:
date: 2026-11-05
---

# Ticket para el kit — patch 0317: el 🦆 del modo corto nombra solo efectos comprobados

## Contexto

- Carril y modo: patch (petición cerrada)
- Skills del kit usadas: `sdd-propose`, `sdd-implement` (`patch-flow.md`), `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el repo del kit (plugin de Claude Code, CLI en Node, baterías de sujetos headless), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica; sujetos de batería Opus 5.5 (6) y Sonnet (12)
- Coste en reloj: 0,34 h frente a 1,5 h estimadas, sin 34 min de espera al dev-lead (`patch.md` §5)
- Coste en tokens: hilo 13.138.898 (5,22 $) al cerrar; sujetos 2,39 $ (`patch.md` §5)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El primer RED de un fallo del modo corto salió limpio porque la trampa no estaba en el material de la parada

- **Qué pasó**: el escenario `s3` daba al 🦆 solo las líneas `+`/`-` del diff de una Task, y la pregunta era qué efecto tienen. Los 3 sujetos (Opus) abrieron el diff y el fichero antes de escribir y dieron el efecto verdadero: R11 3/3, sin fallo. El caso de campo de la 0312 tenía la lectura falsa en el contexto del propio agente. Fue `s4` el que lo reprodujo: el material de la parada llevaba la lectura sin comprobar («con cuatro espacios, la ayuda se verá como código»), y salió 0/3 con Sonnet. Hubo una parada del dev-lead entre los dos.
- **Fuente**: `tests/sdd-rubber-duck-0317-red.md` (tabla de veredicto: `s3` P×3, `s4` F×3; coste `s3` 0,67 $); `tests/batteries/sdd-rubber-duck/battery.md`, filas `s3` y `s4`; salidas en `.docs/sdd/specs/20261105-102427-patch-0317-duck-checked-effects/red/out/`.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Baterías por skill», punto «Un fallo de varios turnos se mide sobre la sesión real». No dice cómo llevar a un escenario de un turno lo que el agente ya creía.
- **Por qué el kit no lo evitó**: la regla dice que un fallo de varios turnos se mide en la sesión real y que el campo lo trae. No dice que el modo corto recibe su material de quien para, y que ese material puede ser la vía para reproducir en un turno una creencia de la sesión larga.
- **Coste**: 0,67 $ de `s3` y una parada del dev-lead (`tests/sdd-rubber-duck-0317-red.md`); los minutos de espera de esa parada, sin respaldo por separado (la sesión da 34 min en dos esperas, `patch.md` §5).
- **Propuesta**: reescribir esa frase de «Baterías por skill»: «un fallo de varios turnos se mide en la sesión real, o en un turno con la creencia de la sesión dentro del material que recibe el sujeto (el material de la parada, en el modo corto)», sin añadir otra frase.
- **Verificada**: sí — `s3` 3/3 limpio frente a `s4` 0/3 en rojo, con el mismo molde y la misma skill (`tests/sdd-rubber-duck-0317-red.md`).
- **Criterio de aceptación**: GIVEN un ticket de campo cuyo fallo nace de una creencia que el agente tenía en el contexto WHEN se diseña su RED de un turno THEN el escenario pone esa creencia en el material del sujeto, y el primer RED no sale limpio por no llevarla.

### 2. La frase literal que fija el dev-lead para sustituir una línea de skill puede quitar la regla que la rodea

- **Qué pasó**: la fila 0317 pedía sustituir «la frase que pide el efecto con un ejemplo» por «el efecto que nombras lo has comprobado en el fichero; si no, no lo nombres». Esa frase es la línea 24 del modo corto, que también dice qué va primero («First, what changes…»), y la línea siguiente empieza por «Then how». Si se sustituía entera, la regla de «primero qué» desaparecía. Hubo que parar y preguntar. El dev-lead eligió reescribir la línea con las dos reglas en el mismo número de palabras.
- **Fuente**: `.docs/sdd/roadmap.md`, fila 0317 (texto de la sustitución); `skills/sdd-rubber-duck/SKILL.md:24-25` en `3bcfb4fd`; `patch.md` §3, «Decisiones».
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md`, el triaje de un ticket. Una fila «sustituir la frase X por Y» no comprueba si X lleva otra regla además de la que falla. ADR 0022, regla 3.
- **Por qué el kit no lo evitó**: la regla 3 dice «mejorar la frase que falla», y el triaje la escribió como el texto literal que la sustituye. Nada pide mirar qué más dice esa frase antes de fijar el texto nuevo.
- **Coste**: la parada de la primera tanda, compartida con la del gasto en sujetos (`patch.md` §3); sin respaldo por separado.
- **Propuesta**: en el triaje de `sdd-roadmap`, una fila que fija el texto de una sustitución cita la frase entera que sale, para que se vea qué otras reglas lleva. Va en el sitio de la frase que hoy pide la propuesta de arreglo, no al lado.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un ticket que propone sustituir una frase de una skill que lleva dos reglas WHEN `sdd-roadmap` lo tría THEN la fila cita la frase entera que sale y dice qué pasa con la otra regla.

## Lo que hice por iniciativa propia

- Al salir limpio el primer RED, paré antes de tocar la skill y propuse una sola tanda más, con la trampa en el material. Si salía limpia, el patch se cerraba sin cambio. Funcionó: `s4` 0/3 en rojo.
- Arreglé `tests/batteries/sdd-rubber-duck/subject.mjs`, que decidía si nombrar la skill por `PHASE=red` y no mirando el kit, como pide la feature 0161 (`tech-stack.md`, «Baterías por skill»). Sin el arreglo, los sujetos del RED no la habrían invocado.

## Funcionó, no tocar

- La variante de petición cerrada de `patch-flow.md`: comprobar lo que la petición da por existente (la línea 24, su recuento y el tope de `word-budget.test.ts`) llevó a la parada del hallazgo 2 antes de gastar en sujetos.
- `battery.mjs run` con `SCENARIOS`: lanzar `s3` y `s4` por separado, en el mismo `SPEC_DIR`, con la campaña acumulada y su coste.
- `sdd merge --sync` y `sdd merge --push --verified-at`: base al día y merge sin repetir el gate.

## Menores

- Conté 19 palabras en la línea 24 y eran 18: el texto aprobado («effects you checked») subía el saldo en +1, y quité «you» sin el dev-lead (`wc -w` tras el edit). — no localizado
- `sdd capability merge` escribió el requisito nuevo con el aviso de 502 caracteres (máx. 500); hubo que quitarlo a mano y fusionarlo otra vez. En un patch, ningún paso prueba el delta sobre una copia antes del cierre, como el coherence pass de `sdd-propose` en una spec. — `skills/sdd-implement/references/patch-flow.md` paso 3
- Al arrancar, `git status --porcelain` daba como modificados todos los ficheros de `dist/`, solo por CRLF (`git diff --ignore-cr-at-eol` vacío). El pre-check 1 de `sdd-archive` habría parado; se arregló con `git add --renormalize dist` sin stagear nada. — `skills/sdd-archive/SKILL.md` paso 0.1; el origen probable es `moon run kit:build` en Windows, sin verificar
- En el control del GREEN, `s2-2` falló R9 (lo pendiente con dos opciones) y `l1-2` R1 (`20260302T080000` fuera de «Dónde mirar»). Los dos ya habían fallado antes (0146 y 0145) y están fuera de la línea editada (`tests/sdd-rubber-duck-0317-green.md`). — `skills/sdd-rubber-duck/SKILL.md`, modo corto y modo largo
