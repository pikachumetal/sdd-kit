---
id: 20261108-144153-feature-0310-init-explore-release-feedback-rework
feature: 0310
title: Walkthrough — sdd-init, sdd-explore, sdd-end-release, sdd-feedback y add-to-changelog con las tres reglas de la ADR 0022
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-08
---

# Walkthrough — sdd-init, sdd-explore, sdd-end-release, sdd-feedback y add-to-changelog con las tres reglas de la ADR 0022

## 1. Cambios realizados

- **`sdd-init`** (P8, `09f226c`): sale el párrafo «No `templates/` folder… **Tracing** is…» de `references/structure.md`; el paso 4 de `SKILL.md:59` dice «its sections and table headers are the template's, literal; the content is…» en lugar de «the form is the template's».
- **`sdd-end-release` y `add-to-changelog`** (P6 y S686, `e7be078`): la forma de la línea `smoke:` y su caso `pendiente` quedan solo en el paso 3 (`SKILL.md:28` gana «if none ran»), y `references/release-notes.md:11` pasa a «The number of the line is never made up. The line reads…», el literal de la decisión 3. `add-to-changelog/SKILL.md:10` deja la regla («touching it doesn't replace touching the roadmap, nor the reverse») y pierde la descripción *backward/forward-looking*, que sigue en `changelog-template.md:3`.
- **`sdd-feedback`** (P7, `d265042`): sale la regla «**Privacy**: never client…» de `SKILL.md`; vive en el bloque de privacidad de `kit-feedback-template.md`, que el paso 3 calca. La batería gana la fila P de la rúbrica sobre `fb1` y una fila propia de privacidad en «Procedencia».
- **Cierre** (commit de cierre, con la pasada de fix de la revisión final, la enmienda y la evidencia):
  - El paso 5 de `sdd-feedback` pasa de «**Privacy pass** — before saving, reread the whole ticket looking for proper names and data of the project's domain.» a «**Privacy pass** — reread the saved ticket, file name and title included, against the template's privacy block, and replace each proper name or datum of the project's domain.». El paso 5 decía «antes de guardar» y va tras el paso 4, que guarda: sin la regla de la skill, `refactor/fb1-2` guardó y no repasó.
  - `battery.md` de `sdd-feedback`: la intro nombra la fila P y la fila P suma `coworking`.
  - La evidencia de las tandas en `green/`, `refactor/`, `control/` y `fix/`, con la lectura a mano en `green/lectura.md`.
  - La enmienda de la spec: la previsión sube de 7 a 8 sujetos, aprobada por el dev-lead.
- `sdd-explore` no cambia (decisión 7) y la lista de `sdd-init/SKILL.md:31` tampoco (decisión 6: P9 no se toca).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1h (más 0,5h de revisión y 0,5h de cierre: 2h)
- Esfuerzo real: 0,77 h — reloj de la sesión 3,49 h desde 2026-11-08T14:32Z, sin 163 min de espera al dev-lead (2 esperas)
- Desviación: −0,23 h (−23 %) frente a la estimación de implementación, medido antes del merge
- Causa de la desviación: dentro del ±30 %. Esperas y huecos: 14:47Z 76 min; 16:23Z 87 min, fuera del reloj.
- Compactación: sí, tras la pasada de fix de la revisión final, con las tres tasks completas → Native (no quedaba ninguna task)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 37.363.853 — claude-opus-5-5 37.363.853
- Tokens de subagentes: 5.912.262 en 4 despachos — Revisión adversarial de la spec 0310 claude-sonnet-5-5 268.471 / 1 min; Final review — Spec axis claude-opus-5-5 2.744.242 / 4 min; Re-revisión 0310 (rango juntado en el cierre) claude-opus-5-5 2.472.887 / 4 min; Final review — Code axis claude-sonnet-5-5 426.662 / 1 min
- Coste de la sesión: 19,12 $ (hilo 15,41 $ + subagentes 3,71 $)
- Coste de sujetos: 1,65 $ en 8 sujetos sonnet — GREEN 0,61 $; REFACTOR 0,39 $; control 0,20 $; fix 0,46 $ (previsión enmendada: 8 sujetos, 1,37 $; el último sujeto costó 0,28 $ frente a 0,20 $ del anterior)
- Review de spec: 1 revisor (técnica) · hallazgos 10, aceptados 9

## 3. Desviaciones del plan

- El paso 5 de `sdd-feedback` cambia de frase en la pasada de fix (antes y después en §1). Ninguna decisión de la spec lo listaba; la re-revisión lo da como no-desvío: no cambia ningún THEN, AND ni el Scope, y cubre mejor el «ticket entero» de la decisión 4. La enmienda aprobada lo nombra.
- La previsión sube de 7 a 8 sujetos (enmienda del 2026-11-08, aprobada: «1», «Subo a 8 sujetos y lanzo el que falta»).
- La pasada de fix cambió también `release-notes.md:11` a «The `<N>` of the `smoke:` line…» (Minor Código 2). La re-revisión lo dio como Important (literal de la decisión 3 cambiado sin enmienda) y el cierre lo vuelve al literal de la spec.

### Decisiones tomadas sin el dev-lead

- Empiezo la Task 2 mientras corre `n2` de la Task 1 — `n2` corre sobre una copia fija del kit y las tasks no comparten ficheros — si fallara, `n2` se relanza sin coste de código.
- El rango de la línea `complete` de la Task 1 llega a `e7be078` porque la Task 2 ya estaba commiteada; el de la Task 1 es `f05cee2..09f226c` — sin coste: el revisor final mira la rama entera.
- Empiezo la Task 3 mientras corre `r4` de la Task 2 — `r4` corre sobre la copia fija de `e7be078` — sin coste si fallara.
- El «fatal: a branch named 'develop' already exists» de `r4` es del molde (`subject.mjs:107` tras `initRepo`), no de esta rama — fuera de Scope, no se toca — si fuera de la rama, saldría también con el kit de `develop`.
- `battery.mjs verdict` filtra por paso y no por `SCENARIOS`, y el paso `release` incluye `r6`, no lanzado; la verificación de la Task 2 comprueba solo la línea de `r4` — sin coste: `r6` no mide nada de esta task.
- Minor Código 4 (fila P sin RED/GREEN propio) — su evidencia es la de esta feature: `refactor/fb1-2` rojo, `fb1` verde en `green/` y `fix/` — sin coste.
- Minor Código 5 (`smoke: pendiente` en `SKILL.md:22` y en el paso 3) — dos casos distintos (sin respuesta del usuario / no corrió smoke), ya estaban; `kit:own` no la da — si fuera repetición, la cogería la 0311.
- Minor Spec (cabeceras de tabla sin medir en `n2`) — `operations-template.md` no tiene tablas; medirlo pide un escenario que presente `ROADMAP.md`, fuera de la previsión — si la init deja cabeceras de tabla no literales, lo verá un ticket de campo.
- Minor Spec (ledger con líneas duplicadas) — el ledger es efímero y se borra — sin coste.
- No verificado Spec «RED decidido con `sdd-agent-writing`» — se invocó en la fase de spec y su resultado es la decisión 9 — sin coste.
- No verificado Spec «`n2` omite Frontend y Entornos» — comprobado en `n2-1.texts.txt` — sin coste.
- No verificado Spec kit checks y word-budget — `kit:own`, `kit:copies` y `kit:skill-size` corridos tras las tasks y otra vez tras la re-revisión; word-budget va en `cli:test` del gate.
- Declinado «`smoke: pendiente` if none ran» frente a la línea 22 — `r4` se comportó bien y el texto ya estaba en la referencia — sin coste.
- Declinado ADR 0020 sin repetir h y a — `r4` cubre «una línea por fila» — si fallara, lo verá la próxima release.
- La campaña cierra en 1,65 $ frente al techo de 1,58 $ de la enmienda — `fix/fb1-2` costó 0,28 $; `battery.mjs` comprueba el techo antes de lanzar, no después — 0,07 $ de más, ya gastados.
- El «What to Check» del eje Código va resumido en la re-revisión, con puntero a `code-reviewer-prompt.md` — el rango es prosa de skill y una rúbrica, sin código.
- Minor Código 2 (referente de «the number») — manda el literal de la decisión 3; el `<N>` está definido en `SKILL.md:28` — si un agente no ata «the number» a `<N>`, lo verá un ticket de campo.
- Minor de la re-revisión (literal del paso 5 fuera de la enmienda) — la enmienda nombra el paso 5 y el dev-lead la aprobó tras leer el cambio; antes y después, en §1 — sin coste.
- Minor de la re-revisión (tabla de topes de `sdd-feedback` en 656) — el paso 5 suma palabras y la skill sigue por debajo de 800; `word-budget.test.ts` en el gate — sin coste.
- Minor de la re-revisión (fila P sin «Norte» ni «reserva» en singular; «Procedencia» sin remitir a la evidencia) — «reserva» choca con el vocabulario del kit («reserva el id»); Norte no salió en ningún sujeto — si un sujeto filtra el nombre de la sala, P no lo cogerá.

**✋ sin revisar**: el commit de cierre lleva, después de la re-revisión, la vuelta de `release-notes.md:11` al literal de la decisión 3 (una línea, la que revisaron los ejes en `d265042`).

## 4. Verificación

### 4.1 Builds

- `moon run kit:build` sin diferencias entre `skills/` y `dist/` tras la vuelta al literal.
- `node tests/own/check.ts` (`kit:own`): de las cinco skills, solo las cuatro líneas repetidas con skills de otras filas (0311). `node tests/copies/check.ts` (`kit:copies`): solo `skills/sdd-verify/references/` sin anotar (0297). `moon run kit:skill-size`: solo `sdd-roadmap/SKILL.md` en 21.680 bytes (0308). Sin rojos nuevos.
- Gate: el de la validación corre tras el merge de sincronización (hay otras ramas abiertas); su línea va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-08 · sujetos de las tres skills medidas en verde (`n2` 1/1, `r4` 1/1, `fb1` 1/1 en GREEN y 2/2 tras la pasada de fix; el rojo de REFACTOR `fb1-2`, nuevo frente al control con `develop`, arreglado) · `kit:own`, `kit:copies`, `kit:skill-size` sin rojos nuevos · revisión final Spec y Código sobre `d265042`, re-revisión de la pasada de fix con un Important nuevo arreglado en el cierre · 1 sin revisar (la vuelta al literal de la decisión 3)

| Comprobación (spec, «Dónde se prueba») | Evidencia | Resultado |
| --- | --- | --- |
| Las reglas siguen cumpliéndose: `n2` (`sdd-init`, cabeceras y secciones de `operations-template.md`) | ejecución real | verde 1/1; cabeceras de tabla no probado (la plantilla no tiene tablas) |
| Las reglas siguen cumpliéndose: `r4` (`sdd-end-release` y `add-to-changelog`, `CHANGELOG.md` sellado) | ejecución real | verde 1/1, `smoke: pendiente` y una línea por entrada |
| Las reglas siguen cumpliéndose: `fb1` (`sdd-feedback`, filas F1, P y L) | ejecución real | GREEN 1/1; REFACTOR 1/2 (rojo en P, nuevo frente a `develop` 1/1); tras el fix 2/2 |
| Cada regla en un solo sitio, sin rojos nuevos: `kit:build`, `kit:copies`, `kit:own`, `kit:skill-size` | ejecución real | solo los rojos de 0311, 0297 y 0308 |
| Topes: `cli/test/kit/word-budget.test.ts` | suite | en el gate del cierre (mensaje final) |

### 4.3 Residuales / deuda generada

- El molde de los sujetos pone en `sdd-kit.json` la versión de `kitVersion()` (`tests/headless/lib.mjs:300`, 3.0.0) mientras el plugin cargado dice 2.3.4: los sujetos de `fb1` añaden un hallazgo de versiones que no cuadran. Va al ticket del kit.
- `battery.mjs verdict` filtra por paso y no por `SCENARIOS`; `battery.mjs run` comprueba el techo de coste antes de lanzar, no después. Van al ticket del kit.

## 5. Aprendizajes

- Quitar una regla de una skill puede dejar sin disparador un paso que la nombraba de forma relativa: el paso 5 de `sdd-feedback` decía «before saving» y venía tras el paso 4, que guarda; la regla general de privacidad tapaba el orden. → `skills/sdd-feedback/SKILL.md` paso 5 (ya sustituido) y ticket del kit.
- El descarte de P9 (las listas de `sdd-init:31` y `sdd-verify:58` responden a dos preguntas distintas) → decisión 6 de la spec y ticket del kit, para que una auditoría futura no lo reabra.

Retro: documento o skill desmentido → paso 5 sustituido en esta rama (`skills/sdd-feedback/SKILL.md`): «before saving» tras el paso 4, que guarda, hizo que `refactor/fb1-2` no repasara la privacidad
Retro: error que cazaría un chequeo → ticket del kit: `battery.mjs run` comprueba `COST_CAP` antes de lanzar y no con el coste real, y la campaña pasó el techo aprobado (1,65 $ frente a 1,58 $); `battery.mjs verdict` filtra por paso y no por `SCENARIOS`
Retro: búsqueda a ciegas → ticket del kit: tras compactar, el comando de la tanda (variables de entorno incluidas) no estaba en el ledger y salió de buscar en el transcript; `sdd-implement` no pide anotarlo
