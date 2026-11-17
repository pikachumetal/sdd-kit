---
id: 20261101-191641-feature-0277-sdd-retro
feature: 0277
title: Walkthrough — sdd-retro, señales del cierre y repaso por causa de cada release
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — sdd-retro, señales del cierre y repaso por causa de cada release

## 1. Cambios realizados

- **CLI**: `sdd roadmap causes` (`cli/src/roadmap/causes.ts`, verbo en `verbs.ts`, `debtPath` en `debt.ts`). Task 1, `67125a3`.
- **Cierre**: la skill `sdd-retro`, pasada `cierre`; `sdd-archive` deja la revisión de skills y gana la salida de un destino en su tope; el hueco `Retro:` en §5 de `walkthrough-template.md`. Task 2, `c1b53c6`.
- **Corte**: la pasada `release` y el paso 5 de `sdd-end-release`; nace `retro-template.md`; salen `feedback-template.md` y `references/retro.md`; `sdd-roadmap` lee las propuestas; README, `mission.md`, `architecture.md`, `CLAUDE.md` y las tres guías de `.docs/workflow/`. Task 3, `686ba9f`.
- **Baterías**: `tests/batteries/sdd-retro/` nueva, `c1` en `sdd-archive` y `m7` en `sdd-roadmap`. Evidencia: `tests/sdd-retro-red.md` y `tests/sdd-retro-green.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3 h
- Esfuerzo real: 1,69 h — reloj de la sesión 2,02 h desde 2026-11-01T19:12Z, sin 20 min de espera al dev-lead (2 esperas)
- Desviación: −1,31 h (−44 %)
- Causa de la desviación: como en la 0276, los sujetos costaron minutos, no las horas que preveía la campaña, y el verbo era un módulo pequeño sobre `tables.ts` y `debt.ts`.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort por defecto de la sesión, en todas las fases
- Tokens del hilo: 35.603.855 — claude-opus-5-5 35.603.855
- Tokens de subagentes: 4.587.104 en 6 despachos
- Coste de la sesión: 20,63 $ (hilo 14,37 $ + subagentes 6,26 $)
- Coste de sujetos: ~8,5 $ en ~55 sujetos Sonnet, contando por las líneas de la campaña — RED 1,96 $; GREEN y controles 5,91 $; contraste de `rc2` 0,43 $; las dos últimas medidas, sin sumar con precisión porque el contador es por carpeta. Previsión: 13,8 $
- Review de spec: 2 revisores · hallazgos 20, aceptados 18 y 1 en parte

## 3. Desviaciones del plan

- `r5` y `r6` entran en la batería, y `r4` no se quedó en n = 2 una sola vez: tres mediciones tras la revisión final. Enmiendas de la spec.
- El plan decía que `rc1` cubría el corte sin carpeta; su molde sí tiene `debt.md`. Lo cubre `r6`, y la línea del plan está corregida.
- La regla de salida del tope va en `sdd-archive` y no en `sdd-retro`, como la decisión 13 dejó escrito.

### Decisiones tomadas sin el dev-lead

- Línea base: el pre-commit verde de la apertura, sin `kit:test-headless` — fuera del Scope — coste si mal: un rojo previo sale en el gate.
- `r5` añadido a la batería — el plan dejaba el peldaño de chequeo sin observar — coste si mal: 0,4 $.
- Las señales y los peldaños se quedan como receta de la línea `Retro:`, con RED limpio en el peldaño — lo que falla es el rastro, y las notas del molde telegrafían las señales; sin tabla de disciplina — coste si mal: ~90 palabras que se recortan.
- `c1` corre sobre un documento sin grasa y con un `operations.md` real — el molde holgado no reproducía el caso — coste si mal: ninguno.
- La base trae la 0279; la fila 0277 solo sale de contexto — se integra en el cierre — coste si mal: un conflicto al sincronizar.
- `rc2` rojo en `K6` también con el kit de la base — el `gh` falso no llega al sujeto; va al ticket — coste si mal: un control de CI sigue sin medir.
- Eje Arquitectura en Opus, no en Sonnet como decía mi línea de la spec — el Art. IV lo fija — coste si mal: céntimos.
- `--json` sin `previous` — la spec fija ese literal — coste si mal: un campo más después.
- Cabecera de dos líneas en `subject.mjs` — es la de todas las baterías — coste si mal: ninguno.
- Las puertas de «Propuestas» siguen en prosa, sin columna `Arrastrada` — cambiaría un literal aprobado — coste si mal: el agente compara versiones a mano; `r4` lo hace bien.
- **El arrastre cuenta los cortes de patch, y la caducidad de la deuda no** — la spec no distingue — coste si mal: `prioriza o descarta` antes de tiempo.
- **Editar un «Ítem», también con el prefijo `parcial`, reinicia su `Abierta desde`** — decisión 7, que no previó el prefijo — coste si mal: una fila parcial se escapa del arrastre.
- `sdd-retro` sigue siendo skill aunque `architecture.md` prefiere `references/` — la fila y la 0131 la nombran — coste si mal: una `description` más en cada sesión.
- Que el repaso corre tras caducar no se observa con un sujeto — el molde no caduca nada — coste si mal: bajo.
- `a1-2` usó una salida fuera de los peldaños (`→ deuda del roadmap`) — un caso; va al ticket — coste si mal: bajo.
- La oferta de la estimación no se observa: `r6` corre en `unattended`, sin propuesta que la lleve, y el texto del paso solo cambia de palabras — coste si mal: bajo.
- `sin revisar: la pasada tras la re-revisión` — «una línea por señal», `VERSION` compartido, ids `Tope1` y `Tope2`, `r6` sin versión dada y esta evidencia — los trajo la pasada de fix; `r1` a `r6` vueltos a medir, suite verde.

## 4. Verificación

### 4.1 Builds

- `npx vitest run test/roadmap test/kit` y `tsc --noEmit`: verdes en cada task y tras las dos pasadas de fix.
- La línea `Gate:` del cierre va en el mensaje final: corre sobre el merge de sincronización, porque la base va por delante.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · suite de `test/roadmap` y `test/kit` verde · smoke por THEN abajo · revisión final Spec, Código y Arquitectura sobre `686ba9f`, con fixes; re-revisión con hallazgos, arreglados, 1 sin revisar

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `project-retro`: señal, peldaño y línea | ejecución real | `r1` 2/2 en la última ronda: `Retro: corrección repetida → …`, `operations.md` corregido, sin skill |
| `project-retro`: chequeo primero | ejecución real | `r5` 2/2: test nuevo y su línea |
| `project-retro`: norma del revisor y skill | no probado | lectura; `r1` y `r5` no llegan a esos peldaños |
| `project-retro`: sin señales | ejecución real | `r2` 2/2: `Retro: sin señales`, ningún otro fichero |
| `project-retro`: señal del kit | ejecución real | `r3` 1/1: línea con lo desmentido, sin editar el kit |
| `project-retro`: repaso, propuestas y arrastre | ejecución real | `r4` 2/2 con el verbo real y `prioriza o descarta` |
| `project-retro`: `--planta 2` fuera, sin escribir deuda | ejecución real | `r4` 2/2 |
| `project-retro`: `unattended` sin preguntar, en el commit del corte | ejecución real | `r4` 2/2 |
| `project-retro`: `Sin propuestas`; sin repaso | ejecución real | `rc1-2`; `r6` 1/1 |
| `archive`: una feature pasa, un patch no | ejecución real | `a1` y `a2` 2/2 |
| `archive`: destino que no cabe | ejecución real | `c1` 2/2: sale la línea del puerto y hay commit |
| `archive`: `unattended` del destino | no probado | lectura |
| `release-flow`: sin carpeta | ejecución real | `r6` 1/1 |
| `release-flow`: con `debt.md`, `retro.md` existe | ejecución real | `r4` 2/2 |
| `release-flow`: la oferta y la estimación pedida | no probado | lectura; ver §3 |
| `cli`: lista de verbos | suite | `lists the verb in the help` |
| `cli`: `roadmap causes`, cada `AND` | suite y ejecución real | `causes.test.ts`, 26 tests; `r4` con el verbo real |
| `planning`: el inventario lee las propuestas | ejecución real | `m7` 1/1 |

### 4.3 Residuales / deuda generada

- Rúbrica `K6` de `rc2`: roja también sin esta feature. Va al ticket.
- El repaso no se ha corrido sobre la deuda real del repo: es 2.x hasta la 0198.

## 5. Aprendizajes

- Ninguno nuevo para los documentos de anclaje: el tropiezo con los escapes en un script ya está en `tech-stack.md`, y se repitió tres veces en esta sesión.

Retro: error que cazaría un chequeo → ticket del kit: `tech-stack.md` avisa de los escapes en un heredoc, y la regla se saltó tres veces porque nada la comprueba

## 6. Adendas
