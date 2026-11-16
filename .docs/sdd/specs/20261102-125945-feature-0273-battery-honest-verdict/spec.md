---
id: 20261102-125945-feature-0273-battery-honest-verdict
feature: 0273
title: battery.mjs dice lo que de verdad comprobó
mode: full
profile: delegate
status: done
created: 2026-11-02
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-02
---

# Spec — battery.mjs dice lo que de verdad comprobó

🦆 Quien lanza una batería deja de leer `verde` donde nadie comprobó la conducta: `v1b · 1/1 · umbral 1/1 · verde` pasa a `v1b · 1/1 · umbral 1/1 · puerta verde · sin leer: V1, L`, y solo sale `verde` si todas sus filas las comprobó una máquina. Una fila nueva, `file: walkthrough.md /^Retro: corrección repetida → /`, da rojo al sujeto que dejó esa línea solo en el chat. Una campaña que no midió nada, sin sujetos o con uno sin RESULTADO, sale con código 3 y nombra la etiqueta, en vez de 0. Y la cabecera de `battery.mjs` avisa de los tres tropiezos del primer lanzamiento.

Validación: agente — herramienta de pruebas sin usuario humano, verificada con Vitest; `validation.mode: field`.

## Capacidades

- Ninguna, porque herramientas: `tests/headless/` es la CLI de pruebas del repo, y su regla vive en `tech-stack.md`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: contrato público (la forma de la fila `file:` y el código de salida de `run.mjs`) · tamaño: ~120 líneas en 7 ficheros
- Mínimo razonable: ninguna; la revisión final de rama mira lo mismo sobre el código.

1. Forma de la línea: `<id> · <pasan>/<n> · umbral <u> · puerta verde · sin leer: <filas>`, con los ids que abren la columna «Fila» (`L Idioma` da `L`; `S1, S2, R1` los tres) separados por `, `. Las notas existentes van después. Sustituye al `puerta verde · conducta sin leer` del roadmap: el dev-lead pidió nombrar las filas.
2. Un rojo o un «sin evidencia» no cambian de texto ni nombran filas sin leer: solo el `verde` se matiza, porque es la palabra que se leía mal.
3. `puerta verde` sale con código 0: los códigos del veredicto no cambian (el dev-lead: «Un rojo sigue saliendo con 1. Lo nuevo es el texto»). Consecuencia: 0 ya no significa «conducta comprobada» si hay filas sin leer; lo dice la cabecera.
4. Qué escenarios cubre una fila en prosa, porque esa columna es texto libre (`todos`, `todos menos r1, r5 y t1a`, `u1, turno 2`, `l1 (GREEN)`): `todos` cubre todos; `todos menos …`, todos menos los nombrados; si no, los ids conocidos que nombra la celda; y una celda sin ningún id conocido cubre todos. Ante la duda sobra un `puerta verde`, nunca un `verde`: en `s1, s2, l1, w1 (en l2, en inglés, no se puntúa…)`, `l2` queda como sin leer aunque no se puntúe, y lo acepto. Las filas `tools:` y `file:` siguen exigiendo la lista estricta de ids.
5. Efecto que acepto: `L Idioma | todos` está en casi todas las baterías, así que casi todo escenario de ellas dirá `puerta verde`. Es lo cierto: esa fila la lee el hilo. No se reescribe ninguna rúbrica (fuera de alcance).
6. La fila `file:` es `` `file: <fichero> /<regex>/` `` en «Falla si…», sin `presente` ni `ausente`, tal como la escribe el dev-lead: falla si el fichero no existe o ninguna línea casa. Por eso, al contrario que `tools: … presente`, se lee «falla si no está»; lo dicen la cabecera y `tech-stack.md`. La regex va con el flag `m` (el `^` del ejemplo es de línea) y con `\|` como en `tools:`. Sin `ausente`, porque ningún ticket lo pide.
7. Dónde lee `file:`: `<salida>/<etiqueta>/<fichero>`, la copia plana de `s.keep`. `<fichero>` sin barras, como exige `keep`; con ellas, «comprobación mal escrita». Un `subject.mjs` que no guarde ese fichero da rojo en su fila, y es correcto: no hay evidencia de la conducta.
8. Código de salida de la campaña: **3**, el que ya significa «falta evidencia» en `battery.mjs`. Mensajes: `sin sujetos: <etiquetas>` si no lanzó ninguno (las que iba a lanzar), `sin RESULTADO: <etiquetas>` si un lanzado de esta tanda no dejó RESULTADO o no dejó `tools.txt` (el caso de la 0282: el sujeto muere antes de escribirlo). Salen antes del resumen de coste.
9. La comprobación mira solo lo lanzado en **esta** ejecución: el resumen `sujetos de la campaña: N` acumula fases anteriores y no sirve. Por eso una campaña parada por `RUNS_DIR/stop`, por un techo o por `ya existe` sin lanzar nada también sale con 3: no midió nada. Una que lanzó algunos y se paró por techo con todos con RESULTADO sigue saliendo con 0 (fuera de lo pedido; `battery.mjs` ya da `sin evidencia` en ese caso).
10. `battery.mjs run` ignora el código de cada `runCampaign` y sigue saliendo por su veredicto, que ya nombra `sin tools.txt` y `sin RESULTADO`. Una batería o un tramo sin ningún escenario sale con 3 y lo dice (`sin escenarios en <tabla>`), también en `verdict`: es su forma de «0 sujetos», sin etiqueta que nombrar.
11. Las tres frases de la cabecera llevan lo que hace el código, no el ticket: `KIT_DIR` sale de `git archive <commit> skills .claude-plugin agents cli hooks`, sin `.docs/` ni `tests/`; `SUBJECT_CAP` acumula entre fases de `SPEC_DIR` (`countFinished` barre sus carpetas); y el id de un escenario choca dentro de una fase (`ya existe`, también entre baterías con el mismo `SPEC_DIR` y `PHASE`). `tech-stack.md`:125 dice «del mismo `RUNS_DIR`», y lo corrijo a `SPEC_DIR`.
12. Los párrafos «Dos veredictos» de las 14 `battery.md` no se tocan: «`battery.mjs run` da el de la puerta» sigue siendo cierto, y el de la conducta lo sigue dando quien lee. Añadir `file:` a cada uno sería reescribir sin que nadie lo lea mal.
13. `sdd capability merge` sobre una copia: `Sin delta que fusionar`.
14. Sin frente condicionado: los tres frentes son de código con RED por Vitest, y un RED limpio en cualquiera es un desvío y paro.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo (no hay sujetos) · en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Perfil y merge — «Perfil delegate. Al fusionar, `sdd merge --push`.»
- Un rojo sigue saliendo con 1 — «Un rojo sigue saliendo con 1. Lo nuevo es el texto, más el código de salida de una campaña que no midió nada.»
- Se prueba sin sujetos — «Es código de la CLI de pruebas: se prueba con Vitest, sin sujetos.»
- Un frente con RED limpio — «Un frente con RED limpio se saca solo si la spec lo marcó condicionado; si no, es un desvío y paras.»

