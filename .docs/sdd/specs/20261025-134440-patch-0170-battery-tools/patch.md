---
id: 20261025-134440-patch-0170-battery-tools
task: 0170
title: Patch — Herramientas de las baterías: comprobación en seco del molde, prompt del Agent en tools.txt y Node del gate
type: patch
solution: dev-lead
status: done
created: 2026-10-25
branch: feature/0170-battery-tools
commit: 2a7558e5
---

# Patch 0170 — Herramientas de las baterías: comprobación en seco del molde, prompt del Agent en tools.txt y Node del gate

## Capacidades

- Ninguna, porque ninguna capacidad describe las herramientas de las campañas de sujetos (`tests/headless/`) ni las reglas de `tech-stack.md`.

## 1. Síntoma

Del [ticket de la feature 0147](../../field-reports/20261010-222401-feature-0147-implement-fork.md) §2-§3 y del [ticket de la feature 0149](../../field-reports/20261017-143150-feature-0149-archive.md) §1 y §4:

- §2 (0147): sujetos invalidados por un molde cuya suite no salía en verde o cuyos THEN no tenían de dónde sacar sus datos (~3 $ y ~20 min); en la 0149 §1, una pasada en seco por iniciativa propia cazó un molde roto antes del RED.
- §3 (0147): `tools.txt` no muestra el prompt de un despacho `Agent`; sin sus cabeceras se escribió un REFACTOR por una lectura falsa (~0,5 h).
- Menor (0147): `cli:test-min` corre con Node 22.18.0 (`moon.yml`) y `tech-stack.md` no lo declara.
- §4 (0149): con la skill nueva al lado de las que sustituye, el GREEN midió las viejas (4 sujetos, 0,90 $).

## 2. Solución fijada

Fila 0170 del roadmap (triaje del dev-lead, 2026-10-11) y el prompt de arranque del dev-lead, 2026-10-25:

- (a) «Octava pregunta en «Comprobación previa de cada escenario» de tech-stack.md: con DRY_RUN=1, la suite del molde montado sale en verde salvo los RED que planta el escenario, y cada THEN tiene de dónde sacar sus datos.»
- (b) «tests/headless/extract.mjs tools escribe bajo >>> Agent las cabeceras ## del prompt del despacho.»
- (c) «tech-stack.md declara el Node de cli:test-min: 22.18.0 (proto install node 22.18.0).»
- (d) «Línea en «Baterías por skill» de tech-stack.md: una skill que sustituye a otras pide su nombre en los escenarios de conducta hasta retirarlas, y el enrutado se mide en la task de la retirada.»
- Al arrancar se partió por umbral (dev-lead, 2026-10-25, «Partir en 3»): se suman la línea de la deuda «Un patch que edita una skill reserva id…» (cabecera de `run.sh` y `tech-stack.md`: el lanzador del RED vive en el scratchpad hasta reproducir), la (a) de la deuda «Herramientas de campaña» (la decisión medida, al alcance del primer turno) dentro de la octava pregunta, y se saldan las filas ya hechas en el código; el resto va a la 0213 y la 0214.

Lo que da por existente, comprobado: «Comprobación previa de cada escenario» (siete preguntas) y «Baterías por skill» en `tech-stack.md`; `cli:test-min` con `node 22.18.0` en `moon.yml`; `describe` del bloque `Agent` en `extract.mjs`, que hoy solo escribe `subagent_type`, `model` y `description`; `subject_resume` y `mold_is_repo` en `lib.sh`, con el caso de `mold_is_repo` en `HeadlessLauncher.Tests.ps1`.

## 3. Fix

- **Fichero(s)**: `.docs/sdd/tech-stack.md`, `tests/headless/extract.mjs`, `tests/headless/run.sh`, `tests/SubjectOutputPrivacy.Tests.ps1`
- **Cambio**: `extract.mjs tools` añade bajo `>>> Agent` las cabeceras `##` del prompt, una por línea con sangría, con su test en `SubjectOutputPrivacy.Tests.ps1`; `tech-stack.md` gana la octava pregunta de la comprobación previa, el node 22.18.0 de `cli:test-min`, la línea de la skill que sustituye a otras y la del lanzador del RED en el scratchpad (repetida en la cabecera de `run.sh`), y corrige la frase que decía que el prompt de un `Agent` no está en `tools.txt`. El roadmap gana las filas 0213 y 0214 y las filas de deuda pasan a su destino.
- **Decisiones**:
  - Partir la 0170 en tres: el patch, la 0213 (`run.sh`) y la 0214 (`lib.sh`, `extract.mjs`, `battery.mjs`) — dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `extract.mjs tools` con un despacho `Agent` cuyo prompt lleva cabeceras `##` | RED: el `It` nuevo falla («did not match», solo la línea `>>> Agent`); GREEN tras el fix: `SubjectOutputPrivacy.Tests.ps1` 14/14 |
| 2 | `tech-stack.md` cabe en su tope de palabras tras las cuatro líneas nuevas | ✅ `WordBudget.Tests.ps1` 71/71, tras compactar cuatro reglas que el código ya cumple (`g init`, `touch stop`, la campaña cortada y el segundo turno) |
| 3 | (a), (c), (d) y la línea del RED en el scratchpad: texto de `tech-stack.md` y `run.sh`, sin conducta que probar | releídas en el diff; no probado con un sujeto |

Validación en campo: 2026-10-25 · gate de cierre `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` sobre 2a7558e5: `cli:test` 1164/1164, `kit:test` 1362/0/13 saltados al relanzarlo (en la primera pasada falló una vez «acepta RUNS_DIR bajo .temp/ del repo», que pasa en aislado y en el relanzamiento: intermitente con carga), `cli:typecheck`, `cli:test-slow` y `cli:test-min` en verde

## 5. Tiempo (ligero)

- Estimación: 1,5 h
- Inicio: 2026-10-25T13:44Z
- Esfuerzo real: 0,29 h — reloj de la sesión 0,30 h desde 2026-10-25T13:40Z, sin 0 min de espera al dev-lead (1 espera). Desvío de −80 %: tres de las cuatro piezas eran una línea de `tech-stack.md` y la cuarta, cinco líneas con su test; la estimación contaba con más trabajo por pieza del que hubo
- Coste de sujetos: no aplica
