---
id: 20261001-153446-feature-0117-patch-lane-fixed-solution
feature: 0117
title: Walkthrough — Carril patch: lo decide quién fijó la solución
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-01
---

# Walkthrough — Carril patch: lo decide quién fijó la solución

## 1. Cambios realizados

- **Apertura** (`1e06b3c3`): spec, plan, `tasks.md`, RED previo a la spec (14 sujetos) y la fila 0130, partida de la 0117 con la estimación previa del patch. Merge de sincronización con `develop` (`17299320`), que trajo la 0120: topes de palabras y batería de `using-sdd`.
- **Task 1 — criterio y petición cerrada** (`456f8191`): `sdd-start-patch` gana un árbol que pregunta quién fija la solución (fallo, ajuste visual, petición cerrada), la definición de «solución fijada» con su contraejemplo, la variante de la petición cerrada en el paso 1, `solution:` y `Decisiones` con autor en el paso 3, el freno de 10 ficheros o 300 líneas en el paso 4 y el tipo de commit por clase en el paso 5. La `description` excluye mostrar u ocultar según un dato, avisos y reglas nuevas. `patch-template.md` gana `solution:`, la §2 de la petición cerrada y la lista `Decisiones`. `sdd-end-patch` escala por decisiones sin el dev-lead, registra la petición cerrada en `Added` o `Changed` y lee `Decisiones` en el mensaje final. `using-sdd`, el paso 2 de `sdd-start-feature` y la guía de uso dicen el mismo criterio. Batería de `using-sdd` con `pc1` y `bt1`, y `c2` pasa a patch.
- **Task 2 — retirada** (`f3e1b4f0`): el predicado del ajuste visual admite la retirada (quitar elementos y lo que queda muerto, solo lo que nadie más usa, sin añadir nada); el paso 4 busca cada símbolo retirado; la plantilla gana `**Retirado**` con lo que el usuario deja de poder hacer; el cierre la registra en `Removed`.
- **Task 3 — lite y parcial** (`4302cce5`): `modo-lite.md` descarta lite solo por un cambio de schema; `sdd-end-patch` nombra el formato `parcial — <enlace>; queda: <lo pendiente>`.
- Tests: `tests/PatchLane.Tests.ps1` (nuevo), `VisualPatch.Tests.ps1` y `Battery.Tests.ps1` al día, topes de `WordBudget.Tests.ps1` a lo medido. Evidencia: `tests/patch-lane-red.md` y `tests/patch-lane-green.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5h (rango 2–3,5h), condicionada al GREEN
- Esfuerzo real: 2,3h — reloj del hilo, de las marcas de los commits: apertura a las 17:51 y cierre hacia las 20:10 (hora local); spec, plan y RED previo, ~0,6h antes de la apertura, fuera de esta cifra
- Desviación: -0,2h (-8 %)
- Modelo del hilo: Opus 5.5, effort de la sesión (no registrado), en todas las fases
- Tokens del hilo: 68.419.230 — claude-opus-5-5 68.419.230
- Tokens de subagentes: 1.807.660 en 1 despacho — Revisor final 0117 claude-opus-5-5 1.807.660 / 4 min
- Coste de la sesión: 23,36 $ (hilo 22,07 $ + subagentes 1,29 $)
- Coste de sujetos: 12,55 $ en 53 sujetos Sonnet — RED 2,77 $ (14); GREEN, REFACTOR y control 9,78 $ (39)
- Review de spec: no · hallazgos 0, aceptados 0

Las tres líneas de tokens y coste son de `Measure-SessionTokens.ps1` antes de la re-revisión del tramo de fix; lo anterior a crear la rama no cuenta.

## 3. Desviaciones del plan

- La 0120 entró en `develop` tras aprobar la spec: la spec gana «Retira o adelgaza» y los topes suben a lo medido (enmienda aprobada por el dev-lead).
- El predicado visual se quedó en `using-sdd`: sin él se probó primero, y el GREEN no mejoró al devolverlo; la causa era la `description` de `sdd-start-patch` (decisión del dev-lead).
- Techo de la campaña de 40 a 55 sujetos, mismo techo de 15 $ (dos decisiones del dev-lead).
- Revisión final (Opus, effort high, sobre `4302cce5`): con arreglos, 2 Important y 8 Minor. Pasada de fix con 3 hallazgos RED→GREEN: el paso 3 solo deja preguntar cerrado con las opciones ya escritas, el paso 4 solo saca a feature un ajuste visual que no es retirada, y la guía de uso da la condición de lite nueva (un Minor subido a Important por efecto). Control c2 tras el fix: «escribir tú las opciones es diseñar la solución». Los otros 7 Minor, a una fila de deuda.
- Dos fixes descubiertos en la validación, fuera del plan: `SubjectOutputPrivacy.Tests.ps1` tumbaba `FastSuiteBudget` (30,8-34,6 s frente a 30) y no revisaba las salidas de `battery/` ni `fix/`. Arreglados en la rama con su test, con re-revisión del tramo.

### Decisiones tomadas sin el dev-lead

- `using-sdd` escrito entero en la Task 1, retirada incluida — es una sola fila — ninguno.
- El GREEN de la Task 1 usa la batería de `using-sdd` (`pc1`, `bt1`, `c2`) en vez de p1, b2 y c2 por el hook — misma petición, dentro del techo — ninguno.
- El test del predicado se invirtió (lo conserva `using-sdd`) y se añadió el de «tu lectura… es tuya» en el REFACTOR — salen de decisiones registradas — ninguno.
- `r2-2` escribió `solution: ticket` en una petición directa; sin ronda nueva — menor — una etiqueta mal puesta en `patch.md`.
- `Merge-CapabilityDelta.ps1` normalizó `feature-flow.md` entero (línea en blanco tras cada título de requisito); se deja como lo deja el script — la normalización es el tema de la 0129 — ruido en el diff de esa capacidad.
- Minor 9 de la revisión subido a Important solo en `usage-guide.md` §4; README, `greenfield.md` y `brownfield.md` van a la relectura de la guía en la release — están fuera del Scope — siguen con el criterio viejo hasta entonces.
- El contraejemplo del control c2 se escribió antes de su aserción — una frase — una aserción que no se vio fallar.
- c2 no discrimina en el molde `ventas` (el grupo ya está a la derecha) y no se relanzó más — Art. I — la guarda del autor queda sin medir con un molde sin ambigüedad.
- El vigía de silencio respondió «SIN TRANSCRIPT» con el revisor final: corrió sin vigía — un cuelgue sin aviso.

## 4. Verificación

### 4.1 Builds

- Sin build: el kit es texto y scripts.
- Pre-commit (conjunto rápido) en cada commit de la rama: verde, el último con 949 tests.
- Suite completa con los `Slow`: `Invoke-Pester tests` → 1.293 de 1.294, 10 omitidos · 10,5 min. Falla `FastSuiteBudget` («tarda menos del umbral»), la fila de deuda «`FastSuiteBudget` falla con la máquina cargada»: suelto pasa 3 de 3 tras el arreglo de `SubjectOutputPrivacy`.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-01 · suite completa 1.293/1.294 (el rojo es la deuda conocida de `FastSuiteBudget` con la máquina cargada; suelto, 3/3) · campaña de 53 sujetos con un THEN por fila abajo · revisión final opus con arreglos sobre 4302cce5, pasada de fix e651f66d y re-revisión limpia de e651f66d..7aac863e

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Bug determinista → `solution: causa raíz`, causa con evidencia, `Fixed`, commit `fix` | ejecución real (`k1-1`) | ✅ `systematic-debugging`, `fix(order-sheets)` |
| Cambio con la solución fijada → `sdd-start-patch` por el hook o con la orden | ejecución real (`pc1-1`, `pc1-2`, `p2-1`, `p2-2`) | ✅ 4 de 4 |
| … `solution: ticket`, §2 con la frase del ticket, sin causa raíz | ejecución real (`p2-1`, `p2-2`) | ✅ |
| … changelog `Changed` o `Added` y commit que no es `fix` | ejecución real (`p2`: `feat(…)`) · changelog: suite (`PatchLane.Tests.ps1`) | ✅ commit; changelog no recorrido hasta el cierre |
| … si `index.html` no existe, para sin abrir nada | ejecución real (RED `p2-1`, `p2-2`, sin `index.html`) | ✅ |
| Solución que fijaría el agente («avisa cuando… 1.000 €», con la orden o «métele un patch») → `sdd-start-feature` | ejecución real (`b1-1`, `d1-1`, `d1-2`, `bt1-7`, `bt1-8`) | ✅ tras el REFACTOR |
| … «Oculta Borrar si está facturado» → feature | ejecución real (`c1w-7`) | ✅ tras el REFACTOR |
| … dentro de un patch, una decisión visible sin fijar para o se pregunta | ejecución real (`c2-4`) | ✅ pregunta cerrada |
| `patch.md` con `solution:` y `Decisiones` con autor | ejecución real (`p2`, `c2`, `k1`) | ✅ |
| Decisión visible `sin el dev-lead` → para y pasa a feature | ejecución real (`c2-1` ❌, `c2-3` ❌, `c2-4` ✅) | ✅ tras el REFACTOR |
| El mensaje final de `sdd-end-patch` lee `Decisiones` | ejecución real (`e1-1`) | ✅ |
| Patch muy grande para y pregunta | suite (`PatchLane.Tests.ps1`) | no probado con sujeto |
| Ajuste visual por el hook → `sdd-start-patch` con el predicado | ejecución real (batería `v1-1`, `v1-2`) | ✅ |
| Retirada → `sdd-start-patch`, `**Retirado**`, lo que se pierde, delta de `order-sheets`, `Removed` | ejecución real (`r2-1`, `r2-2`) · `Removed`: suite | ✅ |
| «Quita Borrar y añade Archivar» → feature | ejecución real (`r3-1`) | ✅ |
| Texto dado literal → patch, `solution: dev-lead`, `Changed` | ejecución real (batería `c2-1`, `c2-2`; recorrido `c2-1`) | ✅ |
| Patch visual: captura, detector o su aviso, `Changed`/`Removed` | ejecución real (`r2-2`: capturas fuera de git y aviso «composición no medida») | ✅ |
| Fallo no reproducido o petición cerrada sin lo que da por existente → para sin abrir nada | ejecución real (RED `p2-1`, `p2-2`) | ✅ |
| Lite con migración solo de datos → se ofrece y se nombra la migración | ejecución real (`l1-1`) | ✅ |
| Lite con una migración que añade una columna → no se ofrece | no probado | — |

### 4.3 Residuales / deuda generada

- `Get-NextSddId.ps1` propone un id ya usado si está en la segunda columna de la tabla de Patches (`Get-NextSddId.ps1:54` solo lee la primera; la plantilla pone el Id en la segunda): 3 sujetos del GREEN lo vieron. → fila de deuda.
- Los 7 Minor de la revisión final que no entraron en la pasada de fix. → fila de deuda «Menores de la revisión final de la 0117».
- La rama «lite con una migración que añade una columna» y el freno de tamaño no se midieron con sujetos.
- Los 3 Minor de la re-revisión de `SubjectOutputPrivacy.Tests.ps1`. → apartado (8) de la misma fila de deuda.
- Suite completa de 10,5 min: deuda del proyecto ya registrada (fila «El conjunto rápido del pre-commit está a 4 s de su tope», ahora `parcial`).

## 5. Aprendizajes

- El primer salto del router lo decide la `description` de la skill, no la tabla de `using-sdd`: con el predicado devuelto a `using-sdd`, c1w y bt1 siguieron entrando por `sdd-start-patch`, y bastó con excluir el caso en la `description`. → `tech-stack.md`, «Baterías por skill» (condensando dos entradas para caber en su tope).
- Revisión de skills: las tocadas por la feature son el propio cambio; ninguna otra skill del kit enruta al patch salvo `sdd-consult` (Minor 6, a deuda).

## 6. Adendas
