---
id: 20261013-112220-feature-0150-roadmap-triage-release-feedback
feature: 0150
title: Walkthrough — Roadmap Now / Next / Later y debt.md con triaje
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-13
---

# Walkthrough — Roadmap Now / Next / Later y debt.md con triaje

## 1. Cambios realizados

- **Apertura** (`bc53694a`): spec y plan; la 0150 se parte en tres (0150, 0177 y 0178), la propuesta 0131 gana su enmienda, y la 0152 y la 0149 pasan a ir tras la 0150. Merge de sincronización con `develop` (`4ba7108a`) antes de la Task 1.
- **Task 1 — RED** (`f790e67c`, `d50c8cd3`):
  - moldes `salas-3` (`ROADMAP.md` y `debt.md` 3.0.0), `salas-3-plain`, `salas-3-wt` y `salas-qa` (2.x);
  - escenarios m3 a m6 y m3b en la batería de `sdd-roadmap`, r7 en la de `using-sdd` y la batería de humo de `sdd-feedback` (fb1);
  - evidencia en `tests/sdd-roadmap-0150-red.md` y `tests/sdd-feedback-0150-red.md`;
  - enmiendas de la spec tras el RED (`0809c953`): salen el contraste de datos del triaje y el prompt desde el brief.
- **Task 2 — plantillas** (`90d4f49d`): `now-next-later-template.md` → `ROADMAP.md` y `debt-template.md` → `.docs/sdd/steering/debt.md`; el hueco `- **Fuente**:` en `kit-feedback-template.md`; el índice de `sdd-templates`, con `roadmap-template.md` como 2.x hasta la 0157 y la de cliente hasta la 0177.
- **Task 3 — `sdd roadmap check`** (`b3e491e5`):
  - `cli/src/roadmap/now-next-later.ts`, `debt.ts` y `changelog.ts`;
  - el fichero decide las reglas: `ROADMAP.md`, las 3.0.0; `roadmap.md`, las 2.x sin el aviso del «Destino»; `steering/debt.md` se valida en el mismo verbo, con la caducidad tras dos releases `X.Y.0`;
  - también: el arreglo de `docs-claims` (`27c21490`) y la enmienda del enlace «desde `ROADMAP.md`» (`246b45a1`).
- **Task 4 — `sdd-roadmap` en inglés** (`14f69886`, REFACTOR `3c62a696`):
  - forma 3.0.0, tabla de equivalencias 2.x (un contrato desde el REFACTOR) y entrada «Triage»;
  - tamaño `S`, `M` o `L` de la fila nueva;
  - `control-profiles.md` lee el «Toca:» del brief y pone el perfil de la release bajo `## Now`;
  - tope de palabras de 2.700 a 3.600.
- **Task 5 — `sdd-feedback` en inglés** (`d68550cc`): la regla «Fuente», también para la cabecera del ticket; tope de 700 a 800.
- **GREEN y pasada de fix de la revisión final** (en el commit de cierre): `tests/sdd-roadmap-0150-green.md` y `tests/sdd-feedback-0150-green.md`; la pasada de fix hace casar el tamaño `L` con «Something big», deja en las plantillas el «Destino» y el «Salda» de la spec, devuelve dos guardas negativas en inglés y rellena la procedencia de las baterías.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4,5 h
- Esfuerzo real: 2,4 h — reloj del hilo por las marcas de los commits, de la apertura (`bc53694a`, 14:09) al cierre (~16:30); sin la espera a las respuestas del dev-lead. Spec y plan: ~2,8 h antes (11:22 a 14:09), con la entrevista y la review de spec.
- Desviación: −2,1 h (−47 %)
- Causa de la desviación: las campañas corrieron en tandas paralelas de ~5–10 min, y las cinco tasks fueron a implementadores Sonnet con el contrato escrito en el plan (de 2 a 20 min cada una); el RED contaminado, m3b, la ronda de REFACTOR y la pasada de fix sumaron ~50 min, menos de lo que se ahorró.
- Compactación: sí, en el cierre (tras la pasada de fix), sin tasks pendientes
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 209.902.163 — claude-opus-5-5 209.902.163 (incluye la entrevista y la spec, anteriores a la rama: el transcript es el mismo)
- Tokens de subagentes: 22.624.834 en 17 despachos — Implement Task 2: plantillas claude-sonnet-5-5 695.883 / 2 min; Review Task 4 (spec + quality) claude-sonnet-5-5 250.964 / 1 min; Final review feature 0150 claude-opus-5-5 4.779.319 / 5 min; Implement Task 5: sdd-feedback en inglés claude-sonnet-5-5 1.576.733 / 4 min; Review Task 2 (spec + quality) claude-sonnet-5-5 130.393 / 0 min; Revisor técnica spec 0150 claude-sonnet-5-5 211.061 / 1 min; Re-review final fix pass 0150 claude-sonnet-5-5 196.813 / 0 min; Fix final review findings 0150 claude-sonnet-5-5 1.003.595 / 3 min; Revisor dominio spec 0150 claude-opus-5-5 809.897 / 2 min; Implement Task 4: sdd-roadmap en inglés claude-sonnet-5-5 5.468.780 / 20 min; Implement Task 1: RED moldes y escenarios claude-sonnet-5-5 3.119.030 / 9 min; Review Task 1 (spec + quality) claude-sonnet-5-5 142.325 / 1 min; Implement Task 3: roadmap check claude-sonnet-5-5 3.346.966 / 13 min; Review Task 3 (spec + quality) claude-sonnet-5-5 353.185 / 1 min; Re-review Task 4 fix round 2 claude-sonnet-5-5 168.263 / 0 min; Re-review Task 4 fix round 1 claude-sonnet-5-5 174.839 / 0 min; Review Task 5 (spec + quality) claude-sonnet-5-5 196.788 / 0 min
- Coste de la sesión: 73,73 $ (hilo 61,52 $ + subagentes 12,21 $)
- Coste de sujetos: 12,37 $ en 65 sujetos sonnet — RED 2,75 $ (13, con los 2 apartados y m3b); GREEN de `sdd-roadmap` 2,90 $ (14); controles del REFACTOR 0,77 $ (3); `using-sdd` entera 5,22 $ (32); GREEN de fb1 0,27 $ (1); controles tras la pasada de fix 0,46 $ (2)
- Review de spec: 2 revisores · hallazgos 20, aceptados 16

