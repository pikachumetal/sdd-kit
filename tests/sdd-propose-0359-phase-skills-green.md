# GREEN — feature 0359: la spec y el plan en skills de fase

Batería de `sdd-propose`, molde `reservas`, sujetos `sonnet`. Kit: `dist/` del worktree tras cada task, copiado sin `.docs/` ni `tests/`. Salidas en `.docs/sdd/changes/20261119-113300-feature-0359-spec-plan-phase-skills/<fase>/out/`.

## Task 2 — `sdd-spec-review` (`PHASE=green-t2`, 5 sujetos, 2,49 $)

| Escenario | RED | GREEN | Filas |
| --- | --- | --- | --- |
| `rq1` | 2/3 | **3/3** | RQ1 3/3: ninguno carga `AskUserQuestion`; RQ1-B 3/3: los tres terminan en una pregunta numerada con los dos revisores, el modelo de cada uno y su coste. `rq1-3` recomienda un revisor en Opus en vez de dos, con los dos en la opción 2: la fila no lo pide. `rq1-2` añade «Dime también si apruebas la spec», una segunda pregunta en el mismo turno |
| `rv1` | — | **2/2** | RV-S 2/2 (`>>> Skill: sdd-kit:sdd-spec-review`); RV-A y RV-B 2/2; RV-C 2/2: despachan sin preguntar el nivel |

## Task 3 — `sdd-plan-writing` (`PHASE=green-t3`, N = 1)

| Escenario | GREEN | Filas |
| --- | --- | --- |
| `p2` | **1/1** | PW 1/1 (`>>> Skill: sdd-kit:sdd-plan-writing`, después `sdd-implement`); P2 1/1: §3 dice `node --test && node scripts/lint.mjs` |
| `k2p` | **1/1** | PW 1/1; K2p 1/1: la task lleva «Evidencia» con `research.md` y el script, y la línea `Ejecución` dice Native |

`sdd-plan-writing`: 2.143 palabras, 13.4 KB; `kit:copies` en verde (conserva más del 50 % de `writing-plans`).

## Task 4 — `sdd-spec-writing`, `sdd-spec-approval` y `sdd-propose` reducido (`PHASE=green-t4`)

| Escenario | RED | GREEN | Filas |
| --- | --- | --- | --- |
| `ss1` | 0/3 | puerta 3/3; conducta según la enmienda 30 | SW1 3/3; IQ1 3/3 (sin `spec.md`); SS2 3/3: los tres montones en un mensaje, cada porqué con su fuente (`src/app.js:3`, `findBooking`, la línea del prompt); SS3: «Abierto» en el montón del dev-lead con su propuesta citada 3/3, y la primera pregunta es el orden de `sort()` (`jue` antes de `lun`), del montón del dev-lead, 3/3; con el AND aprobado («la primera pregunta cita un punto de Abierto»), 0/3; SS4 3/3 |
| `iq2` | — | 0/2 con la petición aprobada | SW1 2/2; IQ1 2/2; IQ5: montones sin preguntar lo que la petición dice 2/2, pero los dos preguntan el orden de las líneas, que la petición no fijaba, en vez de acabar en el diseño corto (enmienda 30) |
| `iq3` | — | 1/2 | SW1 2/2; IQ1 2/2; IQ3: separador con `;` como propuesta del prompt 2/2, nombre del test en el montón del dev-lead con su propuesta 2/2; `iq3-1` lista dos puntos más del montón con interrogación («¿solo las activas…?», «¿qué te haría torcer el gesto…?»), una segunda pregunta en el turno |
| `iq4` | — | **1/1** | SW1, SA1, SA2: `sdd-spec-writing` → `sdd-spec-approval` → `sdd-spec-review` → `sdd-plan-writing`; IQ6: sin mensaje de montones, el umbral en ✋ marcado «pendiente» |

`sdd-spec-writing`: 3.215 palabras, 18.903 bytes, 51 % de `brainstorming`; `sdd-spec-approval`: 1.130 palabras, 6.723 bytes; `sdd-propose`: 2.248 / 8.665 palabras.

### Tandas de REFACTOR de la Task 4

| Tanda | Cambio | `ss1` | `iq2` | `iq3` |
| --- | --- | --- | --- | --- |
| 1 (`refactor-t4`) | los puntos del dev-lead se nombran sin preguntarlos; la única interrogación es la pregunta del turno | 3/3 (primera pregunta: el orden de `sort()`) | `iq2-1` escribe `spec.md` sin mensaje de montones; `iq2-2` encuentra otro hueco (sala que no existe) | **2/2** |
| 2 (`refactor2-t4`, aprobada por el dev-lead) | ⛔ sin `spec.md` hasta que el mensaje de los montones ha salido y el turno ha acabado, también con el montón vacío | **3/3** | montones y parada antes de `spec.md` 3/3; los tres preguntan la sala que no existe, un hueco real de la petición | — |

El camino «montón del dev-lead vacío → diseño corto para confirmar» queda **sin observar**: la petición de `iq2` se corrigió una vez (enmienda 30) y el segundo hueco va como hallazgo del ticket, sin editarla otra vez. Lo que la ronda 2 arregla —escribir la spec sin enseñar los montones— sale 3/3. Coste de la Task 4: 2,26 + 1,91 (ronda 1) + 1,30 (ronda 2) $.
