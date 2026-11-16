---
kit_version: 2.3.4
lane: feature
id: 20261108-180157-feature-0297-verify-removed-by-requirement
task: 0297
mode: full
date: 2026-11-08
---

# Ticket para el kit — feature 0297: el RED de las reglas de OpenSpec para un REMOVED salió limpio y la enmienda de un THEN pasó sin review de spec

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-parallel-agents`, `sdd-implement`, `sdd-implement-native`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `sdd-feedback`, `sdd-templates`
- Proyecto: el propio kit (plugin de Claude Code, skills en Markdown y CLI en TypeScript), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (eje Spec, re-revisión, revisor de dominio de la enmienda) y Sonnet 5.5 (eje Código, revisores de spec)
- Coste en reloj: 1,20 h de esfuerzo real frente a 2 h estimadas de implementación (reloj de la sesión 5,69 h, 270 min de espera)
- Coste en tokens: 83.297.434 del hilo y 3.102.115 de subagentes en 7 despachos; 30,74 $ de sesión y 3,35 $ de sujetos de batería

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una enmienda que reescribe un THEN llega a la aprobación sin review de spec

- **Qué pasó**: la revisión final (eje Spec, Minor 1) pidió que el THEN del requisito «recupera del historial» dejara de nombrar `git log -p`, porque los sujetos usaron `git show`. Lo traté como desvío: corregí el THEN yo, con otro paréntesis de comandos, y paré con 🦆 y ✋ sin otra lectura. El dev-lead pidió una review de spec de la enmienda con dos lentes (dominio en Opus, técnica en Sonnet). Volvieron 14 hallazgos: 13 aceptados, 8 de ellos Importantes. Los dos revisores coincidieron en que el THEN corregido seguía metiendo el mecanismo (los comandos), y en que las decisiones del ✋, los topes y la previsión de coste seguían describiendo lo que habían retirado dos enmiendas anteriores (una viñeta nueva, un `MODIFIED`, ~95 palabras). Una de esas dos enmiendas seguía «sin aprobar».
- **Fuente**: `spec.md` de la carpeta de la feature, sección «Hallazgos de la review de la enmienda del THEN»; `sdd session tokens` → «Revisor de spec, lente dominio claude-opus-5-5 213.600 / 1 min; Revisor de spec, lente técnica claude-sonnet-5-5 127.691 / 1 min».
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings» (la parada por desvío con la enmienda sin commitear); `skills/sdd-propose/references/review-spec.md` solo se aplica antes de la puerta de la spec.
- **Por qué el kit no lo evitó**: ningún paso manda revisar una enmienda que cambia el delta. La parada pide al dev-lead que apruebe un texto que solo ha leído su autor, y nada le dice a quien la escribe que mire qué partes de la spec deja obsoletas.
- **Coste**: 341.291 tokens de subagentes y un turno del dev-lead para pedirla (`sdd session tokens`). Sin ella, la capacidad viva habría heredado un THEN con comandos, y la spec cerrada, cuatro decisiones contrarias a su delta.
- **Propuesta**: en «Deviations and rulings», una enmienda que cambia un GIVEN, un WHEN, un THEN o el delta pasa por un revisor de spec con los siete puntos de `review-spec.md` (`sonnet`, `sdd-kit:effort-medium`) antes de la parada, y sus hallazgos van en el ✋. Sustituye la frase que hoy manda parar con la enmienda tal cual, sin añadir otra.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una revisión final que pide cambiar un THEN del delta WHEN el agente para por desvío THEN el ✋ trae los hallazgos de un revisor de spec sobre la enmienda, y las decisiones del ✋ que la enmienda sustituye llevan su nota.

### 2. `COST_CAP` cuenta la campaña entera y una tanda nueva no lanzó ningún sujeto

- **Qué pasó**: la segunda tanda (`PHASE=red2`, para `rm2b`) con `COST_CAP=2` no lanzó ningún sujeto, porque la campaña del `SPEC_DIR` ya llevaba 2,18 $. La relancé con 4,5 y luego con 5. `tech-stack.md` ya dice que el techo es común a la campaña: la regla existía y no la apliqué.
- **Fuente**: `walkthrough.md` de la feature, §5, segundo aprendizaje; `tests/sdd-verify-0297-removed.md`, «RED — … 2,18 $».
- **Dónde en el kit**: `tests/headless/battery.mjs` (`run`), y la línea de `COST_CAP` de `.docs/sdd/tech-stack.md`.
- **Por qué el kit no lo evitó**: la regla está escrita, pero el lanzador no dice antes de la tanda cuánto queda del techo, y una tanda que no lanza nada no para nada.
- **Coste**: dos relanzamientos, menos de 10 min; es al menos el segundo caso, porque la línea de `tech-stack.md` nació de otro igual (sin respaldo de cuál).
- **Propuesta**: `battery.mjs run` imprime, antes de despachar, «campaña: <gastado> $ de <COST_CAP> $ · caben <n> sujetos», y sale con código distinto de 0 si no cabe ninguno.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un `SPEC_DIR` con 2,18 $ gastados y `COST_CAP=2` WHEN corre `node tests/headless/battery.mjs run` THEN sale con código distinto de 0 y una línea con lo gastado y el techo, sin despachar.

### 3. Una fila de máquina `presente` que nombra una conducta buena falla cuando el sujeto la cumple

- **Qué pasó**: escribí la fila RM3h («Lee el historial») como `` `tools: /git[^\n]*log[^\n]*capabilities\/bookings\.md/` presente ``. En «Falla si…», `presente` significa «falla si aparece», así que dio rojo en el sujeto que sí leyó el historial y verde en el que nombró la carpeta. La corregí a `ausente` con un regex más amplio y volví a dar el veredicto sobre las mismas salidas: 2/2.
- **Fuente**: `tests/sdd-verify-0297-removed.md:13`; `tests/batteries/sdd-verify/battery.md`, fila RM3h.
- **Dónde en el kit**: la forma de la rúbrica de `tests/batteries/<skill>/battery.md` (columna «Falla si…») y su lector en `tests/headless/battery.mjs` (`verdict`).
- **Por qué el kit no lo evitó**: la columna se llama «Falla si…» y la palabra `presente` lee como la conducta esperada; ni `plan` ni `verdict` traducen la fila a llano.
- **Coste**: un rojo falso en el RED y un ruling; con el regex estrecho, el RED de la regla 2 habría salido falso limpio.
- **Propuesta**: `battery.mjs plan` imprime cada fila de máquina en llano («RM3h: falla si aparece /…/ en tools.txt»), para leerla antes de gastar.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una fila `` `tools: /re/` presente `` WHEN corre `battery.mjs plan` THEN la salida dice «falla si aparece /re/».

## Lo que hice por iniciativa propia

- Con el RED limpio en las tres reglas, dejé la fuente como revisada (`from` de la copia con su versión nueva en `upstream.json`) sin traer texto: `kit:upstream` sigue vigilándola y el `NOTICE` la cita. Funcionó: «Copias al día: 31 ficheros.» y `kit:upstream` sin el rojo de esa fuente.
- Recorté el THEN nuevo a menos de 500 caracteres cuando `sdd capability check` avisó de 512 en un requisito nuevo.

## Funcionó, no tocar

- Art. I con la parada de la decisión 4: el RED de la regla central salió limpio y la feature paró antes de escribir una viñeta que no hacía falta. Previsión 15,17 $, gasto real 3,35 $.
- El eje Código vio que el mensaje de commit del molde `rm2b` delataba la conducta que el caso quería esconder (Important), y la re-medición con un mensaje neutro mantuvo 2/2.
- `sdd merge --push` con la red caída (`ssh: Could not resolve hostname github.com`) no dejó ningún merge a medias en el destino. Al volver la red, el mismo comando fusionó y publicó.

## Menores

- `sdd session tokens` dio 1,20 h de esfuerzo real con 270 min de «espera al dev-lead»; parte de esas esperas fueron tandas de batería en segundo plano, y el ratio sale corto (sin respaldo de cuánto) — no localizado
- Un script mío del scratchpad para componer el encargo de los ejes cortaba por la última valla y pegó texto de más al encargo de Código; lo recorté a mano — `skills/sdd-verify/references/encargo-revision.md` (receta a mano, sin comando que la componga)
- Mi primera respuesta a «dom opus tec sonnet» no lo leyó como una petición de review de spec con dos lentes; el dev-lead lo repitió con «haz review» — no localizado
