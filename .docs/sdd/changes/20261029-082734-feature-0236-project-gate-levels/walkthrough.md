---
id: 20261029-082734-feature-0236-project-gate-levels
feature: 0236
title: Walkthrough — El gate de los proyectos por niveles y por lo afectado, con la salvaguarda del build
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — El gate de los proyectos por niveles y por lo afectado

## 1. Cambios realizados

- **Los campos de `operations.md`** (Task 1, `621bee5`): `operations-template.md` §Testing da a cada suite su nivel (`unitario`, `integración`, `E2E` o `pendiente`), y el «Gate de cierre» pasa a ser la integración y los E2E por lo afectado (`--include-relations`). Campos nuevos: «Sin filtro», «Lint» y «CI de la base». Los propone la fila «How it is tested» de `sdd-init` y el paso 2 de `v3.0.0.md`; el paso 9 avisa de un gate con lint. Test nuevo: `cli/test/kit/operations-gate-fields.test.ts`.
- **Correr un gate** (Task 2, `161195a`): bloque «Running a gate» en `sdd-verify` (suites unitarias enteras, gate sin filtro con «Sin filtro», tras un rojo solo lo que toca el arreglo, lint fuera del gate). El paso 1 de `sdd-archive` lleva las condiciones que deciden y la línea `Gate:` literal. Una frase lo nombra en el paso 7 de `sdd-start-feature`, la línea base de `sdd-worktrees` y el carril config de `sdd-propose`. `walkthrough-template.md` (4.1) y `patch-template.md` ganan el hueco de la suite unitaria y de la marca del build.
- **Lo que trae la base y el conflicto de docs** (Task 3, `161195a`, en el mismo commit que la Task 2): el paso 6 de `sdd-archive` pasa a viñetas, con el conflicto solo de docs que junta dos añadidos (lo resuelve el agente y lo nombra), lo que trae la base en «Sin filtro» y la intersección escrita. `merge-recipe.md` remite al paso.
- **Baterías**: `n7` (`sdd-init`), `v4` y `g2` (`sdd-upgrade`), `pl3` (`sdd-propose`, control), `g7`, `g8`, `m1` y `m2` (`sdd-archive`), `t1` y `t2` (`sdd-verify`). Evidencia en `tests/project-gate-levels-red.md` y `tests/project-gate-levels-green.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 5 h
- Esfuerzo real: 1,75 h — reloj de la sesión 2,46 h desde 2026-10-29T08:22Z, sin 43 min de espera al dev-lead (7 esperas)
- Desviación: −3,25 h (−65 %)
- Causa de la desviación: la estimación contaba ~31 sujetos en serie, a ~4 min cada uno; corrieron de tres en tres y en segundo plano mientras el hilo escribía la task siguiente, y los textos de skills fueron frases dentro de pasos que ya existían.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 123.719.839 — claude-opus-5-5 123.719.839
- Tokens de subagentes: 9.159.087 en 5 despachos — Final review — Code axis claude-sonnet-5-5 1.874.346 / 3 min; Final review — Spec axis claude-opus-5-5 3.876.722 / 5 min; Revisor dominio spec 0236 claude-opus-5-5 842.976 / 2 min; Revisor técnico spec 0236 claude-sonnet-5-5 290.868 / 2 min; Re-review final 0236 claude-opus-5-5 2.274.175 / 3 min
- Coste de la sesión: 41,41 $ (hilo 34,48 $ + subagentes 6,93 $)
- Coste de sujetos: 23,78 $ en 53 sujetos sonnet (RED 5,12 $, GREEN 18,66 $), de un tope de 25 $ (previsto 17 $; enmienda de la spec)
- Review de spec: 2 revisores · hallazgos 20, aceptados 17

## 3. Desviaciones del plan

- La regla de la «Verificación» por nivel no se escribe: `pl3` salió limpio en el RED (Art. I); el requisito de `feature-flow` describe una conducta que ya se cumple.
- Las Tasks 2 y 3 van en un solo commit: comparten los pasos 1 y 6 de `sdd-archive`, su receta y su batería.
- `walkthrough-template.md` y `patch-template.md` cambian aunque el plan no los nombraba: su hueco de una sola orden era lo que copiaban los sujetos de `g7`.
- Tope de coste de la prueba: de 22 $ a 25 $ (enmienda de la spec), y cierre con lo medido a 23,78 $: G7b, G8b y M1c quedan sin medir tras su afinado.
- La parte b de `pl3` (una task que escribe un test de integración lo corre) no se ejercitó, y la fila «Verificación» de «Lo que se retira o cambia de forma» no se aplicó: `pl3` salió limpio en el RED.
- Enmienda de la spec tras la revisión final: una suite cuya orden es la del gate no corre aparte (eje Spec, I3).
- Revisión final con arreglos en los dos ejes; pasada de fix juntada en el cierre; la re-revisión dejó dos Important nuevos del fix (N1, N2), arreglados después, también juntados en el cierre.

✋ sin revisar: juntado en el cierre — la frase de solo docs se limita a la validación y el cierre, y el `--verify` del merge sale de «Running a gate» salvo la regla tras un rojo

### Decisiones tomadas sin el dev-lead

- Task 1: Ruling: migrationStep del test buscaba el primer «2. **» (la lista de cómo se aplica cada paso) — busca desde «Los pasos van en este orden» — coste si falla: un falso verde del paso 2
- Task 1: Ruling: pl3 sale limpio en el RED — no se escribe la regla de «Verificación» por nivel en plan-template.md (Art. I); el MODIFIED de feature-flow describe conducta que ya se cumple, y pl3 queda en la batería como control sin GREEN propio — coste si falla: una task que corre la integración de más, que vería la revisión final
- Task 1: Ruling: la copia k-g1 llevó v3.0.0.md con 150 líneas duplicadas (String.replace interpretó «$`» del texto nuevo) — rehecho desde HEAD con reemplazo por función; v4 y g2 se repiten — coste: ~1,5 $ de sujetos repetidos
- Task 1: Ruling: n7 gana TURN2 («La que recomiendas. Sigue con el resto de operations.md.») — una pregunta por turno es conducta del kit; sin él la fila no se observa — coste si falla: el RED se midió sin TURN2 (allí no preguntó)
- Task 2: RED (kit b8ab5635, n=1, 1,02 $): g7 ✗ G7a-b; t1 ✗ T1a-b; t2 ✗ T2a-b. Ruling: el molde de t2 rompía rooms.test.js con una tercera sala — cambia a ['Norte','Sur'].sort() — coste: ninguno en la lectura del RED
- Task 1: Ruling: N7a acepta `unitario` con motivo — el molde trae src/app.test.ts, que solo llama a funciones: el código dice qué arranca — coste: ninguno
- Task 2: Ruling: k6-1 no cargó ninguna skill (Glob → Edit de gate.json): fallo de enrutado ajeno al cambio — sin observar; se repite con k6-2 — coste si falla: un humo del carril config sin medir
- Task 2: Ruling: la causa de G7b es la plantilla: walkthrough-template 4.1 y patch-template solo tienen hueco para una orden — ganan el hueco de la suite unitaria y de la marca (Art. II, elemento omitido) aunque el plan no los nombra — coste si falla: dos líneas de plantilla más
- Task 3: Ruling: molde m1 con texto cierto («…que también valida el motivo al cancelar»), m2 con Node 20 frente a Node 24 — coste: ninguno
- Final de campaña: Ruling: la marca por tarea y el aviso literal se afinan en el paso 1 y el 6 de sdd-archive sin medir — fila de deuda para remedir G7b, G8b y M1c — coste si falla: líneas Gate: sin la marca en cada tarea y un aviso parafraseado
- Tasks 2-3: Ruling: un solo commit para las Tasks 2 y 3 — comparten sdd-archive/SKILL.md (pasos 1 y 6), merge-recipe.md y la batería de sdd-archive, y partir los trozos a mano arriesga un commit roto — coste si falla: la historia junta dos tasks en un commit
- Final: Ruling: Spec I5 m1 y m2 se midieron sobre tech-stack.md, no sobre la fila del roadmap de la 0235 §3 — en 2.x, `sdd merge --sync` une el roadmap por id y el caso de la fila puede no llegar al agente (patch 0244); el de tech-stack es el de la 0228 §4 y la regla es la misma — coste si falla: el caso de la fila sin medir; fila de deuda
- Final: Ruling: Spec I8 humo de g6 (paso 7) sin observar y patch-template sin escenario de cierre de patch — dev-lead «Cerrar con lo medido» con 23,78 $ de 25 $ — coste si falla: una frase del paso 7 y un hueco de plantilla sin humo; fila de deuda junto a G7b, G8b y M1c
- Final: Ruling: Código m8 filteredGate de sdd-verify lee los fixtures del gate de sdd-archive — un solo gate de juguete para las dos baterías; copiarlo duplicaría gate.mjs — coste si falla: un cambio del gate de archive rompe t1 y t2
- Final: Ruling: Código m10 la regla «Sin filtro» vive en sdd-verify y resumida en los pasos 1 y 6 de sdd-archive — tech-stack «Una regla que solo vive en una referencia no se lee» (g7 0/2 con la regla solo en sdd-verify); el paso 1 remite a la lista entera — coste si falla: copias que se desvían
- Final: Ruling: Spec M5 la parte b de pl3 (una task que escribe un test de integración lo corre) no se ejercitó — pl3 salió limpio en el RED y la regla no se escribió; el walkthrough lo dice — coste: ninguno
- Final: Ruling: N1 y N2 se arreglan en un commit tras la re-revisión, que no abre otra — la regla manda adjudicarlos, pero dejarlos rompe la línea base (no correría nada) y contradice la decisión 14 (--verify sin unitarios); son dos frases — coste si falla: el commit va a ✋ como sin revisar
- Final: Ruling: N4 el informe de la pasada sin la orden de la suite — esta línea la da — coste: ninguno
- Final: Ruling: «Fuera del alcance» de la re-revisión: un *.md que es input de un test (skills/**/*.md en este repo) no corre nada en una rama solo de docs — decisión 16 de la propuesta 0234 y de la spec; lo caza el pre-commit — coste si falla: un rojo que llega al pre-commit en vez del cierre; fila de deuda

