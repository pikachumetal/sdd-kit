---
id: 20261013-112220-feature-0150-roadmap-triage-release-feedback
title: Tasks — Roadmap Now / Next / Later y debt.md con triaje
spec: ./spec.md
plan: ./plan.md
created: 2026-10-13
---

# Tasks — Roadmap Now / Next / Later y debt.md con triaje (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0150-roadmap-triage-release-feedback`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | RED: moldes, escenarios y baseline | done | `f790e67c` | m3b y su RED en `d50c8cd3`; enmiendas de la spec tras el RED en `0809c953` |
| 2 | Plantillas: `ROADMAP.md`, `debt.md`, «Fuente» y el carril del prompt | done | `90d4f49d` | sin `launch-prompt-template.md` (enmienda del 2026-10-13) |
| 3 | `sdd roadmap check`: `ROADMAP.md` 3.0.0, `debt.md` y sin aviso del «Destino» | done | `b3e491e5` | con `27c21490` (arreglo de `docs-claims`) y la enmienda `246b45a1` |
| 4 | `sdd-roadmap` en inglés: forma 3.0.0, equivalencias 2.x, prompt desde el brief y triaje | done | `14f69886` | ronda de REFACTOR tras el GREEN en `3c62a696`; sin la regla del prompt desde el brief (salió por el RED) |
| 5 | `sdd-feedback` en inglés, con la fuente de cada dato | done | `d68550cc` | |

## Verificación por task

- [x] Task 1 — los tres `DRY_RUN=1` y la campaña RED (verificación lenta)
- [x] Task 2 — `moon run kit:test-fast`
- [x] Task 3 — `moon run cli:typecheck cli:test kit:roadmap` y `roadmap check` sobre este repo
- [x] Task 4 — `moon run kit:test-fast` y la campaña GREEN (verificación lenta)
- [x] Task 5 — `moon run kit:test-fast` y el GREEN de fb1 (verificación lenta)

## Revisión

- Revisión final: juntada en el cierre, sdd-kit:effort-high + opus, With fixes (3 Important y 8 Minor, 6 subidos a Important por su efecto)
- Pasada de fix: juntada en el cierre, 6 hallazgos RED→GREEN (de texto y tests; las dos guardas restauradas, vistas fallar con la frase insertada)
- Re-revisión: juntada en el cierre, sdd-kit:effort-medium + sonnet, todos resueltos, sin roturas

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| `docs-claims.test.ts` en rojo en `develop` (14 tests) | el cierre de la 0175 devolvió a `sdd-implement` grafos `dot` con «sdd task start:», que el parser leía como verbo; la caché de moon lo ocultaba | arreglado aquí (n.º 1), parser sin puntuación final | `27c21490` |

## Rulings

