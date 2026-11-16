---
id: 20261029-082734-feature-0236-project-gate-levels
title: Tasks — El gate de los proyectos por niveles y por lo afectado
spec: ./spec.md
plan: ./plan.md
created: 2026-10-29
---

# Tasks — El gate de los proyectos por niveles y por lo afectado (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0236-project-gate-levels`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `operations.md` con nivel, «Sin filtro», «Lint» y «CI de la base», y quien los propone | done | 621bee5 | `pl3` limpio en el RED: sin regla en plan-template |
| 2 | Correr un gate: unitarios enteros, salvaguarda, tras un rojo y lint | done | 161195a | un solo commit con la Task 3: comparten el paso 1, el paso 6 y la batería de sdd-archive |
| 3 | Lo que trae la base y el conflicto solo de docs | done | 161195a | con la Task 2; G7b, G8b y M1c sin medir tras su afinado (dev-lead: «Cerrar con lo medido») |

## Verificación por task

- [ ] Task 1 — Vitest de `cli/test/kit/` y GREEN de `n7`, `v4`, `g2`, `pl3`
- [ ] Task 2 — GREEN de `g7`, `t1`, `t2`; humo de `g6`, `w2`, `k6`
- [ ] Task 3 — GREEN de `g8`, `m1`, `m2`, `g5`; control de `a3`

## Fixes adicionales

Ninguno.

Revisión final: Spec opus+high, con arreglos (8 Important, 6 Minor) · Código sonnet+high, con arreglos (2 Important, 10 Minor) · Arquitectura no (plan), sobre 161195a
Pasada de fix: juntada en el cierre, 10 Important y 16 Minor arreglados (texto de skills y plantillas, test reducido a paridad); 4 rulings
Re-revisión: 161195a..pasada de fix (juntada en el cierre), sdd-kit:effort-high + opus, 10/10 resueltos; 2 Important nuevos del fix (N1, N2), arreglados después, juntados en el cierre (sin revisar)

## Rulings

Task 1: Ruling: migrationStep del test buscaba el primer «2. **» (la lista de cómo se aplica cada paso) — busca desde «Los pasos van en este orden» — coste si falla: un falso verde del paso 2
Task 1: Ruling: pl3 sale limpio en el RED — no se escribe la regla de «Verificación» por nivel en plan-template.md (Art. I); el MODIFIED de feature-flow describe conducta que ya se cumple, y pl3 queda en la batería como control sin GREEN propio — coste si falla: una task que corre la integración de más, que vería la revisión final
Task 1: Ruling: la copia k-g1 llevó v3.0.0.md con 150 líneas duplicadas (String.replace interpretó «$`» del texto nuevo) — rehecho desde HEAD con reemplazo por función; v4 y g2 se repiten — coste: ~1,5 $ de sujetos repetidos
Task 1: Ruling: n7 gana TURN2 («La que recomiendas. Sigue con el resto de operations.md.») — una pregunta por turno es conducta del kit; sin él la fila no se observa — coste si falla: el RED se midió sin TURN2 (allí no preguntó)
Task 2: RED (kit b8ab5635, n=1, 1,02 $): g7 ✗ G7a-b; t1 ✗ T1a-b; t2 ✗ T2a-b. Ruling: el molde de t2 rompía rooms.test.js con una tercera sala — cambia a ['Norte','Sur'].sort() — coste: ninguno en la lectura del RED
Task 1: Ruling: N7a acepta `unitario` con motivo — el molde trae src/app.test.ts, que solo llama a funciones: el código dice qué arranca — coste: ninguno
Task 2: Ruling: k6-1 no cargó ninguna skill (Glob → Edit de gate.json): fallo de enrutado ajeno al cambio — sin observar; se repite con k6-2 — coste si falla: un humo del carril config sin medir
Task 2: Ruling: la causa de G7b es la plantilla: walkthrough-template 4.1 y patch-template solo tienen hueco para una orden — ganan el hueco de la suite unitaria y de la marca (Art. II, elemento omitido) aunque el plan no los nombra — coste si falla: dos líneas de plantilla más
Task 3: Ruling: molde m1 con texto cierto («…que también valida el motivo al cancelar»), m2 con Node 20 frente a Node 24 — coste: ninguno
Final de campaña: Ruling: la marca por tarea y el aviso literal se afinan en el paso 1 y el 6 de sdd-archive sin medir — fila de deuda para remedir G7b, G8b y M1c — coste si falla: líneas Gate: sin la marca en cada tarea y un aviso parafraseado
Tasks 2-3: Ruling: un solo commit para las Tasks 2 y 3 — comparten sdd-archive/SKILL.md (pasos 1 y 6), merge-recipe.md y la batería de sdd-archive, y partir los trozos a mano arriesga un commit roto — coste si falla: la historia junta dos tasks en un commit
Final: Ruling: Spec I5 m1 y m2 se midieron sobre tech-stack.md, no sobre la fila del roadmap de la 0235 §3 — en 2.x, `sdd merge --sync` une el roadmap por id y el caso de la fila puede no llegar al agente (patch 0244); el de tech-stack es el de la 0228 §4 y la regla es la misma — coste si falla: el caso de la fila sin medir; fila de deuda
Final: Ruling: Spec I8 humo de g6 (paso 7) sin observar y patch-template sin escenario de cierre de patch — dev-lead «Cerrar con lo medido» con 23,78 $ de 25 $ — coste si falla: una frase del paso 7 y un hueco de plantilla sin humo; fila de deuda junto a G7b, G8b y M1c
Final: Ruling: Código m8 filteredGate de sdd-verify lee los fixtures del gate de sdd-archive — un solo gate de juguete para las dos baterías; copiarlo duplicaría gate.mjs — coste si falla: un cambio del gate de archive rompe t1 y t2
Final: Ruling: Código m10 la regla «Sin filtro» vive en sdd-verify y resumida en los pasos 1 y 6 de sdd-archive — tech-stack «Una regla que solo vive en una referencia no se lee» (g7 0/2 con la regla solo en sdd-verify); el paso 1 remite a la lista entera — coste si falla: copias que se desvían
Final: Ruling: Spec M5 la parte b de pl3 (una task que escribe un test de integración lo corre) no se ejercitó — pl3 salió limpio en el RED y la regla no se escribió; el walkthrough lo dice — coste: ninguno
Final: Ruling: N1 y N2 se arreglan en un commit tras la re-revisión, que no abre otra — la regla manda adjudicarlos, pero dejarlos rompe la línea base (no correría nada) y contradice la decisión 14 (--verify sin unitarios); son dos frases — coste si falla: el commit va a ✋ como sin revisar
Final: Ruling: N4 el informe de la pasada sin la orden de la suite — esta línea la da — coste: ninguno
Final: Ruling: «Fuera del alcance» de la re-revisión: un *.md que es input de un test (skills/**/*.md en este repo) no corre nada en una rama solo de docs — decisión 16 de la propuesta 0234 y de la spec; lo caza el pre-commit — coste si falla: un rojo que llega al pre-commit en vez del cierre; fila de deuda
