---
id: 20261125-181246-feature-0366-dry-run-runs-mold
feature: 0366
title: Walkthrough — El ensayo en seco de una batería ejecuta lo que el molde deja
spec: ./spec.md
status: done
created: 2026-11-25
---

# Walkthrough — El ensayo en seco de una batería ejecuta lo que el molde deja

## 1. Cambios realizados

- **Ensayo en seco** (`tests/headless/lib.mjs`, `0eb77487f`). Antes del stream falso y con `DRY_RUN=1`, el sujeto evalúa dos cosas: las filas `mold:` de su escenario y los comandos que el molde declara con `s.leave(command, { code, output })`.
  - Los comandos corren por la shell del sistema, con un tope de 60 s, en el orden declarado.
  - Un fallo deja `<etiqueta>.mold.txt` en `OUT` y el sujeto sale sin escribir su stream.
  - El sujeto borra un `.mold.txt` que haya quedado de un ensayo anterior.
- **Veredicto y rúbrica** (`tests/headless/battery.mjs`).
  - Un `.mold.txt` deja el escenario `rojo`, con la nota `molde roto en <etiqueta>: …`.
  - `mold: <fichero> /<regex>/` es una comprobación de máquina más: se compila al leer la rúbrica y no se aplica a las salidas del sujeto.
  - `moldChecks` la expone al sujeto, que la carga con un `import()` dinámico para no cerrar el ciclo `battery → campaign → lib`.
- **Moldes** (`tests/batteries/sdd-archive/subject.mjs`). Declaran lo que dejan las cuatro filas del smoke de `validated0010` (el caso de la 0305) y las dos formas de `medir-libres.mjs` del spike (el caso de la 0365).
- **Rúbrica de `sdd-validate`** (`tests/batteries/sdd-validate/battery.md`). Gana VF11 (`vf2`, `vf3`, `vf10`: el walkthrough de la 0010) y VF12 (`vf8`: `patch.md` de la 0008), que fallan si el molde ya trae `Validación en campo:`. Es el caso de la 0362.
- **Tests**:
  - `cli/test/kit/headless/mold-commands.test.ts`: una batería de juguete con sujetos reales en seco, siete escenarios. Corre en `test-headless` (`cli/vitest.config.ts`).
  - `battery.test.ts`: cinco unitarios de `mold:`.
- **Guía** (`.docs/sdd/steering/operations.md`). La pregunta (8) de la comprobación previa nombra `s.leave`, `mold:` y la nota `molde roto`. La (7) se acorta para que el fichero quede en su tope (20.785 palabras).
- Apertura: `0822972bb`.
- Arreglo tras el cierre: `5fc254790`, el tope de `s.leave` mata el grupo de procesos fuera de Windows (§3).

## 2. Tiempo y coste: estimado vs real *(OBLIGATORIO si existe `.docs/sdd/steering/estimation.md` — no borrar)*

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3 h
- Esfuerzo real: 0,76 h — reloj de la sesión 0,86 h desde 2026-11-25T18:07Z, sin 6 min de espera al dev-lead (3 esperas)
- Desviación: −2,24 h (−75 %)
- Causa de la desviación: las esperas y huecos (18:10Z 2 min; 18:21Z 3 min; 18:34Z 2 min) no la explican; la estimación contaba arreglar moldes rotos al declararlos (el «Entra, si el ensayo lo exhibe» con tope de 1 h) y ninguno salió roto
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 42.004.915 — claude-opus-5-5 42.004.915
- Tokens de subagentes: 3.952.009 en 6 despachos — Segunda ronda review spec 0366 claude-sonnet-5-5 202.185 / 1 min; Re-revisión de la pasada de fix 0366 claude-opus-5-5 982.592 / 2 min; Final review — Code axis claude-sonnet-5-5 584.812 / 1 min; Revisión de la enmienda 0366 claude-sonnet-5-5 365.662 / 1 min; Final review — Spec axis claude-opus-5-5 1.619.466 / 3 min; Review adversarial spec 0366 claude-sonnet-5-5 197.292 / 1 min
- Coste de la sesión: 17,47 $ (hilo 14,22 $ + subagentes 3,24 $)
- Coste de sujetos: no aplica (solo ensayos en seco, 0 $)
- Review de spec: 1 revisor (técnica, lite) y segunda ronda por dos críticos aceptados · hallazgos 20, aceptados 15; más la revisión de la enmienda, 8 hallazgos, aceptados 4