## Intent

`battery.mjs` escribe `verde` aunque solo haya comprobado la puerta y las filas `tools:`. En 0206, 0224, 0186, 0276, 0182 y 0277 esa palabra se leyó como veredicto final: casi entra evidencia falsa, y costó ~5 $ y un Important. Además, una campaña sin sujetos o con un sujeto sin RESULTADO sale con 0 (0278, 0282), y la cabecera no avisa de lo que hace fallar el primer lanzamiento (3,07 $ en la 0206). El éxito: nadie puede leer un `verde` sin que todas las filas del escenario las haya comprobado una máquina. Fracasaría aunque funcionara si un escenario con una fila en prosa pudiera salir `verde` porque su celda «Escenarios» no se entendió.

## Scope

- Entra:
  - `tests/headless/battery.mjs`: `puerta verde · sin leer`, la fila `file:`, el código 3 sin escenarios y las tres frases de la cabecera.
  - `tests/headless/campaign.mjs`: el código 3 de una campaña que no midió nada. `tests/headless/run.mjs`: su cabecera.
  - `cli/test/kit/headless/battery.test.ts`, `campaign.test.ts` y `run.test.ts`: los tests nuevos y los que afirmaban lo anterior.
  - `.docs/sdd/tech-stack.md`: líneas 108, 110 y 125 de «Baterías por skill», y la 149 del lanzador.
- No entra: leer con una máquina una fila en prosa; el techo sacado de la spec y el filtro por escenario (0280); `node --check` del `subject.mjs` (0287); reescribir las rúbricas; `ausente` en `file:`; que el techo parcial cambie el código de `run.mjs`; `SUPERPOWERS_DIR` en `readConfig` (criterio del ticket 0282 §3): el caso se cubre con el código 3, porque el sujeto muere sin `tools.txt`, aunque no «antes de lanzar».

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal `· verde` de un escenario con filas en prosa | `tests/headless/battery.mjs`:4, 9 y 135; `cli/test/kit/headless/battery.test.ts`:157 y otros con batería real; ningún hit en `skills/` ni `capabilities/` (`git grep`) | Scope |
| Código 0 de `run.mjs` sin sujetos o con uno sin RESULTADO | `tests/headless/campaign.mjs`:314; `tests/headless/run.mjs`:29; `cli/test/kit/headless/run.test.ts`; `moon.yml`, CI y skills no leen ese código (`git grep`) | Scope |
| Regla «sale con 1 si hay un rojo» y qué comprueba la máquina | `.docs/sdd/tech-stack.md`:108 y 110 | Scope |
| «Dos veredictos» | 14 `tests/batteries/*/battery.md` | Decisión 12: se queda |
| Evidencia histórica que cita el veredicto | `tests/retire-start-skills-green.md`:49, `tests/sdd-verify-0182-comments.md`:21 | Se queda: narra lo que pasó |