## 3. Desviaciones del plan

- **Dos reglas salieron por el RED** (enmiendas aprobadas): el contraste de cada dato del ticket con su fuente (m3 y m3b limpios, también con un caso de campo) y el prompt desde el brief (m4 limpio). `launch-prompt-template.md` no cambió.
- **Dos requisitos vigentes de `roadmap`, enmendados a mitad** (aprobado): sale el enlace «desde `ROADMAP.md`», que la forma 3.0.0 ya no puede dar. Sale con él su test lento.
- **La Task 4 tuvo dos rondas**: la traducción había perdido «o en la sección de la plantilla que diga el usuario», y el GREEN de m6 pidió el REFACTOR de las equivalencias 2.x.
- **Ejecución SDD**, como fijó el plan: cinco tasks con su implementador y su revisor; las campañas, en el hilo.

### Decisiones tomadas sin el dev-lead

- Merge de sincronización con `develop` antes de la Task 1: `develop` había tocado `WordBudget.Tests.ps1`, de la Task 4 — sin él, freno de alcance en la Task 4.
- Los sujetos corren sobre una copia del kit sin `.docs/` ni `tests/`: la primera tanda de m3 leyó la spec de esta feature dentro de la copia — sus dos sujetos se apartaron y se relanzaron (2 sujetos de más).
- m5 sobre `salas-3-plain`, sin la exportación a CSV, y moldes 3.0.0 sin el changelog 2.x — el GIVEN de la spec se cumple igual.
- Desempates de la rúbrica antes de calificar (F1 mira el ticket entero; M5 cuenta la fila propuesta; M6 exige la fila de deuda de cada ítem), por el THEN de la spec y el paso 3 vigente.
- Arreglo fuera de alcance n.º 1: el parser de `docs-claims.test.ts`, en rojo en `develop` desde la 0175 (`27c21490`).
- Rulings de detalle de las tasks:
  - `—` cuenta como celda vacía;
  - la sección se nombra sin la versión del título;
  - la primera línea se comprueba por prefijo;
  - el paso de m4 es `brief`;
  - `task done` de la Task 1 se registra con el Pester de las baterías;
  - el README pasa a 27 plantillas.
- Topes: `sdd-roadmap` 3.600 (medido 3.550) y `sdd-feedback` 800 (medido 711), por la decisión 17 de la spec.
- `SUBJECT_CAP` de 54 a 62 dentro del techo de 34 $.
- La ronda 2 de la Task 4 queda como commit propio, tras el de la Task 5: juntarlo pediría reordenar la historia.
- Rulings de la revisión final:
  - el check pide el `<details>` del brief, no sus cinco etiquetas: es lo que dice el delta, y un brief incompleto pasa;
  - un id de gestor con `#` en «Tras» falla y se corrige a mano;
  - una release con raya corta (`–`) en el changelog no cuenta para la caducidad: la spec nombra `-` y `—`;
  - seis hallazgos suben a Important por su efecto (procedencia de las baterías, dos guardas que ya no afirmaban, «Destino» y «Salda» de las plantillas, el `|` sin escapar y el separador de «Tras»), y la pasada de fix los arregla.
