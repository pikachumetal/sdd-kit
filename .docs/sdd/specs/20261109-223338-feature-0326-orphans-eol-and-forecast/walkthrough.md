---
id: 20261109-223338-feature-0326-orphans-eol-and-forecast
feature: 0326
title: Walkthrough — El lanzador no se cuelga por un huérfano, kit:copies mira el índice y «Previsto» se mide
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-10
---

# Walkthrough — El lanzador no se cuelga por un huérfano, `kit:copies` mira el índice y «Previsto» se mide

## 1. Cambios realizados

- **Lanzador** (Task 1, `c103ac3a`; pasada de fix en el commit de cierre): `launch` de `tests/headless/real-deps.mjs` da al sujeto pipes propios para la salida y el error, los reenvía y, al salir el sujeto, espera su `close` con 5 s de gracia (`closedAfterDrain`). Un nieto vivo ya no retiene la salida de la tanda. Tests: `cli/test/kit/headless/launch.slow.test.ts` (la tanda cierra en menos de 15 s con un nieto vivo; la cola de 64 KB llega entera).
- **`kit:copies`** (Task 2, `35d87e23`; pasada de fix): `indexEols` (`tests/copies/check.ts`) pregunta a git con una llamada `git --literal-pathspecs ls-files --eol -z --`; `eolVerdict` (`tests/copies/annotated.ts`) decide con el índice si hay aviso de CRLF y con el disco qué texto se compara. Tests: `copies.test.ts` (`eolVerdict`) y `copies-eol.slow.test.ts` (`i/lf`, `i/crlf`, `i/mixed`, ruta con espacios y acentos, sin seguir, fuera de un repo y `kit:copies` de punta a punta).
- **Plantilla de spec** (Task 3, `10e98cb1`): la celda «Tope propuesto» pide lo previsto con el comando y su cifra (`<comando> → <n>`), o `sin medir` y la fila al ✋; `sdd-templates` queda en 16.978 palabras, como `develop`. Escenario nuevo `co2p` en la batería de `sdd-propose`, con tres filas de rúbrica.
- **Aviso del tope** (Task 4, `13e3646f`): `[<id>] colgado: tope de <N> s, sujeto cortado` en `tests/headless/lib.mjs`.
- **Docs**: deltas de `kit-distribution` y `feature-flow` fusionados; `tech-stack.md` corrige lo que guarda `tools.txt` (retro).

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2h
- Esfuerzo real: 3,3h, aproximado con las marcas de los commits (de la apertura, 11:28, al cierre, 14:45); `sdd session tokens` da «no medido (sin respuestas de feature/0326-orphans-eol-and-forecast en los transcripts)»: la sesión trabajó desde el checkout de `develop`
- Desviación: +1,3h (+65 %)
- Causa de la desviación: sin medir con `Esperas y huecos`; la Task 3 corrió seis tandas de sujetos (~10-15 min de espera cada una) y dos enmiendas de la spec
- Compactación: sí, en la Task 3 → Native (quedaban la Task 3 y la revisión)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: no medido (sin respuestas de la rama en los transcripts)
- Tokens de subagentes: no medido (sin respuestas de la rama en los transcripts); despachos: revisión de la enmienda (opus), ejes Spec (opus) y Código (sonnet), re-revisión (opus)
- Coste de la sesión: no medido (sin respuestas de la rama en los transcripts)
- Coste de sujetos: 5,66 $ en 12 sujetos sonnet — `co2` RED 1,16 $, green 0,37 $, green2 0,75 $, green3 1,12 $; `co2p` RED 1,19 $, GREEN 1,07 $
- Review de spec: 2 revisores · hallazgos 19, aceptados 19 (uno en parte)

## 3. Desviaciones del plan

- **La Task 3 cambió de escenario** (enmienda del 2026-11-10, «1»): con `co2` la celda sola y la frase de ayuda salieron 0/2, 0/2 y 1/2; la revisión Opus de la enmienda vio que `co2` (+2 palabras) se acierta a ojo y que su rúbrica medía la etiqueta. Pasó a `co2p`, con un párrafo de 42 palabras, y la celda pide el comando.
- **El tope de `sdd-templates` no sube**: la subida a 17.010 de la primera enmienda quedó sin efecto; dos frases de ayuda pasan a su forma corta.
- **Task 4 nueva** (enmienda, «1»): el literal `colgado` salda la fila del lanzador.
- **Sin medición de `co2p` tras la revisión final** (enmienda, «1»): la pasada de fix no tocó la plantilla ni la batería.

### Decisiones tomadas sin el dev-lead