- Filas que implementa: 0273 y la deuda «`battery.mjs` da verde en una fila de conducta sin leer» → `roadmap.md` (la cierra `sdd-archive`); 0198 y 0152 la citan como dependencia y no cambian.

## Approach

- Un rojo sigue saliendo con 1; `puerta verde`, con 0; falta de evidencia, con 3.
- Los lectores se buscaron con `git grep` en `tests/`, `moon.yml`, las skills y `tech-stack.md`: solo los tests y `tech-stack.md` leen la línea o el código.
- `verde` solo con todas las filas del escenario de tipo `tools:` o `file:`, o sin filas.

## Dónde se prueba

- Veredicto y fila `file:`: Vitest, `verdict` sobre `memoryFs`, como «verdict con las filas de la rúbrica que se comprueban».
- Código de la campaña: `runCampaign` con dependencias falsas, en `campaign.test.ts`; `run.mjs` real con su sujeto falso, en `run.test.ts`.
- `battery.mjs run` sin escenarios: `runBattery`, en `battery.test.ts`.
- Rúbricas reales: `verdict` sobre las 15 `battery.md` no lanza error, para que ninguna fila actual se tome por mal escrita.
- Cabecera: un test lee `battery.mjs` y exige `git archive`, `SUBJECT_CAP` y `ya existe`.

### Escenarios

- GIVEN `k1` con la fila `` | J1 Juicio | k1 | `tools.txt` tiene `x` | `` y 2/2 WHEN corre `verdict` THEN `k1 · 2/2 · umbral 2/2 · puerta verde · sin leer: J1`, y salida 0.
- GIVEN `k1` solo con `` `tools: /x/` ausente `` y `` `file: walkthrough.md /^Retro: /` `` que se cumplen WHEN corre `verdict` THEN `k1 · 2/2 · umbral 2/2 · verde`.
- GIVEN una fila `` `file: walkthrough.md /^Retro: corrección repetida → /` `` y `k1-2` con la línea solo en `tools.txt`, sin `k1-2/walkthrough.md` WHEN corre `verdict` THEN `k1 · 1/2 · umbral 2/2 · rojo · <fila> falla en k1-2`, y salida 1.
- GIVEN `` `file: a/b.md /x/` `` WHEN corre `verdict` THEN `BatteryError` «comprobación mal escrita».
- GIVEN una fila `todos menos k2` WHEN corre `verdict` THEN `k1` dice `puerta verde` y `k2` dice `verde`. GIVEN una fila con Escenarios `ver arriba` THEN todos dicen `puerta verde`.
- GIVEN `SCENARIOS="a"` y `RUNS_DIR/stop` WHEN corre `runCampaign` THEN devuelve 3 y el log trae `sin sujetos: a-1`.
- GIVEN un sujeto que acaba sin RESULTADO, u otro sin `tools.txt` WHEN corre `runCampaign` THEN devuelve 3 y el log trae `sin RESULTADO: a-1`.
- GIVEN todos los sujetos con RESULTADO WHEN corre `runCampaign` THEN devuelve 0.
- GIVEN una tabla de escenarios vacía WHEN corre `battery.mjs run` THEN sale con 3 y dice `sin escenarios en <tabla>`.
- GIVEN `tests/headless/battery.mjs` WHEN se lee su cabecera THEN nombra `git archive`, que `SUBJECT_CAP` acumula entre fases y que el id choca dentro de una fase.

## Términos y ADR

- Términos resueltos: `puerta verde` — pasó la puerta y las filas de máquina, y quedan filas en prosa por leer; `verde` — todas las filas las comprobó una máquina.
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `.docs/sdd/tech-stack.md` | 21790 / 24579 (19663 × 1,25) | 2789 | sin cambio |

## Enmiendas

- 2026-11-02 — Decisión 1: se nombran todos los ids de una celda «Fila», no solo el primero — la revisión final vio `S1,` en una fila de `sdd-propose` y quedaban sin nombrar S2, S3, R1 y P1 — aprobada (opción «Apruebo la enmienda»)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-02 | aprobada (opción «Apruebo») |
