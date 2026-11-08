---
id: 20261108-122008-feature-0297-verify-removed-by-requirement
feature: 0297
title: Walkthrough — El eje Spec busca un REMOVED por lo que dice su requisito vigente
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-08
---

# Walkthrough — El eje Spec busca un REMOVED por lo que dice su requisito vigente

## 1. Cambios realizados

- **RED de las reglas de OpenSpec v1.16.1** (`08d5eb29`): escenarios `rm1`, `rm2` y `rm3` en la batería de `sdd-verify`, sobre la 0025 de juguete («Quitar el aviso por correo al anular»), con `REMOVED — Avisar por correo` y una rama que deja `outbox.push` sin «correo» ni «mail» en el código. RM1 2/2 y RM3 2/2 pasan con el texto de `develop`: el encargo del eje Spec ya lista las capacidades, y el revisor lee el requisito vigente, o su historial, por su cuenta. Parada por desvío (decisión 4 de la spec).
- **`upstream.json` al día** (`aec923e1`): OpenSpec deja la entrada `copy` con `pending: "0297"` y pasa a `from` de la copia de `spec-reviewer-prompt.md`, en `v1.16.1`; impeccable sube a `skill-v4.8.1`. `kit:copies` da «Copias al día: 31 ficheros.» y `kit:upstream` ya no da rojo en OpenSpec ni en impeccable. `THIRD_PARTY_NOTICES.md` y el `NOTICE` de `sdd-verify`, regenerados.
- **La regla 3 medida con `rm2b`** (`13888288`): el vigente sin cuerpo y una rama que no toca `src/`. RM2b 2/2 pasan: la regla 3 no entra. La viñeta del `REMOVED` de `spec-reviewer-prompt.md` no cambia; `rm1`, `rm2`, `rm2b` y `rm3` quedan como regresión, con su fila de procedencia.
- **Capacidad `verification`**: dos requisitos nuevos, «El eje Spec busca un REMOVED por lo que dice su requisito vigente» y «El eje Spec recupera del historial un requisito vigente que ya no está», conducta medida con el texto de hoy.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2 h
- Esfuerzo real: 1,20 h — reloj de la sesión 5,69 h desde 2026-11-08T12:10Z, sin 270 min de espera al dev-lead (7 esperas)
- Desviación: -0,80 h (-40 %)
- Causa de la desviación: Esperas y huecos: 12:25Z 2 min; 12:33Z 42 min; 13:31Z 14 min; 13:52Z 35 min; 14:49Z 74 min; 16:03Z 3 min; 16:09Z 101 min. Parte de esas esperas fueron tandas de la batería en segundo plano, no el dev-lead: cuánto, sin medir; el esfuerzo real se queda corto en esa parte.
- Compactación: sí, tras la re-revisión, en el cierre → Native, sin tasks pendientes
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 83.297.434 — claude-opus-5-5 83.297.434
- Tokens de subagentes: 3.102.115 en 7 despachos — Re-revisión única 0297 claude-opus-5-5 404.133 / 1 min; Revisor de spec, lente dominio claude-opus-5-5 213.600 / 1 min; Final review — Spec axis claude-opus-5-5 1.307.332 / 3 min; Final review — Code axis claude-sonnet-5-5 704.046 / 1 min; Revisor de spec — técnica claude-sonnet-5-5 126.911 / 1 min; Revisor de spec, lente técnica claude-sonnet-5-5 127.691 / 1 min; Revisor de spec — dominio claude-sonnet-5-5 218.402 / 2 min
- Coste de la sesión: 30,74 $ (hilo 27,12 $ + subagentes 3,62 $)
- Coste de sujetos: 3,35 $ en 10 sujetos opus — RED 2,18 $; `rm2b` 0,63 $; re-medición de `rm2b` en la pasada de fix 0,54 $
- Review de spec: 2 revisores · hallazgos 18, aceptados 16 (2 en parte); review de la enmienda del THEN, 2 revisores (dominio opus, técnica sonnet) · hallazgos 14, aceptados 13