- Controles de m5 y m2 con el kit de la pasada de fix (2 sujetos, 0,46 $), porque la frase del tamaño `L` cambió después de medirla.

## 4. Verificación

### 4.1 Builds

- Gate de cierre (`no declarado`; tareas de moon de «Contenido y build», decisión 6 del plan), sin caché, sobre el GREEN y los borradores del cierre: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min --cache off` → `cli:test` 846/846, `cli:test-slow` 156/156, `cli:test-min` 1002/1002, Pester 1188 pasan, 0 fallan · 302 s.
- Gate de cierre otra vez, sobre el árbol del cierre (tras la pasada de fix): `cli:test` da 3 timeouts de 5 s (`verify.test.ts`, `layout.test.ts`, `check.test.ts`) con las demás suites en paralelo, y solo pasa 846/846 en 13 s; el resto da `cli:test-slow` 156/156, `cli:test-min` 1002/1002 y Pester 1187/1 (`FastSuiteBudget`: el conjunto rápido tarda 38,1 s con las suites de vitest en paralelo, umbral 30 s), y `FastSuiteBudget.Tests.ps1` solo pasa. Los dos fallos son de tiempo bajo carga → fila de deuda.
- `sdd capability merge` y `capability check --artifact` de la spec → 36 cambios en 6 capacidades, «Capacidades válidas: 18».

### 4.2 Smoke / tests

- Validación en campo: 2026-10-13 · gate de cierre sin caché en verde (302 s), y sobre el árbol del cierre en verde salvo cuatro fallos de tiempo bajo carga que pasan solos · smoke de la CLI R1–R8 con ejecución real (9 casos) · GREEN de las skills por escenario (abajo), con los controles tras el REFACTOR y tras la pasada de fix · revisión final opus with fixes sobre el GREEN, pasada de fix y re-revisión sonnet limpia (juntadas en el commit de cierre) · no probado: los requisitos de `planning` sin escenario y la conducta de `control-profiles` (filas de abajo)

Smoke de la CLI: `scratchpad/smoke/smoke.ps1` monta proyectos con los datos de los GIVEN y ejecuta `node cli/bin/sdd.js roadmap check`. Conducta de las skills: sujetos headless del RED y del GREEN (`tests/sdd-roadmap-0150-*.md`, `tests/sdd-feedback-0150-*.md`).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `roadmap` — `ROADMAP.md` tiene Now, Next y Later, solo con tablas | ejecución real (R1) y suite | `línea 9: prosa en «Now»…`, `línea 12: sección «Backlog» fuera de la plantilla`, `falta la sección «Later»`, exit 1 |
| `roadmap` — El título de Now dice la release en preparación | ejecución real (R2, R2b) | `«Now — 2.4.0» no es «## Now» ni…`, exit 1; `## Now — 2.4.0 · comprometida` → `Roadmap válido` |
| `roadmap` — Las filas de `ROADMAP.md`… | ejecución real (R3) y suite | los siete mensajes del THEN en las líneas 8, 9, 10, 11 (×2), 14 y 22; `B<n>` en Next, estado activo en Later y «Tras» nombrado por el changelog, por suite |
| `roadmap` — `debt.md` tiene una sección por estado… | ejecución real (R4) y suite | líneas 4, 12, 15 y 21 con sus mensajes; «Destino» vacío y cabeceras, por suite |
| `roadmap` — Una fila en espera caduca… | ejecución real (R5) | avisos de las líneas 8 (caduca) y 16 (sale en el corte), sin aviso para la del 2026-08-01, `Roadmap válido`, exit 0 |
| `roadmap` — El roadmap vive en `ROADMAP.md` (MODIFIED) | ejecución real (R6) y suite | `ROADMAP.md: aviso: también existe .docs/sdd/roadmap.md, que no se lee` y `Roadmap válido`; `debt.md` junto a un 2.x, por suite |
| `roadmap` — Cada feature declara los ficheros que toca (MODIFIED) | ejecución real (GREEN m5) | la fila 0014 lleva `**Toca:** src/app.js`; la columna 2.x de «Release N», no probado: ningún escenario prepara una release |
| `roadmap` — Fila saldada y patch publicado (MODIFIED) | suite | `cut.slow.test.ts` 2/2 con las dos formas de enlace |
| `roadmap` — REMOVED del aviso de destino y ADDED del aviso de cierre 2.x | ejecución real (R7, R8) y suite | «Destino» `Decidir dev-lead: patch` sin aviso; este repo da una sola línea, `Roadmap válido` (antes, 106 avisos) |
| `planning` — Con `ROADMAP.md`, una fila nueva… | ejecución real (GREEN m5, control m5-3) | 3/3 con tamaño `S`, en Next, con brief |
| `planning` — El triaje propone el estado de cada ítem | ejecución real (GREEN m3) | 2/2: CSV a «En espera», planta a «Lista» con el comando, las 8 h a «Descartadas» con `caducada`, sin escribir |
| `planning` — Sin `ROADMAP.md`, la forma 2.x | ejecución real (GREEN m6 y controles) | 1/2 antes del REFACTOR, 2/2 después |
| `planning` — Un patch pendiente… (MODIFIED) | ejecución real (GREEN m3) | m3-1 propone la planta como «patch en Now con `**Carril:** patch`» |
| `planning` — Algo grande, Una reunión, Un cambio de definición, Reordenar, Preparar una release y Solo escribe en las secciones (MODIFIED) | no probado | sin escenario, con su motivo en la decisión 21 de la spec; su forma 3.0.0 la exige el check; m2 cubre «Algo grande» en 2.x (2/2) |
| `kit-feedback` — El ticket se escribe para un agente (MODIFIED) | ejecución real (fb1) | RED 1/1 falla (copia 7.1.0); GREEN 1/1 limpio (`superpowers_version: sin determinar`, «Fuente» en cada «Qué pasó») |
| `control-profiles` — El desvío y el freno de alcance; el perfil se hereda (MODIFIED) | suite | `RoadmapTriage.Tests.ps1` fija `**Toca:**` y `## Now` en `control-profiles.md`; la conducta, no probado (sin escenario) |
| `routing` — Triar la deuda entra por `sdd-roadmap` | ejecución real (r7) | RED 2/2 y GREEN 2/2, batería de `using-sdd` entera 22/22 |
| `onboarding` — `sdd-templates` ofrece las plantillas (MODIFIED) | suite | `AnchorTemplates.Tests.ps1` |