## 3. Desviaciones del plan

- Enmienda 2026-11-25, aprobada por el dev-lead («1»): una fila `mold:` sobre un fichero que no existe no falla. En `vf2`, `vf3` y `vf10` el walkthrough de la 0010 no existe en el molde (`RECORD` es falso fuera de `sdd-archive`), y con la regla aprobada esas filas darían `molde roto` siempre. La ruta mal escrita la caza el RED de cada fila nueva.

### Decisiones tomadas sin el dev-lead

- Los unitarios de `mold:` se escribieron tras el GREEN del test integrado. El caso nuevo (una regex de `mold:` que no compila) dio RED y se arregló; los demás ya pasaban con el código del integrado. — Coste si está mal: un caso de rechazo sin RED visto.
- El escenario `ausente` de `mold-commands.test.ts` cambia frente a la copia RED, por la enmienda (`git diff --no-index`: solo ese `it`). — Coste si está mal: una ruta mal escrita pasa hasta su RED.
- `RUNS_DIR` de los ensayos en `.temp/d66` del worktree: el lanzador rechaza un `RUNS_DIR` de más de 100 caracteres, y el del scratchpad tiene 140. — Coste si está mal: ninguno, `.temp/` está ignorado.
- `row` de `validated0010` declara solo `output`, porque la app sale con 0 al rechazar un motivo (medido en el molde de `g5`). — Coste si está mal: un cambio de código en una fila de error no se vería por el código, sí por la salida.
- En un ensayo en seco de una batería real todos los escenarios salen `rojo`, porque el stream falso no carga la skill. Lo que se lee es la nota `molde roto en …`, y así lo dice la pregunta (8). — Coste si está mal: ninguno en código.
- El paréntesis de evidencia de la pregunta (7) se acorta para que `operations.md` quede en su tope. — Coste si está mal: se pierde el detalle «Final review: … Ready» de la task 0057, que sigue en su evidencia.
- Pasada de fix (el commit de cierre): `runShell` pasa de `spawnSync` (lo que decía la decisión 6) a `spawn` asíncrono, y mata el árbol al tope. Medido: el tope de `spawnSync` mataba `cmd.exe` y dejaba vivo el `node` que lanzó. — Coste si está mal: ninguno en los THEN.
- `MOLD_TIMEOUT_SECONDS` (60 por omisión) ajusta el tope, para que el test del tope no tarde 60 s. — Coste si está mal: una variable más en la cabecera de `lib.mjs`.
- Un comando que no arranca da `molde roto: «<comando>» no arrancó: <error>`, un literal que no estaba en la decisión 7. — Coste si está mal: ninguno, es un caso más.
- `moldChecks` se queda en `battery.mjs`, que es quien lee la rúbrica, y no pasa a un módulo común. — Coste si está mal: un ciclo de imports que hay que mantener dinámico.
- El ruling «fuera de Windows el tope mata solo `sh`, y `sh` lanza un `node` simple con `exec`» resultó falso: el CI de la rama se colgó 37 min en `suite` (run 45688320658, cancelado). Con dash, matar `sh` deja vivo el `node` con las tuberías abiertas, y `close` no llega. Reproducido en Docker (`node:22-bookworm-slim`, `/bin/sh` → dash): «RED: runShell no volvió en 10 s». Arreglo en una task más tras el cierre: el comando va en su propio grupo de procesos (`detached`) y al tope se mata el grupo (`process.kill(-pid)`). GREEN: «volvió en 2 s · timedOut true · nieto vivo false» (con `--init`, que recoge los huérfanos como el runner). El test integrado lleva además un tope de 100 s, para fallar en vez de colgar la tanda.
- `stdout += chunk` puede partir un carácter UTF-8 entre dos trozos. Las salidas declaradas son de una línea. — Coste si está mal: un `molde roto` falso y visible; el arreglo es `setEncoding('utf8')`.
- «(0147 a 0365)» en la pregunta (8) se lee como un rango: la lista entera pasa del tope de palabras. — Coste si está mal: la trazabilidad de `operations.md` queda más corta.
- Minor de la revisión de `5fc254790`, sin otro commit: con `detached`, un Ctrl-C o la cancelación del padre ya no llegan al grupo de un comando colgado; si salta el tope de 100 s del test integrado, el fallo dice «expected null to be 1» sin el ETIMEDOUT; `killShellTree` repite el try/catch de `killProcess`; un proceso en segundo plano que cerró sus tuberías no se mata sin tope; `isAlive` necesita un init que recoja huérfanos. — Coste si está mal: un huérfano tras cancelar una tanda, o un fallo de test menos legible.