- Task 3: el molde `reservas-tope-carpeta` no cambia; `co2p` usa el mismo — coste si está mal: ninguno, el RED salió rojo con él.
- Task 3: la tanda `green` de `co2` no mide (los dos sujetos pararon en la pregunta de carril); relanzada como `green2` — 1,2 $ más si me equivoco.
- Revisión final: la cola de un sujeto puede perderse si quien lee la tanda tarda más de 5 s — la tanda va a un fichero o a `sdd watch command`, que leen al momento — coste si está mal: las últimas líneas de un sujeto.
- Revisión final: el sujeto ya no ve un TTY — decisión 4, ningún `isTTY` en el lanzador — coste si está mal: salida sin color.
- Revisión final: todas las rutas en una línea de órdenes — 31 copias, ~2 KB frente a ~32 KB — coste si está mal: con cientos de copias git falla y decide el disco, el aviso de hoy.
- Revisión final: la celda no repite que con `sin medir` el tope es «sin cambio» — lo dicen la celda («· sin cambio») y la decisión 9; el saldo está a 0 — coste si está mal: un `sin medir` con tope propuesto, que el ✋ enseña.
- Revisión final: `co2p` no recorre `sin medir` — un escenario más costaba ~2,4 $; va al ticket — coste si está mal: el caso de la 0311 (texto aún sin escribir) sin medir.
- Revisión final: un `\r` suelto con `i/lf` da «no es su original» y no el aviso de CRLF — no se da en la práctica — coste si está mal: un aviso menos claro.
- Revisión final: falsos verdes o rojos de las filas de máquina `CO2P-M` y `CO2P-C` — los corrige `CO2P`, que se juzga leyendo.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 471/471 · cli:typecheck: corrió · cli:test: corrió 2388/2388 (12 skipped) · 123 s · configuración: la del gate · sobre el commit de cierre (verificado por el agente)
- Lentos de la rama: `vitest run test/kit/headless/launch.slow.test.ts test/kit/copies-eol.slow.test.ts --test-timeout 120000` → 11/11
- `moon run kit:copies kit:own kit:skill-size` → «Copias al día: 31 ficheros.», «Skills al día: 127 ficheros.»; `word-budget.test.ts` 77/77 con `sdd-templates` a 16.978
- RED de la Task 1: con el `real-deps.mjs` de `a46ceef3`, «la tanda termina con un nieto que hereda la salida» falla a los 60,36 s (1 failed)
- Tandas: `co2p` RED (kit de `develop`) 0/2, GREEN 2/2

### 4.2 Smoke / tests

- Validación en campo: 2026-11-10 · gate 471/471 y 2388/2388 · lentos 11/11 · RED de la Task 1 reproducido · `co2p` RED 0/2 → GREEN 2/2 · revisión final Spec (opus) y Código (sonnet), re-revisión limpia (opus)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `kit-distribution`: índice `i/crlf` o `i/mixed` → aviso de CRLF, con el disco en CRLF o en LF | suite: `reports a copy with CRLF in the index and LF on disk`, `reads crlf…`, `reads mixed…` | ✅ |
| AND copia `i/lf w/crlf` igual a su original → `Copias al día` | suite: `passes a copy with CRLF only on disk` | ✅ |
| AND copia sin seguir con `\r\n` → aviso | suite: `still reports a copy git does not track with CRLF` | ✅ |
| AND fuera de un repo con `\r\n` → aviso | suite: `gives an empty map outside a repo` + `eolVerdict(undefined, crlf)` | ✅ |
| AND no `.md` que difiere en LF; `.gitattributes` | sin cambios: `copies.test.ts` | ✅ |
| `feature-flow`: lo previsto lleva el comando y su cifra, o `sin medir` | ejecución real: `co2p` GREEN 2/2 («`wc -w` del párrafo → 42», 114) | ✅ (`sin medir`: no probado) |
| La tanda termina con un nieto vivo, sin perder la cola | suite: `launch.slow.test.ts` | ✅ |
| Aviso `[<id>] colgado: tope de <N> s, sujeto cortado` | suite: `lib.test.ts` | ✅ |

### 4.3 Residuales / deuda generada

- `co2p` no prueba `sin medir` (un texto aún sin escribir, el caso de la 0311): va al ticket; fila solo con un segundo caso.

## 5. Aprendizajes

- Una regla de plantilla se mide por lo que el agente hace, no por la etiqueta que escribe: con `co2` la etiqueta «borrador» salió 1/2 sin que nadie contara; pedir el comando, como la «Previsión de coste», salió 2/2 → procedencia de `co2p` en `tests/batteries/sdd-propose/battery.md`
- En Windows, un nieto lanzado sin `detached` muere con su padre (job object de libuv): el test del huérfano lo lanza desacoplado → comentario de `LEAVES_GRANDCHILD` en `launch.slow.test.ts`

Retro: documento o skill desmentido → corregido en el documento (`.docs/sdd/tech-stack.md`, «Las conductas se cuentan sobre el `.jsonl`»: `tools.txt` lleva el comando entero, sin su salida)

## 6. Adendas