### 4.3 Residuales / deuda generada

- **El contraste de cada dato del ticket con su fuente** (la «7.1.0», ticket de la 0165 §1, parte del triaje): no se reproduce con un ticket corto (m3 y m3b limpios) → fila de deuda en «Esperar 2.º ticket».
- **La copia del kit de una campaña lleva `.docs/` y `tests/`** si sale de `git archive`, y un sujeto lee la spec de la feature que se mide → fila de deuda con la propuesta: `subject_init` aborta si `KIT_DIR` tiene `.docs/`.
- **La caché de moon oculta un `cli:test` en rojo** cuando cambia una skill: sus entradas no incluyen `skills/`, y `docs-claims` lee las skills → fila de deuda: añadir `skills/**` y `.docs/sdd/capabilities/**` a las entradas de `cli:test`.
- **Menores diferidos de las tasks y de la revisión final** (ledger) → una fila de deuda que los agrupa.
- **El gate de cierre falla por tiempo con sus suites en paralelo** (una de dos ejecuciones): timeouts de 5 s en `cli:test` y `FastSuiteBudget` por encima de 30 s; todo pasa solo → fila «Esperar 2.º caso».
- **m2-2 y m2-5 dieron el prompt sin la forma completa de la plantilla** → fila «Esperar 2.º ticket».
- **Los avisos de «Destino» de este repo** (ticket del patch 0164) se saldan sin re-destinar sus ~90 filas: el aviso sale del check, y la 0157 migra esas filas a `debt.md`.
- **Pricing en `sdd-config`** (menores de la feature 0060): no entra aquí; con la partición aprobada en la apertura es de la 0178.

## 5. Aprendizajes

- Una campaña mide con una copia del kit sin la carpeta de specs: con ella, el sujeto lee las reglas que se están midiendo → fila de deuda del roadmap (`tech-stack.md` está en su tope de 18.700 palabras).
- Un baseline limpio en el molde no descarta un fallo de campo: el de la «7.1.0» pasó en una sesión larga, y el molde corto lo deja a la vista. Lo cubre «Un fallo de varios turnos se mide sobre la sesión real» de `tech-stack.md` → sin cambio; la fila de deuda queda en «Esperar 2.º ticket».

## 6. Adendas