## 3. Desviaciones del plan

- **Enmienda del 2026-11-08** (aprobada: «1»): el RED de la regla 1 salió limpio, así que la viñeta no cambia por las reglas 1 y 2; la Task 2 se queda en `upstream.json` y la regla 3 pasa a una Task 3 con un molde nuevo, `rm2b`, porque el de `rm2` delataba el aviso en el diff.
- **Enmienda de la Task 3** (aprobada: «1», aplicaba literal la anterior): con `rm2b` limpio, salen del delta el ADDED del «no verificado» y el `MODIFIED` de «El eje Spec contrasta el diff…».
- **Enmienda del THEN del ADDED 2** (aprobada: «1», tras una review con dominio en opus y técnica en sonnet que pidió el dev-lead): el THEN deja de nombrar `git log -p` y dice qué versión del historial vale, la última antes del commit que lo quitó (en el commit de cierre).
- ✋ sin revisar por los ejes: la parte del commit de cierre posterior a la re-revisión — la enmienda del THEN, las notas de lo que sustituyeron las enmiendas en la spec, el plan con tres tasks y los rulings en `tasks.md`; solo documentación, revisada por la review de la enmienda.

### Decisiones tomadas sin el dev-lead

- La fila RM3h iba al revés (`presente` = «falla si está») y su regex no casaba `git show <sha> -- .docs/sdd/capabilities/` — pasa a `ausente` con `capabilities\/` y se vuelve a dar el veredicto sobre las mismas salidas — si es errónea, RM3 mide de más y el RED de la regla 2 sería falso limpio (los dos informes, leídos a mano, sí recuperan el vigente)
- `npx vitest` da MODULE_NOT_FOUND desde `cli/` en este worktree; la verificación corre con `pnpm exec vitest`, el mismo binario de `node_modules` — si es errónea, ninguno: mismo vitest
- `rm2b` sin fixtures nuevos: la base es `app-rm.js` y la rama solo toca el test — menos código y el diff no delata nada, que es el caso de la fuente — si es errónea, un revisor puede tomar «la rama no toca `src/`» como pista que el caso de campo no da
- Código, declinado: `subject.mjs:193` cita «requisito vigente» — falso positivo: término del escenario de juguete — si es errónea, un comentario que envejece
- Código, declinado: `sdd-verify` sin cambios, regla 3, `dist/` y `NOTICE`, coste — son del eje Spec, del build o del proceso, ya cubiertos — ninguno
- Spec, declinado: `f3` sin correr — la viñeta no cambió — si es errónea, ninguno
- Spec, declinado: las dos cláusulas no escritas y `rm2b` sin plan — no hay texto que verificar; el límite va en la evidencia y en 4.3 — si es errónea, el caso sin plan queda sin medir
- Spec, declinado: `from` OpenSpec v1.16.1 sin traer texto — es la última versión revisada, como impeccable — si es errónea, `kit:upstream` callaría un cambio no leído, y se leyó entero
- Spec Minor 3: `molds.test.ts` no monta `rm*` — construye un caso por molde distinto y `rm*` comparten `reservas` con `f1`; el seco de `rm1`-`rm3` y `rm2b` corrió en esta sesión — si es errónea, una rotura de `reviewRemoved` sale en la próxima tanda, antes de gastar (`DRY_RUN`)
- Código Minor 4: `reviewBase` acumula ramas por escenario — legible hoy (`baseApp` aparte, 3 ramas); se parte con la próxima familia — si es errónea, más condiciones en una función
- Código Minor 5: OpenSpec como copia (`from`) y no concepto — el texto del eje Spec está adaptado de `verify-change.ts` y su MIT pide el aviso en el `NOTICE`, que solo sale de las copias — si es errónea, una fila de aviso de más

## 4. Verificación

### 4.1 Builds

