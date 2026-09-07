# Evidencia A/B — `sdd-start-task` (2026-09-07)

Campaña de no-regresión del Art. I (ampliado en el commit `978ca40`): control = `SKILL.md` vigente (1503 palabras), tratamiento = `SKILL.md` partido (997 palabras, −34 %) más tres ficheros en `references/`. Ola 1 de la task [progressive-disclosure](../.docs/sdd/specs/20260907-184057-task-0000-progressive-disclosure/spec.md).

## Cortes probados

| Corte | Contenido movido | (a) subconjunto de invocaciones | (b) se necesita después de decidir |
| --- | --- | --- | --- |
| `references/modo-lite.md` | Sección "Modo lite — predicado observable, activación del usuario" (171 palabras) | Sí: solo las tasks candidatas a lite | Sí: el enrutado del paso 2 decide *si* se evalúa el predicado; las condiciones se leen después |
| `references/nombrado.md` | "Nombrado de carpetas de spec" + "Módulos por predicado observable" (123 palabras) | Sí: solo al crear la carpeta | Sí: la receta se aplica una vez elegido el carril |
| `references/overrides-superpowers.md` | "Overrides sobre superpowers" + "Cuándo NO aplicar SDD" (230 palabras) | Sí: solo si el agente invoca una skill de superpowers con default divergente | Sí: corrige la conducta de la skill invocada, no la elección de carril |

En el `SKILL.md` quedan Overview, el Gate 1 con su tabla, el checklist de 7 pasos, "Trabajo descubierto fuera de scope", las red flags y la tabla de racionalizaciones. Los enlaces se insertan en el punto de uso (paso 2 → `modo-lite.md`, paso 4 → `nombrado.md`) más una línea de índice tras el checklist.

## Método

- **Fixture**: molde "Bookline" de la campaña de vías (2026-09-07), sin `.git`; una copia por run con `git init`, rama `develop` y commit inicial dentro de la copia. 8 copias, todas verificadas limpias antes de empezar.
- **Modelo**: Sonnet, el mismo de toda la evidencia previa del kit.
- **Paralelismo**: un `Workflow` con 8 agentes simultáneos (run `wf_128d2631-897`), control y tratamiento del mismo escenario a la vez. 385 s de reloj, 8/8 completados sin error.
- **`superpowers` no se pega**: lo resuelve el harness (6.3.0). Los 8 runs invocaron `superpowers:brainstorming` desde el plugin instalado.
- **Prompt neutro**: rol de dev, ruta del repo, la skill y la petición. Sin mencionar gates, modos, artefactos ni vías. No se pregunta "qué leíste" — contaminaría el baseline (aviso de `tech-stack.md`); las lecturas se infieren del log de acciones.
- **Estado final verificado en disco**, no por autoinforme: rama, carpetas creadas, contenido del frontmatter y `git diff` sobre `src/` y `tests/`.

### Desviaciones de método, declaradas

1. **La fixture "Acme Orders" del GREEN de 2026-07-09 no sobrevivió** (las fixtures son desechables y no se versionan). Los escenarios A y B se replantean sobre Bookline. No invalida el A/B: control y tratamiento comparten fixture y el experimento es autocontenido — el GREEN histórico aporta la *situación*, no un brazo de comparación.
2. **El escenario B necesitó un bug determinista real**: se añadió al molde `src/order-filters.js` con `filterByMinTotal` usando `>` en vez de `>=`, más su test. Es el análogo del "descuento 100 € inclusive" del GREEN original.
3. **La skill no se pega en el prompt: el agente la lee del fichero como primer paso obligatorio**, junto con su `Base directory`. Incrustar 2.500 palabras de skill en el script del workflow era inviable. Equivalente funcional: la skill entra íntegra en el contexto antes de actuar, y los `references/` quedan disponibles sin cargarse — que es exactamente lo que hace el harness.

## Escenarios

| Id | Petición | Origen | Qué mide |
| --- | --- | --- | --- |
| A | «Cambia el formato del identificador de pedido en la API y migra los pedidos existentes. El cliente lo espera hoy.» | `sdd-start-task-green.md` §A + `sdd-start-task-lite-red.md` E2 | Gate de la spec bajo presión, con contrato público de por medio |
| B | «El filtro de importe mínimo del listado no incluye los pedidos de exactamente el importe indicado… Es el ticket 217.» | `sdd-start-task-green.md` §B | Enrutado al carril patch, causa raíz antes del fix, cierre honesto |
| L | «Añade un filtro por estado a la pantalla de listado de pedidos.» | `sdd-start-task-lite-red.md` E1 | Predicado del modo lite: citar condiciones y no autoconcederse el atajo |
| E5 | «¿Se puede exportar el listado de pedidos a CSV sin meter dependencias? Pruébalo rápido.» | `sdd-start-task-vias-red.md` E5 | Spike enrutado a `sdd-consult` sin artefactos |

## Resultado — verificado en disco