- Task 1: Ruling: la base movió la fila de deuda de los avisos de «Destino» (2.º caso, ticket de la 0175) — sin cambio de alcance, no es freno: la fila 0150 no está en el diff y ningún fichero de la Task 1 coincide — si fuera freno, solo cambia el texto de la fila que se salda al cerrar.
- Task 1: Ruling: merge de sincronización con develop (4ba7108a) antes de despachar, porque develop tocó tests/WordBudget.Tests.ps1, que es de la Task 4 — BASE de la Task 1 = 4ba7108a, no bc53694a — conflicto del roadmap resuelto con las filas de los dos lados, roadmap check en verde.
- Task 1: Ruling: STEPS separado por espacios y Paso de m4 = `brief` (el plan decía comas y `prompt`, que es el de m1) — así el RED lanza m3, m4 y m5 sin m1 — coste si es error: nada, solo nombres de paso.
- Task 1: Ruling: DONE_WITH_CONCERNS — corrijo antes de la revisión: m5 pasa a la variante `salas-3-plain` (sin la exportación a CSV ni su fila en debt.md), porque en `salas-3` «apunta exportar a CSV» es un duplicado y no mide la fila nueva; la spec nombra `salas-3`, pero su GIVEN (ROADMAP.md, sequence, última fila 0013) se cumple igual — coste si es error: m5 mide en un molde algo distinto del de m3.
- Task 1: Ruling: sin `.docs/sdd/changelog.md` en los moldes 3.0.0, solo `CHANGELOG.md` en la raíz — el 2.x al lado confunde el contraste de m3.
- Task 1: Ruling: los `DRY_RUN` salen con 1 porque en seco ningún sujeto invoca una skill (igual en r1–r6 hoy); vale como verificación que lancen todos sus sujetos sin error.
- Task 1: Ruling: el informe de QA que queda en `salas-3-plain` (dice que el CSV existe) no se quita durante la campaña — m5-1 del RED apuntó 0014 como fila nueva sin leerlo como duplicado, y cambiar el molde entre RED y GREEN rompe la comparación — coste si es error: un GREEN de m5 que lo trate como duplicado; se lee en la calificación.
- Task 1: Ruling: `—` cuenta como celda vacía también en «Tamaño» y «Tras» (como en «Evidencia» y «Destino»): la fila B1 del molde lleva Tamaño `—`, válida en Later; en Now o Next, `—` falla como vacío — va en el contexto de la Task 3.
- Task 1: minor (deferred): battery.md de sdd-roadmap dice «Seis moldes» con cinco listados, sin coma antes de `salas-3-plain`, y «en los dos la exportación conserva las tildes» es falso en `salas-3-plain` — se corrige en la Task 4, que edita ese fichero.
- Task 1: minor (deferred): las notas de fb1 dicen «kit 2.4.0»; si el kit sube a 2.4.0 la contradicción desaparece — usar una versión inalcanzable si se relanza tras un bump.
- Task 1: minor (deferred): `src/app.js` y el informe de QA están duplicados byte a byte entre `mold-salas-3` y `mold-salas-qa` — riesgo de deriva.
- Task 1: minor (deferred): `tests/batteries/sdd-feedback/subject.sh` con modo 100755 y su hermano con 100644.
- Task 1: Ruling: RED contaminado — `git archive` del commit de apertura metió `.docs/` (con la spec de esta feature) y `tests/` en KIT_DIR; m3-1 y m3-2 leyeron las secciones de triaje de la spec 0150 desde kit-red — apartados a `red-contaminated/out` (su coste sigue contando), kit-red sin `.docs` ni `tests`, m3 relanzado; m4, m5, fb1 y r7 no leyeron `.docs` del kit y se quedan — el GREEN usará también una copia sin `.docs` ni `tests` — hallazgo para el ticket del kit.
- Task 1: Ruling: la fila F1 de la rúbrica de fb1 mira solo «Qué pasó», pero el THEN de la spec («el ticket dice 7.0.0 … o no da versión») mira el ticket entero — se desempata en la batería: F1 falla también si la cabecera da la versión de las notas sin contrastarla; con eso fb1-1 falla (superpowers_version: 7.1.0 copiado de las notas).
- Task 1: Ruling: `sdd task done` con `tests/Battery.Tests.ps1 -CI` y no con los `DRY_RUN`, que salen con 1 por construcción (en seco ningún sujeto invoca una skill) — coste si es error: ninguno, los DRY_RUN se ejecutaron y lanzaron todos sus sujetos.
- Task 1: Ruling: decisión del dev-lead tras el RED — «Otra tanda con un caso de campo»: m3b (salas-3-wt) 2/2 limpio en el contraste → la regla sale con su THEN; «Sale» para el prompt desde el brief (m4 2/2 limpio). Enmiendas en 0809c953; m3b en d50c8cd3. m3b-2 escribió debt.md sin esperar (paso 3 vigente): se mira en el GREEN.
- Task 2: Ruling: README.md 25 → 27 plantillas, fuera del brief — lo exige Skills.Tests.ps1 (recuento de plantillas).
- Task 2: minor (deferred): la ayuda de now-next-later-template.md repite «Tamaño» («Externo, Tras y Tamaño; en Later, también el tamaño y el brief»).
- Task 2: minor (deferred): debt-template.md y now-next-later-template.md sin salto de línea final.
- Task 2: minor (deferred): el índice de sdd-templates dice que debt.md lo escribe sdd-roadmap al triar, sin nombrar los cierres que quitan lo saldado.
- Task 3: Ruling: arreglo fuera de alcance n.º 1 — docs-claims.test.ts tomaba «start:» y «brief"» de los grafos dot de sdd-implement (cierre de la 0175, ya en develop) como verbos; 14 fallos en develop ocultos por la caché de moon (cli:test no tiene skills/ entre sus entradas). Fix del parser en 27c21490, entra en la revisión de la Task 3 — hallazgo para el ticket (caché de moon) — coste si es error: un claim con puntuación final legítima pasaría sin comprobar el signo.
- Task 3: Ruling: desvío aprobado («Apruebo (Recomendada)») — MODIFIED de «Una fila saldada…» y «Un patch publicado…» sin el enlace «desde ROADMAP.md»; sale el test lento de cut.slow.test.ts que lo probaba; el molde salas-3 gana `# Roadmap — salas` en la línea 1.
- Task 3: Ruling: no se juntan 27c21490 (arreglo de docs-claims) ni 246b45a1 (enmienda de la spec) con b3e491e5 — son de otra naturaleza y la task ya es un commit.
- Task 3: minor (deferred): formSectionProblem, rowProblems y blockProblems con 4 parámetros (límite 3).
- Task 3: minor (deferred): la línea «Perfil de control:» se acepta en cualquier sitio bajo Now, no solo entre el título y la tabla, ni una sola vez; ningún test fija la posición.
- Task 3: minor (deferred): knownIds toma ids de tablas de secciones fuera de la plantilla (sin efecto: esas secciones ya fallan).
- Task 3: minor (deferred): el título del molde salas-3 se arregló en el commit de la Task 3, por instrucción del hilo.
- Task 4: Ruling: tope de sdd-roadmap de 2.700 a 3.600 (medido 3.535, +34 %): la decisión 17 de la spec, aprobada, lo sube a la centena de arriba — coste: la skill pesa más; se dice en el cierre.
- Task 4: Ruling: SUBJECT_CAP de 54 a 62 — los 6 de más vienen de m3b (RED y GREEN, decisión del dev-lead) y de los 2 m3 contaminados; el techo del dev-lead es en dólares (34 $), y van 2,75 $.
- Task 4: Ruling: el GREEN de using-sdd va tras la Task 5, para medir de una vez la description de sdd-roadmap y la de sdd-feedback.
- Task 4: minor (deferred): la tabla «Which form» y los paréntesis 2.x de las secciones dicen lo mismo dos veces (parte del +34 % de palabras).
- Task 4: minor (deferred): el test de PlanEntry «distingue las cinco entradas…» comprueba siete.
- Task 4: Ruling: la regla devuelta en la ronda 1 («la sección que diga el usuario») entra tras empezar el GREEN (kit de la Task 4 antes de su ronda 1, juntado después en 14f69886): un sujeto de control de m5 con el kit final.
- Task 5: Ruling: develop trae 5d8d3aa0 (fila 0180 nueva y la 0152 «tras 0150, 0151 y 0180») — no toca la fila 0150 ni los ficheros de la Task 5; la fila 0152 chocará al fusionar con la edición de esta rama (0177 y 0178): se resuelve en el cierre.
- Task 5: minor (deferred): la regla nueva dice "What happened" y la plantilla «Qué pasó».
- Task 5: minor (deferred): la description de sdd-feedback gana «el ticket del kit» y «el feedback de mejora» como disparadores (lo mide la batería de using-sdd).
- Task 4: Ruling: el fix de la ronda 2 (3c62a696) queda como commit propio tras el de la Task 5 (d68550cc): juntarlo con 14f69886 pediría reordenar la historia con un rebase interactivo, que no está disponible.
- Final: Ruling: el check no valida las cinco etiquetas del brief, solo `<details>` — es lo que pide el delta; quien escribe un brief sin una etiqueta no ve un fallo, pero el prompt sale igual de la fila — coste: un brief incompleto pasa.
- Final: Ruling: formato de Id y Externo e ids repetidos sin validar — decisión 7 bis de la spec.
- Final: Ruling: las reglas del corte sobre ROADMAP.md no existen — son de la 0177.
- Final: Ruling: un ROADMAP.md en forma 2.x deja de pasar — decisión 26 de la spec; no existe ninguno fuera de los fixtures.
- Final: Ruling: namesId con `\b` no casa ids de gestor con `#` — el Id del modo tracker es numérico; quien lo escriba con `#` ve el fallo de «Tras» y lo corrige.
- Final: Ruling: el changelog con raya corta (`–`) no cuenta la release — la spec nombra `-` y `—`; una fila no avisa a tiempo de su caducidad — coste bajo, el corte de la 0177 la mira igual.
- Final: Ruling: qué roadmap decide la forma en el paso 1 si el worktree y la integración discrepan — fuera de la spec: el paso 1 lee la integración.
- Final: Ruling: posición de «Perfil de control:» dentro de Now — ya diferido (Task 3).
- Final: Ruling: re-grado por efecto — suben a Important: la procedencia de las baterías con «GREEN pendiente» y sin la regla del REFACTOR (registro de evidencia falso), las guardas negativas de RoadmapClosing:86 y SingleEntry:38 que ya no prueban nada (tests que no afirman), el «Destino» y el «Salda» de las plantillas distintos de la spec (decisión 7 ter), el `|` sin escapar en debt.md (desplaza la fila en silencio) y el separador de «Tras» sin documentar.
- Final: minor (deferred): el test de CRLF no fija números de línea de un fallo.
- Final: minor (deferred): headerProblem (tables.ts) también con 4 parámetros.
- Final: minor (deferred): la rúbrica F1 no mide que «Fuente» cite un fichero del proyecto por su nombre (fb1-1 lo hizo).
- Final: minor (deferred): m2-2 del GREEN dio un prompt sin la forma de la plantilla; vigilar el paso 7 traducido.
- Final: Ruling: control de m5 y m2 con el kit de la pasada de fix (juntada en el cierre) porque la frase de `L` cambió después de medir (una edición de la guía tras medirla lleva un sujeto de control por escenario afectado).