- `moon run kit:build`, `kit:notices` (sin cambios tras regenerar), `node tests/copies/check.ts` → «Copias al día: 31 ficheros.», `moon run kit:upstream` → solo las entradas de 0313 y 0314, `kit:own` → 26 líneas, sin cambios, `kit:skill-size` → solo la FALLA previa de `sdd-roadmap`; `pnpm exec vitest run` de notices, dist y copies → Test Files 3 passed (3), Tests 85 passed (85); `kit:test-headless` 448 en verde; pre-commit `cli:test` del commit de la enmienda, juntado en el cierre → Test Files 85 passed (85), Tests 2305 passed, 13 skipped.
- Gate: corre una vez tras `sdd merge --sync`, porque hay tres ramas abiertas a la vez (0308, 0309, 0310); su línea y su sha van en el mensaje final del cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-08 · smoke 2/2 THEN con ejecución real (batería de `sdd-verify`: `rm1` 2/2 y `rm3` 2/2 con RM3h; regresión `rm2` 2/2 y `rm2b` 2/2, también con el commit neutro) · copias, fuentes y avisos como dice 4.1 · revisión final Spec y Código sobre `13888288`, pasada de fix y re-revisión limpia, juntadas en el cierre · gate tras la sync, en el mensaje final

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| ADDED 1: marca Critical `contradicts` «REMOVED sigue implementado: Avisar por correo» con la línea del `outbox.push` | ejecución real: `rm1`, 2 sujetos opus con el encargo del eje Spec (kit `d2532ea`, viñeta sin cambiar desde entonces), `red/out/` | 2/2: los dos leen `capabilities/bookings.md` y marcan el Critical en `src/app.js:18` |
| ADDED 2: lee del historial la última versión del vigente y marca el mismo Critical en `src/app.js` | ejecución real: `rm3`, 2 sujetos opus, `red/out/`; RM3h sobre `tools.txt` | 2/2: `git show <sha> -- .docs/sdd/capabilities/…` recupera el escenario del commit que lo quitó, y los dos marcan el Critical |

### 4.3 Residuales / deuda generada

- El caso de un vigente sin cuerpo y sin plan que nombre el fichero sin tocar queda sin medir: en `rm2b`, un sujeto usó «el plan nombra `src/app.js` y la rama no lo toca» como pista.

## 5. Aprendizajes

- En la columna «Falla si…» de una rúbrica, `` `tools: /…/` presente `` quiere decir «falla si está»: una conducta buena se escribe con `ausente`. La fila RM3h salió al revés en el RED y dio un rojo falso. → ticket del kit.
- `COST_CAP` cuenta toda la campaña del `SPEC_DIR`, no la tanda: la segunda tanda (`PHASE=red2`) con `COST_CAP=2` no lanzó ningún sujeto, porque la campaña ya llevaba 2,18 $. Ya lo dice `tech-stack.md` para `SUBJECT_CAP` y el techo común; se repitió → ticket del kit.
- Retro: error que cazaría un chequeo → ticket del kit: una fila de máquina `tools: /…/ presente` que nombra una conducta buena («Lee el historial») falla justo cuando el sujeto la cumple, y `battery.mjs` no avisa de esa fila al revés (RM3h, rojo falso en el RED)
- Retro: error que cazaría un chequeo → ticket del kit: con `COST_CAP` por debajo de lo ya gastado en el `SPEC_DIR`, la tanda `PHASE=red2` terminó sin lanzar ningún sujeto, y lo dice `tech-stack.md`; un aviso del lanzador antes de la tanda, con lo que lleva gastado la campaña, lo habría cazado
- Una regla de la fuente cuyo RED sale limpio no se trae, y la fuente se apunta como revisada en `from` con su versión: la vigilancia de `kit:upstream` sigue, sin texto nuevo (Art. I frente a Art. IX). → esta spec y `tests/sdd-verify-0297-removed.md`.