## 4. Verificación

### 4.1 Builds

- Línea base (worktree desacoplado en `0822972bb`): `moon run kit:test-headless cli:typecheck cli:test` → kit:test-headless: corrió 801/801 · cli:typecheck: corrió · cli:test: corrió · 5 min 8 s.
- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 811/811 · cli:typecheck: corrió (`tsc --noEmit`, 0 errores) · cli:test: corrió 2595/2595 (15 omitidos) · 125 s · sobre `0eb77487f`.
- Gate tras la pasada de fix: `moon run kit:test-headless cli:typecheck cli:test --affected --base 0eb77487f` → tras la revisión final en `0eb77487f`, arreglo el commit de cierre: kit:test-headless: corrió 813/813 · cli:typecheck: corrió · cli:test: corrió 2596/2596 (15 omitidos) · 182 s · sobre el commit de cierre.
- Tras el cierre: merge de sincronización `82b72baf2` con `origin/develop`, gate `moon run kit:test-headless cli:typecheck cli:test --affected --base origin/develop` → kit:test-headless: corrió 813/813 · cli:typecheck: corrió · cli:test: corrió 2598/2598 (15 omitidos) · 170 s. El arreglo de POSIX `5fc254790` lo revisó un eje Código (sdd-kit:effort-high + sonnet, «Ready to merge: Yes», 6 Minor resueltos con ruling) y el CI de la rama (`ci.yml`, Linux) salió `success` sobre él.
- Ensayos en seco de batería entera sobre el commit de cierre (`DRY_RUN=1 N=1 node tests/headless/battery.mjs run`): `sdd-archive`, 49 escenarios, ninguno con `molde roto`, 82 s; `sdd-validate`, 21 escenarios, ninguno con `molde roto`, 33 s. Todos salen `rojo` (código 1) porque el stream falso no carga la skill: en seco se lee la nota `molde roto`.
- Medida de la decisión 4, en el molde de `g5` (`KEEP_MOLD=1`): `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → 0 · «cancelada Norte lun (sala ocupada)»; `--motivo "por si acaso"` → 0 · «motivo no válido: cambio de planes, sala ocupada, otro»; sin motivo → 0 · el mismo texto.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-25 · gate 813/813 headless y 2596 cli:test sobre el commit de cierre · smoke 10/10 THEN (5 con ejecución real) · ensayos en seco de `sdd-archive` (49) y `sdd-validate` (21) sin `molde roto` · tres RED con la señal plantada · revisión final Spec opus+high y Código sonnet+high sobre `0eb77487f`, pasada de fix el commit de cierre y re-revisión opus limpia (4 Minor resueltos con ruling)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Un comando declarado que sale con error da código ≠ 0, nombra el escenario y no escribe el stream de su sujeto | suite · ejecución real | juguete: `roto · 0/1 · umbral 1/1 · rojo · … molde roto en roto-1: molde roto: «node -e "process.exit(2)"» salió con 2 (esperado 0)`, código 1, sin `roto-1.jsonl`; real (motivo roto en `validated0010`): `g5 · 0/1 · umbral 1/1 · rojo · sin tools.txt: g5-1 · molde roto en g5-1: molde roto: «node src/app.js cancelar Norte lun --motivo sala-ocupada» no contiene «cancelada Norte lun (sala ocupada)»` |
| Un comando con el código y la salida que declara pasa, y se ejecutó | suite · ejecución real | juguete: `codigo · 1/1 · umbral 1/1 · verde` y `ran.txt` en el molde; real: los seis `s.leave` de `sdd-archive` sin `molde roto` en los 49 escenarios |
| Una salida que no contiene el texto declarado da `molde roto` | suite · ejecución real | juguete: `… no contiene «hola»`; real: el RED de `g5` de la primera fila |
| Una fila `mold:` que casa con el molde da `molde roto` con su fila | suite · ejecución real | `vf10 · … molde roto: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md casa /^Validación en campo:/ (fila VF11)`; `vf8 · … molde roto: .docs/sdd/specs/20261010-090000-patch-0008-cancel-missing/patch.md casa /^Validación en campo:/ (fila VF12)` |
| Una fila `mold:` sobre un fichero que no existe deja pasar el escenario | suite · ejecución real | juguete: `ausente · 1/1 · umbral 1/1 · verde`; real: `vf2`, `vf3` y `vf10` sin walkthrough, sin `molde roto` |
| Una fila `mold:` que no casa deja pasar el escenario | suite | `nocasa · 1/1 · umbral 1/1 · verde` |
| Un `.mold.txt` de un ensayo anterior no da rojo | suite | `codigo · 1/1 · umbral 1/1 · verde` con `codigo-1.mold.txt` plantado |
| Un comando que no termina da `molde roto` al tope y no deja vivo su proceso | suite | `… «node -e "…setInterval(()=>{},1e3)"» no terminó en 5 s` (`MOLD_TIMEOUT_SECONDS=5`), y el PID de `hang.pid` ya no vive |
| Una fila `mold:` mal escrita da `comprobación mal escrita`, sin lanzar sujetos | suite | `K6: comprobación mal escrita` en `verdict` y en `runBattery`, con `launched` vacío |
| `mold:` no se aplica a lo que guarda el sujeto | suite | `k1 · 2/2 · umbral 2/2 · verde` con la señal en lo guardado |

### 4.3 Residuales / deuda generada

- Ninguno. El cuelgue del tope fuera de Windows, que era el residual, se arregló en la task posterior al cierre (§3).

## 5. Aprendizajes

- En un ensayo en seco de una batería real todos los escenarios salen `rojo` (el stream falso no carga la skill): lo que se lee es la nota `molde roto en …` → `operations.md`, pregunta (8) de la comprobación previa.
- En Windows, `spawnSync(…, { shell: true, timeout })` mata `cmd.exe` al tope y deja vivo el proceso que lanzó (medido: `ETIMEDOUT` a los 3 s, el nieto vivo) → el comentario de `runShell` en `tests/headless/lib.mjs`, que es donde se decide; `operations.md` está en su tope de palabras y ninguna pieza suya vive ya en otro sitio.
- Un ensayo de batería entera no cabe con el `RUNS_DIR` del scratchpad de la sesión (140 caracteres, máximo 100): va en `.temp/<corto>` del worktree → ya lo dice el error del lanzador, sin destino nuevo.

Retro: documento o skill desmentido → ticket del kit: el encargo del revisor de spec (`reviewer-brief.md` de `sdd-spec-review`) le prohíbe leer código, y su hallazgo crítico aceptado («una fila `mold:` sobre un fichero ausente falla») lo desmintió el molde real (`RECORD` falso fuera de `sdd-archive`): parada del dev-lead, enmienda y otra revisión

## 6. Adendas