## 4. Verificación

### 4.1 Builds

- Línea base, sin filtro (el Scope toca las tres tareas): `` Gate: `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test` → kit:test-headless: corrió 227/227 · cli:typecheck: corrió (sin errores) · cli:test: corrió 1625/1637 (12 omitidos) `` · 48 s · sobre `53b99df`
- Pre-commit de cada task: `cli:test` 1641/1653 (12 omitidos) sobre `621bee5` y sobre `161195a`.

- Verificación de las tasks: `npx --prefix cli vitest run --root cli test/kit/operations-gate-fields.test.ts test/kit/migration-init-parity.test.ts test/kit/word-budget.test.ts` (Task 1) y `test/kit/word-budget.test.ts` (Tasks 2 y 3), en verde; `test/kit` entero 438/450 (12 omitidos) tras la pasada de fix.
- Gate de cierre: corre una vez sobre el merge de sincronización (la base iba 1 commit por delante y había otras dos ramas abiertas); su línea `Gate:` va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · baterías headless (53 sujetos, `tests/project-gate-levels-{red,green}.md`) y `test/kit` 438/450 · revisión final con arreglos en los ejes Spec y Código, re-revisión con 10/10 resueltos · 1 sin revisar (juntado en el cierre) · G7b, G8b y M1c sin medir tras su afinado

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La rama toca el build: la suite unitaria entera y el gate sin `--affected` | ejecución real (`g7-3`, `g7-6`, `g7-7`) | ✅ |
| La línea nombra la suite unitaria y el gate antes de la flecha, cada tarea con `(sin filtro: cambia el build)` | ejecución real (`g7-7`: la suite antes de la flecha; la marca solo en una tarea) | ⚠ marca por tarea sin medir tras su afinado |
| Rama solo de docs: no corre nada; `pendiente` o sin nivel corre entera; una suite cuya orden es la del gate no corre aparte | no probado (texto de «Running a gate», revisado por los ejes y la re-revisión) | no probado |
| Sin «Sin filtro», la lista por defecto; `moon.yml` es «cambia su definición» | ejecución real (`g7`: molde sin «Sin filtro» con `package.json`; `k6-2`) | ✅ |
| Tras un rojo: los tests rojos, `--base <rojo>` y la tarea no corrida | ejecución real (`t2-1`, `t2-2`) | ✅ |
| Arreglo solo de docs: solo los tests rojos, con su línea | ejecución real (`t1-3`, `t1-4`) | ✅ |
| Bail, typecheck, «Sin filtro» en el arreglo y lint | no probado (texto) | no probado |
| Conflicto de docs que junta: lo resuelve, commitea, fusiona y lo nombra | ejecución real (`m1-3`, `m1-4`: junta y fusiona; el aviso, no literal) | ⚠ aviso literal sin medir tras su afinado |
| Contraejemplo: dos valores distintos paran | ejecución real (`m2-3`, `m2-4`) | ✅ |
| La base trae un lockfile: gate sin filtro tras `--sync` | ejecución real (`g8-3`, `g8-4`; la marca en prosa) | ✅ conducta · ⚠ marca |
| La intersección tras `--sync` (deuda de la 0230) | ejecución real (`g5-1`) | ✅ |
| `operations-template.md` con nivel, «Sin filtro», «Lint» y «CI de la base»; la init los propone | ejecución real (`n7-3`, `n7-4`) | ✅ |
| La migración los propone (paso 2) y avisa del gate con lint (paso 9) | ejecución real (`v4-3`, `v4-4`, `g2-3`, `g2-4`) | ✅ |
| La «Verificación» de una task corre los unitarios de lo que toca | ejecución real (`pl3-1`, RED limpio) | ✅ (sin regla nueva) |

### 4.3 Residuales

- Filas de deuda: remedir G7b, G8b y M1c, el humo de `g6` y un cierre de patch con la plantilla nueva, y el caso de la fila del roadmap de la 0235 §3; la pasada de fix de la revisión final que corre la suite entera (decisión 18); un `*.md` que es input de un test, en una rama solo de docs.

## 5. ADR

- ADR candidata de la spec (el cierre corre lo afectado y la suite completa va a la release o a la CI): la escribe la 0257, que completa la decisión.