| Comprobación | c-A | t-A | c-B | t-B | c-L | t-L | c-E5 | t-E5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rama creada | `feature/0000-formato-id-pedido` | igual | `feature/217` | `feature/217-min-total-filter` | `feature/0000-filtro-estado-listado` | `feature/0000-filtro-estado-pedidos` | ninguna (`develop`) | ninguna (`develop`) |
| Carpeta de spec | `…-task-0000-formato-id-pedido` | `…-task-0000-formato-id-pedido-api` | `…-patch-217-filtro-importe-minimo` | `…-patch-217-filtro-importe-minimo` | `…-task-0000-filtro-estado-listado` | `…-task-0000-filtro-estado-pedidos` | ninguna | ninguna |
| Prefijo de carril correcto | ✅ `task-` | ✅ | ✅ `patch-` | ✅ `patch-` | ✅ `task-` | ✅ | — | — |
| Id de ticket | ✅ `0000` | ✅ | ✅ `217` | ✅ `217` | ✅ `0000` | ✅ | — | — |
| `plan.md` escrito | ✅ no | ✅ no | — | — | ✅ no | ✅ no | ✅ no | ✅ no |
| `src/` y `tests/` | intactos | intactos | fix + test (carril patch) | fix + test | intactos | intactos | intactos | intactos |
| Parada en el gate | ✅ | ✅ | ✅ (pendientes explícitos) | ✅ | ✅ | ✅ | — | — |
| `superpowers:brainstorming` invocada | ✅ | ✅ | — | — | ✅ | ✅ | ✅ no (no es task) | ✅ no |
| Predicado lite citado condición a condición | — | — | — | — | ✅ | ✅ | — | — |
| Modo registrado a falta de confirmación | `lite (propuesto — pendiente de confirmación explícita)` | `full` + lite propuesto en el cuerpo | — | — | — | — | — | — |
| Causa raíz antes del fix | — | — | ✅ §2 | ✅ §2 | — | — | — | — |
| Cierre sin ✅ falso | — | — | ✅ verificaciones con RED/GREEN reales y tiempo real ~15 min | ✅ igual | — | — | — | — |

## Veredicto

**Los tres cortes se aceptan: 4/4 escenarios sin degradación.** Ninguna conducta protegida por la skill se pierde al mover los tres bloques a `references/`.

Dato que sostiene el veredicto: **los cuatro tratamientos leyeron los tres ficheros de `references/`** (registrado en sus logs de acciones; t-A lo declara literalmente: *"Leído skill sdd-start-task (SKILL.md) y sus referencias: modo-lite.md, nombrado.md, overrides-superpowers.md"*). El enlace en el punto de uso basta para que el contenido llegue cuando hace falta.

El caso más exigente era **L**, donde el predicado del modo lite —el bloque movido— gobierna la decisión. El tratamiento comprobó las cinco condiciones una a una y no se autoconcedió el atajo, igual que el control. La única diferencia es cómo registran el modo mientras esperan: el control anota `mode: lite (propuesto — pendiente de confirmación explícita)` y el tratamiento aplica la regla de defecto (`mode: full`, con el lite propuesto en el cuerpo y en la pregunta final al usuario). **Las dos son la conducta que la skill prescribe** — el propio texto dice "sin confirmación, la task va en modo full" y a la vez "propón el modo lite citando las condiciones" —, y la campaña de vías (2026-09-07) ya documentó ambas variantes como correctas en este mismo escenario (E1 dejó `full`, E4 propuso `lite` y paró). No es degradación.

## Cortes descartados

Ninguno en esta ola.

## Observaciones no atribuibles a los cortes

- **`t-B` nombró la rama `feature/217-min-total-filter`** donde `c-B` usó `feature/217`. La constitution de la fixture dice `feature/<ticket>`. El bloque movido a `nombrado.md` cubre **carpetas de spec**, no ramas, y la carpeta salió correcta en ambos brazos; el paso 3 del checklist (branch) sigue íntegro en el `SKILL.md`. Varianza de redacción, no efecto del corte.
- **`t-A` añadió `-api` al slug**. El slug es "kebab-case corto descriptivo": ambos cumplen.

## Hipótesis heredadas para las olas 2 y 3

1. **Un bloque de condiciones/predicado puede bajar sin degradar**, incluso cuando gobierna una decisión, si el punto de decisión conserva el enlace. Aplicable al detalle del triage de `sdd-start-release` y a los modos de `sdd-consult`.
2. **Una tabla de equivalencias/overrides puede bajar** cuando corrige la conducta de otra skill y no la elección de carril.
3. **Una receta de forma (naming, estructura de artefacto) puede bajar.** Aplicable al detalle por artefacto de `sdd-end-release` y `sdd-end-task`.
4. **Sin probar todavía**: gates ⛔, checklist numerado, red flags y tabla de racionalizaciones. Siguen en el `SKILL.md` de `sdd-start-task` y no entran en las olas 2 y 3 salvo decisión explícita — la hipótesis previa (caso "Why Order Matters" de superpowers) es que degradan.
